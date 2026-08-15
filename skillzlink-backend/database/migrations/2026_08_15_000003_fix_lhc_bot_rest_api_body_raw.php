<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Remove the integer `session_id` field from the LHC REST API body_raw.
     *
     * The configuration string is not always valid JSON (the body_raw quotes
     * may be unescaped), so we edit the raw string directly instead of
     * json_decode/json_encode.
     */
    public function up(): void
    {
        if (!Schema::hasTable('lh_generic_bot_rest_api')) {
            return;
        }

        $row = DB::table('lh_generic_bot_rest_api')->where('id', 1)->first();
        if (!$row) {
            return;
        }

        $config = str_replace(', "session_id": {{chat_id}}', '', (string) $row->configuration);

        if ($config !== $row->configuration) {
            DB::table('lh_generic_bot_rest_api')
                ->where('id', 1)
                ->update(['configuration' => $config]);
        }
    }

    public function down(): void
    {
        // Data-only fix; no meaningful rollback.
    }
};
