<?php

namespace App\Http\Middleware;

use App\Models\ApiLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogApiRequests
{
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);
        
        $response = $next($request);

        $elapsed = (int) round((microtime(true) - $startTime) * 1000);

        // Skip logging the logs endpoint itself to avoid recursive noise
        if (!str_contains($request->path(), 'admin/api-logs')) {
            try {
                ApiLog::create([
                    'method'          => $request->method(),
                    'url'             => $request->fullUrl(),
                    'ip_address'      => $request->ip(),
                    'status_code'     => $response->getStatusCode(),
                    'user_id'         => $request->user()?->id,
                    'response_time_ms' => $elapsed,
                    'request_body'    => $request->isJson()
                        ? mb_substr($request->getContent(), 0, 2000)
                        : null,
                    'user_agent'      => mb_substr($request->userAgent() ?? '', 0, 512),
                ]);
            } catch (\Throwable) {
                // Never let logging break a real request
            }
        }

        return $response;
    }
}
