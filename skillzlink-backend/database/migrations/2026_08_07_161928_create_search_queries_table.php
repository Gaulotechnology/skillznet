<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('search_queries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seeker_id')->constrained()->cascadeOnDelete();
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->string('service_category', 100);
            $table->unsignedInteger('radius_used');
            $table->unsignedInteger('results_count');
            $table->timestamp('searched_at')->nullable();
            $table->timestamps();

            $table->index(['seeker_id', 'service_category']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('search_queries');
    }
};
