<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_engagements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seeker_id')->constrained('seekers')->cascadeOnDelete();
            $table->foreignId('provider_id')->constrained('providers')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('client_name');
            $table->string('provider_name');
            $table->string('type')->nullable();
            $table->string('duration')->nullable();
            $table->string('location')->nullable();
            $table->string('amount')->nullable();
            $table->string('time_estimate')->nullable();
            $table->integer('attachments')->default(0);
            $table->decimal('rating', 2, 1)->nullable();
            $table->integer('reviews')->default(0);
            $table->string('rate')->nullable();
            $table->boolean('is_premium')->default(false);
            $table->string('status')->default('pending'); // pending, ongoing, completed, cancelled
            $table->string('hired_name')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_engagements');
    }
};
