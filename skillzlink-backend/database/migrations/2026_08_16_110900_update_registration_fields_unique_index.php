<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('registration_fields', function (Blueprint $table) {
            $table->dropUnique('registration_fields_name_unique');
            $table->index(['name', 'category_name']);
        });
    }

    public function down(): void
    {
        Schema::table('registration_fields', function (Blueprint $table) {
            $table->dropIndex(['name', 'category_name']);
            $table->unique('name', 'registration_fields_name_unique');
        });
    }
};
