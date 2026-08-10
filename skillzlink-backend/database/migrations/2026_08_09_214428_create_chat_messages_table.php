<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_messages', function (Blueprint $table) {
            $table->id();
            $table->string('session_id', 64)->index();
            $table->string('sender_name')->nullable();
            $table->text('message');
            $table->string('sender_role')->default('visitor'); // visitor, admin
            $table->unsignedBigInteger('user_id')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_messages');
    }
};
