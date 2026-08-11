<?php

namespace App\Jobs;

use App\Services\LhcService;
use App\Services\RagService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Processes an AI query asynchronously and posts the response back to LHC.
 *
 * Flow:
 *   1. Webhook receives message → returns "Let me check..." immediately
 *   2. This job is queued
 *   3. Job processes the query via RAG/DeepSeek
 *   4. Job posts the response back to LHC via /restapi/addmsguser
 */
class ProcessAIQuery implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 120;

    public function __construct(
        private string $question,
        private int    $chatId,
        private string $visitorName,
    ) {}

    public function handle(RagService $rag, LhcService $lhc): void
    {
        Log::info("ProcessAIQuery: Processing \"{$this->question}\" for chat {$this->chatId}");

        try {
            // Process via RAG AI
            $result = $rag->query($this->question, 3);

            if ($result['answer'] && ($result['mode'] ?? 'fallback') !== 'fallback') {
                $response = $result['answer'];
            } else {
                $response = "I couldn't find a specific answer to your question. A member of our team will get back to you shortly. In the meantime, you can browse professionals at /nearby-professionals.";
            }

            // Post the response back to LHC via REST API (bot message)
            $success = $lhc->sendBotMessage($this->chatId, $response);

            if ($success) {
                Log::info("ProcessAIQuery: Response posted to chat {$this->chatId}");
            } else {
                Log::warning("ProcessAIQuery: Failed to post response to chat {$this->chatId}");
            }
        } catch (\Exception $e) {
            Log::error("ProcessAIQuery failed: " . $e->getMessage());
        }
    }
}
