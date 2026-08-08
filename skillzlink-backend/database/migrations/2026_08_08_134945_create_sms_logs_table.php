<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sms_logs', function (Blueprint $table) {
            $table->id();
            $table->string('recipient', 20);
            $table->enum('type', ['otp', 'notification', 'marketing'])->default('notification');
            $table->text('message');
            $table->string('provider', 50)->default('fake');
            $table->enum('status', ['delivered', 'failed', 'pending'])->default('pending');
            $table->decimal('cost', 8, 4)->default(0);
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamp('sent_at')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sms_logs');
    }
};
