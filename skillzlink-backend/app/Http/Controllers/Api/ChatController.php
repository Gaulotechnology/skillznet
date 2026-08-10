<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function send(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_id' => ['required', 'string', 'max:64'],
            'message' => ['required', 'string', 'max:2000'],
            'sender_name' => ['nullable', 'string', 'max:255'],
        ]);

        $msg = ChatMessage::create([
            'session_id' => $validated['session_id'],
            'message' => $validated['message'],
            'sender_name' => $validated['sender_name'] ?? 'Visitor',
            'sender_role' => 'visitor',
            'user_id' => $request->user()?->id,
        ]);

        return response()->json([
            'message' => [
                'id' => $msg->id,
                'session_id' => $msg->session_id,
                'message' => $msg->message,
                'sender_name' => $msg->sender_name,
                'sender_role' => $msg->sender_role,
                'created_at' => $msg->created_at->toISOString(),
            ],
        ], 201);
    }

    public function poll(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_id' => ['required', 'string', 'max:64'],
            'after_id' => ['nullable', 'integer'],
        ]);

        $query = ChatMessage::where('session_id', $validated['session_id']);

        if (!empty($validated['after_id'])) {
            $query->where('id', '>', $validated['after_id']);
        }

        $messages = $query->orderBy('id')->limit(100)->get()->map(fn($m) => [
            'id' => $m->id,
            'session_id' => $m->session_id,
            'message' => $m->message,
            'sender_name' => $m->sender_name,
            'sender_role' => $m->sender_role,
            'created_at' => $m->created_at->toISOString(),
        ]);

        return response()->json(['messages' => $messages]);
    }

    public function adminReply(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_id' => ['required', 'string', 'max:64'],
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $user = $request->user();
        $msg = ChatMessage::create([
            'session_id' => $validated['session_id'],
            'message' => $validated['message'],
            'sender_name' => $user->name ?? 'Admin',
            'sender_role' => 'admin',
            'user_id' => $user->id,
        ]);

        return response()->json([
            'message' => [
                'id' => $msg->id,
                'session_id' => $msg->session_id,
                'message' => $msg->message,
                'sender_name' => $msg->sender_name,
                'sender_role' => $msg->sender_role,
                'created_at' => $msg->created_at->toISOString(),
            ],
        ], 201);
    }

    public function adminSessions(Request $request): JsonResponse
    {
        $sessions = ChatMessage::select('session_id')
            ->selectRaw('MAX(created_at) as last_message, MAX(sender_name) as visitor_name, COUNT(*) as message_count')
            ->groupBy('session_id')
            ->orderByDesc('last_message')
            ->limit(50)
            ->get()
            ->map(function ($s) {
                $unread = ChatMessage::where('session_id', $s->session_id)
                    ->where('sender_role', 'visitor')
                    ->where('is_read', false)
                    ->count();
                return [
                    'session_id' => $s->session_id,
                    'visitor_name' => $s->visitor_name ?? 'Visitor',
                    'last_message' => $s->last_message,
                    'message_count' => $s->message_count,
                    'unread' => $unread,
                ];
            });

        return response()->json(['sessions' => $sessions]);
    }

    public function adminMessages(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_id' => ['required', 'string', 'max:64'],
        ]);

        ChatMessage::where('session_id', $validated['session_id'])
            ->where('sender_role', 'visitor')
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $messages = ChatMessage::where('session_id', $validated['session_id'])
            ->orderBy('id')
            ->limit(200)
            ->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'session_id' => $m->session_id,
                'message' => $m->message,
                'sender_name' => $m->sender_name,
                'sender_role' => $m->sender_role,
                'created_at' => $m->created_at->toISOString(),
            ]);

        return response()->json(['messages' => $messages]);
    }
}
