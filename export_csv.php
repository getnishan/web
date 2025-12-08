<?php
/**
 * Export Submissions to CSV
 * Requires authentication
 */

session_start();

// Check if admin is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: admin_login.php');
    exit;
}

require_once 'db.php';

// Get database connection
$conn = getDBConnection();
if (!$conn) {
    die('Database connection failed');
}

// Get all submissions
$sql = "SELECT * FROM applications ORDER BY uploaded_at DESC";
$result = $conn->query($sql);

// Set headers for CSV download
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="aveti_submissions_' . date('Y-m-d_H-i-s') . '.csv"');
header('Pragma: no-cache');
header('Expires: 0');

// Create output stream
$output = fopen('php://output', 'w');

// Add BOM for UTF-8 (helps Excel recognize UTF-8)
fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));

// Add CSV headers
fputcsv($output, [
    'ID',
    'Name',
    'Email',
    'Phone',
    'Age',
    'Qualification',
    'Graduation Year',
    'Location',
    'Video Filename',
    'Uploaded At'
]);

// Add data rows
while ($row = $result->fetch_assoc()) {
    fputcsv($output, [
        $row['id'],
        $row['name'],
        $row['email'] ?? '',
        $row['phone'],
        $row['age'],
        $row['qualification'],
        $row['graduation_year'],
        $row['location'],
        $row['video_filename'],
        $row['uploaded_at']
    ]);
}

fclose($output);
close_db_connection($conn);
exit;

