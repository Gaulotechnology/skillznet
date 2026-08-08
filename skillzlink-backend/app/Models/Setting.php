<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['key', 'value', 'section'];

    public static function get(string $key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    public static function set(string $key, $value, string $section = 'general'): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value, 'section' => $section]);
    }

    public static function getSection(string $section): array
    {
        return static::where('section', $section)
            ->pluck('value', 'key')
            ->toArray();
    }
}
