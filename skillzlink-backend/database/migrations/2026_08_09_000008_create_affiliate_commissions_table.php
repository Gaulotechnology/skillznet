<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('affiliate_commissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('affiliate_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('referred_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('description');
            $table->decimal('amount', 10, 2)->default(0);
            $table->string('status')->default('pending'); // pending, paid
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('affiliate_commissions');
    }
};
