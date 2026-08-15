<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\InfobipService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InfobipController extends Controller
{
    public function __construct(private readonly InfobipService $infobip)
    {
    }

    /**
     * Send a WhatsApp message via Infobip.
     *
     * Body: { "to": "27780179816", "text": "Hello", "from": "27219352461" }
     */
    public function send(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'to' => ['required', 'string'],
            'text' => ['required', 'string'],
            'from' => ['nullable', 'string'],
        ]);

        $result = $this->infobip->sendText(
            $validated['to'],
            $validated['text'],
            $validated['from'] ?? null,
        );

        $status = ($result['success'] ?? false) ? 200 : 422;

        return response()->json($result, $status);
    }
}
