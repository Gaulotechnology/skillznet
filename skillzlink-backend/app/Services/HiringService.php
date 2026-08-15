<?php

namespace App\Services;

use App\Models\Provider;
use Illuminate\Support\Facades\Log;

/**
 * Powers the bot's "hire a professional" flow.
 *
 * Extracts a service category and (optionally) a city from free-form text,
 * then returns matching, verified-first providers so the bot can suggest
 * real candidates instead of a generic "browse professionals" link.
 */
class HiringService
{
    private array $serviceMap = [
        'plumbing'         => ['plumber', 'plumbing', 'pipe', 'leak', 'geyser', 'drain', 'tap'],
        'electrical'       => ['electrician', 'electrical', 'wiring', 'electric', 'electricity'],
        'cleaning'         => ['cleaner', 'cleaning', 'clean', 'housekeeping', 'maid'],
        'tutoring'         => ['tutor', 'tutoring', 'teacher', 'lessons', 'tuition'],
        'carpentry'        => ['carpenter', 'carpentry', 'furniture', 'woodwork', 'cabinet'],
        'painting'         => ['painter', 'painting', 'paint', 'wall coating'],
        'gardening'        => ['gardener', 'gardening', 'landscaping', 'lawn', 'garden'],
        'appliance-repair' => ['appliance', 'fridge', 'stove', 'washing machine', 'dishwasher', 'repair'],
    ];

    private array $cities = [
        'Harare', 'Bulawayo', 'Mutare', 'Gweru', 'Kwekwe', 'Masvingo',
        'Chinhoyi', 'Marondera', 'Kadoma', 'Bindura', 'Hwange', 'Victoria Falls',
    ];

    /**
     * Detect the service category from a message, or return null.
     */
    public function detectService(string $message): ?string
    {
        $msg = mb_strtolower($message);
        foreach ($this->serviceMap as $category => $keywords) {
            foreach ($keywords as $keyword) {
                if (str_contains($msg, $keyword)) {
                    return $category;
                }
            }
        }
        return null;
    }

    /**
     * Detect a Zimbabwean city from a message, or return null.
     */
    public function detectCity(string $message): ?string
    {
        $msg = mb_strtolower($message);
        foreach ($this->cities as $city) {
            if (str_contains($msg, mb_strtolower($city))) {
                return $city;
            }
        }
        return null;
    }

    /**
     * Search for candidate providers matching a service and optional city.
     *
     * Returns null when no service is detected, otherwise an array with
     * the resolved category, city, and a list of candidates.
     */
    public function searchCandidates(string $message): ?array
    {
        $service = $this->detectService($message);
        if (!$service) {
            return null;
        }

        $city = $this->detectCity($message);

        try {
            $query = Provider::query()
                ->with('user')
                ->where('service_category', $service)
                // Only suggest providers who are listed (active subscription or free)
                ->where(function ($q) {
                    $q->where('subscription_tier', 'free')
                        ->orWhere('subscription_expiry', '>', now());
                });

            if ($city) {
                $query->where('address', 'LIKE', "%{$city}%");
            }

            $providers = $query
                ->orderByDesc('identity_verified')
                ->orderByDesc('rating')
                ->limit(5)
                ->get();

            $candidates = $providers->map(fn (Provider $p) => [
                'id'                 => $p->id,
                'name'               => $p->user->name ?? 'Professional',
                'service_category'   => $p->service_category,
                'rating'             => round((float) $p->rating, 1),
                'hourly_rate'        => (float) $p->hourly_rate,
                'identity_verified'  => (bool) $p->identity_verified,
                'description'        => $p->description,
                'address'            => $p->address,
                'phone'              => $p->phone,
                'completed_services' => (int) $p->completed_services,
                'success_rate'       => (int) $p->success_rate,
            ])->values()->all();

            return [
                'service'    => $service,
                'city'       => $city,
                'candidates' => $candidates,
            ];
        } catch (\Exception $e) {
            Log::warning('HiringService search failed: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Detect which previously-suggested candidate the visitor is referring to.
     *
     * Handles both ordinal/number selection ("1", "the first one", "option 2")
     * and name selection ("give me Dr. Toney Zieme").
     */
    public function selectCandidate(string $message, array $candidates): ?array
    {
        if (empty($candidates)) {
            return null;
        }

        $msg = mb_strtolower(trim($message));

        // Ordinal words: first/second/third/fourth/fifth (+ 1st/2nd/...)
        $ordinals = [
            'first' => 0, '1st' => 0,
            'second' => 1, '2nd' => 1,
            'third' => 2, '3rd' => 2,
            'fourth' => 3, '4th' => 3,
            'fifth' => 4, '5th' => 4,
        ];
        foreach ($ordinals as $word => $index) {
            if (preg_match('/\b' . preg_quote($word, '/') . '\b/', $msg)) {
                return $candidates[$index] ?? null;
            }
        }

        // "number 1", "option 1", "candidate 1", "#1", "no. 1"
        if (preg_match('/\b(?:number|option|candidate|choice|no\.?|#)\s*(\d+)/', $msg, $m)) {
            return $candidates[((int) $m[1]) - 1] ?? null;
        }

        // Bare number ("1", "2") when the message is just a selection.
        if (preg_match('/^\s*(\d+)\s*$/', $msg, $m)) {
            return $candidates[((int) $m[1]) - 1] ?? null;
        }

        // Name selection — every significant word of a candidate's name appears
        // in the message (titles and degree/roman-numeral suffixes are ignored).
        $ignored = ['dr', 'dr.', 'mr', 'mr.', 'mrs', 'mrs.', 'ms', 'ms.', 'md', 'dvm', 'i', 'ii', 'iii', 'iv', 'v', 'jr', 'sr'];
        foreach ($candidates as $candidate) {
            $name = mb_strtolower((string) ($candidate['name'] ?? ''));
            $words = preg_split('/[\s,]+/', $name) ?: [];
            $significant = array_values(array_filter($words, fn ($w) => !in_array($w, $ignored, true) && mb_strlen($w) > 2));

            if (empty($significant)) {
                continue;
            }

            $allFound = true;
            foreach ($significant as $word) {
                if (!str_contains($msg, $word)) {
                    $allFound = false;
                    break;
                }
            }

            if ($allFound) {
                return $candidate;
            }
        }

        return null;
    }
}
