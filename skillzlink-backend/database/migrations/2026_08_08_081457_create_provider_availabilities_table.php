<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('provider_availabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('provider_id')->constrained()->cascadeOnDelete();
            $table->tinyInteger('day_of_week'); // 0 (Sunday) to 6 (Saturday)
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->boolean('is_available')->default(false);
            $table->timestamps();
            
            // A provider can only have one availability record per day of the week
            $table->unique(['provider_id', 'day_of_week']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('provider_availabilities');
    }
};
