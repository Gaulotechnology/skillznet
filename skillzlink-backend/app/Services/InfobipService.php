<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Infobip WhatsApp Integration Service
 *
 * Sends WhatsApp messages through the Infobip HTTP API. This mirrors the
 * outbound pattern used by papaya-new's InfobipService.ts, using the same
 * credentials (INFOBIP_API_KEY / INFOBIP_BASE_URL / INFOBIP_SENDER_NUMBER).
 */
class InfobipService
{
    /**
     * Send a plain-text WhatsApp message.
     *
     * @param string      $to   Recipient phone number (international format, +/- sign optional).
     * @param string      $text Message body.
     * @param string|null $from Sender number (defaults to configured sender number).
     */
    public function sendText(string $to, string $text, ?string $from = null): array
    {
        $baseUrl = $this->baseUrl();
        $apiKey = (string) config('services.infobip.api_key');
        $from = $this->normalizePhone($from ?: (string) config('services.infobip.sender_number'));
        $to = $this->normalizePhone($to);

        if ($apiKey === '' || $from === '' || $to === '') {
            return [
                'success' => false,
                'error' => 'Infobip is not configured (missing api key, sender or recipient).',
            ];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'App ' . $apiKey,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->timeout(30)->post("https://{$baseUrl}/whatsapp/1/message/text", [
                'from' => $from,
                'to' => $to,
                'content' => [
                    'text' => $text,
                ],
            ]);

            $body = $response->json();

            if (! $response->successful()) {
                Log::error('Infobip send failed', [
                    'status' => $response->status(),
                    'to' => $to,
                    'body' => $body,
                ]);

                return [
                    'success' => false,
                    'status' => $response->status(),
                    'error' => $body['requestError']['serviceException']['text']
                        ?? $body['requestError']['serviceException']['messageId']
                        ?? $response->body(),
                ];
            }

            return [
                'success' => true,
                'status' => $response->status(),
                'message_id' => $body['messages'][0]['messageId'] ?? null,
                'to' => $to,
            ];
        } catch (\Throwable $e) {
            Log::error('Infobip send exception: ' . $e->getMessage());

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Normalize the base URL by stripping protocol and trailing slashes.
     */
    protected function baseUrl(): string
    {
        $url = (string) config('services.infobip.base_url');

        return trim(preg_replace('#^https?://#', '', $url), '/');
    }

    /**
     * Infobip requires international numbers without the leading "+".
     */
    protected function normalizePhone(string $phone): string
    {
        return ltrim(trim($phone), '+');
    }
}
