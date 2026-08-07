<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Seeker extends Model
{
    protected $fillable = [
        'user_id',
        'default_latitude',
        'default_longitude',
        'saved_searches',
    ];

    protected function casts(): array
    {
        return [
            'saved_searches' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function searchQueries(): HasMany
    {
        return $this->hasMany(SearchQuery::class);
    }
}
