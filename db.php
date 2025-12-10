<?php
/**
 * Database Connection File
 * Compatible with Hostinger shared hosting
 */

// Database configuration
// Update these values according to your Hostinger database settings
define('DB_HOST', 'localhost');
define('DB_USER', 'nishan');
define('DB_PASS', 'Avetibnm577');
define('DB_NAME', 'elevateten_db');

/**
 * Create database connection
 * @return mysqli|false Returns mysqli connection object or false on failure
 */
function getDBConnection() {
    // Create connection using mysqli (compatible with Hostinger)
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    // Check connection
    if ($conn->connect_error) {
        error_log("Database connection failed: " . $conn->connect_error);
        return false;
    }
    
    // Set charset to utf8mb4 for proper character encoding
    $conn->set_charset("utf8mb4");
    
    return $conn;
}

/**
 * Close database connection
 * @param mysqli $conn Database connection object
 */
function closeDBConnection($conn) {
    if ($conn) {
        $conn->close();
    }
}

?>

