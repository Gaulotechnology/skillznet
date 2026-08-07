<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProviderController;
use App\Http\Controllers\Api\SeekerController;
use App\Http\Controllers\Api\WhatsAppWebhookController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['ok' => true]));

Route::prefix('auth')->group(function (): void {
    Route::post('/register-provider', [AuthController::class, 'registerProvider']);
    Route::post('/register-seeker', [AuthController::class, 'registerSeeker']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
});

Route::middleware('auth:sanctum')->group(function (): void {
    Route::prefix('provider')->group(function (): void {
        Route::get('/profile', [ProviderController::class, 'profile']);
        Route::put('/profile', [ProviderController::class, 'updateProfile']);
        Route::post('/cv', [ProviderController::class, 'uploadCv']);
        Route::get('/subscription', [ProviderController::class, 'subscription']);
        Route::post('/subscribe', [ProviderController::class, 'subscribe']);
        Route::get('/analytics', [ProviderController::class, 'analytics']);
    });

    Route::prefix('seeker')->group(function (): void {
        Route::get('/search', [SeekerController::class, 'search']);
        Route::get('/provider/{id}', [SeekerController::class, 'providerDetails']);
        Route::post('/provider/{id}/contact', [SeekerController::class, 'revealContact']);
        Route::post('/provider/{id}/report', [SeekerController::class, 'reportProvider']);
    });

    Route::prefix('admin')->group(function (): void {
        Route::get('/users', [AdminController::class, 'users']);
        Route::put('/provider/{id}/verify', [AdminController::class, 'verifyProvider']);
        Route::put('/provider/{id}/suspend', [AdminController::class, 'suspendProvider']);
        Route::get('/subscriptions', [AdminController::class, 'subscriptions']);
        Route::get('/revenue', [AdminController::class, 'revenue']);
        Route::put('/provider/{id}/subscription', [AdminController::class, 'overrideSubscription']);
    });
});
