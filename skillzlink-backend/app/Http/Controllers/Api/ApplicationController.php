<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ApplicationController extends Controller
{
    // Public: submit application (no auth required)
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:applications,email',
            'phone' => 'nullable|string|max:20',
            'type' => 'required|in:affiliate,agent,provider',
            'message' => 'nullable|string|max:2000',
            'company' => 'nullable|string|max:255',
            'experience' => 'nullable|string|max:255',
        ]);

        $application = Application::create($validated);

        return response()->json([
            'message' => 'Application submitted successfully. We will review it shortly.',
            'application' => $application,
        ], 201);
    }

    // Admin: list all applications
    public function index(Request $request): JsonResponse
    {
        $query = Application::latest();

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }
        if ($request->filled('type')) {
            $query->where('type', $request->query('type'));
        }

        $applications = $query->get();

        $stats = [
            'total' => Application::count(),
            'pending' => Application::where('status', 'pending')->count(),
            'approved' => Application::where('status', 'approved')->count(),
            'rejected' => Application::where('status', 'rejected')->count(),
        ];

        return response()->json(['applications' => $applications, 'stats' => $stats]);
    }

    // Admin: approve application (creates user account)
    public function approve(Request $request, int $id): JsonResponse
    {
        $application = Application::findOrFail($id);

        if ($application->status !== 'pending') {
            return response()->json(['message' => 'Application already processed.'], 422);
        }

        // Create user account
        $password = Str::random(10);
        $user = User::create([
            'name' => $application->name,
            'email' => $application->email,
            'phone_number' => $application->phone,
            'password' => Hash::make($password),
            'role' => $application->type,
            'is_active' => true,
        ]);

        $application->update([
            'status' => 'approved',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'admin_notes' => $request->input('notes', 'Approved'),
        ]);

        // Log SMS notification
        \App\Models\SmsLog::create([
            'recipient' => $application->phone ?? 'N/A',
            'type' => 'notification',
            'message' => "Congratulations {$application->name}! Your SkillzLink {$application->type} application has been approved. Your temp password: {$password}",
            'provider' => 'fake',
            'status' => 'delivered',
            'cost' => 0.0350,
            'user_id' => $user->id,
            'sent_at' => now(),
        ]);

        return response()->json([
            'message' => "Application approved. Account created for {$application->name}.",
            'user' => $user,
            'temp_password' => $password,
        ]);
    }

    // Admin: reject application
    public function reject(Request $request, int $id): JsonResponse
    {
        $application = Application::findOrFail($id);

        if ($application->status !== 'pending') {
            return response()->json(['message' => 'Application already processed.'], 422);
        }

        $application->update([
            'status' => 'rejected',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'admin_notes' => $request->input('notes', 'Rejected'),
        ]);

        return response()->json(['message' => 'Application rejected.']);
    }
}
