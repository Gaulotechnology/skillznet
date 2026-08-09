<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OtpVerification;
use App\Models\Provider;
use App\Models\Seeker;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    // ─── Helper: load PIN policy from settings ────────────────────────────────

    private function pinPolicy(): array
    {
        return [
            'min_length'    => (int) Setting::get('pin_min_length', 4),
            'max_attempts'  => (int) Setting::get('pin_max_attempts', 5),
            'lockout_mins'  => (int) Setting::get('pin_lockout_minutes', 30),
            'expiry_days'   => (int) Setting::get('pin_expiry_days', 0), // 0 = never
        ];
    }

    // ─── OTP helpers ─────────────────────────────────────────────────────────

    public function requestOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'phone_number' => ['required', 'string', 'max:20'],
        ]);

        $otp = (string) random_int(100000, 999999);
        OtpVerification::create([
            'phone_number' => $validated['phone_number'],
            'code'         => $otp,
            'expires_at'   => now()->addMinutes(10),
            'verified'     => false,
        ]);

        // Log SMS
        \App\Models\SmsLog::create([
            'recipient' => $validated['phone_number'],
            'type'      => 'otp',
            'message'   => "Your SkillzLink verification code is: {$otp}. Valid for 10 minutes.",
            'provider'  => 'fake',
            'status'    => 'delivered',
            'cost'      => 0.0350,
            'user_id'   => null,
            'sent_at'   => now(),
        ]);

        return response()->json([
            'message' => 'OTP generated',
            'otp'     => $otp,
        ]);
    }

    // ─── Registration ─────────────────────────────────────────────────────────

    public function registerProvider(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'             => ['required', 'string', 'max:255'],
            'phone_number'     => ['required', 'string', 'max:20', 'unique:users,phone_number'],
            'pin'              => ['required', 'string', 'size:4'],
            'otp'              => ['required', 'string', 'size:6'],
            'identity_number'  => ['required', 'string', 'max:255'],
            'address'          => ['required', 'string'],
            'service_category' => ['required', 'string', 'max:100'],
            'service_radius'   => ['required', 'integer', 'min:1', 'max:200'],
            'latitude'         => ['nullable', 'numeric'],
            'longitude'        => ['nullable', 'numeric'],
            'description'      => ['nullable', 'string'],
            'dynamic_data'     => ['nullable', 'array'],
        ]);

        $this->verifyRegistrationOtp($validated['phone_number'], $validated['otp']);

        $user = User::create([
            'name'           => $validated['name'],
            'email'          => sprintf('provider-%s@skillzlink.local', Str::uuid()),
            'phone_number'   => $validated['phone_number'],
            'password'       => Hash::make($validated['pin']),
            'role'           => 'provider',
            'is_active'      => true,
            'pin_changed_at' => now(),
            'referred_by'    => $this->resolveReferrer($request),
        ]);

        $provider = Provider::create([
            'user_id'          => $user->id,
            'identity_number'  => encrypt($validated['identity_number']),
            'address'          => $validated['address'],
            'service_category' => $validated['service_category'],
            'service_radius'   => $validated['service_radius'],
            'latitude'         => $validated['latitude'] ?? null,
            'longitude'        => $validated['longitude'] ?? null,
            'description'      => $validated['description'] ?? null,
            'dynamic_data'     => $validated['dynamic_data'] ?? null,
        ]);

        return response()->json([
            'message'     => 'Provider registered successfully',
            'user_id'     => $user->id,
            'provider_id' => $provider->id,
        ], 201);
    }

    public function registerSeeker(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'              => ['required', 'string', 'max:255'],
            'phone_number'      => ['required', 'string', 'max:20', 'unique:users,phone_number'],
            'pin'               => ['required', 'string', 'size:4'],
            'otp'               => ['required', 'string', 'size:6'],
            'default_latitude'  => ['nullable', 'numeric'],
            'default_longitude' => ['nullable', 'numeric'],
        ]);

        $this->verifyRegistrationOtp($validated['phone_number'], $validated['otp']);

        $user = User::create([
            'name'           => $validated['name'],
            'email'          => sprintf('seeker-%s@skillzlink.local', Str::uuid()),
            'phone_number'   => $validated['phone_number'],
            'password'       => Hash::make($validated['pin']),
            'role'           => 'seeker',
            'is_active'      => true,
            'pin_changed_at' => now(),
            'referred_by'    => $this->resolveReferrer($request),
        ]);

        $seeker = Seeker::create([
            'user_id'           => $user->id,
            'default_latitude'  => $validated['default_latitude'] ?? null,
            'default_longitude' => $validated['default_longitude'] ?? null,
        ]);

        return response()->json([
            'message'   => 'Seeker registered successfully',
            'user_id'   => $user->id,
            'seeker_id' => $seeker->id,
        ], 201);
    }

    // ─── PIN Login with lockout & expiry enforcement ──────────────────────────

    public function loginWithPin(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'phone_number' => ['required', 'string'],
            'pin'          => ['required', 'string'],
        ]);

        $user = User::where('phone_number', $validated['phone_number'])->first();

        if (!$user || !$user->is_active) {
            return response()->json(['message' => 'Invalid phone number or PIN'], 401);
        }

        $policy = $this->pinPolicy();

        // ── Check if account is currently locked ─────────────────────────────
        if ($user->locked_until && $user->locked_until->isFuture()) {
            $remaining = now()->diffInMinutes($user->locked_until, true);
            return response()->json([
                'message' => "Account locked. Try again in {$remaining} minute(s) or contact an admin.",
                'code'    => 'account_locked',
                'locked_until' => $user->locked_until->toIso8601String(),
            ], 423);
        }

        // ── Verify the PIN ────────────────────────────────────────────────────
        if (!Hash::check($validated['pin'], $user->password)) {
            $attempts = $user->failed_pin_attempts + 1;

            if ($attempts >= $policy['max_attempts']) {
                // Lock the account
                $user->update([
                    'failed_pin_attempts' => $attempts,
                    'locked_until'        => now()->addMinutes($policy['lockout_mins']),
                ]);
                return response()->json([
                    'message' => "Too many failed attempts. Account locked for {$policy['lockout_mins']} minute(s).",
                    'code'    => 'account_locked',
                ], 423);
            }

            $user->update(['failed_pin_attempts' => $attempts]);
            $left = $policy['max_attempts'] - $attempts;
            return response()->json([
                'message' => "Invalid phone number or PIN. {$left} attempt(s) remaining.",
                'code'    => 'invalid_credentials',
            ], 401);
        }

        // ── PIN is correct — check expiry ─────────────────────────────────────
        if ($policy['expiry_days'] > 0 && $user->pin_changed_at) {
            $expiredAt = $user->pin_changed_at->addDays($policy['expiry_days']);
            if (now()->isAfter($expiredAt)) {
                return response()->json([
                    'message'      => 'Your PIN has expired. Please reset it.',
                    'code'         => 'pin_expired',
                    'phone_number' => $user->phone_number,
                ], 403);
            }
        }

        // ── Success — reset failed attempts ───────────────────────────────────
        $user->update([
            'failed_pin_attempts' => 0,
            'locked_until'        => null,
        ]);

        $token = $user->createToken('api-token')->plainTextToken;
        $user->append('permissions');

        return response()->json([
            'message' => 'Authenticated',
            'token'   => $token,
            'user'    => $user,
        ]);
    }

    // ─── Forgot PIN flow ──────────────────────────────────────────────────────

    public function requestPinReset(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'phone_number' => ['required', 'string', 'max:20'],
        ]);

        $user = User::where('phone_number', $validated['phone_number'])->first();
        if (!$user || !$user->is_active) {
            return response()->json(['message' => 'User not found or inactive'], 404);
        }

        return $this->requestOtp($request);
    }

    public function resetPin(Request $request): JsonResponse
    {
        $policy = $this->pinPolicy();

        $validated = $request->validate([
            'phone_number' => ['required', 'string'],
            'otp'          => ['required', 'string'],
            'pin'          => ['required', 'string', "min:{$policy['min_length']}", 'max:8'],
        ]);

        $otpRecord = OtpVerification::where('phone_number', $validated['phone_number'])
            ->where('code', $validated['otp'])
            ->where('verified', true)
            ->latest()
            ->first();

        if (!$otpRecord) {
            // Also accept if they haven't called verify-otp but the OTP is valid
            $otpRecord = OtpVerification::where('phone_number', $validated['phone_number'])
                ->where('code', $validated['otp'])
                ->where('verified', false)
                ->where('expires_at', '>', now())
                ->latest()
                ->first();
        }

        if (!$otpRecord) {
            return response()->json(['message' => 'Invalid or expired OTP'], 422);
        }

        $user = User::where('phone_number', $validated['phone_number'])->firstOrFail();
        $user->password = Hash::make($validated['pin']);
        $user->pin_changed_at = now();
        $user->failed_pin_attempts = 0;
        $user->locked_until = null;
        $user->save();

        $otpRecord->update(['verified' => true]);

        $token = $user->createToken('api-token')->plainTextToken;
        $user->append('permissions');

        return response()->json([
            'message' => 'PIN reset successfully',
            'token'   => $token,
            'user'    => $user,
        ]);
    }

    // ─── OTP verification ─────────────────────────────────────────────────────

    public function verifyOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'phone_number' => ['required', 'string', 'max:20'],
            'otp'          => ['required', 'string', 'size:6'],
        ]);

        $otpRecord = OtpVerification::where('phone_number', $validated['phone_number'])
            ->where('code', $validated['otp'])
            ->where('verified', false)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if (!$otpRecord) {
            return response()->json(['message' => 'Invalid or expired OTP'], 422);
        }

        $otpRecord->update(['verified' => true]);

        // Return token only if user exists (i.e. login flow). Otherwise, just verify OTP.
        $user = User::where('phone_number', $validated['phone_number'])->first();
        if ($user) {
            $token = $user->createToken('api-token')->plainTextToken;
            $user->append('permissions');
            return response()->json([
                'message' => 'Authenticated',
                'token'   => $token,
                'user'    => $user,
            ]);
        }

        return response()->json(['message' => 'OTP verified']);
    }

    // ─── Agent registration ────────────────────────────────────────────────────

    public function registerAgent(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'         => ['required', 'string', 'max:255'],
            'phone_number' => ['required', 'string', 'max:20', 'unique:users,phone_number'],
            'pin'          => ['required', 'string', 'size:4'],
            'otp'          => ['required', 'string', 'size:6'],
        ]);

        $this->verifyRegistrationOtp($validated['phone_number'], $validated['otp']);

        $user = User::create([
            'name'           => $validated['name'],
            'email'          => sprintf('agent-%s@skillzlink.local', Str::uuid()),
            'phone_number'   => $validated['phone_number'],
            'password'       => Hash::make($validated['pin']),
            'role'           => 'agent',
            'is_active'      => true,
            'pin_changed_at' => now(),
            'referred_by'    => $this->resolveReferrer($request),
        ]);

        return response()->json([
            'message' => 'Agent registered successfully',
            'user_id' => $user->id,
        ], 201);
    }

    // ─── Affiliate registration ────────────────────────────────────────────────

    public function registerAffiliate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'         => ['required', 'string', 'max:255'],
            'phone_number' => ['required', 'string', 'max:20', 'unique:users,phone_number'],
            'pin'          => ['required', 'string', 'size:4'],
            'otp'          => ['required', 'string', 'size:6'],
        ]);

        $this->verifyRegistrationOtp($validated['phone_number'], $validated['otp']);

        $user = User::create([
            'name'           => $validated['name'],
            'email'          => sprintf('affiliate-%s@skillzlink.local', Str::uuid()),
            'phone_number'   => $validated['phone_number'],
            'password'       => Hash::make($validated['pin']),
            'role'           => 'affiliate',
            'is_active'      => true,
            'pin_changed_at' => now(),
            'referred_by'    => $this->resolveReferrer($request),
        ]);

        return response()->json([
            'message' => 'Affiliate registered successfully',
            'user_id' => $user->id,
        ], 201);
    }

    // ─── Password reset (placeholder) ──────────────────────────────────────────

    public function requestPasswordReset(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'If an account with that email exists, a password reset link has been sent.',
        ]);
    }

    // ─── Helpers ───────────────────────────────────────────────────────────────

    private function verifyRegistrationOtp(string $phoneNumber, string $otp): void
    {
        $otpRecord = OtpVerification::where('phone_number', $phoneNumber)
            ->where('code', $otp)
            ->where('verified', false)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        abort_unless($otpRecord, 422, 'Invalid or expired OTP');
        $otpRecord->update(['verified' => true]);
    }

    private function resolveReferrer(Request $request): ?int
    {
        $referralCode = $request->input('referral_code')
            ?? $request->header('X-Referral-Code');

        if ($referralCode) {
            $referrer = User::where('referral_code', $referralCode)->first();
            return $referrer?->id;
        }

        return null;
    }
}
