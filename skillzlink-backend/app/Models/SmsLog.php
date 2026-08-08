<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SmsLog extends Model
{
    protected $fillable = [
        'recipient', 'type', 'message', 'provider', 'status', 'cost', 'user_id', 'sent_at',
    ];

    protected $casts = ['sent_at' => 'datetime'];

    public function user() { return $this->belongsTo(User::class); }
}
