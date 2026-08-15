<?php

/**
 * Infobip inbound webhook endpoint.
 *
 * URL: index.php/infobip/callbacks
 *
 * Expected body (Infobip WhatsApp inbound message):
 * {
 *   "results": [
 *     {
 *       "from": "27780179816",
 *       "messageId": "...",
 *       "message": { "type": "TEXT", "text": "hello" }
 *     }
 *   ]
 * }
 */

$payload = json_decode(file_get_contents('php://input'), true);

if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(array('status' => 'invalid_payload'));
    exit;
}

try {
    $infobip = erLhcoreClassModule::getExtensionInstance('erLhcoreClassExtensionInfobip');
    if ($infobip !== false) {
        $infobip->processCallback($payload);
    }
} catch (Exception $e) {
    error_log('Infobip callback error: ' . $e->getMessage());
}

echo json_encode(array('status' => 'ok'));
exit;
