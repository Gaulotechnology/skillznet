<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\LiveHelperChatApiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WhatsAppWebhookController extends Controller
{
    public function __construct(private readonly LiveHelperChatApiService $liveHelperChatApiService)
    {
    }

    public function verify(Request $request): JsonResponse
    {
        $mode = $request->query('hub.mode');
        $token = $request->query('hub.verify_token');
        $challenge = $request->query('hub.challenge');

        if (
            $mode === 'subscribe'
            && $token
            && hash_equals((string) config('services.whatsapp.verify_token'), (string) $token)
        ) {
            return response()->json(['challenge' => $challenge]);
        }

        return response()->json(['message' => 'Verification failed'], 403);
    }

    public function handle(Request $request): JsonResponse
    {
        $payload = $request->all();
        $sender = data_get($payload, 'sender');
        $message = data_get($payload, 'message');

        if (!$sender || !$message) {
            return response()->json(['message' => 'Invalid payload'], 422);
        }

        $this->liveHelperChatApiService->sendMessage(
            (string) $sender,
            'Message received. SkillzLink bot flow is active.'
        );

        return response()->json([
            'status' => 'ok',
            'sender' => $sender,
            'received' => $message,
        ]);
    }
}
