<?php

namespace App\Jobs;

use App\Services\LhcService;
use App\Services\RagService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

/**
 * Processes an AI query asynchronously and pushes the response back to LHC.
 *
 * Push-based flow (mirrors the IVA proxy in broadcast_tool):
 *   1. Webhook receives message → returns "Let me check..." immediately
 *   2. This job is queued and acquires a per-chat execution lock
 *   3. Job processes the query via RAG/DeepSeek
 *   4. Job pushes the response back to LHC via /restapi/addmsgadmin (bot message)
 *   5. On failure, pushes an error message and clears state — never leaves the user stuck
 */
class ProcessAIQuery implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 120;
    public int $tries = 1;

    public function __construct(
        private string $question,
        private int    $chatId,
        private string $visitorName,
    ) {}

    public function handle(RagService $rag, LhcService $lhc): void
    {
        Log::info("ProcessAIQuery: Processing \"{$this->question}\" for chat {$this->chatId}");

        // Execution lock — prevent concurrent AI jobs for the same chat.
        $lockKey = "lhc:ai_lock:{$this->chatId}";
        if (!Cache::add($lockKey, true, 300)) {
            Log::info("ProcessAIQuery: chat {$this->chatId} already processing, skipping");
            return;
        }

        try {
            $lhc->updateChatVariables($this->chatId, [
                'agent_is_thinking' => true,
                'iva_status' => 'processing',
            ]);

            // Process via RAG AI
            $result = $rag->query($this->question, 3);

            if ($result['answer'] && ($result['mode'] ?? 'fallback') !== 'fallback') {
                $response = $result['answer'];
            } else {
                $response = "I couldn't find a specific answer to your question. A member of our team will get back to you shortly. In the meantime, you can browse professionals at /nearby-professionals.";
            }

            // Push the response back to LHC via REST API (bot message)
            $response = $this->stripEmojis($response);
            $success = $lhc->sendBotMessage($this->chatId, $response);

            if ($success) {
                Log::info("ProcessAIQuery: Response pushed to chat {$this->chatId}");
                $lhc->updateChatVariables($this->chatId, [
                    'agent_is_thinking' => false,
                    'iva_status' => 'completed',
                ]);
            } else {
                Log::warning("ProcessAIQuery: Failed to push response to chat {$this->chatId}");
                $lhc->updateChatVariables($this->chatId, [
                    'agent_is_thinking' => false,
                    'iva_status' => 'error',
                ]);
            }
        } catch (\Exception $e) {
            Log::error("ProcessAIQuery failed: " . $e->getMessage());

            // Best-effort error push so the visitor is never left hanging.
            try {
                $lhc->sendBotMessage(
                    $this->chatId,
                    "Sorry, an error occurred while processing your request. Please try again, or type 'agent' to speak with a human."
                );
            } catch (\Throwable $notifyError) {
                Log::warning('ProcessAIQuery: failed to send error message: ' . $notifyError->getMessage());
            }

            try {
                $lhc->updateChatVariables($this->chatId, [
                    'agent_is_thinking' => false,
                    'iva_status' => 'error',
                ]);
            } catch (\Throwable $cleanupError) {
                Log::warning('ProcessAIQuery: failed to clear state: ' . $cleanupError->getMessage());
            }
        } finally {
            Cache::forget($lockKey);
        }
    }

    /**
     * Strip emojis and variation selectors from AI output.
     */
    private function stripEmojis(string $text): string
    {
        $pattern = '/[\x{1F000}-\x{1FAFF}\x{2600}-\x{27BF}\x{2B00}-\x{2BFF}\x{FE00}-\x{FE0F}\x{200D}\x{20E3}\x{2190}-\x{21FF}\x{2B50}\x{2B55}]/u';
        $text = preg_replace($pattern, '', $text);

        return trim($text);
    }
}
