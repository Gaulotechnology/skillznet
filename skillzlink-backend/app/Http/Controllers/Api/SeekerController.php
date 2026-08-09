<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Provider;
use App\Models\Rating;
use App\Models\SeekerPaymentMethod;
use App\Models\ProviderReport;
use App\Models\ProviderView;
use App\Models\SearchQuery;
use App\Models\Seeker;
use App\Models\Booking;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SeekerController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'service' => ['required', 'string', 'max:100'],
            'lat' => ['required', 'numeric'],
            'lng' => ['required', 'numeric'],
            'radius' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $seeker = Seeker::where('user_id', $request->user()->id)->firstOrFail();

        $radii = [5, 10, 25, 50];
        if (!empty($validated['radius']) && !in_array($validated['radius'], $radii, true)) {
            array_unshift($radii, (int) $validated['radius']);
        }

        $providers = collect();
        $radiusUsed = 50;
        foreach ($radii as $radius) {
            $providers = $this->searchProvidersWithinRadius(
                (float) $validated['lat'],
                (float) $validated['lng'],
                (string) $validated['service'],
                (int) $radius
            );

            if ($providers->count() >= 5) {
                $radiusUsed = (int) $radius;
                break;
            }
            $radiusUsed = (int) $radius;
        }

        $topProviders = $providers->take(5)->values();
        SearchQuery::create([
            'seeker_id' => $seeker->id,
            'latitude' => $validated['lat'],
            'longitude' => $validated['lng'],
            'service_category' => $validated['service'],
            'radius_used' => $radiusUsed,
            'results_count' => $topProviders->count(),
            'searched_at' => now(),
        ]);

        return response()->json([
            'radius_used' => $radiusUsed,
            'results' => $topProviders,
        ]);
    }

    public function providerDetails(Request $request, int $id): JsonResponse
    {
        $seeker = Seeker::where('user_id', $request->user()->id)->firstOrFail();
        $provider = Provider::with(['user', 'documents'])->findOrFail($id);

        ProviderView::create([
            'provider_id' => $provider->id,
            'seeker_id' => $seeker->id,
            'viewed_at' => now(),
            'contact_revealed' => false,
        ]);

        return response()->json([
            'provider' => [
                'id' => $provider->id,
                'name' => $provider->user->name,
                'service_category' => $provider->service_category,
                'rating' => $provider->rating,
                'subscription_tier' => $provider->subscription_tier,
                'identity_verified' => $provider->identity_verified,
                'description' => $provider->description,
                'contact_number_masked' => $this->maskedPhone($provider->user->phone_number),
                'cv_links' => $provider->documents->map(fn ($doc) => asset('storage/'.$doc->file_path)),
            ],
        ]);
    }

    public function revealContact(Request $request, int $id): JsonResponse
    {
        $seeker = Seeker::where('user_id', $request->user()->id)->firstOrFail();
        $provider = Provider::with('user')->findOrFail($id);

        ProviderView::create([
            'provider_id' => $provider->id,
            'seeker_id' => $seeker->id,
            'viewed_at' => now(),
            'contact_revealed' => true,
        ]);

        return response()->json([
            'contact_number' => $provider->contact_opt_in ? $provider->user->phone_number : null,
            'contact_available' => $provider->contact_opt_in,
        ]);
    }

    public function reportProvider(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'issue' => ['required', 'string'],
        ]);
        $seeker = Seeker::where('user_id', $request->user()->id)->firstOrFail();
        $provider = Provider::findOrFail($id);

        $report = ProviderReport::create([
            'provider_id' => $provider->id,
            'seeker_id' => $seeker->id,
            'issue' => $validated['issue'],
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Report submitted',
            'report' => $report,
        ], 201);
    }

    private function searchProvidersWithinRadius(float $lat, float $lng, string $category, int $radiusKm)
    {
        $distanceExpr = '(6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude))))';

        return Provider::query()
            ->with('user')
            ->where('service_category', $category)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->where(function (Builder $query): void {
                $query->where('subscription_tier', 'free')
                    ->orWhere('subscription_expiry', '>', now());
            })
            ->select('*')
            ->selectRaw("$distanceExpr as distance", [$lat, $lng, $lat])
            ->having('distance', '<=', $radiusKm)
            ->orderByRaw("CASE WHEN subscription_tier IN ('premium_monthly', 'premium_quarterly') THEN 1 ELSE 2 END")
            ->orderByDesc('identity_verified')
            ->orderBy('distance')
            ->orderByDesc('rating')
            ->limit(5)
            ->get()
            ->map(function (Provider $provider): array {
                return [
                    'id' => $provider->id,
                    'provider_name' => $provider->user->name,
                    'rating' => $provider->rating,
                    'premium_badge' => in_array($provider->subscription_tier, ['premium_monthly', 'premium_quarterly'], true),
                    'id_verified' => $provider->identity_verified,
                    'distance' => round((float) $provider->distance, 2),
                    'contact_number_masked' => $this->maskedPhone($provider->user->phone_number),
                    'description' => $provider->description,
                ];
            });
    }

    private function maskedPhone(?string $phoneNumber): ?string
    {
        if (!$phoneNumber || strlen($phoneNumber) < 4) {
            return $phoneNumber;
        }
        $visible = substr($phoneNumber, -4);
        return str_repeat('*', max(strlen($phoneNumber) - 4, 0)).$visible;
    }

    public function createBooking(Request $request): JsonResponse
    {
        $seeker = Seeker::where('user_id', $request->user()->id)->firstOrFail();
        
        $validated = $request->validate([
            'provider_id' => ['required', 'exists:providers,id'],
            'booking_date' => ['required', 'date', 'after_or_equal:today'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'notes' => ['nullable', 'string'],
        ]);

        $booking = Booking::create([
            'seeker_id' => $seeker->id,
            'provider_id' => $validated['provider_id'],
            'booking_date' => $validated['booking_date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Booking created successfully',
            'booking' => $booking,
        ], 201);
    }

    public function getBookings(Request $request): JsonResponse
    {
        $seeker = Seeker::where('user_id', $request->user()->id)->firstOrFail();
        
        $bookings = Booking::with('provider.user')
            ->where('seeker_id', $seeker->id)
            ->orderByDesc('booking_date')
            ->orderByDesc('start_time')
            ->get();

        return response()->json(['bookings' => $bookings]);
    }

    // ─── Overview ──────────────────────────────────────────────────────────────

    public function getOverview(Request $request): JsonResponse
    {
        $seeker = Seeker::where('user_id', $request->user()->id)->firstOrFail();

        $savedCount = ProviderView::where('seeker_id', $seeker->id)
            ->where('contact_revealed', true)
            ->count();
        $reportsCount = ProviderReport::where('seeker_id', $seeker->id)->count();
        $bookingsCount = Booking::where('seeker_id', $seeker->id)->count();

        $recentSaved = ProviderView::where('seeker_id', $seeker->id)
            ->where('contact_revealed', true)
            ->with('provider.user')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn($v) => [
                'id'   => $v->provider_id,
                'name' => $v->provider->user->name ?? 'Professional',
                'service_category' => $v->provider->service_category ?? '',
            ]);

        return response()->json([
            'stats' => [
                'saved_count'    => $savedCount,
                'reports_count'  => $reportsCount,
                'bookings_count' => $bookingsCount,
            ],
            'recent_saved' => $recentSaved,
        ]);
    }

    // ─── Reviews ───────────────────────────────────────────────────────────────

    public function getReviews(Request $request): JsonResponse
    {
        $seeker = Seeker::where('user_id', $request->user()->id)->firstOrFail();

        $reviews = Rating::where('seeker_id', $seeker->id)
            ->with('provider.user')
            ->latest()
            ->get()
            ->map(fn($r) => [
                'id'            => $r->id,
                'provider_id'   => $r->provider_id,
                'provider_name' => $r->provider->user->name ?? 'Provider',
                'rating'        => $r->rating,
                'comment'       => $r->comment,
                'created_at'    => $r->created_at->toDateTimeString(),
            ]);

        return response()->json(['reviews' => $reviews]);
    }

    public function createReview(Request $request): JsonResponse
    {
        $seeker = Seeker::where('user_id', $request->user()->id)->firstOrFail();
        $validated = $request->validate([
            'provider_id' => ['required', 'exists:providers,id'],
            'rating'      => ['required', 'integer', 'min:1', 'max:5'],
            'comment'     => ['required', 'string'],
        ]);

        $review = Rating::create([
            'seeker_id'   => $seeker->id,
            'provider_id' => $validated['provider_id'],
            'rating'      => $validated['rating'],
            'comment'     => $validated['comment'],
        ]);

        return response()->json([
            'message' => 'Review created',
            'review'  => $review,
        ], 201);
    }

    public function updateReview(Request $request, int $id): JsonResponse
    {
        $seeker = Seeker::where('user_id', $request->user()->id)->firstOrFail();
        $validated = $request->validate([
            'rating'  => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['required', 'string'],
        ]);

        $review = Rating::where('id', $id)
            ->where('seeker_id', $seeker->id)
            ->firstOrFail();

        $review->update($validated);

        return response()->json(['message' => 'Review updated']);
    }

    public function deleteReview(Request $request, int $id): JsonResponse
    {
        $seeker = Seeker::where('user_id', $request->user()->id)->firstOrFail();

        $review = Rating::where('id', $id)
            ->where('seeker_id', $seeker->id)
            ->firstOrFail();

        $review->delete();

        return response()->json(['message' => 'Review deleted']);
    }

    // ─── Billing ───────────────────────────────────────────────────────────────

    public function getBilling(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $paymentMethods = SeekerPaymentMethod::where('user_id', $userId)
            ->latest()
            ->get();

        return response()->json([
            'payment_methods' => $paymentMethods,
            'transactions'    => [],
        ]);
    }

    public function addPaymentMethod(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type'    => ['required', 'string'],
            'details' => ['required', 'array'],
        ]);

        $pm = SeekerPaymentMethod::create([
            'user_id'    => $request->user()->id,
            'type'       => $validated['type'],
            'number'     => $validated['details']['number'] ?? '',
            'label'      => $validated['details']['label'] ?? null,
            'is_default' => !SeekerPaymentMethod::where('user_id', $request->user()->id)->exists(),
        ]);

        return response()->json([
            'message'         => 'Payment method added',
            'payment_method'  => $pm,
        ]);
    }

    public function deletePaymentMethod(Request $request, int $id): JsonResponse
    {
        $pm = SeekerPaymentMethod::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $pm->delete();

        return response()->json(['message' => 'Payment method removed']);
    }

    // ─── Settings ──────────────────────────────────────────────────────────────

    public function getSettings(Request $request): JsonResponse
    {
        $settings = $request->user()->settings ?? ['email_updates' => true, 'sms_updates' => true];

        return response()->json(['settings' => $settings]);
    }

    public function updateSettings(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email_updates' => ['required', 'boolean'],
            'sms_updates'   => ['required', 'boolean'],
        ]);

        $request->user()->update(['settings' => $validated]);

        return response()->json(['message' => 'Settings updated']);
    }

    // ─── Account ───────────────────────────────────────────────────────────────

    public function deleteAccount(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'Account deleted']);
    }

    public function requestPasswordReset(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'If an account with that email exists, a password reset link has been sent.',
        ]);
    }
}
