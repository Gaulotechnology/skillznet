<?php

/**
 * Infobip WhatsApp extension for Live Helper Chat.
 *
 * Mirrors the 360dialog "clouddialog" extension, but talks to the Infobip
 * WhatsApp HTTP API instead. Two-way support:
 *
 *   - Inbound:  POST index.php/infobip/callbacks  (Infobip webhook)
 *               creates/reopens an LHC chat and feeds the visitor message
 *               through the generic bot (SkillzLink AI).
 *
 *   - Outbound: listens to `chat.web_add_msg_admin` and forwards any
 *               admin/bot reply to the visitor's WhatsApp number when the
 *               chat carries the `infobip_whatsapp` chat variable.
 */
class erLhcoreClassExtensionInfobip
{
    private $settings = array();

    public function run()
    {
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

            if ($to === '' || trim((string) $msg->msg) === '') {
                return;
            }

            $text = $this->cleanMessage((string) $msg->msg);
            if ($text === '') {
                return;
            }

            $this->sendText($to, $text);
        } catch (Exception $e) {
            $this->writeLog('sendWhatsApp exception: ' . $e->getMessage());
        }
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
     * Send a plain-text WhatsApp message through Infobip.
     */
    public function sendText($to, $text)
    {
        $baseUrl = isset($this->settings['base_url']) ? trim($this->settings['base_url'], '/') : '';
        $apiKey = isset($this->settings['api_key']) ? $this->settings['api_key'] : '';
        $sender = isset($this->settings['sender_number']) ? $this->settings['sender_number'] : '';

        $baseUrl = preg_replace('#^https?://#', '', $baseUrl);

        if ($baseUrl === '' || $apiKey === '' || $sender === '') {
            $this->writeLog('infobip not configured');
            return array(false, 'not configured');
        }

        $payload = array(
            'from' => ltrim($sender, '+'),
            'to' => ltrim($to, '+'),
            'content' => array('text' => $text),
        );

        $headers = array(
            'Content-Type: application/json',
            'Accept: application/json',
            'Authorization: App ' . $apiKey,
        );

        $ch = curl_init('https://' . $baseUrl . '/whatsapp/1/message/text');
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

        $this->writeLog('infobip send to=' . $to . ' status=' . $status . ' response=' . $response);

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
            $text = isset($message['text']) ? (string) $message['text'] : (isset($result['text']) ? (string) $result['text'] : '');

            if ($from === '' || $text === '') {
                continue;
            }

            if ($type !== 'TEXT') {
                $this->writeLog('infobip unsupported message type=' . $type);
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
        $timeout = isset($this->settings['chat_timeout']) ? (int) $this->settings['chat_timeout'] : 86400;
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
        $chat->gbot_id = isset($this->settings['bot_id']) ? (int) $this->settings['bot_id'] : 0;
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
        if (isset($this->settings['dep_id']) && (int) $this->settings['dep_id'] > 0) {
            return (int) $this->settings['dep_id'];
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

    protected function writeLog($message)
    {
        if (isset($this->settings['debug']) && $this->settings['debug'] == true) {
            erLhcoreClassLog::write(print_r($message, true));
        }
    }
}
