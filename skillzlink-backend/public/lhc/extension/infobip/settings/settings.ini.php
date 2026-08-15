<?php

// Infobip WhatsApp extension settings.
//
// Credentials copied from papaya-new (production):
//   INFOBIP_API_KEY      -> api_key
//   INFOBIP_BASE_URL     -> base_url (hostname only)
//   INFOBIP_SENDER_NUMBER-> sender_number

return array(
    'api_key' => '59c28a39f3f7df59a1195e77d5d58427-e938ca84-d4c6-47b1-a619-663f64275c68',
    'base_url' => 'x1l2r4.api.infobip.com',
    'sender_number' => '27780179816',

    // Generic bot (SkillzLink AI) that should answer inbound WhatsApp messages.
    'bot_id' => 1,

    // Department to assign inbound WhatsApp chats to. 0 = first non-disabled department.
    'dep_id' => 0,

    // How long (seconds) an existing chat stays reusable for the same WhatsApp number.
    'chat_timeout' => 86400,

    // When true, verbose logging goes to LHC's default log.
    'debug' => false,
);
