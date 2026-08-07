<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProviderView extends Model
{
    protected $fillable = [
        'provider_id',
        'seeker_id',
        'viewed_at',
        'contact_revealed',
    ];

    protected function casts(): array
    {
        return [
            'viewed_at' => 'datetime',
            'contact_revealed' => 'boolean',
        ];
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }

    public function seeker(): BelongsTo
    {
        return $this->belongsTo(Seeker::class);
    }
}
