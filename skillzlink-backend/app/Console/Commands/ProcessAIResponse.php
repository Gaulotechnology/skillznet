<?php

namespace App\Console\Commands;

use App\Services\LhcService;
use App\Services\RagService;
use Illuminate\Console\Command;

/**
 * Background command: processes an AI query and posts the response back to LHC.
 *
 * Usage: php artisan skillzlink:ai-response "question" 123
 */
class ProcessAIResponse extends Command
{
    protected $signature = 'skillzlink:ai-response {question} {chat_id}';
    protected $description = 'Process AI query and post response to LHC chat';

    public function handle(RagService $rag, LhcService $lhc): int
    {
        $question = $this->argument('question');
        $chatId = (int) $this->argument('chat_id');

        $this->info("Processing AI query for chat {$chatId}");

        try {
            $result = $rag->query($question, 3);

            if ($result['answer'] && ($result['mode'] ?? 'fallback') !== 'fallback') {
                $response = $result['answer'];
            } else {
                $response = "I couldn't find a specific answer to your question. A member of our team will get back to you shortly.";
            }

            $success = $lhc->postMessageToChat($chatId, $response);

            if ($success) {
                $this->info("Response posted to chat {$chatId}");
                return 0;
            } else {
                $this->error("Failed to post response to chat {$chatId}");
                return 1;
            }
        } catch (\Exception $e) {
            $this->error('AI processing error: ' . $e->getMessage());
            $lhc->postMessageToChat($chatId, "Sorry, I encountered an error. Please try again or chat with a human agent.");
            return 1;
        }
    }
}
