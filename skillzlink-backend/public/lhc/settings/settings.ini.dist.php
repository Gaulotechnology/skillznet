<?php
 return array (
  'settings' => 
  array (
    'site' => 
    array (
      'title' => 'SkillzLink Live Chat',
      'site_admin_email' => 'admin@skillzlink.local',
      'locale' => 'en_EN',
      'theme' => 'defaulttheme',
      'installed' => true,
      'secrethash' => 'u6wHmj6B9fmmujDct4eZI6BfJnHRZIP3QEXIR3orjfiSAtmJhY93wEudGU3O6Yx93c8Y6sOqXuU9G5x2',
      'debug_output' => false,
      'debug_view' => false,
      'static_version' => 0,
      'log_slow_request' => false,
      'templatecache' => true,
      'templatecompile' => true,
      'modulecompile' => true,
      'force_virtual_host' => false,
      'proxy_mode' => false,
      'disable_mobile' => false,
      'disable_rest_api_by_user' => false,
      'one_login_per_account' => false,
      'php_session_cookie_name' => '',
      'time_zone' => 'Africa/Johannesburg',
      'date_format' => 'Y-m-d',
      'date_hour_format' => 'H:i:s',
      'date_date_hour_format' => 'Y-m-d H:i:s',
      'default_site_access' => 'eng',
      'default_site_access_list' => 
      array (
        0 => 'eng',
      ),
      'default_admin_site_access' => 
      array (
        0 => 'site_admin',
      ),
      'maps_api_key' => false,
      'default_group' => 'www-data',
      'default_user' => 'www-data',
      'site_address' => '',
      'allow_iframe' => false,
      'allow_iframe_domain' => '',
      'trusted_host_patterns' => 
      array (
      ),
      'extensions' => 
      array (
        0 => 'infobip',
      ),
      'available_site_access' => 
      array (
        0 => 'eng',
        1 => 'site_admin',
      ),
      'admin_session_timeout' => 3600,
      'max_message_length' => 5000,
      'max_file_upload_size' => 5242880,
      'allowed_file_types' => 'jpg,jpeg,gif,png,svg,pdf,doc,docx,xls,xlsx,txt,zip',
    ),
    'db' => 
    array (
      'host' => 'mysql',
      'port' => 3306,
      'database_name' => 'skillzlink',
      'database_user' => 'skillzlink',
      'database_password' => 'skillzlink',
      'use_slave' => false,
      'slave_host' => '',
      'slave_port' => 3306,
      'slave_database_name' => '',
      'slave_database_user' => '',
      'slave_database_password' => '',
      'prefix' => 'lh_',
      'user' => 'skillzlink',
      'password' => 'skillzlink',
      'database' => 'skillzlink',
    ),
    'cache' => 
    array (
      'cache_global_expire' => 3600,
      'cache_global' => true,
      'cache_global_enabled' => true,
      'cache_global_db' => true,
      'cache_global_file' => true,
    ),
    'session' => 
    array (
      'session_handler' => 'files',
      'session_save_path' => '/tmp',
      'session_name' => 'lhc_session',
    ),
    'chat' => 
    array (
      'online_timeout' => 300,
      'wait_timeout' => 180,
      'max_message_length' => 5000,
      'back_office_sinterval' => 10,
      'chat_message_sinterval' => 3.5,
      'check_for_operator_msg' => 10,
      'new_chat_sound_enabled' => true,
      'new_message_sound_admin_enabled' => true,
      'new_message_sound_user_enabled' => true,
    ),
    'webhooks' => 
    array (
      'enabled' => false,
      'worker' => 'http',
    ),
    'cacheEngine' => 
    array (
      'cache_global_key' => 'global_cache_key',
      'className' => false,
    ),
    'memecache' => 
    array (
      'servers' => 
      array (
        0 => 
        array (
          'host' => '127.0.0.1',
          'port' => '11211',
          'weight' => 1,
        ),
      ),
    ),
    'default_url' => 
    array (
      'module' => 'chat',
      'view' => 'start',
    ),
    'site_access_options' => 
    array (
      'eng' => 
      array (
        'locale' => 'en_EN',
        'content_language' => 'en',
        'dir_language' => 'ltr',
        'default_url' => 
        array (
          'module' => 'chat',
          'view' => 'start',
        ),
        'theme' => 
        array (
          0 => 'customtheme',
          1 => 'defaulttheme',
        ),
      ),
      'site_admin' => 
      array (
        'locale' => 'en_EN',
        'content_language' => 'en',
        'dir_language' => 'ltr',
        'login_pagelayout' => 'login',
        'default_url' => 
        array (
          'module' => 'front',
          'view' => 'default',
        ),
        'theme' => 
        array (
          0 => 'customtheme',
          1 => 'defaulttheme',
        ),
      ),
    ),
  ),
);
?>