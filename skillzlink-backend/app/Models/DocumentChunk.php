<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentChunk extends Model
{
    protected $fillable = [
        'title',
        'content',
        'source',
        'embedding',
        'chunk_index',
    ];

    protected function casts(): array
    {
        return [
            'embedding' => 'array',
        ];
    }
}
