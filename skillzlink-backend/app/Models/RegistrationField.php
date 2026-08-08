<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegistrationField extends Model
{
    protected $fillable = [
        'label', 'name', 'type', 'options', 'is_required', 'sort_order', 'placeholder', 'category_name'
    ];

    protected $casts = [
        'options' => 'array',
        'is_required' => 'boolean',
    ];
}
