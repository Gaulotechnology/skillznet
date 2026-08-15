<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // api_logs and comm_logs were dropped on production even though their
        // original migrations are still recorded as "ran". Recreate them
        // defensively so the admin reporting pages always have their tables.
        if (!Schema::hasTable('api_logs')) {
            Schema::create('api_logs', function (Blueprint $table) {
                $table->id();
                $table->string('method', 10);
                $table->string('url', 500);
                $table->string('ip_address', 45)->nullable();
                $table->unsignedSmallInteger('status_code')->nullable();
                $table->unsignedBigInteger('user_id')->nullable()->index();
                $table->unsignedInteger('response_time_ms')->nullable();
                $table->text('request_body')->nullable();
                $table->string('user_agent', 512)->nullable();
                $table->timestamp('created_at')->useCurrent();
            });
        }

        if (!Schema::hasTable('comm_logs')) {
            Schema::create('comm_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('from_user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->foreignId('to_user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->enum('channel', ['in_app', 'sms', 'email'])->default('in_app');
                $table->string('subject')->nullable();
                $table->text('preview')->nullable();
                $table->enum('status', ['read', 'unread', 'delivered'])->default('delivered');
                $table->timestamp('sent_at')->useCurrent();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        // Intentionally not dropping — these are safety re-creations only.
    }
};
