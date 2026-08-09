<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceEngagement extends Model
{
    protected $fillable = [
        'seeker_id',
        'provider_id',
        'title',
        'description',
        'client_name',
        'provider_name',
        'type',
        'duration',
        'location',
        'amount',
        'time_estimate',
        'attachments',
        'rating',
        'reviews',
        'rate',
        'is_premium',
        'status',
        'hired_name',
    ];

    public function seeker()
    {
        return $this->belongsTo(Seeker::class);
    }

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }

    public function messages()
    {
        return $this->hasMany(ServiceMessage::class);
    }
}
