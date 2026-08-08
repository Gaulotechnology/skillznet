<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OtpVerification;
use App\Models\Provider;
use App\Models\Seeker;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function registerProvider(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone_number' => ['required', 'string', 'max:20', 'unique:users,phone_number'],
            'identity_number' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'service_category' => ['required', 'string', 'max:100'],
            'service_radius' => ['required', 'integer', 'min:1', 'max:200'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'description' => ['nullable', 'string'],
            'dynamic_data' => ['nullable', 'array'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => sprintf('provider-%s@skillzlink.local', Str::uuid()),
            'phone_number' => $validated['phone_number'],
            'password' => Hash::make(Str::random(24)),
            'role' => 'provider',
            'is_active' => true,
        ]);

        $provider = Provider::create([
            'user_id' => $user->id,
            'identity_number' => encrypt($validated['identity_number']),
            'address' => $validated['address'],
            'service_category' => $validated['service_category'],
            'service_radius' => $validated['service_radius'],
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
            'description' => $validated['description'] ?? null,
            'dynamic_data' => $validated['dynamic_data'] ?? null,
        ]);

        return response()->json([
            'message' => 'Provider registered successfully',
            'user_id' => $user->id,
            'provider_id' => $provider->id,
        ], 201);
    }

    public function registerSeeker(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone_number' => ['required', 'string', 'max:20', 'unique:users,phone_number'],
            'default_latitude' => ['nullable', 'numeric'],
            'default_longitude' => ['nullable', 'numeric'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => sprintf('seeker-%s@skillzlink.local', Str::uuid()),
            'phone_number' => $validated['phone_number'],
            'password' => Hash::make(Str::random(24)),
            'role' => 'seeker',
            'is_active' => true,
        ]);

        $seeker = Seeker::create([
            'user_id' => $user->id,
            'default_latitude' => $validated['default_latitude'] ?? null,
            'default_longitude' => $validated['default_longitude'] ?? null,
        ]);

        return response()->json([
            'message' => 'Seeker registered successfully',
            'user_id' => $user->id,
            'seeker_id' => $seeker->id,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'phone_number' => ['required', 'string', 'max:20'],
        ]);

        $user = User::where('phone_number', $validated['phone_number'])->first();
        if (!$user || !$user->is_active) {
            return response()->json(['message' => 'User not found or inactive'], 404);
        }

        $otp = (string) random_int(100000, 999999);
        OtpVerification::create([
            'phone_number' => $validated['phone_number'],
            'code' => $otp,
            'expires_at' => now()->addMinutes(10),
            'verified' => false,
        ]);

        // Log SMS
        \App\Models\SmsLog::create([
            'recipient' => $validated['phone_number'],
            'type' => 'otp',
            'message' => "Your SkillzLink verification code is: {$otp}. Valid for 10 minutes.",
            'provider' => 'fake',
            'status' => 'delivered',
            'cost' => 0.0350,
            'user_id' => $user->id,
            'sent_at' => now(),
        ]);

        return response()->json([
            'message' => 'OTP generated',
            'otp' => $otp,
            'expires_in_seconds' => 600,
        ]);
    }

    public function verifyOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'phone_number' => ['required', 'string', 'max:20'],
            'otp' => ['required', 'string', 'size:6'],
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
        $user = User::where('phone_number', $validated['phone_number'])->firstOrFail();
        $token = $user->createToken('api-token')->plainTextToken;

        $user->append('permissions');

        return response()->json([
            'message' => 'Authenticated',
            'token' => $token,
            'user' => $user,
        ]);
    }
}
