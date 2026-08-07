<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LiveHelperChatApiService
{
    public function sendMessage(string $to, string $message, array $options = []): array
    {
        $apiUrl = config('services.live_helper_chat.url');
        $apiKey = config('services.live_helper_chat.api_key');
        $botId = config('services.live_helper_chat.bot_id');

        if (!$apiUrl || !$apiKey || !$botId) {
            return [
                'success' => false,
                'message' => 'Live Helper Chat is not configured',
            ];
        }

        $response = Http::withHeaders([
            'X-API-Key' => $apiKey,
            'Accept' => 'application/json',
        ])->post(rtrim($apiUrl, '/').'/api/v1/whatsapp/messages', [
            'bot_id' => $botId,
            'to' => $to,
            'message' => $message,
            'type' => $options['type'] ?? 'text',
            'quick_replies' => $options['quick_replies'] ?? null,
            'flow_trigger' => $options['flow_trigger'] ?? null,
        ]);

        if (!$response->successful()) {
            Log::error('Live Helper Chat send failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
        }

        return $response->json();
    }
}
