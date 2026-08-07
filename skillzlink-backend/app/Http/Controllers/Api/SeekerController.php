<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Provider;
use App\Models\ProviderReport;
use App\Models\ProviderView;
use App\Models\SearchQuery;
use App\Models\Seeker;
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
}
