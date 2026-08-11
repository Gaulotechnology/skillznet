<?php
/**
 * Router script for PHP's built-in web server to serve LHC.
 * Mimics Apache's mod_rewrite behavior: all requests go through index.php
 */

// Never show PHP errors on frontend
ini_set('display_errors', '0');
ini_set('display_startup_errors', '0');
error_reporting(0);

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '');
$lhcRoot = __DIR__ . '/../public/lhc';
$filePath = $lhcRoot . $uri;

// Serve static files directly if they exist
if ($uri !== '/' && file_exists($filePath) && is_file($filePath)) {
    // Determine MIME type
    $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
    $mimeTypes = [
        'css' => 'text/css',
        'js' => 'application/javascript',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
        'ico' => 'image/x-icon',
        'woff' => 'font/woff',
        'woff2' => 'font/woff2',
        'ttf' => 'font/ttf',
        'eot' => 'application/vnd.ms-fontobject',
    ];
    $mime = $mimeTypes[$ext] ?? 'application/octet-stream';
    header('Content-Type: ' . $mime);
    readfile($filePath);
    exit;
}

// Everything else goes through LHC's index.php
chdir($lhcRoot);
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['SCRIPT_FILENAME'] = $lhcRoot . '/index.php';

require $lhcRoot . '/index.php';
