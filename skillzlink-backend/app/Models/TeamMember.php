<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    protected $fillable = [
        'name',
        'role',
        'bio',
        'photo_url',
        'order_index',
        'is_active',
        'social_links',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order_index' => 'integer',
        'social_links' => 'array',
    ];
}
