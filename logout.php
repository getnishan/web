<?php
/**
 * Admin Logout
 * Ends admin session and redirects to login page
 */

session_start();

// Destroy session
$_SESSION = array();

// Destroy session cookie
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 3600, '/');
}

// Destroy the session
session_destroy();

// Redirect to login page
header('Location: admin_login.php');
exit;

