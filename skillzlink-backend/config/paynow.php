<?php

return [
    'integration_id' => env('PAYNOW_INTEGRATION_ID', ''),
    'integration_key' => env('PAYNOW_INTEGRATION_KEY', ''),
    'auth_email'      => env('PAYNOW_AUTH_EMAIL', ''),

    'return_url'      => env('PAYNOW_RETURN_URL', env('APP_URL') . '/api/paynow/return'),
    'result_url'      => env('PAYNOW_RESULT_URL', env('APP_URL') . '/api/paynow/status'),

    'mode'            => env('PAYNOW_MODE', 'sandbox'), // sandbox | live
];
