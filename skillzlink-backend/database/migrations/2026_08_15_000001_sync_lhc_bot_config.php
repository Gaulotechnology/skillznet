<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const EMOJI_REGEX = '/[\x{1F000}-\x{1FAFF}\x{2600}-\x{27BF}\x{2B00}-\x{2BFF}\x{FE00}-\x{FE0F}\x{200D}\x{20E3}\x{2190}-\x{21FF}\x{2B50}\x{2B55}]/u';

    /**
     * Sync the LHC generic-bot config to the current (emoji-free) version.
     *
     * The bot trigger actions and patterns live in the LHC database, not in
     * code, so they must be migrated separately from the Laravel app code.
     */
    public function up(): void
    {
        if (!Schema::hasTable('lh_generic_bot_trigger')) {
            return;
        }

        // 1. Strip emojis from every bot trigger action (text + quick-reply buttons).
        foreach (DB::table('lh_generic_bot_trigger')->get() as $trigger) {
            $cleaned = $this->cleanActionsJson($trigger->actions);
            if ($cleaned !== null && $cleaned !== $trigger->actions) {
                DB::table('lh_generic_bot_trigger')
                    ->where('id', $trigger->id)
                    ->update(['actions' => $cleaned]);
            }
        }

        if (!Schema::hasTable('lh_generic_bot_trigger_event')) {
            return;
        }

        // 2. Strip emojis from every trigger matching pattern (e.g. button patterns).
        foreach (DB::table('lh_generic_bot_trigger_event')->get() as $event) {
            $cleaned = $this->stripEmojis($event->pattern);
            if ($cleaned !== $event->pattern) {
                DB::table('lh_generic_bot_trigger_event')
                    ->where('id', $event->id)
                    ->update(['pattern' => $cleaned]);
            }
        }

        // 3. Greetings must only match standalone greetings, so
        //    "hi i need a plumber" routes to the AI/find path instead.
        DB::table('lh_generic_bot_trigger_event')
            ->where('id', 2)
            ->update([
                'pattern' => '#^(hi|hello|hey|greetings|good morning|good afternoon|good evening|yo|sup)[\s.!?]*$#i',
            ]);

        // 4. "Chat with AI" button should match the exact payload.
        DB::table('lh_generic_bot_trigger_event')
            ->where('id', 17)
            ->update(['pattern' => '#Chat with AI#i']);
    }

    public function down(): void
    {
        // Data-only sync; reverting emoji removal is not meaningful.
    }

    /**
     * Decode the actions JSON, strip emojis from every string value, and
     * re-encode. Leaves non-JSON values untouched.
     */
    private function cleanActionsJson(?string $json): ?string
    {
        if ($json === null) {
            return null;
        }

        $data = json_decode($json, true);
        if (!is_array($data)) {
            return $json;
        }

        return json_encode(
            $this->stripEmojisRecursive($data),
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );
    }

    private function stripEmojisRecursive(mixed $value): mixed
    {
        if (is_string($value)) {
            return trim($this->stripEmojis($value));
        }

        if (is_array($value)) {
            foreach ($value as $key => $item) {
                $value[$key] = $this->stripEmojisRecursive($item);
            }
        }

        return $value;
    }

    private function stripEmojis(?string $text): ?string
    {
        if ($text === null) {
            return null;
        }

        return preg_replace(self::EMOJI_REGEX, '', $text);
    }
};
