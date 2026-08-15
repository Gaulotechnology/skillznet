<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Fix the LHC generic-bot REST API body_raw on the deployed environment.
     *
     * The old body_raw included `"session_id": {{chat_id}}`. Because LHC
     * replaces `{{chat_id}}` with a bare integer (via json_encode), the webhook
     * received an integer for `session_id`, which failed Laravel's `string`
     * validation and made the bot return no response.
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

        $config = json_decode($row->configuration, true);
        if (!is_array($config)) {
            return;
        }

        $changed = false;
        foreach (($config['parameters'] ?? []) as $index => $param) {
            if (isset($param['body_raw'])) {
                $config['parameters'][$index]['body_raw'] =
                    '{"message":{{msg}},"chat_id":{{chat_id}},"visitor_name":{{lhc.nick}}}';
                $changed = true;
            }
        }

        if ($changed) {
            DB::table('lh_generic_bot_rest_api')
                ->where('id', 1)
                ->update([
                    'configuration' => json_encode($config, JSON_UNESCAPED_SLASHES),
                ]);
        }
    }

    public function down(): void
    {
        // Data-only fix; no meaningful rollback.
    }
};
