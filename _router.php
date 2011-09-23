<?php

/**
 * Momentum HQ Router
 * Nate Ferrero
 */

chdir(__DIR__);
define('HQ_BASE_URL', '/' . array_shift($path));

hq_route($path);
function hq_route($path) {
    
    // Check for file
    $path = implode(DIRECTORY_SEPARATOR, $path);
    
    // Check for index
    if($path == '')
        $path = 'index.php';
    
    // Check for file
    if(is_file($path)) {
        switch(pathinfo($path, PATHINFO_EXTENSION)) {
            case 'less':
                $mime = 'text/css';
                $path = e::helper('less')->render($path);
                break;
            case 'js':
                $mime = 'text/javascript';
                break;
            case 'php':
                include($path);
                return;
            default:
                $mime = 'text/html';
        }
        
        header('Content-Type: ' . $mime);
        header('Content-Length: ' . filesize($path));
        readfile($path);
        return;
    }
    
    // Else 404
    echo '<!doctype html><html><head><title>Not Found</title></head>
        <body><h1>Momentum HQ&trade;</h1><p>404 Not Found</p></body></html>';
}