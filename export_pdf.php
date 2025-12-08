<?php
/**
 * Export Submissions to PDF
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
$submissions = $result->fetch_all(MYSQLI_ASSOC);
close_db_connection($conn);

// Simple PDF generation using HTML to PDF approach
// For production, consider using libraries like TCPDF, FPDF, or DomPDF

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Submissions Export - Aveti Learning</title>
    <style>
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #84BC54;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #84BC54;
            margin: 0;
            font-size: 28px;
        }
        .header p {
            color: #666;
            margin: 5px 0 0 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 11px;
        }
        th {
            background-color: #84BC54;
            color: white;
            padding: 10px 8px;
            text-align: left;
            font-weight: bold;
            border: 1px solid #6A9A43;
        }
        td {
            padding: 8px;
            border: 1px solid #ddd;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        tr:hover {
            background-color: #f5f5f5;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .summary {
            background-color: #f0f9f0;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .summary strong {
            color: #84BC54;
        }
    </style>
</head>
<body>
    <div class="no-print" style="text-align: center; margin-bottom: 20px;">
        <button onclick="window.print()" style="background: #84BC54; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
            Print / Save as PDF
        </button>
        <a href="admin.php" style="display: inline-block; margin-left: 10px; background: #666; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
            Back to Admin Panel
        </a>
    </div>

    <div class="header">
        <h1>Aveti Learning - Submissions Report</h1>
        <p>Generated on <?php echo date('F d, Y \a\t H:i:s'); ?></p>
    </div>

    <div class="summary">
        <strong>Total Submissions:</strong> <?php echo count($submissions); ?>
    </div>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Age</th>
                <th>Qualification</th>
                <th>Grad Year</th>
                <th>Location</th>
                <th>Video File</th>
                <th>Submitted At</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($submissions)): ?>
                <tr>
                    <td colspan="10" style="text-align: center; padding: 20px; color: #999;">
                        No submissions found.
                    </td>
                </tr>
            <?php else: ?>
                <?php foreach ($submissions as $submission): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($submission['id']); ?></td>
                        <td><?php echo htmlspecialchars($submission['name']); ?></td>
                        <td><?php echo htmlspecialchars($submission['email'] ?? 'N/A'); ?></td>
                        <td><?php echo htmlspecialchars($submission['phone']); ?></td>
                        <td><?php echo htmlspecialchars($submission['age']); ?></td>
                        <td><?php echo htmlspecialchars($submission['qualification']); ?></td>
                        <td><?php echo htmlspecialchars($submission['graduation_year']); ?></td>
                        <td><?php echo htmlspecialchars($submission['location']); ?></td>
                        <td><?php echo htmlspecialchars($submission['video_filename']); ?></td>
                        <td><?php echo date('M d, Y H:i', strtotime($submission['uploaded_at'])); ?></td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>

    <div class="footer">
        <p>Aveti Learning - Three-Month Residential Program</p>
        <p>This is a confidential document. Generated automatically by the admin panel.</p>
    </div>
</body>
</html>

