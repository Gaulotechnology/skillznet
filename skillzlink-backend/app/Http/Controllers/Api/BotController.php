<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessAIQuery;
use App\Services\LhcService;
use App\Services\RagService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Bot webhook endpoint — called by LHC's Generic Bot or any external bot system.
 *
 * Flow: Visitor message → LHC Bot → POST /api/bot/webhook → Laravel processes
 *
 * Fast path (quick rules): returns response immediately
 * Async path (AI/RAG): returns "Let me check..." immediately, dispatches job,
 *                      job posts response back via LHC /restapi/addmsguser
 */
class BotController extends Controller
{
    public function webhook(Request $request, RagService $rag, LhcService $lhc): JsonResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:5000'],
            'chat_id' => ['nullable', 'integer'],
            'visitor_name' => ['nullable', 'string'],
            'session_id' => ['nullable', 'string'],
        ]);

        $question = $validated['message'];
        $chatId = $validated['chat_id'] ?? null;
        $visitorName = $validated['visitor_name'] ?? 'Visitor';

        // ── Step 1: Bot quick rules (FAST — returns immediately) ───────────
        $botReply = $this->processBotRules($question);

        if ($botReply && !$botReply['fallback']) {
            return $this->respond($botReply['text'], $botReply['escalate'] ?? false, [
                'quickReplies' => $botReply['quickReplies'] ?? [],
            ]);
        }

        // ── Step 2: AI / RAG (ASYNC — dispatches queue job, pushes response when ready) ──
        if ($chatId) {
            ProcessAIQuery::dispatch($question, $chatId, $visitorName);

            return $this->respond(
                "Let me check that for you... I'll get back with an answer shortly.",
                false,
                ['mode' => 'ai_processing']
            );
        }

        // ── Step 3: No chat ID — fallback ──────────────────────────────────
        return $this->respond(
            "I couldn't find a specific answer to your question. A member of our team will get back to you shortly.",
            true
        );
    }

    /**
     * Simple keyword-based bot rules for common SkillzLink topics.
     * Returns null if no rule matches.
     */
    private function processBotRules(string $message): ?array
    {
        $msg = mb_strtolower(trim($message));

        // Greetings
        if (preg_match('/^(hi|hello|hey|good morning|good afternoon|good evening|yo|sup)\b/', $msg)) {
            return [
                'text' => "Hello! 👋 I'm the SkillzLink assistant. I can help you find professionals, become a provider, learn about pricing, or answer any questions. What can I help with?",
                'escalate' => false,
                'fallback' => false,
                'quickReplies' => [
                    '🔍 Find a Professional',
                    '📝 Become a Provider',
                    '💰 Pricing & Cost',
                    '📖 How It Works',
                    '💬 Chat with a human',
                ],
            ];
        }

        // Chat with AI — direct handler so it never goes quiet
        if (preg_match('/chat with ai\b|\bchat.?gpt\b|\bai assist\b|\bask ai\b/i', $msg)) {
            return [
                'text' => "🤖 You're now chatting with the SkillzLink AI assistant! Ask me anything about our platform — finding professionals, becoming a provider, pricing, safety, how it works, or any other question you have.",
                'escalate' => false,
                'fallback' => false,
                'quickReplies' => [
                    '🔍 Find a Professional',
                    '📝 Become a Provider',
                    '💰 Pricing & Cost',
                    '📖 How It Works',
                    '💬 Chat with a human',
                ],
            ];
        }

        // Find a professional
        if (preg_match('/find|hire|need|looking for|search|plumber|electrician|cleaner|tutor|mechanic|carpenter|painter|gardener/i', $msg)) {
            return [
                'text' => "You can browse our verified professionals at /nearby-professionals. Filter by city, category, experience level, and budget to find the perfect match. All professionals are ID-verified for your safety.",
                'escalate' => false,
                'fallback' => false,
                'quickReplies' => ['🔍 Browse Now', '📝 Post a Request', '💬 Chat with a human'],
            ];
        }

        // Become a provider
        if (preg_match('/join|register|sign up|become.*provider|work.*offer/i', $msg)) {
            return [
                'text' => "Great! You can register as a provider in a few minutes. Just provide your name, phone number, service category, and National ID for verification. Once approved, clients will find and message you directly on WhatsApp. Register at /register.",
                'escalate' => false,
                'fallback' => false,
                'quickReplies' => ['📝 Register Now', '📖 How It Works', '💬 Chat with a human'],
            ];
        }

        // Pricing
        if (preg_match('/price|cost|rate|how much|pay|fee|charge|free/i', $msg)) {
            return [
                'text' => "SkillzLink is free to browse and register. Professionals set their own rates (typically $15–$50/hr depending on the service). You negotiate directly on WhatsApp — no hidden fees from us.",
                'escalate' => false,
                'fallback' => false,
                'quickReplies' => ['🏷️ View Professionals', '💬 Chat with a human'],
            ];
        }

        // How it works
        if (preg_match('/how.*work|process|steps|explain|guide/i', $msg)) {
            return [
                'text' => "It's simple: 1) Browse professionals near you, 2) Check their profiles, ratings, and verification, 3) Click 'Reveal Contact' to get their WhatsApp and chat directly. No app download needed! Learn more at /how-it-works.",
                'escalate' => false,
                'fallback' => false,
                'quickReplies' => ['📖 Full Guide', '🔍 Find a Pro', '💬 Chat with a human'],
            ];
        }

        // Safety / verification
        if (preg_match('/verif|id|safe|trust|background|check|scam/i', $msg)) {
            return [
                'text' => "Safety is our priority. Every professional must provide their National ID for verification before being listed. Verified providers get a blue checkmark badge. We show real client reviews and success rates so you can hire with confidence.",
                'escalate' => false,
                'fallback' => false,
                'quickReplies' => ['🛡️ Trust & Safety', '💬 Chat with a human'],
            ];
        }

        // Human escalation
        if (preg_match('/human|agent|person|real|talk to|speak|support|help/i', $msg)) {
            return [
                'text' => "Let me connect you with a member of our team. Someone will be with you shortly. In the meantime, feel free to describe what you need help with.",
                'escalate' => true,
                'fallback' => false,
            ];
        }

        // No rule matched — return fallback indicator for RAG
        return [
            'text' => '',
            'escalate' => false,
            'fallback' => true,
        ];
    }

    private function respond(string $text, bool $escalate, array $extra = []): JsonResponse
    {
        return response()->json(array_merge([
            'response' => $text,
            'escalate' => $escalate,
            'mode' => $escalate ? 'human_escalation' : 'bot',
        ], $extra));
    }
}
