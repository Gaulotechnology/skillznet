<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('api_logs', function (Blueprint $table) {
            $table->id();
            $table->string('method', 10);
            $table->string('url', 500);
            $table->string('ip_address', 45)->nullable();
            $table->unsignedSmallInteger('status_code')->nullable();
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->unsignedInteger('response_time_ms')->nullable(); // in milliseconds
            $table->text('request_body')->nullable();
            $table->string('user_agent', 512)->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('api_logs');
    }
};
