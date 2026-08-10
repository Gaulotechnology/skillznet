<?php

namespace App\Services;

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
     */
    public function sendBotMessage(int $chatId, string $message): bool
    {
        if (!$this->available) return false;

        try {
            $response = Http::withBasicAuth('admin', $this->apiKey)
                ->post($this->baseUrl . '/restapi/addmsgadmin', [
                    'chat_id' => $chatId,
                    'msg' => $message,
                ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::warning('LHC bot message failed: ' . $e->getMessage());
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
