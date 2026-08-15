<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApiLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'method', 'url', 'ip_address', 'status_code', 'user_id',
        'response_time_ms', 'request_body', 'user_agent'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'status_code' => 'integer',
        'response_time_ms' => 'integer',
    ];
}
