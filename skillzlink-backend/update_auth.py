import re

with open("app/Http/Controllers/Api/AuthController.php", "r") as f:
    content = f.read()

# Add requestOtp method
request_otp_method = """
    public function requestOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'phone_number' => ['required', 'string', 'max:20'],
        ]);

        $otp = (string) random_int(100000, 999999);
        OtpVerification::create([
            'phone_number' => $validated['phone_number'],
            'code' => $otp,
            'expires_at' => now()->addMinutes(10),
            'verified' => false,
        ]);

        return response()->json([
            'message' => 'OTP generated',
            'otp' => $otp,
        ]);
    }
"""

content = content.replace("class AuthController extends Controller\n{", "class AuthController extends Controller\n{" + request_otp_method)

# Modify registerProvider to accept pin
content = re.sub(
    r"'password' => Hash::make\(Str::random\(24\)\),",
    r"'password' => Hash::make($request->input('pin', Str::random(24))),",
    content
)

# Modify registerSeeker to accept pin
content = re.sub(
    r"'password' => Hash::make\(Str::random\(24\)\),",
    r"'password' => Hash::make($request->input('pin', Str::random(24))),",
    content
)

# Add loginWithPin, requestPinReset, resetPin
new_methods = """
    public function loginWithPin(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'phone_number' => ['required', 'string'],
            'pin' => ['required', 'string'],
        ]);

        $user = User::where('phone_number', $validated['phone_number'])->first();
        if (!$user || !$user->is_active || !Hash::check($validated['pin'], $user->password)) {
            return response()->json(['message' => 'Invalid phone number or PIN'], 401);
        }

        $token = $user->createToken('api-token')->plainTextToken;
        $user->append('permissions');

        return response()->json([
            'message' => 'Authenticated',
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function requestPinReset(Request $request): JsonResponse
    {
        // Same as requestOtp
        return $this->requestOtp($request);
    }

    public function resetPin(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'phone_number' => ['required', 'string'],
            'otp' => ['required', 'string'],
            'pin' => ['required', 'string', 'size:4'],
        ]);

        $otpRecord = OtpVerification::where('phone_number', $validated['phone_number'])
            ->where('code', $validated['otp'])
            ->where('verified', true) // It should be verified before reset, or we verify it here
            ->latest()
            ->first();

        // Actually, let's verify it here if not verified
        if (!$otpRecord) {
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
        $user->save();
        $otpRecord->update(['verified' => true]);

        return response()->json(['message' => 'PIN reset successfully']);
    }
}
"""

content = content.replace("}\n", new_methods)

with open("app/Http/Controllers/Api/AuthController.php", "w") as f:
    f.write(content)

