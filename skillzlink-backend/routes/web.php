<?php

use App\Http\Controllers\Api\WhatsAppWebhookController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('webhooks/whatsapp')->group(function (): void {
    Route::post('/', [WhatsAppWebhookController::class, 'handle']);
    Route::get('/', [WhatsAppWebhookController::class, 'verify']);
});
