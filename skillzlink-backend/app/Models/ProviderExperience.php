<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProviderExperience extends Model
{
    protected $fillable = [
        'provider_id',
        'title',
        'company',
        'date_range',
        'description',
    ];

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }
}
