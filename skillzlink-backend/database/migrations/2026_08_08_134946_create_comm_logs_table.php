<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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

    public function down(): void
    {
        Schema::dropIfExists('comm_logs');
    }
};
