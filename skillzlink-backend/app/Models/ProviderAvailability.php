<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProviderAvailability extends Model
{
    protected $fillable = [
        'provider_id',
        'day_of_week',
        'start_time',
        'end_time',
        'is_available',
    ];

    protected $casts = [
        'is_available' => 'boolean',
    ];

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }
}
