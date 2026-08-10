<?php

use App\Http\Controllers\Api\BotController;
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

// Bot webhook — called by LHC or external bots
Route::post('/api/bot/webhook', [BotController::class, 'webhook']);

Route::prefix('webhooks/whatsapp')->group(function (): void {
    Route::post('/', [WhatsAppWebhookController::class, 'handle']);
    Route::get('/', [WhatsAppWebhookController::class, 'verify']);
});
