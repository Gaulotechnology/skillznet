<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceMessage extends Model
{
    protected $fillable = [
        'service_engagement_id',
        'user_id',
        'user_name',
        'message',
        'attachments',
    ];

    public function engagement()
    {
        return $this->belongsTo(ServiceEngagement::class, 'service_engagement_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
