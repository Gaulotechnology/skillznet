<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Make provider_id, payment_method, method nullable on existing payments table
        Schema::table('payments', function (Blueprint $table) {
            // Only modify if the table already exists with non-nullable columns
            if (Schema::hasColumn('payments', 'provider_id')) {
                $table->unsignedBigInteger('provider_id')->nullable()->change();
            }
            if (Schema::hasColumn('payments', 'payment_method')) {
                $table->string('payment_method')->nullable()->change();
            }
            if (Schema::hasColumn('payments', 'method')) {
                $table->string('method')->nullable()->change();
            }
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            if (Schema::hasColumn('payments', 'provider_id')) {
                $table->unsignedBigInteger('provider_id')->nullable(false)->change();
            }
        });
    }
};
