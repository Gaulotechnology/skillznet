<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TeamMemberController extends Controller
{
    /**
     * Public listing for /about page
     */
    public function index(): JsonResponse
    {
        $members = TeamMember::where('is_active', true)
            ->orderBy('order_index')
            ->orderBy('id')
            ->get();

        return response()->json([
            'team' => $members,
        ]);
    }

    /**
     * Admin listing
     */
    public function adminIndex(Request $request): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $members = TeamMember::orderBy('order_index')
            ->orderBy('id')
            ->get();

        return response()->json([
            'team' => $members,
        ]);
    }

    /**
     * Create a new team member
     */
    public function store(Request $request): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'name'         => ['required', 'string', 'max:255'],
            'role'         => ['required', 'string', 'max:255'],
            'bio'          => ['nullable', 'string', 'max:1000'],
            'photo_url'    => ['nullable', 'string', 'max:1000'],
            'order_index'  => ['nullable', 'integer'],
            'is_active'    => ['nullable', 'boolean'],
            'social_links' => ['nullable', 'array'],
        ]);

        $member = TeamMember::create([
            'name'         => $validated['name'],
            'role'         => $validated['role'],
            'bio'          => $validated['bio'] ?? '',
            'photo_url'    => $validated['photo_url'] ?? '/images/team/default.jpg',
            'order_index'  => $validated['order_index'] ?? (TeamMember::max('order_index') + 1),
            'is_active'    => $validated['is_active'] ?? true,
            'social_links' => $validated['social_links'] ?? null,
        ]);

        return response()->json([
            'message' => 'Team member added successfully.',
            'member'  => $member,
        ], 201);
    }

    /**
     * Update an existing team member
     */
    public function update(Request $request, int $id): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $member = TeamMember::findOrFail($id);

        $validated = $request->validate([
            'name'         => ['sometimes', 'required', 'string', 'max:255'],
            'role'         => ['sometimes', 'required', 'string', 'max:255'],
            'bio'          => ['nullable', 'string', 'max:1000'],
            'photo_url'    => ['nullable', 'string', 'max:1000'],
            'order_index'  => ['nullable', 'integer'],
            'is_active'    => ['nullable', 'boolean'],
            'social_links' => ['nullable', 'array'],
        ]);

        $member->update($validated);

        return response()->json([
            'message' => 'Team member updated successfully.',
            'member'  => $member,
        ]);
    }

    /**
     * Delete a team member
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $member = TeamMember::findOrFail($id);
        $member->delete();

        return response()->json([
            'message' => 'Team member removed successfully.',
        ]);
    }

    /**
     * Upload photo with strict dimension and aspect ratio enforcement
     */
    public function uploadPhoto(Request $request): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->validate([
            'photo' => [
                'required',
                'file',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120', // 5MB max
                'dimensions:min_width=250,min_height=250,ratio=1', // 1:1 square aspect ratio
            ],
        ], [
            'photo.dimensions' => 'The photo must be a square image (1:1 aspect ratio) and at least 250x250 pixels in resolution.',
            'photo.max'        => 'The photo file size must not exceed 5MB.',
            'photo.image'      => 'The uploaded file must be a valid image (JPG, PNG, or WebP).',
        ]);

        $file = $request->file('photo');
        $path = $file->store('team', 'public');
        $url = asset('storage/' . $path);

        return response()->json([
            'message'   => 'Photo uploaded successfully.',
            'photo_url' => $url,
        ]);
    }
}
