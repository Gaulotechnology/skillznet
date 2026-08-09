<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Provider;
use App\Models\ProviderReport;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Seeker;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function users(Request $request): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return response()->json([
            'users' => User::query()->latest()->get(), // Fetch all without pagination for simple dashboard table
        ]);
    }

    public function storeUser(Request $request): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,seeker,provider',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        if ($validated['role'] === 'provider') {
            Provider::create(['user_id' => $user->id, 'service_category' => 'General']);
        } elseif ($validated['role'] === 'seeker') {
            Seeker::create(['user_id' => $user->id]);
        }

        return response()->json(['message' => 'User created successfully', 'user' => $user]);
    }

    public function updateUser(Request $request, int $id): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'role' => 'sometimes|in:admin,seeker,provider',
            'is_active' => 'sometimes|boolean',
            'password' => 'nullable|string|min:8',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = \Illuminate\Support\Facades\Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user = User::findOrFail($id);
        $user->update($validated);

        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    public function deleteUser(Request $request, int $id): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $user = User::findOrFail($id);
        // Note: Due to foreign keys, cascade on delete should handle providers/seekers.
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function impersonateUser(Request $request, int $id): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Prevent impersonating another super_admin
        $target = User::findOrFail($id);
        if ($target->role === 'super_admin' && $request->user()->role !== 'super_admin') {
            return response()->json(['message' => 'Cannot impersonate a super admin'], 403);
        }

        // Create a new Sanctum token for the target user
        $token = $target->createToken('impersonation')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => ['name' => $target->name, 'role' => $target->role],
        ]);
    }

    public function verifyProvider(Request $request, int $id): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $provider = Provider::findOrFail($id);
        $provider->update(['identity_verified' => true]);
        return response()->json(['message' => 'Provider verified', 'provider' => $provider]);
    }

    public function suspendProvider(Request $request, int $id): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $provider = Provider::with('user')->findOrFail($id);
        $provider->user->update(['is_active' => false]);
        return response()->json(['message' => 'Provider suspended']);
    }

    public function subscriptions(Request $request): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return response()->json([
            'subscriptions' => Provider::query()->select([
                'id',
                'user_id',
                'subscription_tier',
                'subscription_expiry',
                'is_featured',
            ])->latest()->paginate(25),
        ]);
    }

    public function stats(Request $request): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return response()->json([
            'total_users' => User::count(),
            'total_providers' => Provider::count(),
            'total_seekers' => Seeker::count(),
            'total_revenue' => Payment::where('status', 'success')->sum('amount'),
            'payments_count' => Payment::where('status', 'success')->count(),
            'pending_reports' => ProviderReport::where('status', 'pending')->count(),
            'recent_users' => User::latest()->take(5)->get(),
        ]);
    }

    public function overrideSubscription(Request $request, int $id): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $validated = $request->validate([
            'tier' => ['required', 'in:free,premium_monthly,premium_quarterly'],
            'expiry_days' => ['nullable', 'integer', 'min:1', 'max:365'],
        ]);
        $provider = Provider::findOrFail($id);
        $provider->update([
            'subscription_tier' => $validated['tier'],
            'subscription_expiry' => $validated['tier'] === 'free'
                ? null
                : now()->addDays($validated['expiry_days'] ?? 30),
            'is_featured' => $validated['tier'] === 'premium_quarterly',
        ]);
        return response()->json(['message' => 'Subscription updated', 'provider' => $provider]);
    }

    public function categories(Request $request): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return response()->json([
            'categories' => \App\Models\ServiceCategory::latest()->get()
        ]);
    }

    public function storeCategory(Request $request): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:service_categories',
            'icon' => 'nullable|string',
            'description' => 'nullable|string',
        ]);
        $category = \App\Models\ServiceCategory::create($validated);
        return response()->json(['message' => 'Category created', 'category' => $category]);
    }

    public function updateCategory(Request $request, int $id): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $category = \App\Models\ServiceCategory::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:service_categories,slug,' . $id,
            'icon' => 'nullable|string',
            'description' => 'nullable|string',
        ]);
        $category->update($validated);
        return response()->json(['message' => 'Category updated', 'category' => $category]);
    }

    public function deleteCategory(Request $request, int $id): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $category = \App\Models\ServiceCategory::findOrFail($id);
        $category->delete();
        return response()->json(['message' => 'Category deleted']);
    }

    public function themeSettings(Request $request): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $settings = \App\Models\ThemeSetting::all()->pluck('value', 'key');
        return response()->json(['settings' => $settings]);
    }

    public function updateThemeSettings(Request $request): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*' => 'nullable|string',
        ]);
        
        foreach ($validated['settings'] as $key => $value) {
            \App\Models\ThemeSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }
        return response()->json(['message' => 'Theme settings updated successfully']);
    }

    public function getSettings(Request $request): JsonResponse
    {
        $sections = ['general', 'email', 'payment', 'security', 'affiliate', 'agent', 'social', 'subscriptions'];
        $all = [];
        foreach ($sections as $section) {
            $all[$section] = \App\Models\Setting::getSection($section);
        }
        return response()->json(['settings' => $all]);
    }

    public function updateSettings(Request $request): JsonResponse
    {
        $section = $request->input('section', 'general');
        $data = $request->except(['section']);

        foreach ($data as $key => $value) {
            \App\Models\Setting::set($key, is_array($value) ? json_encode($value) : (string) $value, $section);
        }

        return response()->json(['message' => 'Settings updated successfully.']);
    }

    // ─── Registration Form Builder ─────────────────────────────────────────────

    public function registrationFields(Request $request): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return response()->json([
            'fields' => \App\Models\RegistrationField::orderBy('sort_order')->get()
        ]);
    }

    public function storeRegistrationField(Request $request): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $validated = $request->validate([
            'label'       => 'required|string|max:255',
            'name'        => 'required|string|max:100|unique:registration_fields',
            'type'        => 'required|in:text,textarea,dropdown,number,file,checkbox',
            'options'     => 'nullable|array',
            'is_required' => 'boolean',
            'sort_order'  => 'integer',
            'placeholder' => 'nullable|string|max:255',
            'category_name' => 'nullable|string|max:255',
        ]);
        $field = \App\Models\RegistrationField::create($validated);
        return response()->json(['message' => 'Field created', 'field' => $field]);
    }

    public function updateRegistrationField(Request $request, int $id): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $field = \App\Models\RegistrationField::findOrFail($id);
        $validated = $request->validate([
            'label'       => 'sometimes|string|max:255',
            'type'        => 'sometimes|in:text,textarea,dropdown,number,file,checkbox',
            'options'     => 'nullable|array',
            'is_required' => 'boolean',
            'sort_order'  => 'integer',
            'placeholder' => 'nullable|string|max:255',
            'category_name' => 'nullable|string|max:255',
        ]);
        $field->update($validated);
        return response()->json(['message' => 'Field updated', 'field' => $field]);
    }

    public function deleteRegistrationField(Request $request, int $id): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        \App\Models\RegistrationField::findOrFail($id)->delete();
        return response()->json(['message' => 'Field deleted']);
    }

    // ─── Public endpoint (no auth) for fetching form fields ───────────────────

    public function publicRegistrationFields(Request $request): JsonResponse
    {
        $query = \App\Models\RegistrationField::orderBy('sort_order');
        if ($request->filled('category')) {
            $query->where(function($q) use ($request) {
                $q->where('category_name', $request->query('category'))
                  ->orWhereNull('category_name');
            });
        }
        
        return response()->json([
            'fields' => $query->get()
        ]);
    }

    // ─── API Logs ─────────────────────────────────────────────────────────────

    public function apiLogs(Request $request): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $query = \App\Models\ApiLog::latest('created_at');

        if ($request->filled('status')) {
            $query->where('status_code', $request->query('status'));
        }
        if ($request->filled('method')) {
            $query->where('method', strtoupper($request->query('method')));
        }
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->query('user_id'));
        }
        if ($request->filled('error')) {
            $query->where('status_code', '>=', 400);
        }

        $logs = $query->limit(200)->get();
        return response()->json(['logs' => $logs]);
    }

    public function smsLogs(Request $request): JsonResponse
    {
        $query = \App\Models\SmsLog::with('user')->latest('sent_at');

        if ($request->filled('type')) {
            $query->where('type', $request->query('type'));
        }
        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        $logs = $query->limit(200)->get();

        $stats = [
            'total' => \App\Models\SmsLog::count(),
            'delivered' => \App\Models\SmsLog::where('status', 'delivered')->count(),
            'failed' => \App\Models\SmsLog::where('status', 'failed')->count(),
            'monthly_cost' => \App\Models\SmsLog::whereMonth('sent_at', now()->month)->sum('cost'),
        ];

        return response()->json(['logs' => $logs, 'stats' => $stats]);
    }

    public function commLogs(Request $request): JsonResponse
    {
        $query = \App\Models\CommLog::with(['fromUser', 'toUser'])->latest('sent_at');

        if ($request->filled('channel')) {
            $query->where('channel', $request->query('channel'));
        }
        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        $logs = $query->limit(200)->get();

        $stats = [
            'total' => \App\Models\CommLog::count(),
            'today' => \App\Models\CommLog::whereDate('sent_at', today())->count(),
            'unread' => \App\Models\CommLog::where('status', 'unread')->count(),
        ];

        return response()->json(['logs' => $logs, 'stats' => $stats]);
    }

    // ─── Roles & Permissions ──────────────────────────────────────────────────

    public function permissions(Request $request): JsonResponse
    {
        $permissions = DB::table('permissions')->get();
        
        $rolePermissions = DB::table('role_permissions')->get()->groupBy('role')->map(function ($items) {
            return $items->pluck('permission_id');
        });

        return response()->json([
            'permissions' => $permissions,
            'role_permissions' => $rolePermissions,
        ]);
    }

    public function syncPermissions(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'role' => 'required|string',
            'permissions' => 'present|array',
            'permissions.*' => 'integer|exists:permissions,id',
        ]);

        $role = $validated['role'];
        $permissionIds = $validated['permissions'];

        DB::transaction(function () use ($role, $permissionIds) {
            DB::table('role_permissions')->where('role', $role)->delete();
            
            $insertData = collect($permissionIds)->map(function ($id) use ($role) {
                return [
                    'role' => $role,
                    'permission_id' => $id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            })->toArray();
            
            if (!empty($insertData)) {
                DB::table('role_permissions')->insert($insertData);
            }
        });

        return response()->json(['message' => 'Permissions synchronized successfully']);
    }

    // ─── PIN Policy: Unlock account ───────────────────────────────────────────

    public function unlockUser(Request $request, int $id): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $user = User::findOrFail($id);
        $user->update([
            'failed_pin_attempts' => 0,
            'locked_until'        => null,
        ]);

        return response()->json(['message' => 'Account unlocked successfully', 'user' => $user]);
    }
}

