<?php

namespace App\Providers;

use App\Models\ApiLog;
use GuzzleHttp\TransferStats;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Globally log every outbound HTTP call made with the Http facade
        // (Infobip/WhatsApp, DeepSeek, SMS Portal, etc.) so the admin API
        // logs page shows calls going out to external systems.
        Http::globalOptions([
            'on_stats' => function (TransferStats $stats) {
                try {
                    $request = $stats->getRequest();
                    if (!$request) {
                        return;
                    }

                    $url = (string) $request->getUri();

                    // Only log external calls (skip loopback / our own host).
                    $host = strtolower((string) $request->getUri()->getHost());
                    if ($host === '' || in_array($host, ['localhost', '127.0.0.1'], true)) {
                        return;
                    }

                    $handlerStats = $stats->getHandlerStats() ?? [];
                    $elapsedMs = isset($handlerStats['total_time'])
                        ? (int) round($handlerStats['total_time'] * 1000)
                        : 0;

                    $body = $request->getBody();
                    if ($body->isSeekable()) {
                        $body->rewind();
                    }
                    $bodyString = (string) $body;

                    $response = $stats->getResponse();

                    ApiLog::create([
                        'method' => $request->getMethod(),
                        'url' => $url,
                        'ip_address' => null,
                        'status_code' => $response ? $response->getStatusCode() : null,
                        'user_id' => null,
                        'response_time_ms' => $elapsedMs,
                        'request_body' => mb_substr($bodyString, 0, 4000),
                        'user_agent' => 'outbound',
                    ]);
                } catch (\Throwable $e) {
                    // Never let logging break the outbound request.
                }
            },
        ]);
    }
}
