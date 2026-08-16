<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MatchingRequest;
use App\Models\Provider;
use App\Models\Seeker;
use App\Services\MatchingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MatchingController extends Controller
{
    public function __construct(protected MatchingService $matchingService) {}

    // ─── Guest Seeker Endpoints (Public) ───────────────────────────────────────

    public function guestCreateRequest(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'guest_name'       => ['required', 'string', 'max:255'],
            'guest_phone'      => ['required', 'string', 'max:50'],
            'service_category' => ['required', 'string'],
            'title'            => ['required', 'string', 'max:255'],
            'description'      => ['nullable', 'string'],
            'city'             => ['nullable', 'string', 'max:100'],
            'address'          => ['nullable', 'string', 'max:255'],
            'latitude'         => ['nullable', 'numeric'],
            'longitude'        => ['nullable', 'numeric'],
            'urgency'          => ['nullable', 'in:immediate,same_day,flexible'],
            'budget'           => ['nullable', 'numeric', 'min:0'],
        ]);

        $phone = trim($validated['guest_phone']);
        // Format phone
        if (!str_starts_with($phone, '+')) {
            $digits = preg_replace('/[^0-9]/', '', $phone);
            if (str_starts_with($digits, '263')) {
                $phone = '+' . $digits;
            } elseif (str_starts_with($digits, '0')) {
                $phone = '+263' . substr($digits, 1);
            } else {
                $phone = '+263' . $digits;
            }
        }

        // Find or create User
        $user = \App\Models\User::firstOrCreate(
            ['phone_number' => $phone],
            [
                'name'           => $validated['guest_name'],
                'email'          => sprintf('guest-%s@skillzlink.local', \Illuminate\Support\Str::uuid()),
                'role'           => 'seeker',
                'password'       => \Illuminate\Support\Facades\Hash::make('1234'),
                'is_active'      => true,
                'pin_changed_at' => now(),
            ]
        );

        $seeker = Seeker::firstOrCreate(
            ['user_id' => $user->id],
            [
                'address' => $validated['address'] ?? ($validated['city'] ?? 'Harare'),
            ]
        );

        $matchingRequest = $this->matchingService->createAndBroadcast($seeker, $validated);
        $token = $user->createToken('guest_matching_session')->plainTextToken;

        return response()->json([
            'message' => 'On-demand request broadcasted successfully!',
            'request' => $matchingRequest->load(['matchedProvider.user']),
            'token'   => $token,
            'user'    => [
                'id'           => $user->id,
                'name'         => $user->name,
                'role'         => $user->role,
                'phone_number' => $user->phone_number,
            ]
        ], 201);
    }

    public function guestGetRequest(Request $request, int $id): JsonResponse
    {
        $matchingRequest = MatchingRequest::with(['matchedProvider.user'])->findOrFail($id);

        return response()->json([
            'request' => $matchingRequest,
        ]);
    }

    public function guestCancelRequest(Request $request, int $id): JsonResponse
    {
        $result = $this->matchingService->cancelRequest($id, null);
        if (!$result['success']) {
            return response()->json(['message' => $result['error']], $result['code'] ?? 400);
        }

        return response()->json([
            'message' => 'Request cancelled.',
            'request' => $result['request'],
        ]);
    }

    // ─── Seeker Endpoints ─────────────────────────────────────────────────────

    public function seekerCreateRequest(Request $request): JsonResponse
    {
        $seeker = Seeker::where('user_id', $request->user()->id)->firstOrFail();

        $validated = $request->validate([
            'service_category' => ['required', 'string'],
            'title'            => ['required', 'string', 'max:255'],
            'description'      => ['nullable', 'string'],
            'city'             => ['nullable', 'string', 'max:100'],
            'address'          => ['nullable', 'string', 'max:255'],
            'latitude'         => ['nullable', 'numeric'],
            'longitude'        => ['nullable', 'numeric'],
            'urgency'          => ['nullable', 'in:immediate,same_day,flexible'],
            'budget'           => ['nullable', 'numeric', 'min:0'],
        ]);

        $matchingRequest = $this->matchingService->createAndBroadcast($seeker, $validated);

        return response()->json([
            'message' => 'Matching request created and broadcasted successfully.',
            'request' => $matchingRequest,
        ], 201);
    }

    public function seekerListRequests(Request $request): JsonResponse
    {
        $seeker = Seeker::where('user_id', $request->user()->id)->firstOrFail();

        $requests = MatchingRequest::where('seeker_id', $seeker->id)
            ->with(['matchedProvider.user'])
            ->latest()
            ->get();

        return response()->json(['requests' => $requests]);
    }

    public function seekerGetRequest(Request $request, int $id): JsonResponse
    {
        $seeker = Seeker::where('user_id', $request->user()->id)->firstOrFail();

        $matchingRequest = MatchingRequest::where('id', $id)
            ->where('seeker_id', $seeker->id)
            ->with(['matchedProvider.user'])
            ->firstOrFail();

        return response()->json(['request' => $matchingRequest]);
    }

    public function seekerCancelRequest(Request $request, int $id): JsonResponse
    {
        $result = $this->matchingService->cancelRequest($id, $request->user());
        if (!$result['success']) {
            return response()->json(['message' => $result['error']], $result['code'] ?? 400);
        }

        return response()->json(['message' => 'Request cancelled.', 'request' => $result['request']]);
    }

    // ─── Provider Endpoints ───────────────────────────────────────────────────

    public function providerAvailableJobs(Request $request): JsonResponse
    {
        $provider = Provider::where('user_id', $request->user()->id)->firstOrFail();
        $category = strtolower($provider->service_category ?? '');
        $aliases = [$category];
        if (str_ends_with($category, 'ing')) {
            $aliases[] = substr($category, 0, -3) . 'er';
        }
        if (str_ends_with($category, 'er')) {
            $aliases[] = substr($category, 0, -2) . 'ing';
        }
        if ($category === 'electrical') $aliases[] = 'electrician';
        if ($category === 'electrician') $aliases[] = 'electrical';
        if ($category === 'tutoring') $aliases[] = 'tutor';
        if ($category === 'tutor') $aliases[] = 'tutoring';

        $jobs = MatchingRequest::where('status', 'broadcasting')
            ->whereNull('matched_provider_id')
            ->where(function ($q) use ($aliases) {
                foreach ($aliases as $alias) {
                    $q->orWhereRaw('LOWER(service_category) = ?', [$alias]);
                }
            })
            ->with(['seeker.user'])
            ->latest()
            ->get()
            ->map(fn($job) => [
                'id'               => $job->id,
                'title'            => $job->title,
                'description'      => $job->description,
                'service_category' => $job->service_category,
                'city'             => $job->city,
                'address'          => $job->address,
                'urgency'          => $job->urgency,
                'budget'           => $job->budget,
                'status'           => $job->status,
                'created_at'       => $job->created_at->toISOString(),
                'seeker_name'      => $job->seeker->user->name ?? 'Seeker',
            ]);

        return response()->json(['jobs' => $jobs]);
    }

    public function providerMyJobs(Request $request): JsonResponse
    {
        $provider = Provider::where('user_id', $request->user()->id)->firstOrFail();

        $jobs = MatchingRequest::where('matched_provider_id', $provider->id)
            ->with(['seeker.user'])
            ->latest()
            ->get();

        return response()->json(['jobs' => $jobs]);
    }

    public function providerAcceptJob(Request $request, int $id): JsonResponse
    {
        $provider = Provider::where('user_id', $request->user()->id)->firstOrFail();

        $result = $this->matchingService->acceptJob($id, $provider);

        if (!$result['success']) {
            return response()->json([
                'message' => $result['error'],
            ], $result['code'] ?? 400);
        }

        return response()->json([
            'message' => 'Job successfully accepted! Contact details unlocked.',
            'request' => $result['request'],
        ]);
    }

    // ─── Admin Endpoints ──────────────────────────────────────────────────────

    public function adminIndex(Request $request): JsonResponse
    {
        $requests = MatchingRequest::with(['seeker.user', 'matchedProvider.user'])
            ->latest()
            ->get()
            ->map(function ($r) {
                $timeToMatch = null;
                if ($r->accepted_at && $r->created_at) {
                    $secs = $r->accepted_at->diffInSeconds($r->created_at);
                    $timeToMatch = $secs < 60 ? "{$secs}s" : round($secs / 60) . "m";
                }

                return [
                    'id'                     => $r->id,
                    'title'                  => $r->title,
                    'description'            => $r->description,
                    'service_category'       => $r->service_category,
                    'city'                   => $r->city,
                    'address'                => $r->address,
                    'urgency'                => $r->urgency,
                    'budget'                 => $r->budget,
                    'status'                 => $r->status,
                    'broadcast_count'        => $r->broadcast_count,
                    'candidate_provider_ids' => $r->candidate_provider_ids,
                    'seeker'                 => $r->seeker->user->name ?? 'Seeker',
                    'seeker_phone'           => $r->seeker->user->phone_number ?? 'N/A',
                    'provider'               => $r->matchedProvider->user->name ?? null,
                    'provider_phone'         => $r->matchedProvider->phone ?? $r->matchedProvider->user->phone_number ?? null,
                    'provider_avatar'        => $r->matchedProvider->profile_image ?? null,
                    'time_to_match'          => $timeToMatch,
                    'created_at'             => $r->created_at->toISOString(),
                    'accepted_at'            => $r->accepted_at?->toISOString(),
                ];
            });

        $today = now()->format('Y-m-d');
        $stats = [
            'total_requests' => $requests->count(),
            'broadcasting'   => $requests->where('status', 'broadcasting')->count(),
            'matched_today'  => $requests->filter(fn($r) => in_array($r['status'], ['matched', 'in_progress', 'completed']) && str_starts_with($r['created_at'], $today))->count(),
            'avg_match_time' => '42s',
        ];

        return response()->json([
            'stats'    => $stats,
            'requests' => $requests,
        ]);
    }

    public function adminAssign(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'provider_id' => ['required', 'exists:providers,id'],
        ]);

        $result = $this->matchingService->manualAssign($id, (int) $validated['provider_id']);
        if (!$result['success']) {
            return response()->json(['message' => $result['error']], $result['code'] ?? 400);
        }

        return response()->json(['message' => 'Provider assigned successfully.', 'request' => $result['request']]);
    }

    public function adminCancel(Request $request, int $id): JsonResponse
    {
        $result = $this->matchingService->cancelRequest($id, $request->user());
        if (!$result['success']) {
            return response()->json(['message' => $result['error']], $result['code'] ?? 400);
        }

        return response()->json(['message' => 'Request cancelled.', 'request' => $result['request']]);
    }

    public function adminRebroadcast(Request $request, int $id): JsonResponse
    {
        $result = $this->matchingService->rebroadcast($id);
        if (!$result['success']) {
            return response()->json(['message' => $result['error']], $result['code'] ?? 400);
        }

        return response()->json(['message' => 'Request rebroadcast successfully.', 'request' => $result['request']]);
    }
}
