<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('matching_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seeker_id')->constrained('seekers')->cascadeOnDelete();
            $table->string('service_category');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('city')->default('Harare');
            $table->string('address')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('urgency')->default('immediate'); // immediate, same_day, flexible
            $table->decimal('budget', 10, 2)->nullable();
            $table->string('status')->default('broadcasting'); // broadcasting, matched, in_progress, completed, cancelled, expired
            $table->foreignId('matched_provider_id')->nullable()->constrained('providers')->nullOnDelete();
            $table->timestamp('accepted_at')->nullable();
            $table->integer('broadcast_count')->default(0);
            $table->json('candidate_provider_ids')->nullable();
            $table->timestamps();

            $table->index(['service_category', 'status']);
            $table->index(['city', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('matching_requests');
    }
};
