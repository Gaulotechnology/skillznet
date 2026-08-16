<?php

namespace App\Services;

use App\Models\MatchingRequest;
use App\Models\Provider;
use App\Models\Seeker;
use App\Models\SmsLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MatchingService
{
    /**
     * Create an on-demand service request and broadcast to matching providers.
     */
    public function createAndBroadcast(Seeker $seeker, array $data): MatchingRequest
    {
        $category = $data['service_category'];
        $city = $data['city'] ?? 'Harare';

        // 1. Identify matching candidates
        $candidatesQuery = Provider::query()
            ->with('user')
            ->whereRaw('LOWER(service_category) = ?', [strtolower($category)]);

        if (!empty($city)) {
            $candidatesQuery->where(function ($q) use ($city) {
                $q->where('address', 'LIKE', "%{$city}%")
                  ->orWhereNull('address');
            });
        }

        $candidates = $candidatesQuery->get();
        $candidateIds = $candidates->pluck('id')->toArray();

        // 2. Create the matching request record
        $matchingRequest = MatchingRequest::create([
            'seeker_id'              => $seeker->id,
            'service_category'       => $category,
            'title'                  => $data['title'],
            'description'            => $data['description'] ?? null,
            'city'                   => $city,
            'address'                => $data['address'] ?? ($seeker->user->address ?? $city),
            'latitude'               => $data['latitude'] ?? null,
            'longitude'              => $data['longitude'] ?? null,
            'urgency'                => $data['urgency'] ?? 'immediate',
            'budget'                 => $data['budget'] ?? null,
            'status'                 => 'broadcasting',
            'broadcast_count'        => count($candidateIds),
            'candidate_provider_ids' => $candidateIds,
        ]);

        // 3. Dispatch SMS / WhatsApp broadcast alerts to candidate providers
        foreach ($candidates as $candidate) {
            $phone = $candidate->phone ?? $candidate->user->phone_number ?? null;
            if ($phone) {
                try {
                    SmsLog::create([
                        'phone_number' => $phone,
                        'message'      => "SkillzNet Job Alert: New {$category} request in {$city} - \"{$matchingRequest->title}\". Tap to accept!",
                        'status'       => 'sent',
                        'provider'     => 'simulated',
                        'response'     => json_encode(['matching_request_id' => $matchingRequest->id]),
                    ]);
                } catch (\Exception $e) {
                    Log::warning("Could not log SMS broadcast for candidate {$candidate->id}: " . $e->getMessage());
                }
            }
        }

        return $matchingRequest->load(['seeker.user', 'matchedProvider.user']);
    }

    /**
     * First-come, first-served job acceptance with atomic concurrency locking.
     */
    public function acceptJob(int $requestId, Provider $provider): array
    {
        return DB::transaction(function () use ($requestId, $provider) {
            $matchingRequest = MatchingRequest::where('id', $requestId)
                ->lockForUpdate()
                ->first();

            if (!$matchingRequest) {
                return ['success' => false, 'error' => 'Matching request not found.', 'code' => 404];
            }

            if ($matchingRequest->status !== 'broadcasting' || $matchingRequest->matched_provider_id !== null) {
                return [
                    'success' => false,
                    'error'   => 'This job has already been claimed by another professional.',
                    'code'    => 409,
                ];
            }

            // Successfully claim the job
            $matchingRequest->update([
                'status'              => 'matched',
                'matched_provider_id' => $provider->id,
                'accepted_at'         => now(),
            ]);

            $matchingRequest->load(['seeker.user', 'matchedProvider.user']);

            // Notify Seeker of the match
            $seekerPhone = $matchingRequest->seeker->user->phone_number ?? null;
            if ($seekerPhone) {
                try {
                    SmsLog::create([
                        'phone_number' => $seekerPhone,
                        'message'      => "SkillzNet: {$provider->user->name} has accepted your {$matchingRequest->service_category} request! Contact: {$provider->phone}",
                        'status'       => 'sent',
                        'provider'     => 'simulated',
                        'response'     => json_encode(['matched_provider_id' => $provider->id]),
                    ]);
                } catch (\Exception $e) {
                    Log::warning("Could not log seeker match SMS: " . $e->getMessage());
                }
            }

            // Notify Provider with Seeker details
            $providerPhone = $provider->phone ?? $provider->user->phone_number ?? null;
            if ($providerPhone) {
                try {
                    SmsLog::create([
                        'phone_number' => $providerPhone,
                        'message'      => "SkillzNet: Job confirmed! Client {$matchingRequest->seeker->user->name}, Address: {$matchingRequest->address}. Contact: {$seekerPhone}",
                        'status'       => 'sent',
                        'provider'     => 'simulated',
                        'response'     => json_encode(['seeker_id' => $matchingRequest->seeker_id]),
                    ]);
                } catch (\Exception $e) {
                    Log::warning("Could not log provider match SMS: " . $e->getMessage());
                }
            }

            return [
                'success' => true,
                'request' => $matchingRequest,
            ];
        });
    }

    /**
     * Cancel an active request.
     */
    public function cancelRequest(int $requestId, $user = null): array
    {
        $matchingRequest = MatchingRequest::find($requestId);
        if (!$matchingRequest) {
            return ['success' => false, 'error' => 'Request not found', 'code' => 404];
        }

        // Check permission if seeker user is provided
        if ($user && isset($user->role) && $user->role === 'seeker' && $matchingRequest->seeker?->user_id !== $user->id) {
            return ['success' => false, 'error' => 'Unauthorized to cancel this request', 'code' => 403];
        }

        $matchingRequest->update(['status' => 'cancelled']);
        return ['success' => true, 'request' => $matchingRequest->fresh()];
    }

    /**
     * Admin manual assignment.
     */
    public function manualAssign(int $requestId, int $providerId): array
    {
        $matchingRequest = MatchingRequest::find($requestId);
        $provider = Provider::with('user')->find($providerId);

        if (!$matchingRequest || !$provider) {
            return ['success' => false, 'error' => 'Request or Provider not found', 'code' => 404];
        }

        $matchingRequest->update([
            'status'              => 'matched',
            'matched_provider_id' => $provider->id,
            'accepted_at'         => now(),
        ]);

        return ['success' => true, 'request' => $matchingRequest->fresh(['seeker.user', 'matchedProvider.user'])];
    }

    /**
     * Admin rebroadcast.
     */
    public function rebroadcast(int $requestId): array
    {
        $matchingRequest = MatchingRequest::find($requestId);
        if (!$matchingRequest) {
            return ['success' => false, 'error' => 'Request not found', 'code' => 404];
        }

        $candidates = Provider::whereRaw('LOWER(service_category) = ?', [strtolower($matchingRequest->service_category)])->get();
        $matchingRequest->update([
            'status'                 => 'broadcasting',
            'matched_provider_id'    => null,
            'accepted_at'            => null,
            'broadcast_count'        => $candidates->count(),
            'candidate_provider_ids' => $candidates->pluck('id')->toArray(),
        ]);

        return ['success' => true, 'request' => $matchingRequest->fresh(['seeker.user', 'matchedProvider.user'])];
    }
}
