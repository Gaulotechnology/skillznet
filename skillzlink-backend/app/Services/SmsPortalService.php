<?php

namespace App\Services;

use App\Models\SmsLog;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * SMS Portal outbound integration.
 *
 * Mirrors papaya-new's sendSMS(): Basic auth against
 * {SMS_PORTAL_BASE_URL}/bulkmessages with a single message payload, then
 * records the result in the sms_logs table so the admin dashboard can show
 * every SMS Portal message the platform sends.
 */
class SmsPortalService
{
    /**
     * Send an SMS via SMS Portal and log the result.
     *
     * @param string      $to      Destination phone number.
     * @param string      $message Message body.
     * @param string      $type    One of: otp, notification, marketing.
     * @param int|null    $userId  Related user id (optional).
     */
    public function send(string $to, string $message, string $type = 'notification', ?int $userId = null): array
    {
        $baseUrl = rtrim((string) config('services.sms_portal.base_url', 'https://rest.smsportal.com'), '/');
        $clientId = (string) config('services.sms_portal.client_id', '');
        $clientSecret = (string) config('services.sms_portal.client_secret', '');

        if ($clientId === '' || $clientSecret === '') {
            $this->log($to, $message, $type, 'pending', 0, $userId);

            return ['success' => false, 'error' => 'SMS Portal credentials not configured.'];
        }

        try {
            $response = Http::withBasicAuth($clientId, $clientSecret)
                ->asJson()
                ->timeout(30)
                ->post($baseUrl . '/bulkmessages', [
                    'messages' => [
                        [
                            'content' => $message,
                            'destination' => $to,
                        ],
                    ],
                ]);

            if ($response->successful()) {
                $this->log($to, $message, $type, 'delivered', 0.0350, $userId);

                return ['success' => true, 'status' => $response->status()];
            }

            Log::warning('SMS Portal send failed', [
                'status' => $response->status(),
                'to' => $to,
                'body' => $response->body(),
            ]);
            $this->log($to, $message, $type, 'failed', 0, $userId);

            return ['success' => false, 'status' => $response->status(), 'error' => $response->body()];
        } catch (\Throwable $e) {
            Log::error('SMS Portal send exception: ' . $e->getMessage());
            $this->log($to, $message, $type, 'failed', 0, $userId);

            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    private function log(string $to, string $message, string $type, string $status, float $cost, ?int $userId): void
    {
        try {
            SmsLog::create([
                'recipient' => $to,
                'type' => $type,
                'message' => $message,
                'provider' => 'smsportal',
                'status' => $status,
                'cost' => $cost,
                'user_id' => $userId,
                'sent_at' => now(),
            ]);
        } catch (\Throwable $e) {
            Log::error('Failed to write SMS log: ' . $e->getMessage());
        }
    }
}
