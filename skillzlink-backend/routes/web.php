<?php

use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\RagController;
use App\Http\Controllers\Api\WhatsAppWebhookController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Live Chat — public endpoints (web routes avoid global API auth)
Route::post('/api/chat/send', [ChatController::class, 'send']);
Route::get('/api/chat/poll', [ChatController::class, 'poll']);

// RAG AI — public knowledge base query
Route::post('/api/rag/ask', [RagController::class, 'ask']);

// Live Helper Chat — serve all LHC requests through its own index.php
Route::any('/lhc/{any?}', function ($any = null) {
    $lhcPath = public_path('lhc');
    chdir($lhcPath);

    $_SERVER['SCRIPT_NAME'] = '/lhc/index.php';
    $_SERVER['SCRIPT_FILENAME'] = $lhcPath . '/index.php';

    require $lhcPath . '/index.php';
    exit;
})->where('any', '.*');

Route::prefix('webhooks/whatsapp')->group(function (): void {
    Route::post('/', [WhatsAppWebhookController::class, 'handle']);
    Route::get('/', [WhatsAppWebhookController::class, 'verify']);
});
