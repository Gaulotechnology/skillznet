<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Provider;
use App\Models\ProviderReport;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

use App\Models\Seeker;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function users(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return response()->json([
            'users' => User::query()->latest()->get(), // Fetch all without pagination for simple dashboard table
        ]);
    }

    public function storeUser(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
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
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'role' => 'sometimes|in:admin,seeker,provider',
            'is_active' => 'sometimes|boolean',
        ]);

        $user = User::findOrFail($id);
        $user->update($validated);

        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    public function deleteUser(Request $request, int $id): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $user = User::findOrFail($id);
        // Note: Due to foreign keys, cascade on delete should handle providers/seekers.
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function verifyProvider(Request $request, int $id): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $provider = Provider::findOrFail($id);
        $provider->update(['identity_verified' => true]);
        return response()->json(['message' => 'Provider verified', 'provider' => $provider]);
    }

    public function suspendProvider(Request $request, int $id): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $provider = Provider::with('user')->findOrFail($id);
        $provider->user->update(['is_active' => false]);
        return response()->json(['message' => 'Provider suspended']);
    }

    public function subscriptions(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
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
        if ($request->user()->role !== 'admin') {
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
        if ($request->user()->role !== 'admin') {
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
    public function categories(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return response()->json([
            'categories' => \App\Models\ServiceCategory::latest()->get()
        ]);
    }

    public function storeCategory(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
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
        if ($request->user()->role !== 'admin') {
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
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $category = \App\Models\ServiceCategory::findOrFail($id);
        $category->delete();
        return response()->json(['message' => 'Category deleted']);
    public function themeSettings(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $settings = \App\Models\ThemeSetting::all()->pluck('value', 'key');
        return response()->json(['settings' => $settings]);
    }

    public function updateThemeSettings(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
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

    // ─── Registration Form Builder ─────────────────────────────────────────────

    public function registrationFields(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return response()->json([
            'fields' => \App\Models\RegistrationField::orderBy('sort_order')->get()
        ]);
    }

    public function storeRegistrationField(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
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
        ]);
        $field = \App\Models\RegistrationField::create($validated);
        return response()->json(['message' => 'Field created', 'field' => $field]);
    }

    public function updateRegistrationField(Request $request, int $id): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
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
        ]);
        $field->update($validated);
        return response()->json(['message' => 'Field updated', 'field' => $field]);
    }

    public function deleteRegistrationField(Request $request, int $id): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        \App\Models\RegistrationField::findOrFail($id)->delete();
        return response()->json(['message' => 'Field deleted']);
    }

    // ─── Public endpoint (no auth) for fetching form fields ───────────────────

    public function publicRegistrationFields(): JsonResponse
    {
        return response()->json([
            'fields' => \App\Models\RegistrationField::orderBy('sort_order')->get()
        ]);
    }

    // ─── API Logs ─────────────────────────────────────────────────────────────

    public function apiLogs(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
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
}
