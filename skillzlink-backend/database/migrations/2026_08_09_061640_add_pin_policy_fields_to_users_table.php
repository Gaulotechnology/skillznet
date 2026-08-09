<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedSmallInteger('failed_pin_attempts')->default(0)->after('is_active');
            $table->timestamp('locked_until')->nullable()->after('failed_pin_attempts');
            $table->timestamp('pin_changed_at')->nullable()->after('locked_until');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['failed_pin_attempts', 'locked_until', 'pin_changed_at']);
        });
    }
};
