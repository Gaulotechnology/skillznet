<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Provider;
use App\Models\ProviderReport;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function users(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return response()->json([
            'users' => User::query()->latest()->paginate(25),
        ]);
    }

    public function verifyProvider(Request $request, int $id): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $provider = Provider::findOrFail($id);
        $provider->update(['identity_verified' => true]);
        return response()->json(['message' => 'Provider verified', 'provider' => $provider]);
    }

    public function suspendProvider(Request $request, int $id): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $provider = Provider::with('user')->findOrFail($id);
        $provider->user->update(['is_active' => false]);
        return response()->json(['message' => 'Provider suspended']);
    }

    public function subscriptions(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return response()->json([
            'subscriptions' => Provider::query()->select([
                'id',
                'user_id',
                'subscription_tier',
                'subscription_expiry',
                'is_featured',
            ])->latest()->paginate(25),
        ]);
    }

    public function revenue(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return response()->json([
            'total_revenue' => Payment::where('status', 'success')->sum('amount'),
            'payments_count' => Payment::where('status', 'success')->count(),
            'pending_reports' => ProviderReport::where('status', 'pending')->count(),
        ]);
    }

    public function overrideSubscription(Request $request, int $id): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $validated = $request->validate([
            'tier' => ['required', 'in:free,premium_monthly,premium_quarterly'],
            'expiry_days' => ['nullable', 'integer', 'min:1', 'max:365'],
        ]);
        $provider = Provider::findOrFail($id);
        $provider->update([
            'subscription_tier' => $validated['tier'],
            'subscription_expiry' => $validated['tier'] === 'free'
                ? null
                : now()->addDays($validated['expiry_days'] ?? 30),
            'is_featured' => $validated['tier'] === 'premium_quarterly',
        ]);
        return response()->json(['message' => 'Subscription updated', 'provider' => $provider]);
    }
}
