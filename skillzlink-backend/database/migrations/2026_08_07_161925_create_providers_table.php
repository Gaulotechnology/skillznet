<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('providers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('identity_number');
            $table->boolean('identity_verified')->default(false);
            $table->text('address');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->unsignedInteger('service_radius')->default(10);
            $table->string('service_category', 100);
            $table->text('description')->nullable();
            $table->decimal('rating', 3, 2)->default(0);
            $table->unsignedInteger('total_ratings')->default(0);
            $table->enum('subscription_tier', ['free', 'premium_monthly', 'premium_quarterly'])->default('free');
            $table->timestamp('subscription_expiry')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('contact_opt_in')->default(true);
            $table->timestamps();

            $table->index(['service_category', 'subscription_tier']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('providers');
    }
};
