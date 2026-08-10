<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\ConversationController;
use App\Http\Controllers\Api\ProviderController;
use App\Http\Controllers\Api\PublicProviderController;
use App\Http\Controllers\Api\SeekerController;
use App\Http\Controllers\Api\AdminChatController;
use App\Http\Controllers\Api\AgentController;
use App\Http\Controllers\Api\AffiliateController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\PaynowController;
use App\Http\Controllers\Api\RagController;
use App\Http\Controllers\Api\WhatsAppWebhookController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['ok' => true]));

// Public PIN policy (used by frontend for client-side validation)
Route::get('/pin-policy', function () {
    return response()->json([
        'min_length'      => (int) \App\Models\Setting::get('pin_min_length', 4),
        'max_attempts'    => (int) \App\Models\Setting::get('pin_max_attempts', 5),
        'lockout_minutes' => (int) \App\Models\Setting::get('pin_lockout_minutes', 30),
        'expiry_days'     => (int) \App\Models\Setting::get('pin_expiry_days', 0),
    ]);
});


// ─── Public endpoints (no auth) ───────────────────────────────────────────────
Route::get('/theme-settings', [PublicProviderController::class, 'themeSettings']);
Route::get('/categories', [PublicProviderController::class, 'categories']);
Route::get('/registration-fields', [AdminController::class, 'publicRegistrationFields']);
Route::get('/providers', [PublicProviderController::class, 'index']);
Route::get('/providers/{id}', [PublicProviderController::class, 'show']);
Route::get('/providers/{id}/slots', [PublicProviderController::class, 'getSlots']);

// Public application submission (no auth)
Route::post('/applications', [ApplicationController::class, 'store']);
Route::post('/referral-click', [AffiliateController::class, 'trackClick']);
Route::get('/careers', function () {
    return response()->json([
        'jobs' => \App\Models\JobPosting::where('is_active', true)->get()
    ]);
});

// ─── PayNow callbacks (public — called by PayNow servers) ──────────────────
Route::post('/paynow/status', [PaynowController::class, 'status']);
Route::get('/paynow/return', [PaynowController::class, 'return']);


Route::prefix('auth')->group(function (): void {
    Route::post('/request-otp', [AuthController::class, 'requestOtp']);
    Route::post('/register-provider', [AuthController::class, 'registerProvider']);
    Route::post('/register-seeker', [AuthController::class, 'registerSeeker']);
    Route::post('/register-agent', [AuthController::class, 'registerAgent']);
    Route::post('/register-affiliate', [AuthController::class, 'registerAffiliate']);
    Route::post('/login', [AuthController::class, 'loginWithPin']);
    Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
    Route::post('/request-pin-reset', [AuthController::class, 'requestPinReset']);
    Route::post('/reset-pin', [AuthController::class, 'resetPin']);
    Route::post('/password-reset', [AuthController::class, 'requestPasswordReset']);
});

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/auth/me', function (Illuminate\Http\Request $request) {
        $user = $request->user();
        $user->append('permissions');
        return response()->json(['user' => $user]);
    });

    // ─── Conversations (all authenticated users) ───────────────────────────
    Route::get('/conversations', [ConversationController::class, 'index']);
    Route::post('/conversations', [ConversationController::class, 'store']);
    Route::get('/conversations/{id}', [ConversationController::class, 'show']);
    Route::post('/conversations/{id}/messages', [ConversationController::class, 'sendMessage']);
    Route::get('/users/list', [ConversationController::class, 'userList']);

    // ─── Account (shared across all roles) ─────────────────────────────────
    Route::prefix('account')->group(function (): void {
        Route::get('/settings', [SeekerController::class, 'getSettings']);
        Route::put('/settings', [SeekerController::class, 'updateSettings']);
        Route::delete('/', [SeekerController::class, 'deleteAccount']);
    });

    // ─── Support tickets ───────────────────────────────────────────────────
    Route::post('/support/tickets', function (Illuminate\Http\Request $request) {
        $request->validate([
            'category'    => ['required', 'string'],
            'description' => ['required', 'string'],
        ]);
        // Placeholder: store ticket in DB for future implementation
        return response()->json(['message' => 'Ticket received', 'ticket_id' => rand(1000, 9999)]);
    });

    // ─── PayNow payments ───────────────────────────────────────────────────
    Route::post('/paynow/initiate', [PaynowController::class, 'initiate']);
    Route::get('/paynow/check', [PaynowController::class, 'check']);

    Route::prefix('provider')->middleware('role:provider')->group(function (): void {
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
        Route::get('/quotes', [ProviderController::class, 'getQuotes']);
        Route::post('/quotes/{id}/respond', [ProviderController::class, 'respondToQuote']);
        Route::get('/services', [ProviderController::class, 'getServices']);
        Route::get('/services/{id}', [ProviderController::class, 'getService']);
        Route::post('/services/{id}/messages', [ProviderController::class, 'sendServiceMessage']);
        Route::post('/services/{id}/cancel', [ProviderController::class, 'cancelService']);
        Route::post('/services/{id}/complete', [ProviderController::class, 'completeService']);
        Route::post('/services/{id}/repost', [ProviderController::class, 'repostService']);
        Route::delete('/services/{id}', [ProviderController::class, 'deleteService']);
    });

    Route::prefix('seeker')->middleware('role:seeker,customer')->group(function (): void {
        Route::get('/search', [SeekerController::class, 'search']);
        Route::get('/provider/{id}', [SeekerController::class, 'providerDetails']);
        Route::post('/provider/{id}/contact', [SeekerController::class, 'revealContact']);
        Route::post('/provider/{id}/report', [SeekerController::class, 'reportProvider']);
        Route::post('/bookings', [SeekerController::class, 'createBooking']);
        Route::get('/bookings', [SeekerController::class, 'getBookings']);
        Route::get('/overview', [SeekerController::class, 'getOverview']);
        Route::get('/reviews', [SeekerController::class, 'getReviews']);
        Route::post('/reviews', [SeekerController::class, 'createReview']);
        Route::put('/reviews/{id}', [SeekerController::class, 'updateReview']);
        Route::delete('/reviews/{id}', [SeekerController::class, 'deleteReview']);
        Route::get('/billing', [SeekerController::class, 'getBilling']);
        Route::post('/billing/payment-methods', [SeekerController::class, 'addPaymentMethod']);
        Route::delete('/billing/payment-methods/{id}', [SeekerController::class, 'deletePaymentMethod']);
        Route::get('/settings', [SeekerController::class, 'getSettings']);
        Route::put('/settings', [SeekerController::class, 'updateSettings']);
        Route::delete('/account', [SeekerController::class, 'deleteAccount']);
    });

    Route::prefix('agent')->middleware('role:agent')->group(function (): void {
        Route::get('/overview', [AgentController::class, 'getOverview']);
        Route::get('/referrals', [AgentController::class, 'getReferrals']);
        Route::get('/commissions', [AgentController::class, 'getCommissions']);
        Route::get('/onboarding-link', [AgentController::class, 'getOnboardingLink']);
    });

    Route::prefix('affiliate')->middleware('role:affiliate')->group(function (): void {
        Route::get('/overview', [AffiliateController::class, 'getOverview']);
        Route::get('/links', [AffiliateController::class, 'getLinks']);
        Route::get('/payouts', [AffiliateController::class, 'getPayouts']);
        Route::post('/payout', [AffiliateController::class, 'requestPayout']);
    });

    Route::prefix('admin')->middleware('role:admin,super_admin')->group(function (): void {
        Route::get('/users', [AdminController::class, 'users']);
        Route::post('/users', [AdminController::class, 'storeUser']);
        Route::put('/users/{id}', [AdminController::class, 'updateUser']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        Route::post('/users/{id}/impersonate', [AdminController::class, 'impersonateUser']);
        Route::post('/users/{id}/unlock', [AdminController::class, 'unlockUser']);

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

        Route::get('/conversations/all', [ConversationController::class, 'adminIndex']);

        Route::get('/applications', [ApplicationController::class, 'index']);
        Route::post('/applications/{id}/approve', [ApplicationController::class, 'approve']);
        Route::post('/applications/{id}/reject', [ApplicationController::class, 'reject']);
        
        Route::get('/permissions', [AdminController::class, 'permissions']);
        Route::post('/permissions/sync', [AdminController::class, 'syncPermissions']);

        Route::get('/insights', [AdminController::class, 'insights']);

        Route::get('/packages', [AdminController::class, 'getPackages']);
        Route::post('/packages', [AdminController::class, 'createPackage']);
        Route::put('/packages/{id}', [AdminController::class, 'updatePackage']);
        Route::delete('/packages/{id}', [AdminController::class, 'deletePackage']);

        Route::get('/roles', [AdminController::class, 'getRoles']);
        Route::post('/roles', [AdminController::class, 'createRole']);
        Route::put('/roles/{id}', [AdminController::class, 'updateRole']);
        Route::delete('/roles/{id}', [AdminController::class, 'deleteRole']);

        Route::get('/affiliates', [AdminController::class, 'getAffiliates']);
        Route::get('/agents', [AdminController::class, 'getAgents']);
        Route::get('/payments', [AdminController::class, 'getPayments']);
        Route::get('/appointments', [AdminController::class, 'getAppointments']);
        Route::get('/matching', [AdminController::class, 'getMatchingRequests']);

        // Admin settings (accessible by both admin and super_admin)
        Route::get('/settings', [AdminController::class, 'getSettings']);
        Route::post('/settings', [AdminController::class, 'updateSettings']);

        // Super admin only routes
        Route::middleware('role:super_admin')->group(function (): void {
            Route::get('/theme-settings', [AdminController::class, 'themeSettings']);
            Route::post('/theme-settings', [AdminController::class, 'updateThemeSettings']);
            Route::get('/api-logs', [AdminController::class, 'apiLogs']);
            Route::get('/sms-logs', [AdminController::class, 'smsLogs']);
            Route::get('/comm-logs', [AdminController::class, 'commLogs']);
        });
    });

    // ─── Live Chat & RAG AI (admin only) ─────────────────────────────────
    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/chat/admin/sessions', [ChatController::class, 'adminSessions']);
        Route::get('/chat/admin/messages', [ChatController::class, 'adminMessages']);
        Route::post('/chat/admin/reply', [ChatController::class, 'adminReply']);

        // Admin chat panel
        Route::get('/admin/chat/sessions', [AdminChatController::class, 'sessions']);
        Route::get('/admin/chat/messages', [AdminChatController::class, 'messages']);
        Route::post('/admin/chat/reply', [AdminChatController::class, 'reply']);
        Route::get('/admin/chat/lhc-login', [AdminChatController::class, 'lhcLogin']);

        // RAG management
        Route::post('/rag/build', [RagController::class, 'buildIndex']);
        Route::get('/rag/status', [RagController::class, 'status']);
    });

});
