<?php

$Module = array(
    'name' => 'Infobip WhatsApp',
    'variable_params' => true,
);

$ViewList = array();

// Public inbound webhook: index.php/infobip/callbacks
$ViewList['callbacks'] = array(
    'params' => array(),
    'uparams' => array(),
);

$FunctionList = array();
