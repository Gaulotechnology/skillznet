<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use App\Services\LhcService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminChatController extends Controller
{
    /**
     * Get all chat sessions with unread counts.
     */
    public function sessions(): JsonResponse
    {
        $sessions = ChatMessage::select('session_id')
            ->selectRaw('MAX(created_at) as last_message')
            ->selectRaw('MAX(sender_name) as visitor_name')
            ->selectRaw('COUNT(*) as total')
            ->selectRaw("SUM(CASE WHEN sender_role = 'visitor' AND is_read = 0 THEN 1 ELSE 0 END) as unread")
            ->groupBy('session_id')
            ->orderByDesc('last_message')
            ->limit(100)
            ->get()
            ->map(fn($s) => [
                'session_id' => $s->session_id,
                'visitor_name' => $s->visitor_name ?? 'Visitor',
                'last_message' => $s->last_message,
                'total' => (int) $s->total,
                'unread' => (int) $s->unread,
            ]);

        return response()->json(['sessions' => $sessions]);
    }

    /**
     * Get messages for a specific session and mark as read.
     */
    public function messages(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_id' => ['required', 'string'],
        ]);

        // Mark visitor messages as read
        ChatMessage::where('session_id', $validated['session_id'])
            ->where('sender_role', 'visitor')
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $messages = ChatMessage::where('session_id', $validated['session_id'])
            ->orderBy('id')
            ->limit(500)
            ->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'message' => $m->message,
                'sender_name' => $m->sender_name,
                'sender_role' => $m->sender_role,
                'created_at' => $m->created_at->toISOString(),
            ]);

        return response()->json(['messages' => $messages]);
    }

    /**
     * Admin sends a reply to a chat session.
     */
    public function reply(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_id' => ['required', 'string'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $user = $request->user();
        $msg = ChatMessage::create([
            'session_id' => $validated['session_id'],
            'message' => $validated['message'],
            'sender_name' => $user->name ?? 'Admin',
            'sender_role' => 'admin',
            'user_id' => $user->id,
            'is_read' => true,
        ]);

        return response()->json([
            'message' => [
                'id' => $msg->id,
                'message' => $msg->message,
                'sender_name' => $msg->sender_name,
                'sender_role' => $msg->sender_role,
                'created_at' => $msg->created_at->toISOString(),
            ],
        ], 201);
    }

    /**
     * Get LHC auto-login URL for the authenticated admin.
     */
    public function lhcLogin(Request $request, LhcService $lhc): JsonResponse
    {
        $user = $request->user();

        $url = $lhc->generateAutoLoginUrl($user->id, $user->name, $user->email ?? '');

        if ($url) {
            return response()->json(['url' => $url, 'available' => true]);
        }

        // Fallback to direct LHC admin URL
        $lhcUrl = rtrim(config('app.url'), '/') . '/lhc/site_admin/';
        return response()->json(['url' => $lhcUrl, 'available' => false, 'note' => 'LHC not fully configured. Opening admin panel.']);
    }
}
