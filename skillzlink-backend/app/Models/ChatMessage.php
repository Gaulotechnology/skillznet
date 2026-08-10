<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    protected $fillable = [
        'session_id',
        'sender_name',
        'message',
        'sender_role',
        'user_id',
        'is_read',
    ];

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
