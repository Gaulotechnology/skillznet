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
        Schema::table('providers', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('address');
            $table->decimal('hourly_rate', 8, 2)->default(15.00)->after('service_category');
            $table->unsignedInteger('completed_services')->default(0)->after('hourly_rate');
            $table->unsignedInteger('success_rate')->default(100)->after('completed_services');
            $table->string('response_time')->default('2h')->after('success_rate');
            $table->json('skills')->nullable()->after('response_time');
        });

        Schema::create('provider_experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('provider_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('company');
            $table->string('date_range');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('provider_experiences');
        
        Schema::table('providers', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'hourly_rate',
                'completed_services',
                'success_rate',
                'response_time',
                'skills'
            ]);
        });
    }
};
