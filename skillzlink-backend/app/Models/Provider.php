<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Provider extends Model
{
    protected $fillable = [
        'user_id',
        'identity_number',
        'identity_verified',
        'address',
        'latitude',
        'longitude',
        'service_radius',
        'service_category',
        'description',
        'profile_image',
        'rating',
        'total_ratings',
        'subscription_tier',
        'subscription_expiry',
        'is_featured',
        'contact_opt_in',
        'phone',
        'hourly_rate',
        'completed_services',
        'success_rate',
        'response_time',
        'skills',
        'dynamic_data',
    ];

    protected function casts(): array
    {
        return [
            'identity_verified' => 'boolean',
            'is_featured' => 'boolean',
            'contact_opt_in' => 'boolean',
            'subscription_expiry' => 'datetime',
            'rating' => 'decimal:2',
            'skills' => 'array',
            'dynamic_data' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(ProviderDocument::class);
    }

    public function views(): HasMany
    {
        return $this->hasMany(ProviderView::class);
    }

    public function experiences(): HasMany
    {
        return $this->hasMany(ProviderExperience::class);
    }

    public function portfolios(): HasMany
    {
        return $this->hasMany(ProviderPortfolio::class);
    }

    public function services(): HasMany
    {
        return $this->hasMany(ProviderService::class);
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class);
    }
}
