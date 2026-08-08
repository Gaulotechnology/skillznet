<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\ConversationController;
use App\Http\Controllers\Api\ProviderController;
use App\Http\Controllers\Api\PublicProviderController;
use App\Http\Controllers\Api\SeekerController;
use App\Http\Controllers\Api\WhatsAppWebhookController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['ok' => true]));

// ─── Public endpoints (no auth) ───────────────────────────────────────────────
Route::get('/theme-settings', [PublicProviderController::class, 'themeSettings']);
Route::get('/categories', [PublicProviderController::class, 'categories']);
Route::get('/registration-fields', [AdminController::class, 'publicRegistrationFields']);
Route::get('/providers', [PublicProviderController::class, 'index']);
Route::get('/providers/{id}', [PublicProviderController::class, 'show']);
Route::get('/providers/{id}/slots', [PublicProviderController::class, 'getSlots']);

// Public application submission (no auth)
Route::post('/applications', [ApplicationController::class, 'store']);
Route::get('/careers', function () {
    return response()->json([
        'jobs' => \App\Models\JobPosting::where('is_active', true)->get()
    ]);
});


Route::prefix('auth')->group(function (): void {
    Route::post('/register-provider', [AuthController::class, 'registerProvider']);
    Route::post('/register-seeker', [AuthController::class, 'registerSeeker']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
});

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/auth/me', function (Illuminate\Http\Request $request) {
        $user = $request->user();
        $user->append('permissions');
        return response()->json(['user' => $user]);
    });

    Route::prefix('provider')->group(function (): void {
        Route::get('/profile', [ProviderController::class, 'profile']);
        Route::put('/profile', [ProviderController::class, 'updateProfile']);
        Route::post('/cv', [ProviderController::class, 'uploadCv']);
        Route::get('/subscription', [ProviderController::class, 'subscription']);
        Route::post('/subscribe', [ProviderController::class, 'subscribe']);
        Route::get('/analytics', [ProviderController::class, 'analytics']);
        Route::get('/availability', [ProviderController::class, 'getAvailability']);
        Route::post('/availability', [ProviderController::class, 'setAvailability']);
        Route::get('/bookings', [ProviderController::class, 'getBookings']);
        Route::put('/bookings/{id}/status', [ProviderController::class, 'updateBookingStatus']);
    });

    Route::prefix('seeker')->group(function (): void {
        Route::get('/search', [SeekerController::class, 'search']);
        Route::get('/provider/{id}', [SeekerController::class, 'providerDetails']);
        Route::post('/provider/{id}/contact', [SeekerController::class, 'revealContact']);
        Route::post('/provider/{id}/report', [SeekerController::class, 'reportProvider']);
        Route::post('/bookings', [SeekerController::class, 'createBooking']);
        Route::get('/bookings', [SeekerController::class, 'getBookings']);
    });

    Route::prefix('admin')->middleware('role:admin,super_admin')->group(function (): void {
        Route::get('/users', [AdminController::class, 'users']);
        Route::post('/users', [AdminController::class, 'storeUser']);
        Route::put('/users/{id}', [AdminController::class, 'updateUser']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        Route::post('/users/{id}/impersonate', [AdminController::class, 'impersonateUser']);

        Route::get('/categories', [AdminController::class, 'categories']);
        Route::post('/categories', [AdminController::class, 'storeCategory']);
        Route::put('/categories/{id}', [AdminController::class, 'updateCategory']);
        Route::delete('/categories/{id}', [AdminController::class, 'deleteCategory']);

        Route::get('/registration-fields', [AdminController::class, 'registrationFields']);
        Route::post('/registration-fields', [AdminController::class, 'storeRegistrationField']);
        Route::put('/registration-fields/{id}', [AdminController::class, 'updateRegistrationField']);
        Route::delete('/registration-fields/{id}', [AdminController::class, 'deleteRegistrationField']);

        Route::put('/provider/{id}/verify', [AdminController::class, 'verifyProvider']);
        Route::put('/provider/{id}/suspend', [AdminController::class, 'suspendProvider']);
        Route::get('/subscriptions', [AdminController::class, 'subscriptions']);
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::put('/provider/{id}/subscription', [AdminController::class, 'overrideSubscription']);

        Route::get('/conversations', [ConversationController::class, 'index']);
        Route::post('/conversations', [ConversationController::class, 'store']);
        Route::get('/conversations/{id}', [ConversationController::class, 'show']);
        Route::post('/conversations/{id}/messages', [ConversationController::class, 'sendMessage']);

        Route::get('/applications', [ApplicationController::class, 'index']);
        Route::post('/applications/{id}/approve', [ApplicationController::class, 'approve']);
        Route::post('/applications/{id}/reject', [ApplicationController::class, 'reject']);
        
        // Super admin only routes
        Route::middleware('role:super_admin')->group(function (): void {
            Route::get('/theme-settings', [AdminController::class, 'themeSettings']);
            Route::post('/theme-settings', [AdminController::class, 'updateThemeSettings']);
            Route::get('/settings', [AdminController::class, 'getSettings']);
            Route::post('/settings', [AdminController::class, 'updateSettings']);
            Route::get('/api-logs', [AdminController::class, 'apiLogs']);
            Route::get('/sms-logs', [AdminController::class, 'smsLogs']);
            Route::get('/comm-logs', [AdminController::class, 'commLogs']);
            
            Route::get('/permissions', [AdminController::class, 'permissions']);
            Route::post('/permissions/sync', [AdminController::class, 'syncPermissions']);
        });
    });
});
