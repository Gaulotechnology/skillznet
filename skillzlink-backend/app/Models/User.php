<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\DB;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'avatar',
        'phone_number',
        'password',
        'role',
        'referral_code',
        'referred_by',
        'is_active',
        'failed_pin_attempts',
        'locked_until',
        'pin_changed_at',
        'settings',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'failed_pin_attempts' => 'integer',
            'locked_until' => 'datetime',
            'pin_changed_at' => 'datetime',
            'settings'       => 'array',
        ];
    }

    public function provider(): HasOne
    {
        return $this->hasOne(Provider::class);
    }

    public function seeker(): HasOne
    {
        return $this->hasOne(Seeker::class);
    }

    public function getPermissionsAttribute(): array
    {
        if ($this->role === 'super_admin') {
            return DB::table('permissions')->pluck('key')->toArray();
        }
        
        return DB::table('role_permissions')
            ->join('permissions', 'role_permissions.permission_id', '=', 'permissions.id')
            ->where('role_permissions.role', $this->role)
            ->pluck('permissions.key')
            ->toArray();
    }

    /**
     * Return the user's avatar, falling back to a deterministic profile
     * portrait when none has been uploaded (mirrors provider profile images).
     */
    public function getAvatarAttribute($value): string
    {
        if (!empty($value)) {
            return $value;
        }

        $id = (int) ($this->id ?? 0);
        $gender = ($id % 2 === 0) ? 'men' : 'women';
        $n = ($id % 99) + 1;

        return "https://randomuser.me/api/portraits/{$gender}/{$n}.jpg";
    }
}
