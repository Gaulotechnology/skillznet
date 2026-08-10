<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * LHC (Live Helper Chat) Integration Service
 *
 * Handles REST API calls to LHC, auto-login token generation,
 * admin user sync, and bot webhook processing.
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
        $this->baseUrl = rtrim(env('LHC_BASE_URL', config('app.url') . '/lhc'), '/');
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
     * Generate an auto-login URL for an admin to access LHC directly.
     * This bypasses the LHC login form using a time-limited token.
     */
    public function generateAutoLoginUrl(int $userId, string $username, string $email = ''): ?string
    {
        if (!$this->available) return null;

        try {
            // First, ensure the user exists in LHC
            $lhcUserId = $this->syncUser($userId, $username, $email);

            if (!$lhcUserId) return null;

            // Generate auto-login token via LHC REST API
            $response = Http::get($this->baseUrl . '/restapi/generateautologin.php', [
                'user_id' => $lhcUserId,
                'secret_hash' => $this->apiKey,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $token = $data['token'] ?? $data['hash'] ?? null;

                if ($token) {
                    return $this->baseUrl . '/site_admin/user/autologin/' . $token;
                }
            }

            // Fallback: login by token approach
            $loginResponse = Http::post($this->baseUrl . '/restapi/loginbytoken.php', [
                'username' => $username,
                'secret_hash' => $this->apiKey,
            ]);

            if ($loginResponse->successful()) {
                $data = $loginResponse->json();
                $token = $data['token'] ?? $data['hash'] ?? null;
                if ($token) {
                    return $this->baseUrl . '/site_admin/user/autologin/' . $token;
                }
            }

        } catch (\Exception $e) {
            Log::warning('LHC auto-login failed: ' . $e->getMessage());
        }

        // If auto-login fails, return the standard LHC login URL
        return $this->baseUrl . '/site_admin/';
    }

    // ─── User Sync ────────────────────────────────────────────────────────────

    /**
     * Sync a Laravel admin user to LHC.
     * Creates the user if they don't exist, returns the LHC user ID.
     */
    public function syncUser(int $laravelUserId, string $username, string $email = ''): ?int
    {
        if (!$this->available) return null;

        try {
            // Check if user already exists in LHC by username
            $existing = $this->getLhcUserByUsername($username);
            if ($existing) {
                return $existing['id'];
            }

            // Create LHC user via REST API
            $response = Http::post($this->baseUrl . '/restapi/user.php', [
                'secret_hash' => $this->apiKey,
                'username' => $username,
                'password' => $this->generateLhcPassword($laravelUserId, $username),
                'email' => $email ?: ($username . '@skillzlink.local'),
                'name' => $username,
                'surname' => 'Admin',
                'all_departments' => 1,
                'skype' => '',
                'xmpp' => '',
                'job_title' => 'Administrator',
                'disabled' => 0,
                'hide_online' => 0,
                'visible_departments' => '',
                'exclude_departments' => '',
                'max_chats' => 0,
                'departments_ids' => [],
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['id'] ?? null;
            }

            Log::warning('LHC user creation failed: ' . $response->body());
        } catch (\Exception $e) {
            Log::warning('LHC user sync failed: ' . $e->getMessage());
        }

        return null;
    }

    private function getLhcUserByUsername(string $username): ?array
    {
        try {
            $response = Http::get($this->baseUrl . '/restapi/user.php', [
                'secret_hash' => $this->apiKey,
                'username' => $username,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                if (!empty($data['id'])) {
                    return $data;
                }
            }
        } catch (\Exception $e) {}

        return null;
    }

    private function generateLhcPassword(int $userId, string $username): string
    {
        return substr(hash('sha256', 'skillzlink_lhc_' . $userId . '_' . $username . '_' . config('app.key')), 0, 32);
    }

    // ─── Bot Webhook Processing ───────────────────────────────────────────────

    /**
     * Send a bot response back to an LHC chat.
     * This is called by our webhook handler after processing a visitor message.
     */
    public function sendBotMessage(int $chatId, string $message): bool
    {
        if (!$this->available) return false;

        try {
            $response = Http::post($this->baseUrl . '/restapi/addmsgadmin.php', [
                'secret_hash' => $this->apiKey,
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
            $response = Http::post($this->baseUrl . '/restapi/transferchat.php', [
                'secret_hash' => $this->apiKey,
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
            $response = Http::get($this->baseUrl . '/restapi/fetchchatmessages.php', [
                'secret_hash' => $this->apiKey,
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
