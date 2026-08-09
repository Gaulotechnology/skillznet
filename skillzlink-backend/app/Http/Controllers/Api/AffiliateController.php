<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AffiliateClick;
use App\Models\AffiliateCommission;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AffiliateController extends Controller
{
    public function getOverview(Request $request): JsonResponse
    {
        $user = $request->user();

        $referralCode = $user->referral_code;
        if (!$referralCode) {
            $referralCode = Str::random(10);
            $user->update(['referral_code' => $referralCode]);
        }

        $totalClicks = AffiliateClick::where('affiliate_id', $user->id)->count();
        $totalSignups = User::where('referred_by', $user->id)->count();
        $totalEarnings = AffiliateCommission::where('affiliate_id', $user->id)->sum('amount');
        $pendingPayout = AffiliateCommission::where('affiliate_id', $user->id)
            ->where('status', 'pending')
            ->sum('amount');

        $referralLink = config('app.url') . '/join/' . $referralCode;

        $recentReferrals = User::where('referred_by', $user->id)
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn($u) => [
                'name'   => $u->name,
                'email'  => $u->email,
                'role'   => $u->role,
                'date'   => $u->created_at->toDateTimeString(),
                'status' => 'Signed up',
            ]);

        return response()->json([
            'stats' => [
                'total_clicks'    => $totalClicks,
                'total_signups'   => $totalSignups,
                'total_earnings'  => (float) $totalEarnings,
                'pending_payout'  => (float) $pendingPayout,
            ],
            'referral_code' => $referralCode,
            'referral_link' => $referralLink,
            'recent_referrals' => $recentReferrals,
        ]);
    }

    public function getLinks(Request $request): JsonResponse
    {
        $user = $request->user();

        $referralCode = $user->referral_code;
        if (!$referralCode) {
            $referralCode = Str::random(10);
            $user->update(['referral_code' => $referralCode]);
        }

        $link = config('app.url') . '/join/' . $referralCode;

        $recentClicks = AffiliateClick::where('affiliate_id', $user->id)
            ->latest()
            ->limit(20)
            ->get()
            ->map(fn($c) => [
                'id'         => $c->id,
                'clicked_at' => $c->created_at->toDateTimeString(),
                'ip'         => $c->ip_address,
            ]);

        $totalClicks = AffiliateClick::where('affiliate_id', $user->id)->count();
        $todayClicks = AffiliateClick::where('affiliate_id', $user->id)
            ->whereDate('created_at', today())
            ->count();

        return response()->json([
            'referral_code' => $referralCode,
            'referral_link' => $link,
            'recent_clicks' => $recentClicks,
            'stats' => [
                'total_clicks' => $totalClicks,
                'today_clicks' => $todayClicks,
            ],
        ]);
    }

    public function getPayouts(Request $request): JsonResponse
    {
        $user = $request->user();

        $commissions = AffiliateCommission::where('affiliate_id', $user->id)
            ->with('referredUser')
            ->latest()
            ->get()
            ->map(fn($c) => [
                'id'            => $c->id,
                'amount'        => (float) $c->amount,
                'description'   => $c->description,
                'status'        => $c->status,
                'referred_user' => $c->referredUser?->name ?? 'N/A',
                'created_at'    => $c->created_at->toDateTimeString(),
                'paid_at'       => $c->paid_at?->toDateTimeString(),
            ]);

        $totalEarned = AffiliateCommission::where('affiliate_id', $user->id)->sum('amount');
        $totalPending = AffiliateCommission::where('affiliate_id', $user->id)
            ->where('status', 'pending')
            ->sum('amount');
        $totalPaid = AffiliateCommission::where('affiliate_id', $user->id)
            ->where('status', 'paid')
            ->sum('amount');

        return response()->json([
            'commissions' => $commissions,
            'stats' => [
                'total_earned'  => (float) $totalEarned,
                'total_pending' => (float) $totalPending,
                'total_paid'    => (float) $totalPaid,
            ],
        ]);
    }

    public function requestPayout(Request $request): JsonResponse
    {
        $user = $request->user();

        $pendingTotal = AffiliateCommission::where('affiliate_id', $user->id)
            ->where('status', 'pending')
            ->sum('amount');

        if ($pendingTotal <= 0) {
            return response()->json(['message' => 'No pending balance to payout.'], 400);
        }

        AffiliateCommission::where('affiliate_id', $user->id)
            ->where('status', 'pending')
            ->update([
                'status'  => 'paid',
                'paid_at' => now(),
            ]);

        return response()->json(['message' => 'Payout of $' . number_format($pendingTotal, 2) . ' processed successfully.']);
    }

    public function trackClick(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'referral_code' => ['required', 'string'],
        ]);

        $agent = User::where('referral_code', $validated['referral_code'])->first();

        if ($agent) {
            AffiliateClick::create([
                'affiliate_id'  => $agent->id,
                'referral_code' => $validated['referral_code'],
                'ip_address'    => $request->ip(),
                'user_agent'    => $request->userAgent(),
            ]);
        }

        return response()->json(['message' => 'ok']);
    }
}
