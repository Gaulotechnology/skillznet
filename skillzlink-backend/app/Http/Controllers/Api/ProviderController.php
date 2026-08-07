<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Provider;
use App\Models\ProviderDocument;
use App\Models\ProviderView;
use App\Models\SubscriptionHistory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProviderController extends Controller
{
    public function profile(Request $request): JsonResponse
    {
        $provider = Provider::with('documents')
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return response()->json([
            'provider' => $provider,
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $provider = Provider::where('user_id', $request->user()->id)->firstOrFail();
        $validated = $request->validate([
            'address' => ['sometimes', 'string'],
            'service_category' => ['sometimes', 'string', 'max:100'],
            'service_radius' => ['sometimes', 'integer', 'min:1', 'max:200'],
            'latitude' => ['sometimes', 'nullable', 'numeric'],
            'longitude' => ['sometimes', 'nullable', 'numeric'],
            'description' => ['sometimes', 'nullable', 'string'],
            'contact_opt_in' => ['sometimes', 'boolean'],
        ]);

        $provider->update($validated);

        return response()->json([
            'message' => 'Profile updated',
            'provider' => $provider->fresh(),
        ]);
    }

    public function uploadCv(Request $request): JsonResponse
    {
        $provider = Provider::where('user_id', $request->user()->id)->firstOrFail();
        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:pdf,doc,docx,jpg,jpeg,png', 'max:10240'],
        ]);

        $file = $validated['file'];
        $storedPath = $file->store('provider-documents', 'public');

        $document = ProviderDocument::create([
            'provider_id' => $provider->id,
            'document_type' => 'cv',
            'file_path' => $storedPath,
            'file_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType() ?? 'application/octet-stream',
            'uploaded_at' => now(),
        ]);

        return response()->json([
            'message' => 'CV uploaded',
            'document' => $document,
            'url' => asset('storage/'.$storedPath),
        ], 201);
    }

    public function subscription(Request $request): JsonResponse
    {
        $provider = Provider::where('user_id', $request->user()->id)->firstOrFail();
        $history = SubscriptionHistory::where('provider_id', $provider->id)->latest()->get();

        return response()->json([
            'tier' => $provider->subscription_tier,
            'subscription_expiry' => $provider->subscription_expiry,
            'history' => $history,
        ]);
    }

    public function subscribe(Request $request): JsonResponse
    {
        $provider = Provider::where('user_id', $request->user()->id)->firstOrFail();
        $validated = $request->validate([
            'tier' => ['required', 'in:monthly,quarterly'],
            'payment_method' => ['required', 'string', 'max:50'],
        ]);

        $amount = $validated['tier'] === 'monthly' ? 10.00 : 25.00;
        $payment = Payment::create([
            'provider_id' => $provider->id,
            'amount' => $amount,
            'currency' => 'USD',
            'payment_method' => $validated['payment_method'],
            'transaction_id' => 'TXN-'.strtoupper(Str::random(16)),
            'status' => 'success',
            'tier' => $validated['tier'],
        ]);

        $mappedTier = $validated['tier'] === 'monthly' ? 'premium_monthly' : 'premium_quarterly';
        $expiry = $validated['tier'] === 'monthly' ? now()->addMonth() : now()->addMonths(3);

        $provider->update([
            'subscription_tier' => $mappedTier,
            'subscription_expiry' => $expiry,
            'is_featured' => $mappedTier === 'premium_quarterly',
        ]);

        SubscriptionHistory::create([
            'provider_id' => $provider->id,
            'tier' => $mappedTier,
            'start_date' => now(),
            'end_date' => $expiry,
            'payment_id' => $payment->id,
        ]);

        return response()->json([
            'message' => 'Subscription activated',
            'payment' => $payment,
            'provider' => $provider->fresh(),
        ], 201);
    }

    public function analytics(Request $request): JsonResponse
    {
        $provider = Provider::where('user_id', $request->user()->id)->firstOrFail();

        return response()->json([
            'profile_views' => ProviderView::where('provider_id', $provider->id)->count(),
            'contact_reveals' => ProviderView::where('provider_id', $provider->id)
                ->where('contact_revealed', true)
                ->count(),
            'subscription_tier' => $provider->subscription_tier,
            'expiry_date' => $provider->subscription_expiry,
        ]);
    }
}
