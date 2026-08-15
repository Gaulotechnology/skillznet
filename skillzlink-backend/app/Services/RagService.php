<?php

namespace App\Services;

use App\Models\DocumentChunk;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RagService
{
    private string $deepseekApiKey;
    private string $deepseekBaseUrl = 'https://api.deepseek.com/v1';
    private string $siteUrl;

    public function __construct()
    {
        $this->deepseekApiKey = env('DEEPSEEK_API_KEY', '');
        $this->siteUrl = rtrim(env('SITE_URL', 'http://localhost:5173'), '/');
    }

    // ─── Ingestion ──────────────────────────────────────────────────────────

    /**
     * Ingest a document: chunk it, generate embeddings, and store.
     */
    public function ingest(string $title, string $content, string $source = ''): int
    {
        $chunks = $this->chunkText($content, 500);
        $stored = 0;

        foreach ($chunks as $i => $chunk) {
            $embedding = $this->generateEmbedding($chunk);

            DocumentChunk::create([
                'title' => $title,
                'content' => $chunk,
                'source' => $source,
                'embedding' => $embedding,
                'chunk_index' => $i,
            ]);
            $stored++;
        }

        return $stored;
    }

    /**
     * Split text into overlapping chunks of roughly $maxChars characters.
     */
    private function chunkText(string $text, int $maxChars = 500): array
    {
        $text = trim($text);
        if (mb_strlen($text) <= $maxChars) {
            return [$text];
        }

        $chunks = [];
        $words = explode(' ', $text);
        $current = '';
        $overlap = 50; // words of overlap

        for ($i = 0; $i < count($words); $i++) {
            $candidate = $current ? $current . ' ' . $words[$i] : $words[$i];

            if (mb_strlen($candidate) > $maxChars && $current !== '') {
                $chunks[] = trim($current);
                // Overlap: keep last N words
                $prevWords = explode(' ', $current);
                $keep = array_slice($prevWords, max(0, count($prevWords) - $overlap));
                $current = implode(' ', $keep) . ' ' . $words[$i];
            } else {
                $current = $candidate;
            }
        }

        if (trim($current) !== '') {
            $chunks[] = trim($current);
        }

        return $chunks;
    }

    // ─── Embeddings ─────────────────────────────────────────────────────────

    /**
     * Generate an embedding vector for the given text.
     * Uses DeepSeek API if key is available, otherwise falls back to local TF-IDF vector.
     */
    public function generateEmbedding(string $text): array
    {
        if ($this->deepseekApiKey) {
            try {
                return $this->deepseekEmbedding($text);
            } catch (\Exception $e) {
                Log::warning('DeepSeek embedding failed, falling back to local: ' . $e->getMessage());
            }
        }

        return $this->localEmbedding($text);
    }

    private function deepseekEmbedding(string $text): array
    {
        $response = Http::withToken($this->deepseekApiKey)
            ->timeout(30)
            ->post($this->deepseekBaseUrl . '/embeddings', [
                'model' => 'deepseek-chat',
                'input' => $text,
            ]);

        if (!$response->successful()) {
            throw new \RuntimeException('DeepSeek embedding API error: ' . $response->body());
        }

        $data = $response->json();
        return $data['data'][0]['embedding'] ?? [];
    }

    /**
     * Local TF-IDF style embedding using word frequencies.
     * This ensures the system works without an API key.
     * Produces a 256-dimension vector.
     */
    private function localEmbedding(string $text): array
    {
        $text = mb_strtolower(trim($text));
        $text = preg_replace('/[^a-z0-9\s]/', '', $text);
        $words = array_values(array_filter(explode(' ', $text), fn($w) => strlen($w) > 1));

        // Build a fixed-size feature vector using n-grams and word hashing
        $dim = 256;
        $vector = array_fill(0, $dim, 0.0);

        // Word-level features via hash trick
        foreach ($words as $word) {
            $hash = crc32($word);
            $idx = abs($hash) % $dim;
            $vector[$idx] += 1.0;
        }

        // Bigram features
        for ($i = 0; $i < count($words) - 1; $i++) {
            $bigram = $words[$i] . '_' . $words[$i + 1];
            $hash = crc32($bigram);
            $idx = abs($hash) % $dim;
            $vector[$idx] += 0.5;
        }

        // Normalize
        $norm = sqrt(array_sum(array_map(fn($v) => $v * $v, $vector)));
        if ($norm > 0) {
            $vector = array_map(fn($v) => $v / $norm, $vector);
        }

        return $vector;
    }

    // ─── Query / Retrieval ──────────────────────────────────────────────────

    /**
     * Query the knowledge base: find relevant chunks, then answer with DeepSeek.
     */
    public function query(string $question, int $topK = 5): array
    {
        $relevantChunks = $this->semanticSearch($question, $topK);

        if (empty($relevantChunks)) {
            return [
                'answer' => $this->simpleFallback($question),
                'sources' => [],
                'mode' => 'fallback',
            ];
        }

        $context = implode("\n\n---\n\n", array_map(
            fn($c) => "[{$c['title']}] {$c['content']}",
            $relevantChunks
        ));

        if ($this->deepseekApiKey) {
            $answer = $this->deepseekChat($question, $context);
            $mode = 'deepseek';
        } else {
            $answer = $this->localAnswer($question, $relevantChunks);
            $mode = 'local';
        }

        return [
            'answer' => $answer,
            'sources' => array_map(fn($c) => [
                'title' => $c['title'],
                'source' => $c['source'],
                'snippet' => mb_substr($c['content'], 0, 150) . '...',
            ], $relevantChunks),
            'mode' => $mode,
        ];
    }

    /**
     * Find the most semantically similar chunks to the query.
     */
    private function semanticSearch(string $query, int $topK): array
    {
        $queryEmbedding = $this->generateEmbedding($query);

        $chunks = DocumentChunk::whereNotNull('embedding')->get();

        if ($chunks->isEmpty()) {
            return [];
        }

        $scored = [];
        foreach ($chunks as $chunk) {
            $chunkEmbedding = $chunk->embedding;
            if (empty($chunkEmbedding)) continue;

            $similarity = $this->cosineSimilarity($queryEmbedding, $chunkEmbedding);
            $scored[] = [
                'chunk' => $chunk,
                'score' => $similarity,
            ];
        }

        usort($scored, fn($a, $b) => $b['score'] <=> $a['score']);
        $top = array_slice($scored, 0, $topK);

        return array_map(fn($s) => [
            'title' => $s['chunk']->title,
            'content' => $s['chunk']->content,
            'source' => $s['chunk']->source,
            'score' => round($s['score'], 4),
        ], $top);
    }

    private function cosineSimilarity(array $a, array $b): float
    {
        $dot = 0.0;
        $normA = 0.0;
        $normB = 0.0;
        $len = min(count($a), count($b));

        for ($i = 0; $i < $len; $i++) {
            $dot += $a[$i] * $b[$i];
            $normA += $a[$i] * $a[$i];
            $normB += $b[$i] * $b[$i];
        }

        if ($normA == 0.0 || $normB == 0.0) return 0.0;
        return $dot / (sqrt($normA) * sqrt($normB));
    }

    // ─── LLM Answer Generation ───────────────────────────────────────────────

    private function deepseekChat(string $question, string $context): string
    {
        $systemPrompt = <<<PROMPT
You are a helpful customer support assistant for SkillzLink, a Zimbabwean platform that connects people with local professionals (plumbers, electricians, cleaners, tutors, etc.).

Use ONLY the context provided below to answer the question. If the context doesn't contain enough information, say so honestly and suggest the visitor browse the website or chat with a human agent.

Keep answers friendly, concise, and helpful. Do not use emojis.

The SkillzLink website is hosted at {$this->siteUrl}. When you reference any page, always give the full URL (for example, {$this->siteUrl}/nearby-professionals, {$this->siteUrl}/register, {$this->siteUrl}/how-it-works). Never give only a relative path like /nearby-professionals.

Context:
{$context}
PROMPT;

        $response = Http::withToken($this->deepseekApiKey)
            ->timeout(45)
            ->post($this->deepseekBaseUrl . '/chat/completions', [
                'model' => 'deepseek-chat',
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $question],
                ],
                'temperature' => 0.5,
                'max_tokens' => 500,
            ]);

        if (!$response->successful()) {
            throw new \RuntimeException('DeepSeek chat error: ' . $response->body());
        }

        $data = $response->json();
        return trim($data['choices'][0]['message']['content'] ?? '');
    }

    /**
     * Local answer without LLM — extracts the most relevant snippet.
     */
    private function localAnswer(string $question, array $chunks): string
    {
        if (empty($chunks)) {
            return "I don't have enough information to answer that yet. Try browsing our website or ask to chat with a human agent.";
        }

        $best = $chunks[0];
        $snippet = mb_substr($best['content'], 0, 300);

        return "Here's what I found from our knowledge base:\n\n\"{$snippet}...\"\n\n📖 Source: {$best['title']}\n\nFor more details, you can browse professionals at /nearby-professionals or chat with a human agent.";
    }

    private function simpleFallback(string $question): string
    {
        return "I don't have specific information about that yet. You can:\n• Browse professionals at /nearby-professionals\n• Learn how it works at /how-it-works\n• Chat with a human agent for personalized help";
    }

    // ─── Re-index all ───────────────────────────────────────────────────────

    public function reindexAll(): int
    {
        DocumentChunk::truncate();
        $count = 0;

        $count += $this->ingest(
            'About SkillzLink',
            file_get_contents(resource_path('knowledge/about.txt')),
            '/about'
        );

        $count += $this->ingest(
            'How It Works',
            file_get_contents(resource_path('knowledge/how-it-works.txt')),
            '/how-it-works'
        );

        $count += $this->ingest(
            'FAQ',
            file_get_contents(resource_path('knowledge/faq.txt')),
            '/faq'
        );

        return $count;
    }

    /**
     * Build the knowledge index from inline content (no file reads needed).
     */
    public function buildKnowledgeBase(): int
    {
        DocumentChunk::truncate();
        $count = 0;

        $documents = $this->getKnowledgeDocuments();
        foreach ($documents as $doc) {
            $count += $this->ingest($doc['title'], $doc['content'], $doc['source']);
        }

        return $count;
    }

    private function getKnowledgeDocuments(): array
    {
        return [
            [
                'title' => 'About SkillzLink',
                'source' => '/about',
                'content' => $this->aboutContent(),
            ],
            [
                'title' => 'How SkillzLink Works',
                'source' => '/how-it-works',
                'content' => $this->howItWorksContent(),
            ],
            [
                'title' => 'Services & Categories',
                'source' => '/nearby-professionals',
                'content' => $this->servicesContent(),
            ],
            [
                'title' => 'For Professionals (Providers)',
                'source' => '/register',
                'content' => $this->forProvidersContent(),
            ],
            [
                'title' => 'For Clients (Seekers)',
                'source' => '/',
                'content' => $this->forClientsContent(),
            ],
            [
                'title' => 'Pricing & Payments',
                'source' => '/nearby-professionals',
                'content' => $this->pricingContent(),
            ],
            [
                'title' => 'Verification & Trust',
                'source' => '/trust-and-safety',
                'content' => $this->verificationContent(),
            ],
            [
                'title' => 'WhatsApp Integration',
                'source' => '/how-it-works',
                'content' => $this->whatsappContent(),
            ],
            [
                'title' => 'FAQ',
                'source' => '/faq',
                'content' => $this->faqContent(),
            ],
        ];
    }

    private function aboutContent(): string
    {
        return <<<TEXT
SkillzLink is a Zimbabwean platform that connects people with trusted local professionals. We help you find plumbers, electricians, cleaners, tutors, mechanics, carpenters, painters, gardeners, and more across Zimbabwe.

Founded to solve the problem of finding reliable service providers, SkillzLink verifies every professional's identity through their National ID before listing them on the platform. This ensures you hire with confidence.

Our platform covers all major Zimbabwean cities including Harare, Bulawayo, Mutare, Gweru, Kwekwe, Masvingo, Chinhoyi, Marondera, Kadoma, Bindura, Hwange, and Victoria Falls.

SkillzLink operates on WhatsApp — no additional app downloads required. You browse professionals on our website, then connect with them directly through WhatsApp for messaging, calling, and sharing photos.
TEXT;
    }

    private function howItWorksContent(): string
    {
        return <<<TEXT
Finding a professional on SkillzLink takes just three simple steps:

Step 1 — Search & Filter: Browse our directory of verified professionals. Filter by city (Harare, Bulawayo, etc.), service category (plumbing, electrical, tutoring, etc.), or by experience level and hourly rate to find the perfect match.

Step 2 — Review Profiles: Check out their past work, read reviews from other Zimbabweans, and verify their ID status. Each professional displays their years of experience, success rate, and hourly rate.

Step 3 — Chat on WhatsApp: Click the "Reveal Contact" button to get the professional's WhatsApp number (requires login). Then message them directly on WhatsApp to discuss your project, negotiate pricing, share photos, and schedule the work.

For professionals: Register with your phone number and National ID. Once verified, you'll appear in search results and clients can contact you on WhatsApp.
TEXT;
    }

    private function servicesContent(): string
    {
        return <<<TEXT
SkillzLink offers a wide range of service categories across Zimbabwe:

Plumbing — Emergency repairs, pipe installations, drainage, geyser repairs, and maintenance.
Electrical — Residential and commercial wiring, installations, repairs, and safety inspections.
Cleaning — Home cleaning, office cleaning, deep cleaning, and housekeeping services.
Tutoring — Academic tutoring for primary, secondary, and tertiary students in various subjects.
Carpentry — Furniture making, repairs, kitchen installations, and woodwork.
Painting — Interior and exterior painting for homes and commercial buildings.
Gardening — Landscaping, garden maintenance, lawn care, and tree services.
Mechanics — Vehicle repairs, maintenance, diagnostics, and servicing.
Appliance Repair — Fridge, stove, washing machine, and electronics repair.

All professionals are available in major cities: Harare, Bulawayo, Mutare, Gweru, Kwekwe, Masvingo, Chinhoyi, Marondera, Kadoma, Bindura, Hwange, and Victoria Falls.
TEXT;
    }

    private function forProvidersContent(): string
    {
        return <<<TEXT
Become a professional on SkillzLink and grow your business:

Step 1 — Create Your Profile: Sign up with your phone number. Select your service category (plumbing, electrical, cleaning, etc.). Set your working radius in kilometers and write a bio describing your experience.

Step 2 — Get ID Verified: Provide your Zimbabwe National ID number for verification. Once approved, you'll receive a verified badge that builds trust with potential clients.

Step 3 — Receive Client Leads: Clients searching for your service category in your city will find your profile. They can click to reveal your WhatsApp number and message you directly.

Step 4 — Build Your Reputation: Complete jobs successfully, collect 5-star reviews from satisfied clients, and climb the search rankings. Better reviews and higher success rates mean more visibility and more clients.

Registration is free. There are no hidden fees — you negotiate rates directly with clients on WhatsApp.
TEXT;
    }

    private function forClientsContent(): string
    {
        return <<<TEXT
As a client on SkillzLink, you can:

Browse Professionals — Search by city, service category, experience level, and budget. All professionals display their rating, success rate, and hourly rate upfront.

Reveal Contact — Once logged in, click "Reveal Contact" on any professional's profile to get their WhatsApp number. Contact is only revealed after login to protect provider privacy.

Chat on WhatsApp — All communication happens on WhatsApp. Message, call, share photos, and negotiate directly with the professional.

Post a Service Request — Describe what you need, and relevant professionals in your area can respond with quotes.

Save Favorites — Save professionals to your favorites list for quick access later.

Your privacy is protected. Your WhatsApp number is never shared publicly — only the professional you contact will see it.
TEXT;
    }

    private function pricingContent(): string
    {
        return <<<TEXT
Pricing on SkillzLink:

For Clients: Browsing and searching for professionals is completely free. There are no fees to use the platform. You negotiate rates directly with the professional on WhatsApp. Typical rates vary by service:
- Plumbers: $20–$50 per hour
- Electricians: $25–$50 per hour
- Cleaners: $10–$25 per hour
- Tutors: $15–$35 per hour
- Mechanics: $20–$50 per hour
- Painters: $15–$30 per hour
- Carpenters: $20–$45 per hour
- Gardeners: $10–$25 per hour

For Professionals: Registration and listing on SkillzLink is free. There are no commission fees or hidden charges. You keep 100% of what you earn from clients.

All payments are handled directly between the client and professional — SkillzLink does not process payments or hold funds.
TEXT;
    }

    private function verificationContent(): string
    {
        return <<<TEXT
Trust and Safety on SkillzLink:

ID Verification — Every professional must provide their Zimbabwe National ID number during registration. Verified professionals receive a blue checkmark badge on their profile.

Real Reviews — All ratings and reviews come from real clients who have actually hired the professional. We do not allow fake or paid reviews.

Success Rate — Each professional displays their success rate based on completed jobs and client satisfaction. This helps you make informed hiring decisions.

Profile Transparency — You can see a professional's years of experience, location, service category, hourly rate, and client reviews before contacting them.

WhatsApp Safety — All conversations happen on WhatsApp, where you can verify the professional's identity through their WhatsApp profile before hiring.

If you encounter any issues with a professional, you can report them through the platform.

For additional safety information, visit the Trust and Safety page at /trust-and-safety.
TEXT;
    }

    private function whatsappContent(): string
    {
        return <<<TEXT
WhatsApp is the primary communication channel on SkillzLink. Here's how it works:

No App Required — You don't need to download any additional apps. SkillzLink works on WhatsApp, which you already use every day.

Reveal Contact — Browse professionals on the SkillzLink website, then click "Reveal Contact" to get their WhatsApp number. You must be logged in to reveal contact details.

Instant Messaging — Message professionals directly on WhatsApp to describe your project, ask questions, and share details.

Share Media — Send photos of the problem (e.g., a leaking pipe), share your location, and exchange documents all within WhatsApp.

Voice Calls — Make voice calls directly from the WhatsApp chat if you need to discuss something in detail.

Data Friendly — WhatsApp is optimized for low data usage and works with all major Zimbabwean mobile networks (Econet, NetOne, Telecel).

Your phone number is protected — it's only shared when you choose to reveal a professional's contact or when a professional responds to your inquiry.
TEXT;
    }

    private function faqContent(): string
    {
        return <<<TEXT
Frequently Asked Questions:

Q: Is SkillzLink free to use?
A: Yes, browsing and searching for professionals is completely free for clients. Registration is free for professionals too. There are no hidden fees.

Q: How do I contact a professional?
A: Click "Reveal Contact" on their profile (requires login). This will show their WhatsApp number, and you can message them directly.

Q: How do I register as a professional?
A: Go to the Register page, select "I am a professional", enter your name, phone number, National ID, service category, and create a PIN. After OTP verification, your profile is created.

Q: What cities do you cover?
A: We cover all major Zimbabwean cities: Harare, Bulawayo, Mutare, Gweru, Kwekwe, Masvingo, Chinhoyi, Marondera, Kadoma, Bindura, Hwange, and Victoria Falls.

Q: How are professionals verified?
A: Professionals provide their National ID during registration. Verified professionals get a blue checkmark badge.

Q: How do payments work?
A: You negotiate rates and payment directly with the professional on WhatsApp. SkillzLink does not process payments.

Q: What if I have a problem with a professional?
A: You can report any issues through the platform. We take all reports seriously.

Q: Do I need to download an app?
A: No app required. Browse on our website and communicate via WhatsApp.

Q: Can I find professionals in my specific suburb?
A: Yes, you can filter by city (e.g., Harare, Bulawayo) and contact professionals to confirm they serve your specific area.

Q: How do I reset my PIN?
A: Use the "Forgot PIN" option on the login page. You'll receive an OTP to verify your identity, then you can set a new PIN.
TEXT;
    }
}
