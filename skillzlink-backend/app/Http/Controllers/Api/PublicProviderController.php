<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Provider;
use App\Models\ProviderAvailability;
use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicProviderController extends Controller
{
    /**
     * Public listing of providers — no auth required.
     * Supports optional ?category= and ?city= filters.
     */
    public function categories(): JsonResponse
    {
        return response()->json([
            'categories' => \App\Models\ServiceCategory::all()
        ]);
    }

    public function themeSettings(): JsonResponse
    {
        $settings = \App\Models\ThemeSetting::all()->pluck('value', 'key');
        return response()->json(['settings' => $settings]);
    }

    public function index(Request $request): JsonResponse
    {
        $query = Provider::with('user')
            ->where(function ($q) {
                $q->where('subscription_tier', 'free')
                    ->orWhere('subscription_expiry', '>', now());
            });

        if ($request->filled('category') && $request->query('category') !== 'all') {
            $query->where('service_category', 'like', '%' . $request->query('category') . '%');
        }

        if ($request->filled('city')) {
            $query->where('address', 'like', '%' . $request->query('city') . '%');
        }

        if ($request->filled('q')) {
            $q = $request->query('q');
            $query->where(function ($sub) use ($q) {
                $sub->where('description', 'like', "%{$q}%")
                    ->orWhere('service_category', 'like', "%{$q}%")
                    ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$q}%"));
            });
        }

        $query->orderByRaw("CASE WHEN subscription_tier IN ('premium_monthly','premium_quarterly') THEN 1 ELSE 2 END")
              ->orderByDesc('identity_verified')
              ->orderByDesc('rating');

        $providers = $query->get()->map(fn(Provider $p) => $this->formatProvider($p));

        return response()->json([
            'data'  => $providers,
            'total' => $providers->count(),
        ]);
    }

    /**
     * Public single provider view — no auth required.
     */
    public function show(int $id): JsonResponse
    {
        $provider = Provider::with(['user', 'documents', 'experiences', 'portfolios', 'services', 'ratings.seeker.user'])->findOrFail($id);

        return response()->json([
            'provider' => $this->formatProvider($provider),
        ]);
    }

    private function formatProvider(Provider $provider): array
    {
        $level = 'Junior';
        $rating = (float) ($provider->rating ?? 0);
        $reviews = (int) ($provider->total_ratings ?? 0);
        
        if ($rating >= 4.5 && $reviews >= 50) {
            $level = 'Expert';
        } elseif ($rating >= 4.0 && $reviews >= 20) {
            $level = 'Intermediate';
        }

        return [
            'id'                 => $provider->id,
            'name'               => $provider->user->name ?? 'Unknown',
            'member_since'       => $provider->created_at ? $provider->created_at->format('M Y') : 'Aug 2023',
            'service_category'   => $provider->service_category,
            'rating'             => $rating,
            'reviews'            => $reviews,
            'location'           => $provider->address ?? '',
            'rate'               => '$' . number_format($provider->hourly_rate ?? 15, 2) . ' / hr',
            'description'        => $provider->description ?? '',
            'skills'             => $provider->skills ?? [],
            'image'              => $provider->profile_image ?? '/images/user/userlisting/img-01.jpg',
            'featured'           => (bool) ($provider->is_featured ?? false),
            'premium_badge'      => in_array($provider->subscription_tier, ['premium_monthly', 'premium_quarterly'], true),
            'id_verified'        => (bool) ($provider->identity_verified ?? false),
            'level'              => $level,
            'phone'              => $provider->phone ?? '263770000000',
            'completed_services' => $provider->completed_services ?? 0,
            'success_rate'       => $provider->success_rate ?? 100,
            'response_time'      => $provider->response_time ?? '2h',
            'experience'         => $provider->relationLoaded('experiences') 
                                    ? $provider->experiences->map(fn($exp) => [
                                        'title' => $exp->title,
                                        'company' => $exp->company,
                                        'date' => $exp->date_range,
                                        'desc' => $exp->description,
                                      ]) 
                                    : [],
            'portfolios'         => $provider->relationLoaded('portfolios')
                                    ? $provider->portfolios->map(fn($p) => [
                                        'image_url' => $p->image_url,
                                        'title' => $p->title,
                                        'description' => $p->description,
                                    ])
                                    : [],
            'services'           => $provider->relationLoaded('services')
                                    ? $provider->services->map(fn($s) => [
                                        'name' => $s->name,
                                        'price' => (float)$s->price,
                                        'description' => $s->description,
                                    ])
                                    : [],
            'client_reviews'     => $provider->relationLoaded('ratings')
                                    ? $provider->ratings->map(fn($r) => [
                                        'rating' => $r->rating,
                                        'comment' => $r->comment,
                                        'reviewer_name' => $r->seeker->user->name ?? 'Anonymous',
                                    ])
                                    : [],
            'dynamic_data'       => $provider->dynamic_data ?? [],
        ];
    }

    public function getSlots(Request $request, int $id): JsonResponse
    {
        $provider = Provider::findOrFail($id);
        $dateStr = $request->query('date', now()->format('Y-m-d'));
        
        try {
            $date = Carbon::parse($dateStr);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid date format'], 400);
        }
        
        $dayOfWeek = $date->dayOfWeek; // 0 (Sunday) to 6 (Saturday)
        
        $availability = ProviderAvailability::where('provider_id', $provider->id)
            ->where('day_of_week', $dayOfWeek)
            ->where('is_available', true)
            ->first();
            
        if (!$availability) {
            return response()->json(['slots' => []]);
        }
        
        // Find existing bookings for this date that are not rejected or cancelled
        $bookings = Booking::where('provider_id', $provider->id)
            ->where('booking_date', $date->format('Y-m-d'))
            ->whereNotIn('status', ['rejected', 'cancelled'])
            ->get();
            
        // Generate 1-hour slots
        $slots = [];
        $start = Carbon::parse($date->format('Y-m-d') . ' ' . $availability->start_time);
        $end = Carbon::parse($date->format('Y-m-d') . ' ' . $availability->end_time);
        
        while ($start->copy()->addHour() <= $end) {
            $slotStart = $start->format('H:i');
            $slotEnd = $start->copy()->addHour()->format('H:i');
            
            // Check if slot overlaps with any booking
            $isAvailable = true;
            foreach ($bookings as $booking) {
                $bStart = Carbon::parse($booking->booking_date . ' ' . $booking->start_time);
                $bEnd = Carbon::parse($booking->booking_date . ' ' . $booking->end_time);
                
                // If our slot start is strictly before booking end, AND slot end is strictly after booking start
                if ($start < $bEnd && $start->copy()->addHour() > $bStart) {
                    $isAvailable = false;
                    break;
                }
            }
            
            if ($isAvailable) {
                $slots[] = [
                    'start_time' => $slotStart,
                    'end_time' => $slotEnd
                ];
            }
            
            $start->addHour();
        }
        
        return response()->json(['slots' => $slots]);
    }
}
