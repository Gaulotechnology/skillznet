<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registration_fields', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('name')->unique(); // used as form field key
            $table->enum('type', ['text', 'textarea', 'dropdown', 'number', 'file', 'checkbox'])->default('text');
            $table->json('options')->nullable(); // For dropdown choices
            $table->boolean('is_required')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('placeholder')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registration_fields');
    }
};
