<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'live_helper_chat' => [
        'url' => env('LIVE_HELPER_CHAT_URL'),
        'api_key' => env('LIVE_HELPER_CHAT_API_KEY'),
        'bot_id' => env('LIVE_HELPER_CHAT_BOT_ID'),
    ],

    'whatsapp' => [
        'verify_token' => env('WHATSAPP_VERIFY_TOKEN'),
    ],

    'infobip' => [
        'api_key' => env('INFOBIP_API_KEY'),
        'base_url' => env('INFOBIP_BASE_URL', 'https://x1l2r4.api.infobip.com'),
        'sender_number' => env('INFOBIP_SENDER_NUMBER'),
    ],

    'sms_portal' => [
        'base_url' => env('SMS_PORTAL_BASE_URL', 'https://rest.smsportal.com'),
        'client_id' => env('SMS_PORTAL_CLIENT_ID'),
        'client_secret' => env('SMS_PORTAL_CLIENT_SECRET'),
    ],

];
