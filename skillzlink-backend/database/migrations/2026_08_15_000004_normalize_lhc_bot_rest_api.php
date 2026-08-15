<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Normalise the LHC generic-bot REST API config to the known-good shape.
     *
     * A manual edit in the admin panel left an empty `conditions` entry
     * ({"key":"","value":""}), which makes the REST API action return
     * "Invalid conditions" and skip the webhook call entirely.
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

        $host = $config['host'] ?? 'http://62.238.107.93/api/bot/webhook';

        $clean = [
            'host' => $host,
            'ecache' => false,
            'log_audit' => false,
            'log_system' => false,
            'log_code' => '',
            'sr_body' => false,
            'parameters' => [
                [
                    'id' => 'skzwh1',
                    'name' => 'SkillzLink Webhook',
                    'position' => 0,
                    'method' => 'POST',
                    'suburl' => '',
                    'header' => [
                        ['key' => 'Content-Type', 'value' => 'application/json'],
                        ['key' => 'Accept', 'value' => 'application/json'],
                    ],
                    'body_request_type' => 'raw',
                    'body_request_type_content' => 'json',
                    'body_raw' => '{"message":{{msg}},"chat_id":{{chat_id}},"visitor_name":{{lhc.nick}}}',
                    'query' => [],
                    'conditions' => [],
                    'postparams' => [],
                    'userparams' => [],
                    'output' => [
                        [
                            'success_name' => 'AI Response',
                            'success_location' => 'response',
                            'output_priority' => 0,
                        ],
                    ],
                ],
            ],
        ];

        DB::table('lh_generic_bot_rest_api')
            ->where('id', 1)
            ->update(['configuration' => json_encode($clean, JSON_UNESCAPED_SLASHES)]);
    }

    public function down(): void
    {
        // Data-only fix; no meaningful rollback.
    }
};
