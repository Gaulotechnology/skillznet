<?php

namespace App\Services;

use App\Models\Setting;
use Paynow\Payments\Paynow;

class PaynowService
{
    private ?Paynow $client = null;
    private ?object $config = null;

    /**
     * Get config from database (admin-set) with fallback to .env / config/paynow.php.
     */
    public function getConfig(): object
    {
        if ($this->config) {
            return $this->config;
        }

        $db = Setting::getSection('paynow');

        return $this->config = (object) [
            'integration_id' => $db['integration_id'] ?? config('paynow.integration_id'),
            'integration_key' => $db['integration_key'] ?? config('paynow.integration_key'),
            'auth_email'      => $db['auth_email']      ?? config('paynow.auth_email'),
            'return_url'      => $db['return_url']      ?? config('paynow.return_url'),
            'result_url'      => $db['result_url']      ?? config('paynow.result_url'),
            'mode'            => $db['mode']            ?? config('paynow.mode', 'sandbox'),
            'active'          => (bool) ($db['active']  ?? true),
        ];
    }

    /**
     * Get PayNow client instance.
     */
    public function client(): ?Paynow
    {
        if ($this->client) {
            return $this->client;
        }

        $config = $this->getConfig();

        if (empty($config->integration_id) || empty($config->integration_key)) {
            return null;
        }

        return $this->client = new Paynow(
            $config->integration_id,
            $config->integration_key,
            $config->result_url,
            $config->return_url
        );
    }

    /**
     * Initiate a payment and return the redirect URL.
     *
     * @param  string  $reference   Unique payment reference (e.g., invoice ID).
     * @param  string  $description Payment description.
     * @param  float   $amount      Amount in USD.
     * @return array{success: bool, redirect_url?: string, poll_url?: string, error?: string}
     */
    public function initiatePayment(string $reference, string $description, float $amount): array
    {
        $paynow = $this->client();

        if (! $paynow) {
            return ['success' => false, 'error' => 'PayNow is not configured.'];
        }

        $config = $this->getConfig();

        $payment = $paynow->createPayment($reference, $config->auth_email);
        $payment->add($description, $amount);

        try {
            $response = $paynow->send($payment);

            if ($response->success()) {
                return [
                    'success'      => true,
                    'redirect_url' => $response->redirectUrl(),
                    'poll_url'     => $response->pollUrl(),
                ];
            }

            return ['success' => false, 'error' => 'PayNow initiation failed: ' . ($response->data()['error'] ?? 'Unknown error')];
        } catch (\Throwable $e) {
            \Log::error('PayNow payment initiation failed', ['error' => $e->getMessage()]);
            return ['success' => false, 'error' => 'Payment initiation failed. Please try again.'];
        }
    }

    /**
     * Poll transaction status.
     */
    public function pollTransaction(string $pollUrl): ?string
    {
        $paynow = $this->client();

        if (! $paynow) {
            return null;
        }

        try {
            $status = $paynow->pollTransaction($pollUrl);
            return $status->status();
        } catch (\Throwable $e) {
            \Log::error('PayNow poll failed', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Process incoming status update from PayNow webhook.
     *
     * @return array{status: string, poll_url: string, reference: string}
     */
    public function processStatusUpdate(): array
    {
        $paynow = $this->client();

        if (! $paynow) {
            return ['status' => 'Error', 'poll_url' => '', 'reference' => ''];
        }

        $result = $paynow->processStatusUpdate();

        return [
            'status'    => $result->status(),
            'poll_url'  => $result->pollUrl(),
            'reference' => $result->reference(),
        ];
    }
}
