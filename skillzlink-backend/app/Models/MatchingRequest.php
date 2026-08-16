<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MatchingRequest extends Model
{
    use HasFactory;

    protected $table = 'matching_requests';

    protected $fillable = [
        'seeker_id',
        'service_category',
        'title',
        'description',
        'city',
        'address',
        'latitude',
        'longitude',
        'urgency',
        'budget',
        'status',
        'matched_provider_id',
        'accepted_at',
        'broadcast_count',
        'candidate_provider_ids',
    ];

    protected $casts = [
        'budget'                 => 'decimal:2',
        'latitude'               => 'decimal:7',
        'longitude'              => 'decimal:7',
        'accepted_at'            => 'datetime',
        'broadcast_count'        => 'integer',
        'candidate_provider_ids' => 'array',
    ];

    public function seeker(): BelongsTo
    {
        return $this->belongsTo(Seeker::class);
    }

    public function matchedProvider(): BelongsTo
    {
        return $this->belongsTo(Provider::class, 'matched_provider_id');
    }
}
