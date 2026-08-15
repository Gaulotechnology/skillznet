<?php

/**
 * Single-row Infobip WhatsApp configuration model.
 */
class erLhcoreClassModelInfobipConfig
{
    use erLhcoreClassDBTrait;

    public static $dbTable = 'lh_infobip_config';
    public static $dbTableId = 'id';
    public static $dbSessionHandler = 'erLhcoreClassChat::getSession';
    public static $dbSortOrder = 'ASC';

    public function getState()
    {
        return array(
            'id' => $this->id,
            'api_key' => $this->api_key,
            'base_url' => $this->base_url,
            'sender_number' => $this->sender_number,
            'bot_id' => $this->bot_id,
            'dep_id' => $this->dep_id,
            'chat_timeout' => $this->chat_timeout,
            'debug' => $this->debug,
        );
    }

    public $id = null;
    public $api_key = '';
    public $base_url = '';
    public $sender_number = '';
    public $bot_id = 1;
    public $dep_id = 0;
    public $chat_timeout = 86400;
    public $debug = 0;
}
