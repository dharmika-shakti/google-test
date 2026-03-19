<?php
echo "PHP is working!<br>";
echo "Current directory: " . __DIR__ . "<br>";
echo "Script exists: " . (file_exists(__DIR__ . '/puppeteer/google-open.js') ? 'YES' : 'NO') . "<br>";
echo "Node path: C:\\Program Files\\nodejs\\node.exe<br>";
echo "Node exists: " . (file_exists('C:\\Program Files\\nodejs\\node.exe') ? 'YES' : 'NO') . "<br>";

// Try to run node
$output = shell_exec('C:\\Program Files\\nodejs\\node.exe --version 2>&1');
echo "Node version: " . ($output ? htmlspecialchars($output) : 'FAILED') . "<br>";
?>
