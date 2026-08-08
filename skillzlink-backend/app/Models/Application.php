<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = [
        'name', 'email', 'phone', 'type', 'message', 'company',
        'experience', 'status', 'admin_notes', 'reviewed_by', 'reviewed_at',
    ];

    protected $casts = ['reviewed_at' => 'datetime'];

    public function reviewer() { return $this->belongsTo(User::class, 'reviewed_by'); }
}
