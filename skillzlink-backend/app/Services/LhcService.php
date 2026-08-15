<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * LHC (Live Helper Chat) Integration Service
 *
 * Handles auto-login token generation, admin user sync,
 * and bot webhook processing.
 *
 * All methods gracefully handle the case where LHC is not yet installed.
 */
class LhcService
{
    private string $baseUrl;
    private string $apiKey;
    private bool $available = false;

    public function __construct()
    {
        $this->baseUrl = rtrim(env('LHC_BASE_URL', 'http://lhc:8080'), '/');
        $this->apiKey = env('LHC_API_KEY', '');

        // Check if LHC settings file exists (indicates installation)
        $settingsPath = public_path('lhc/settings/settings.ini.php');
        $this->available = file_exists($settingsPath);
    }

    public function isAvailable(): bool
    {
        return $this->available;
    }

    // ─── Authentication & Auto-Login ──────────────────────────────────────────

    /**
     * Generate an auto-login URL for admin access to LHC.
     * Uses the autologinuser endpoint which validates via a pre-configured hash.
     */
    public function generateAutoLoginUrl(int $userId, string $username, string $email = ''): ?string
    {
        if (!$this->available) return null;

        $hash = $this->getAutologinHash($userId);
        if (!$hash) return null;

        return $this->baseUrl . '/site_admin/user/autologinuser/' . $hash;
    }

    /**
     * Get the autologin hash for a user from LHC's config.
     */
    private function getAutologinHash(int $userId): ?string
    {
        try {
            $row = \DB::connection('mysql')
                ->table('lh_chat_config')
                ->where('identifier', 'autologin_data')
                ->value('value');

            if (!$row) return null;

            $data = @unserialize($row, ['allowed_classes' => false]);
            if (!is_array($data) || !isset($data['autologin_options'])) return null;

            foreach ($data['autologin_options'] as $option) {
                if (isset($option['user_id']) && (int)$option['user_id'] === $userId) {
                    return $option['secret_hash'] ?? null;
                }
            }

            // Fallback: return first available hash
            return $data['autologin_options'][0]['secret_hash'] ?? null;
        } catch (\Exception $e) {
            Log::warning('LHC autologin hash lookup failed: ' . $e->getMessage());
            return null;
        }
    }

    // ─── Bot Webhook Processing ───────────────────────────────────────────────

    /**
     * Look up a chat hash from the LHC database by chat ID.
     * The backend shares the same MySQL database as LHC.
     */
    public function getChatHash(int $chatId): ?string
    {
        try {
            return \DB::connection('mysql')
                ->table('lh_chat')
                ->where('id', $chatId)
                ->value('hash');
        } catch (\Exception $e) {
            Log::warning('LHC chat hash lookup failed: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Post a message back to an LHC chat via REST API (appears as a visitor/bot message).
     * Uses the chat hash for authentication.
     */
    public function postMessageToChat(int $chatId, string $message): bool
    {
        if (!$this->available) return false;

        $hash = $this->getChatHash($chatId);
        if (!$hash) {
            Log::warning("LHC: Cannot post message, hash not found for chat $chatId");
            return false;
        }

        try {
            $response = Http::asForm()->post($this->baseUrl . '/restapi/addmsguser', [
                'chat_id' => $chatId,
                'hash' => $hash,
                'msg' => $message,
            ]);

            if (!$response->successful()) {
                Log::warning("LHC addmsguser failed: " . $response->body());
            }

            return $response->successful();
        } catch (\Exception $e) {
            Log::warning('LHC post message failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send a bot response back to an LHC chat (admin-side).
     *
     * Idempotent (deduplicates identical messages within a window) and
     * retries transient failures with exponential backoff — mirrors the
     * push-based pattern used by the IVA proxy (broadcast_tool).
     */
    public function sendBotMessage(int $chatId, string $message, array $meta = []): bool
    {
        if (!$this->available) return false;

        // Idempotency — prevent duplicate bubbles from replayed/duplicate jobs.
        $messageId = md5($chatId . '|' . $message);
        $cacheKey = "lhc:sent:{$messageId}";
        if (Cache::has($cacheKey)) {
            Log::info('LHC: duplicate bot message skipped', ['chat_id' => $chatId]);
            return true;
        }

        $payload = [
            'chat_id' => $chatId,
            'msg' => $message,
            'sender' => 'bot',
        ];

        if (!empty($meta)) {
            $payload['meta_msg'] = json_encode($meta);
        }

        $attempts = 3;
        $sleepMs = 500;

        for ($i = 0; $i < $attempts; $i++) {
            try {
                $response = Http::withBasicAuth('admin', $this->apiKey)
                    ->asForm()
                    ->timeout(10)
                    ->post($this->baseUrl . '/restapi/addmsgadmin', $payload);

                if ($response->successful()) {
                    Cache::put($cacheKey, true, 3600);
                    return true;
                }

                $status = $response->status();

                // 4xx (except 408/429) are non-retryable
                if ($status >= 400 && $status < 500 && !in_array($status, [408, 429])) {
                    Log::warning("LHC addmsgadmin failed (non-retryable): HTTP {$status} " . $response->body());
                    return false;
                }

                Log::warning("LHC addmsgadmin failed (retryable): HTTP {$status}", ['attempt' => $i + 1]);
            } catch (\Exception $e) {
                Log::warning("LHC addmsgadmin attempt " . ($i + 1) . " failed: " . $e->getMessage());
            }

            if ($i < $attempts - 1) {
                usleep($sleepMs * 1000);
                $sleepMs *= 2;
            }
        }

        return false;
    }

    // ─── Chat Variables & Handoff (native DB, mirrors IVA proxy) ──────────────

    /**
     * Read the chat variables JSON for a chat.
     */
    public function fetchChatVariables(int $chatId): array
    {
        try {
            $json = DB::table('lh_chat')->where('id', $chatId)->value('chat_variables');
            if ($json) {
                $parsed = json_decode($json, true);
                if (is_array($parsed)) {
                    return $parsed;
                }
            }
        } catch (\Exception $e) {
            Log::warning('LHC fetch chat variables failed: ' . $e->getMessage());
        }

        return [];
    }

    /**
     * Merge and persist chat variables JSON for a chat.
     */
    public function updateChatVariables(int $chatId, array $variables): bool
    {
        try {
            $merged = array_merge($this->fetchChatVariables($chatId), $variables);

            return DB::table('lh_chat')
                ->where('id', $chatId)
                ->update(['chat_variables' => json_encode($merged)]) > 0;
        } catch (\Exception $e) {
            Log::warning('LHC update chat variables failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Transfer a bot chat back to pending so a human operator can pick it up.
     */
    public function transferChatToPending(int $chatId): bool
    {
        try {
            return DB::table('lh_chat')
                ->where('id', $chatId)
                ->update([
                    'status' => 0, // erLhcoreClassModelChat::STATUS_PENDING_CHAT
                    'pnd_time' => time(),
                ]) > 0;
        } catch (\Exception $e) {
            Log::warning('LHC transfer to pending failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Transfer a chat to a human operator.
     */
    public function transferToHuman(int $chatId, int $departmentId = 1): bool
    {
        if (!$this->available) return false;

        try {
            $response = Http::withBasicAuth('admin', $this->apiKey)
                ->post($this->baseUrl . '/restapi/transferchat', [
                    'chat_id' => $chatId,
                    'department_id' => $departmentId,
                ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::warning('LHC transfer failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Fetch recent messages from an LHC chat.
     */
    public function fetchMessages(int $chatId, int $lastMsgId = 0): array
    {
        if (!$this->available) return [];

        try {
            $response = Http::withBasicAuth('admin', $this->apiKey)
                ->get($this->baseUrl . '/restapi/fetchchatmessages', [
                    'chat_id' => $chatId,
                    'last_msg_id' => $lastMsgId,
                ]);

            if ($response->successful()) {
                return $response->json()['messages'] ?? [];
            }
        } catch (\Exception $e) {
            Log::warning('LHC fetch messages failed: ' . $e->getMessage());
        }

        return [];
    }
}
