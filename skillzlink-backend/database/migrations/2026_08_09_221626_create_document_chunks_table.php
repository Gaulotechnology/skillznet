<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_chunks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->string('source')->nullable();
            $table->json('embedding')->nullable(); // vector as JSON array
            $table->integer('chunk_index')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_chunks');
    }
};
