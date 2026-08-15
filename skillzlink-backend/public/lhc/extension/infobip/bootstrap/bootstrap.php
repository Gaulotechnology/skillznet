<?php

/**
 * Infobip WhatsApp extension for Live Helper Chat.
 *
 * Mirrors the 360dialog "clouddialog" extension, but talks to the Infobip
 * WhatsApp HTTP API instead. Two-way support:
 *
 *   - Inbound:  POST index.php/infobip/callbacks  (Infobip webhook)
 *               creates/reopens an LHC chat and feeds the visitor message
 *               through the generic bot (SkillzLink AI). Text, interactive
 *               button replies and interactive list replies are supported.
 *
 *   - Outbound: listens to `chat.web_add_msg_admin` and forwards any
 *               admin/bot reply to the visitor's WhatsApp number when the
 *               chat carries the `infobip_whatsapp` chat variable. Text,
 *               buttons (`buttons_generic`) and lists (`list`) are converted
 *               to the correct Infobip interactive payloads with WhatsApp
 *               length/quantity limits enforced.
 */
class erLhcoreClassExtensionInfobip
{
    private $settings = array();
    private $config = null;

    // WhatsApp rules enforced when building interactive messages.
    const MAX_BUTTONS = 3;
    const BUTTON_TITLE_MAX = 20;
    const BUTTON_ID_MAX = 256;
    const LIST_ACTION_TITLE_MAX = 20;
    const LIST_SECTION_TITLE_MAX = 24;
    const LIST_ROW_TITLE_MAX = 24;
    const LIST_ROW_DESC_MAX = 72;
    const LIST_ROW_ID_MAX = 200;
    const MAX_LIST_ROWS = 10;
    const BODY_TEXT_MAX = 1024;

    public function run()
    {
        $this->registerAutoload();

        $settingsFile = 'extension/infobip/settings/settings.ini.php';
        if (file_exists($settingsFile)) {
            $this->settings = include $settingsFile;
        }

        if (!is_array($this->settings)) {
            $this->settings = array();
        }

        $dispatcher = erLhcoreClassChatEventDispatcher::getInstance();
        $dispatcher->listen('chat.web_add_msg_admin', array($this, 'sendWhatsApp'));
        $dispatcher->listen('chat.desktop_client_admin_msg', array($this, 'sendWhatsApp'));
    }

    public function registerAutoload()
    {
        spl_autoload_register(array($this, 'autoload'), true, false);
    }

    public function autoload($className)
    {
        $classesArray = array(
            'erLhcoreClassModelInfobipConfig' => 'extension/infobip/classes/erlhcoreclassmodelinfobipconfig.php',
        );

        if (key_exists($className, $classesArray)) {
            include_once $classesArray[$className];
        }
    }

    /**
     * Resolve the effective Infobip configuration (DB row first, then settings file).
     */
    public function config($key = null)
    {
        if ($this->config === null) {
            $defaults = array(
                'api_key' => isset($this->settings['api_key']) ? $this->settings['api_key'] : '',
                'base_url' => isset($this->settings['base_url']) ? $this->settings['base_url'] : '',
                'sender_number' => isset($this->settings['sender_number']) ? $this->settings['sender_number'] : '',
                'bot_id' => isset($this->settings['bot_id']) ? (int) $this->settings['bot_id'] : 1,
                'dep_id' => isset($this->settings['dep_id']) ? (int) $this->settings['dep_id'] : 0,
                'chat_timeout' => isset($this->settings['chat_timeout']) ? (int) $this->settings['chat_timeout'] : 86400,
                'debug' => isset($this->settings['debug']) ? (int) $this->settings['debug'] : 0,
            );

            try {
                $row = erLhcoreClassModelInfobipConfig::fetch(1);
                if ($row instanceof erLhcoreClassModelInfobipConfig) {
                    $this->config = array_merge($defaults, $row->getState());
                } else {
                    $this->config = $defaults;
                }
            } catch (Exception $e) {
                $this->config = $defaults;
            }
        }

        if ($key === null) {
            return $this->config;
        }

        return isset($this->config[$key]) ? $this->config[$key] : null;
    }

    /**
     * Return the config model for the admin settings form.
     */
    public function getConfigModel()
    {
        try {
            $row = erLhcoreClassModelInfobipConfig::fetch(1);
            if ($row instanceof erLhcoreClassModelInfobipConfig) {
                return $row;
            }
        } catch (Exception $e) {
            // fall through to defaults
        }

        $row = new erLhcoreClassModelInfobipConfig();
        $row->id = 1;
        $row->api_key = isset($this->settings['api_key']) ? $this->settings['api_key'] : '';
        $row->base_url = isset($this->settings['base_url']) ? $this->settings['base_url'] : '';
        $row->sender_number = isset($this->settings['sender_number']) ? $this->settings['sender_number'] : '';
        $row->bot_id = isset($this->settings['bot_id']) ? (int) $this->settings['bot_id'] : 1;
        $row->dep_id = isset($this->settings['dep_id']) ? (int) $this->settings['dep_id'] : 0;
        $row->chat_timeout = isset($this->settings['chat_timeout']) ? (int) $this->settings['chat_timeout'] : 86400;
        $row->debug = isset($this->settings['debug']) ? 1 : 0;

        return $row;
    }

    public function clearConfigCache()
    {
        $this->config = null;
    }

    /**
     * Outbound hook: send an admin/bot message to the visitor via WhatsApp.
     */
    public function sendWhatsApp($params)
    {
        try {
            if (!isset($params['chat']) || !isset($params['msg'])) {
                return;
            }

            $chat = $params['chat'];
            $msg = $params['msg'];

            if (!($chat instanceof erLhcoreClassModelChat) || !($msg instanceof erLhcoreClassModelmsg)) {
                return;
            }

            $chatVariables = $chat->chat_variables_array;

            $isWhatsApp = isset($chatVariables['infobip_whatsapp'])
                && in_array($chatVariables['infobip_whatsapp'], array(true, 1, '1'), true);

            if (!$isWhatsApp) {
                return;
            }

            $to = isset($chat->phone) && $chat->phone !== ''
                ? $chat->phone
                : (isset($chatVariables['infobip_phone']) ? $chatVariables['infobip_phone'] : '');

            if ($to === '') {
                return;
            }

            $meta = $msg->meta_msg_array;
            $content = isset($meta['content']) && is_array($meta['content']) ? $meta['content'] : array();
            $bodyText = $this->cleanMessage((string) $msg->msg);

            // List message
            if (isset($content['list']) && is_array($content['list'])) {
                $this->sendInteractiveList($to, $bodyText, $content);
                return;
            }

            // Generic buttons
            if (isset($content['buttons_generic']) && is_array($content['buttons_generic'])) {
                $this->sendInteractiveButtons($to, $bodyText, $content['buttons_generic']);
                return;
            }

            // Quick replies (rendered as buttons on WhatsApp)
            if (isset($content['quick_replies']) && is_array($content['quick_replies'])) {
                $this->sendInteractiveButtons($to, $bodyText, $content['quick_replies']);
                return;
            }

            // Fallback: plain text
            if ($bodyText === '') {
                return;
            }

            $this->sendText($to, $bodyText);
        } catch (Exception $e) {
            $this->writeLog('sendWhatsApp exception: ' . $e->getMessage());
        }
    }

    /**
     * Build Infobip button objects from LHC generic-bot button items.
     */
    protected function buildButtons($items)
    {
        $buttons = array();

        foreach ($items as $item) {
            if (!isset($item['content']) || !is_array($item['content'])) {
                continue;
            }

            $name = isset($item['content']['name']) ? (string) $item['content']['name'] : '';
            $payload = isset($item['content']['payload']) ? (string) $item['content']['payload'] : '';

            if ($name === '' && $payload === '') {
                continue;
            }

            $type = isset($item['type']) ? (string) $item['type'] : '';

            if ($type === 'url' && $payload !== '') {
                $buttons[] = array(
                    'type' => 'URL',
                    'displayText' => $this->truncate($name !== '' ? $name : $payload, self::BUTTON_TITLE_MAX),
                    'url' => $payload,
                );
            } else {
                $buttons[] = array(
                    'type' => 'REPLY',
                    'id' => $this->truncate($payload, self::BUTTON_ID_MAX),
                    'title' => $this->truncate($name, self::BUTTON_TITLE_MAX),
                );
            }

            if (count($buttons) >= self::MAX_BUTTONS) {
                break;
            }
        }

        return $buttons;
    }

    /**
     * Send an Infobip interactive-buttons message.
     */
    protected function sendInteractiveButtons($to, $bodyText, $items)
    {
        $buttons = $this->buildButtons($items);

        if (empty($buttons)) {
            if ($bodyText !== '') {
                $this->sendText($to, $bodyText);
            }
            return array(false, 'no buttons');
        }

        $payload = array(
            'from' => ltrim($this->sender(), '+'),
            'to' => ltrim($to, '+'),
            'content' => array(
                'body' => array('text' => $this->truncate($bodyText, self::BODY_TEXT_MAX)),
                'action' => array('buttons' => $buttons),
            ),
        );

        return $this->post('/whatsapp/1/message/interactive/buttons', $payload);
    }

    /**
     * Send an Infobip interactive-list message.
     */
    protected function sendInteractiveList($to, $bodyText, $content)
    {
        $list = isset($content['list']) && is_array($content['list']) ? $content['list'] : array();
        $attrOptions = isset($content['attr_options']) && is_array($content['attr_options']) ? $content['attr_options'] : array();
        $items = isset($list['items']) && is_array($list['items']) ? $list['items'] : array();

        $rows = array();
        foreach ($items as $item) {
            if (!isset($item['content']) || !is_array($item['content'])) {
                continue;
            }

            $title = isset($item['content']['title']) ? (string) $item['content']['title'] : '';
            $subtitle = isset($item['content']['subtitle']) ? (string) $item['content']['subtitle'] : '';
            $payload = isset($item['content']['payload']) ? (string) $item['content']['payload'] : '';

            if ($title === '' && $payload === '') {
                continue;
            }

            if ($title === '') {
                $title = $this->truncate($payload, self::LIST_ROW_TITLE_MAX);
            }

            $row = array(
                'id' => $this->truncate($payload, self::LIST_ROW_ID_MAX),
                'title' => $this->truncate($title, self::LIST_ROW_TITLE_MAX),
            );

            if ($subtitle !== '') {
                $row['description'] = $this->truncate($subtitle, self::LIST_ROW_DESC_MAX);
            }

            $rows[] = $row;

            if (count($rows) >= self::MAX_LIST_ROWS) {
                break;
            }
        }

        if (empty($rows)) {
            if ($bodyText !== '') {
                $this->sendText($to, $bodyText);
            }
            return array(false, 'no list rows');
        }

        $actionTitle = isset($attrOptions['btn_title']) && $attrOptions['btn_title'] !== ''
            ? (string) $attrOptions['btn_title']
            : 'Menu';

        $body = $bodyText !== '' ? $bodyText : 'Please select an option';

        $payload = array(
            'from' => ltrim($this->sender(), '+'),
            'to' => ltrim($to, '+'),
            'content' => array(
                'body' => array('text' => $this->truncate($body, self::BODY_TEXT_MAX)),
                'action' => array(
                    'title' => $this->truncate($actionTitle, self::LIST_ACTION_TITLE_MAX),
                    'sections' => array(
                        array(
                            'title' => $this->truncate('Options', self::LIST_SECTION_TITLE_MAX),
                            'rows' => $rows,
                        ),
                    ),
                ),
            ),
        );

        return $this->post('/whatsapp/1/message/interactive/list', $payload);
    }

    /**
     * Send a plain-text WhatsApp message through Infobip.
     */
    public function sendText($to, $text)
    {
        $payload = array(
            'from' => ltrim($this->sender(), '+'),
            'to' => ltrim($to, '+'),
            'content' => array('text' => $text),
        );

        return $this->post('/whatsapp/1/message/text', $payload);
    }

    /**
     * Perform an Infobip HTTP POST and return [status, body].
     */
    protected function post($endpoint, $payload)
    {
        $baseUrl = trim((string) $this->config('base_url'), '/');
        $apiKey = (string) $this->config('api_key');

        $baseUrl = preg_replace('#^https?://#', '', $baseUrl);

        if ($baseUrl === '' || $apiKey === '' || $this->sender() === '') {
            $this->writeLog('infobip not configured');
            return array(false, 'not configured');
        }

        $headers = array(
            'Content-Type: application/json',
            'Accept: application/json',
            'Authorization: App ' . $apiKey,
        );

        $ch = curl_init('https://' . $baseUrl . $endpoint);
        curl_setopt_array($ch, array(
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_TIMEOUT => 30,
        ));

        $response = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $this->writeLog('infobip post ' . $endpoint . ' status=' . $status . ' response=' . $response);

        return array($status, $response);
    }

    /**
     * Inbound hook: parse an Infobip webhook payload and process each message.
     */
    public function processCallback($payload)
    {
        if (!is_array($payload) || !isset($payload['results']) || !is_array($payload['results'])) {
            return 0;
        }

        $processed = 0;

        foreach ($payload['results'] as $result) {
            if (!is_array($result)) {
                continue;
            }

            // Skip delivery/seen/sent status reports.
            if (isset($result['status']) || isset($result['seenAt']) || isset($result['deliveredAt']) || (isset($result['sentAt']) && !isset($result['message']))) {
                continue;
            }

            $from = isset($result['from']) ? ltrim((string) $result['from'], '+') : '';
            $message = isset($result['message']) && is_array($result['message']) ? $result['message'] : array();
            $type = isset($message['type']) ? strtoupper((string) $message['type']) : (isset($result['type']) ? strtoupper((string) $result['type']) : 'TEXT');

            $text = $this->extractInboundText($type, $message, $result);

            if ($from === '' || $text === '') {
                continue;
            }

            $chat = $this->receiveMessage($from, $text);
            if ($chat instanceof erLhcoreClassModelChat) {
                $processed++;
            }
        }

        return $processed;
    }

    /**
     * Extract the visitor text from TEXT or interactive-reply messages.
     */
    protected function extractInboundText($type, $message, $result)
    {
        if ($type === 'TEXT') {
            return isset($message['text']) ? (string) $message['text'] : (isset($result['text']) ? (string) $result['text'] : '');
        }

        if ($type === 'INTERACTIVE_BUTTON_REPLY') {
            if (isset($message['button']['payload'])) {
                return (string) $message['button']['payload'];
            }
            if (isset($message['id'])) {
                return (string) $message['id'];
            }
            if (isset($message['payload'])) {
                return (string) $message['payload'];
            }
        }

        if ($type === 'INTERACTIVE_LIST_REPLY') {
            if (isset($message['list']['id'])) {
                return (string) $message['list']['id'];
            }
            if (isset($message['id'])) {
                return (string) $message['id'];
            }
        }

        $this->writeLog('infobip unsupported message type=' . $type);
        return '';
    }

    /**
     * Create/reuse a chat and feed the incoming WhatsApp message into it.
     */
    protected function receiveMessage($from, $text)
    {
        $chat = $this->findOpenChat($from);

        if (!($chat instanceof erLhcoreClassModelChat)) {
            $chat = $this->createChat($from);
        } elseif ($chat->status == erLhcoreClassModelChat::STATUS_CLOSED_CHAT) {
            $chat->status = erLhcoreClassModelChat::STATUS_PENDING_CHAT;
            $chat->user_id = 0;
            $chat->pnd_time = time();
            $chat->saveThis();
        }

        $msg = new erLhcoreClassModelmsg();
        $msg->msg = $text;
        $msg->chat_id = $chat->id;
        $msg->user_id = 0;
        $msg->time = time();
        erLhcoreClassChat::getSession()->save($msg);

        $db = ezcDbInstance::get();
        $stmt = $db->prepare('UPDATE lh_chat SET last_user_msg_time = :last_user_msg_time, lsync = :lsync, last_msg_id = :last_msg_id, has_unread_messages = 1, unanswered_chat = :unanswered_chat WHERE id = :id');
        $stmt->bindValue(':id', $chat->id, PDO::PARAM_INT);
        $stmt->bindValue(':lsync', time(), PDO::PARAM_INT);
        $stmt->bindValue(':last_user_msg_time', $msg->time, PDO::PARAM_INT);
        $stmt->bindValue(':unanswered_chat', ($chat->status == erLhcoreClassModelChat::STATUS_PENDING_CHAT ? 1 : 0), PDO::PARAM_INT);
        $stmt->bindValue(':last_msg_id', $msg->id, PDO::PARAM_INT);
        $stmt->execute();

        // Run the generic bot (SkillzLink AI) and forward its responses to WhatsApp.
        erLhcoreClassChatWebhookIncoming::sendBotResponse($chat, $msg, array('sub_source' => 'infobip'));

        return $chat;
    }

    /**
     * Find an existing WhatsApp chat for the number, or a recently closed one.
     */
    protected function findOpenChat($from)
    {
        $timeout = (int) $this->config('chat_timeout');
        $unique = 'WA' . $from;

        $open = erLhcoreClassModelChat::getList(array(
            'filterin' => array('status' => array(
                erLhcoreClassModelChat::STATUS_PENDING_CHAT,
                erLhcoreClassModelChat::STATUS_ACTIVE_CHAT,
                erLhcoreClassModelChat::STATUS_BOT_CHAT,
            )),
            'filter' => array('unique_identifier' => $unique),
            'filtergt' => array('time' => time() - $timeout),
            'sort' => 'id DESC',
            'limit' => 1,
        ));

        if (!empty($open)) {
            return $open[0];
        }

        $closed = erLhcoreClassModelChat::getList(array(
            'filter' => array('unique_identifier' => $unique, 'status' => erLhcoreClassModelChat::STATUS_CLOSED_CHAT),
            'filtergt' => array('time' => time() - $timeout),
            'sort' => 'id DESC',
            'limit' => 1,
        ));

        if (!empty($closed)) {
            return $closed[0];
        }

        return null;
    }

    /**
     * Create a brand new WhatsApp chat.
     */
    protected function createChat($from)
    {
        $chat = new erLhcoreClassModelChat();
        $chat->phone = $from;
        $chat->nick = 'WhatsApp ' . $from;
        $chat->time = time();
        $chat->pnd_time = time();
        $chat->status = erLhcoreClassModelChat::STATUS_PENDING_CHAT;
        $chat->hash = erLhcoreClassChat::generateHash();
        $chat->referrer = '';
        $chat->session_referrer = '';
        $chat->dep_id = $this->getDepartmentId();
        $chat->gbot_id = (int) $this->config('bot_id');
        $chat->unique_identifier = 'WA' . $from;
        $chat->chat_variables = json_encode(array(
            'infobip_whatsapp' => true,
            'infobip_phone' => $from,
        ));
        $chat->saveThis();

        return $chat;
    }

    /**
     * Resolve the department for inbound WhatsApp chats.
     */
    protected function getDepartmentId()
    {
        if ((int) $this->config('dep_id') > 0) {
            return (int) $this->config('dep_id');
        }

        $departments = erLhcoreClassModelDepartament::getList(array(
            'limit' => 1,
            'filter' => array('disabled' => 0),
        ));

        if (!empty($departments)) {
            $department = array_shift($departments);
            return $department->id;
        }

        return 1;
    }

    /**
     * Strip bot/bbcode tags so WhatsApp only receives plain text.
     */
    protected function cleanMessage($text)
    {
        $text = preg_replace('#\[file=[^\]]+\]#i', '', $text);
        $text = preg_replace('#\[translation\]#i', '', $text);
        $text = preg_replace('#\[img[^\]]*\]#i', '', $text);
        $text = preg_replace('#\[url=[^\]]*\](.*?)\[/url\]#is', '$1', $text);
        $text = strip_tags($text);

        return trim($text);
    }

    /**
     * Truncate a string to a byte/char-safe length.
     */
    protected function truncate($value, $length)
    {
        $value = (string) $value;
        if (function_exists('mb_substr')) {
            return mb_substr($value, 0, $length);
        }
        return substr($value, 0, $length);
    }

    protected function sender()
    {
        return (string) $this->config('sender_number');
    }

    protected function writeLog($message)
    {
        if ((int) $this->config('debug') === 1) {
            erLhcoreClassLog::write(print_r($message, true));
        }
    }
}
