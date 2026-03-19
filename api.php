<?php
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

if ($action === 'run') {
    // Run the Node.js script
    $scriptPath = __DIR__ . '/puppeteer/google-open.js';
    
    // Check if script exists
    if (!file_exists($scriptPath)) {
        http_response_code(404);
        echo json_encode([
            'status' => 'error',
            'message' => 'Script not found: ' . $scriptPath
        ]);
        exit;
    }
    
    // Check if shell_exec is available
    if (!function_exists('shell_exec')) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'shell_exec() is disabled on this server'
        ]);
        exit;
    }
    
    // Run the script with full path to node
    $nodePath = 'C:\\Program Files\\nodejs\\node.exe';
    $command = escapeshellarg($nodePath) . ' ' . escapeshellarg($scriptPath) . ' 2>&1';
    $output = shell_exec($command);
    
    if ($output === null) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to execute node command. Make sure Node.js is installed and accessible.'
        ]);
        exit;
    }
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Google test completed',
        'output' => $output
    ]);
    
} elseif ($action === 'health') {
    // Health check
    $nodePath = 'C:\\Program Files\\nodejs\\node.exe';
    $nodeCheck = shell_exec(escapeshellarg($nodePath) . ' --version 2>&1') ?? 'not available';
    
    echo json_encode([
        'status' => 'online',
        'timestamp' => date('Y-m-d H:i:s'),
        'nodeVersion' => trim($nodeCheck)
    ]);
    
} else {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid action. Use ?action=run or ?action=health'
    ]);
}
?>
