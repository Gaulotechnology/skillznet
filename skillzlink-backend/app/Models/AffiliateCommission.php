<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AffiliateCommission extends Model
{
    protected $fillable = [
        'affiliate_id',
        'referred_user_id',
        'description',
        'amount',
        'status',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'paid_at' => 'datetime',
        ];
    }

    public function affiliate()
    {
        return $this->belongsTo(User::class, 'affiliate_id');
    }

    public function referredUser()
    {
        return $this->belongsTo(User::class, 'referred_user_id');
    }
}
