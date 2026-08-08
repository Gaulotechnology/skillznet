<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class JobPosting extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'department',
        'location',
        'type',
        'description',
        'is_active',
    ];
}
