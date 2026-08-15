<?php

$infobip = erLhcoreClassModule::getExtensionInstance('erLhcoreClassExtensionInfobip');

$item = $infobip->getConfigModel();

$saved = false;
$errors = array();

if (isset($_POST['store_infobip'])) {
    $item->api_key = isset($_POST['api_key']) ? (string) $_POST['api_key'] : '';
    $item->base_url = isset($_POST['base_url']) ? (string) $_POST['base_url'] : '';
    $item->sender_number = isset($_POST['sender_number']) ? (string) $_POST['sender_number'] : '';
    $item->bot_id = isset($_POST['bot_id']) ? (int) $_POST['bot_id'] : 1;
    $item->dep_id = isset($_POST['dep_id']) ? (int) $_POST['dep_id'] : 0;
    $item->chat_timeout = isset($_POST['chat_timeout']) ? (int) $_POST['chat_timeout'] : 86400;
    $item->debug = isset($_POST['debug']) ? 1 : 0;

    try {
        $item->saveThis();
        $saved = true;
        $infobip->clearConfigCache();
    } catch (Exception $e) {
        $errors[] = $e->getMessage();
    }
}

$proto = (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') ? 'https' : 'http';
$host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '';
$callbackUrl = $proto . '://' . $host . '/lhc/index.php/infobip/callbacks';

$tpl = erLhcoreClassTemplate::getInstance('lhinfobip/index.tpl.php');
$tpl->set('item', $item);
$tpl->set('saved', $saved);
$tpl->set('errors', $errors);
$tpl->set('callbackUrl', $callbackUrl);

$Result['content'] = $tpl->fetch();

$Result['path'] = array(
    array(
        'url' => erLhcoreClassDesign::baseurl('infobip/index'),
        'title' => erTranslationClassLhTranslation::getInstance()->getTranslation('module/infobip', 'Infobip WhatsApp settings'),
    ),
);
