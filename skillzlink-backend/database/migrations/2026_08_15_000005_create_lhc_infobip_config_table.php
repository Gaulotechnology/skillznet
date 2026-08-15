<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('lh_infobip_config')) {
            Schema::create('lh_infobip_config', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('api_key', 255)->default('');
                $table->string('base_url', 255)->default('');
                $table->string('sender_number', 35)->default('');
                $table->integer('bot_id')->default(1);
                $table->integer('dep_id')->default(0);
                $table->integer('chat_timeout')->default(86400);
                $table->tinyInteger('debug')->default(0);
            });
        }

        // Seed the single config row from the environment so the admin UI
        // starts with the correct production credentials.
        if (DB::table('lh_infobip_config')->count() === 0) {
            DB::table('lh_infobip_config')->insert([
                'id' => 1,
                'api_key' => (string) env('INFOBIP_API_KEY', ''),
                'base_url' => (string) env('INFOBIP_BASE_URL', ''),
                'sender_number' => (string) env('INFOBIP_SENDER_NUMBER', ''),
                'bot_id' => 1,
                'dep_id' => 0,
                'chat_timeout' => 86400,
                'debug' => 0,
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('lh_infobip_config');
    }
};
