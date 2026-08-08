<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'seeker_id',
        'provider_id',
        'booking_date',
        'start_time',
        'end_time',
        'status',
        'notes',
        'total_price',
    ];

    protected $casts = [
        'booking_date' => 'date',
        'total_price' => 'decimal:2',
    ];

    public function seeker()
    {
        return $this->belongsTo(Seeker::class);
    }

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }
}
