<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $conversations = Conversation::where('user_one_id', $userId)
            ->orWhere('user_two_id', $userId)
            ->with(['userOne:id,name,role', 'userTwo:id,name,role'])
            ->orderByDesc('last_message_at')
            ->get()
            ->map(function ($conv) use ($userId) {
                $participant = $conv->user_one_id === $userId ? $conv->userTwo : $conv->userOne;
                $unreadCount = $conv->messages()
                    ->where('sender_id', '!=', $userId)
                    ->whereNull('read_at')
                    ->count();

                return [
                    'id' => $conv->id,
                    'participant' => $participant ? [
                        'id' => $participant->id,
                        'name' => $participant->name,
                        'role' => $participant->role,
                    ] : null,
                    'last_message' => $conv->last_message,
                    'last_message_at' => $conv->last_message_at,
                    'unread_count' => $unreadCount,
                ];
            });

        return response()->json(['conversations' => $conversations]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $userId = $request->user()->id;

        $conversation = Conversation::where(function ($q) use ($userId) {
            $q->where('user_one_id', $userId)->orWhere('user_two_id', $userId);
        })->findOrFail($id);

        // Mark messages as read
        Message::where('conversation_id', $id)
            ->where('sender_id', '!=', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $messages = $conversation->messages()->with('sender:id,name,role')->get()->map(function ($msg) use ($userId) {
            return [
                'id' => $msg->id,
                'sender_id' => $msg->sender_id,
                'sender_name' => $msg->sender->name ?? 'Unknown',
                'sender_role' => $msg->sender->role ?? 'user',
                'content' => $msg->content,
                'created_at' => $msg->created_at,
                'is_admin' => $msg->sender_id === $userId,
            ];
        });

        $participant = $conversation->user_one_id === $userId
            ? User::select('id', 'name', 'role')->find($conversation->user_two_id)
            : User::select('id', 'name', 'role')->find($conversation->user_one_id);

        return response()->json([
            'conversation' => [
                'id' => $conversation->id,
                'participant' => $participant,
            ],
            'messages' => $messages,
        ]);
    }

    public function sendMessage(Request $request, int $id): JsonResponse
    {
        $request->validate(['content' => 'required|string|max:5000']);

        $userId = $request->user()->id;

        $conversation = Conversation::where(function ($q) use ($userId) {
            $q->where('user_one_id', $userId)->orWhere('user_two_id', $userId);
        })->findOrFail($id);

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $userId,
            'content' => $request->input('content'),
        ]);

        // Log to comm_logs
        $recipientId = $conversation->user_one_id === $userId ? $conversation->user_two_id : $conversation->user_one_id;
        \App\Models\CommLog::create([
            'from_user_id' => $userId,
            'to_user_id' => $recipientId,
            'channel' => 'in_app',
            'subject' => 'Direct Message',
            'preview' => \Illuminate\Support\Str::limit($request->input('content'), 100),
            'status' => 'delivered',
            'sent_at' => now(),
        ]);


        $conversation->update([
            'last_message'    => \Illuminate\Support\Str::limit($request->input('content'), 100),
            'last_message_at' => now(),
        ]);

        return response()->json([
            'message' => [
                'id'          => $message->id,
                'sender_id'   => $message->sender_id,
                'sender_name' => $request->user()->name,
                'sender_role' => $request->user()->role,
                'content'     => $message->content,
                'created_at'  => $message->created_at,
                'is_admin'    => true,
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'recipient_id' => 'required|integer|exists:users,id',
            'content' => 'required|string|max:5000',
        ]);

        $userId = $request->user()->id;
        $recipientId = (int) $request->input('recipient_id');

        if ($userId === $recipientId) {
            return response()->json(['message' => 'Cannot message yourself.'], 422);
        }

        // Find or create conversation (normalize order)
        $userOneId = min($userId, $recipientId);
        $userTwoId = max($userId, $recipientId);

        $conversation = Conversation::firstOrCreate(
            ['user_one_id' => $userOneId, 'user_two_id' => $userTwoId],
            ['last_message' => null, 'last_message_at' => now()]
        );

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $userId,
            'content' => $request->input('content'),
        ]);

        $conversation->update([
            'last_message' => \Illuminate\Support\Str::limit($request->input('content'), 100),
            'last_message_at' => now(),
        ]);

        $participant = User::select('id', 'name', 'role')->find($recipientId);

        return response()->json([
            'message' => 'Conversation started.',
            'conversation' => [
                'id' => $conversation->id,
                'participant' => $participant,
                'last_message' => $conversation->last_message,
                'last_message_at' => $conversation->last_message_at,
                'unread_count' => 0,
            ],
        ]);
    }

    /** Admin: list ALL conversations across the system */
    public function adminIndex(Request $request): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $conversations = Conversation::with([
            'userOne:id,name,role',
            'userTwo:id,name,role',
        ])
            ->orderByDesc('last_message_at')
            ->get()
            ->map(function ($conv) {
                return [
                    'id'              => $conv->id,
                    'user_one'        => $conv->userOne ? ['id' => $conv->userOne->id, 'name' => $conv->userOne->name, 'role' => $conv->userOne->role] : null,
                    'user_two'        => $conv->userTwo ? ['id' => $conv->userTwo->id, 'name' => $conv->userTwo->name, 'role' => $conv->userTwo->role] : null,
                    'last_message'    => $conv->last_message,
                    'last_message_at' => $conv->last_message_at,
                    'message_count'   => $conv->messages()->count(),
                ];
            });

        return response()->json(['conversations' => $conversations]);
    }

    /** Return list of all users (for admin new message picker) */
    public function userList(Request $request): JsonResponse
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $users = User::select('id', 'name', 'role', 'email')
            ->where('id', '!=', $request->user()->id)
            ->orderBy('name')
            ->get();

        return response()->json(['users' => $users]);
    }
}
