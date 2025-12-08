<?php
/**
 * Setup Script - Create Required Directories
 * Run this once after uploading files to create necessary directories
 */

// Create uploads/videos directory
$uploadsDir = __DIR__ . '/uploads';
$videosDir = $uploadsDir . '/videos';

if (!file_exists($uploadsDir)) {
    mkdir($uploadsDir, 0755, true);
    echo "Created directory: uploads/\n";
} else {
    echo "Directory exists: uploads/\n";
}

if (!file_exists($videosDir)) {
    mkdir($videosDir, 0755, true);
    echo "Created directory: uploads/videos/\n";
} else {
    echo "Directory exists: uploads/videos/\n";
}

// Create .htaccess for security
$htaccessFile = $videosDir . '/.htaccess';
if (!file_exists($htaccessFile)) {
    file_put_contents($htaccessFile, "Options -Indexes\n");
    echo "Created .htaccess file\n";
} else {
    echo ".htaccess file exists\n";
}

echo "\nSetup complete! Directories created successfully.\n";
echo "Make sure to set proper permissions:\n";
echo "chmod 755 uploads\n";
echo "chmod 755 uploads/videos\n";

?>

