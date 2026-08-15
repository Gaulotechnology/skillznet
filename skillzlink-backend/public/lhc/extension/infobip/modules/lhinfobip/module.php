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

// Admin settings page: index.php/infobip/index
$ViewList['index'] = array(
    'params' => array(),
    'uparams' => array(),
    'functions' => array('use_admin'),
);

$FunctionList = array();
$FunctionList['use_admin'] = array('explain' => 'Allow operator to configure Infobip WhatsApp settings');
