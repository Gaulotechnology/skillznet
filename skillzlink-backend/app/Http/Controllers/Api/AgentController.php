<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AgentCommission;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AgentController extends Controller
{
    public function getOverview(Request $request): JsonResponse
    {
        $user = $request->user();

        $referralCode = $user->referral_code;
        if (!$referralCode) {
            $referralCode = Str::random(10);
            $user->update(['referral_code' => $referralCode]);
        }

        $totalOnboarded = User::where('referred_by', $user->id)->count();
        $activeProviders = User::where('referred_by', $user->id)
            ->whereHas('provider', fn($q) => $q->whereNotNull('id'))
            ->count();

        $totalCommission = AgentCommission::where('agent_id', $user->id)->sum('amount');
        $pendingCommission = AgentCommission::where('agent_id', $user->id)
            ->where('status', 'pending')
            ->sum('amount');

        $onboardingLink = config('app.url') . '/join/' . $referralCode;

        $recentReferrals = User::where('referred_by', $user->id)
            ->with('provider')
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn($u) => [
                'id'              => $u->id,
                'name'            => $u->name,
                'role'            => $u->role,
                'service_category'=> $u->provider?->service_category ?? '',
                'status'          => $u->is_active ? 'active' : 'inactive',
                'registered_at'   => $u->created_at->toDateTimeString(),
            ]);

        return response()->json([
            'stats' => [
                'total_onboarded'   => $totalOnboarded,
                'commission_earned' => (float) $totalCommission,
                'active_providers'  => $activeProviders,
                'pending_commission'=> (float) $pendingCommission,
            ],
            'onboarding_link' => $onboardingLink,
            'referral_code'   => $referralCode,
            'recent_referrals'=> $recentReferrals,
        ]);
    }

    public function getReferrals(Request $request): JsonResponse
    {
        $user = $request->user();
        $role = $request->query('role'); // optional filter: provider, seeker

        $query = User::where('referred_by', $user->id)->with('provider', 'seeker');
        if ($role) {
            $query->where('role', $role);
        }

        $referrals = $query->latest()->get()->map(fn($u) => [
            'id'              => $u->id,
            'name'            => $u->name,
            'role'            => $u->role,
            'email'           => $u->email,
            'phone_number'    => $u->phone_number,
            'service_category'=> $u->provider?->service_category ?? '',
            'status'          => $u->is_active ? 'active' : 'inactive',
            'registered_at'   => $u->created_at->toDateTimeString(),
        ]);

        $stats = [
            'total'    => User::where('referred_by', $user->id)->count(),
            'providers'=> User::where('referred_by', $user->id)->where('role', 'provider')->count(),
            'seekers'  => User::where('referred_by', $user->id)->where('role', 'seeker')->count(),
        ];

        return response()->json([
            'referrals' => $referrals,
            'stats'     => $stats,
        ]);
    }

    public function getCommissions(Request $request): JsonResponse
    {
        $user = $request->user();

        $commissions = AgentCommission::where('agent_id', $user->id)
            ->with('referredUser')
            ->latest()
            ->get()
            ->map(fn($c) => [
                'id'               => $c->id,
                'amount'           => (float) $c->amount,
                'description'      => $c->description,
                'status'           => $c->status,
                'referred_user'    => $c->referredUser?->name ?? 'Unknown',
                'created_at'       => $c->created_at->toDateTimeString(),
                'paid_at'          => $c->paid_at?->toDateTimeString(),
            ]);

        $totalEarned = AgentCommission::where('agent_id', $user->id)->sum('amount');
        $totalPending = AgentCommission::where('agent_id', $user->id)
            ->where('status', 'pending')
            ->sum('amount');
        $totalPaid = AgentCommission::where('agent_id', $user->id)
            ->where('status', 'paid')
            ->sum('amount');

        return response()->json([
            'commissions' => $commissions,
            'stats'       => [
                'total_earned'  => (float) $totalEarned,
                'total_pending' => (float) $totalPending,
                'total_paid'    => (float) $totalPaid,
            ],
        ]);
    }

    public function getOnboardingLink(Request $request): JsonResponse
    {
        $user = $request->user();

        $referralCode = $user->referral_code;
        if (!$referralCode) {
            $referralCode = Str::random(10);
            $user->update(['referral_code' => $referralCode]);
        }

        $link = config('app.url') . '/join/' . $referralCode;

        return response()->json([
            'onboarding_link' => $link,
            'referral_code'   => $referralCode,
        ]);
    }
}
