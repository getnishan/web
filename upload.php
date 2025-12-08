<?php
/**
 * File Upload Handler
 * Handles form submission, file uploads, and database storage
 * Compatible with Hostinger shared hosting
 */

// Include database connection
require_once 'db.php';

// Set response header to JSON
header('Content-Type: application/json');

// Enable error reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors, log them instead

/**
 * Create uploads directory if it doesn't exist
 */
function ensureUploadsDirectory() {
    $uploadDir = __DIR__ . '/uploads/videos';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    // Also create .htaccess for security
    $htaccessFile = $uploadDir . '/.htaccess';
    if (!file_exists($htaccessFile)) {
        file_put_contents($htaccessFile, "Options -Indexes\n");
    }
    return $uploadDir;
}

/**
 * Sanitize input data
 */
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

/**
 * Validate email
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

/**
 * Main processing
 */
try {
    // Check if request is POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method.');
    }
    
    // Get database connection
    $conn = getDBConnection();
    if (!$conn) {
        throw new Exception('Database connection failed.');
    }
    
    // Sanitize and validate form inputs
    $name = isset($_POST['name']) ? sanitizeInput($_POST['name']) : '';
    $email = isset($_POST['email']) ? sanitizeInput($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? sanitizeInput($_POST['phone']) : '';
    $age = isset($_POST['age']) ? intval($_POST['age']) : 0;
    $qualification = isset($_POST['qualification']) ? sanitizeInput($_POST['qualification']) : '';
    $graduation_year = isset($_POST['graduation_year']) ? intval($_POST['graduation_year']) : 0;
    $location = isset($_POST['location']) ? sanitizeInput($_POST['location']) : '';
    
    // Validate required fields (email is optional)
    if (empty($name) || empty($phone) || empty($age) || 
        empty($qualification) || empty($graduation_year) || empty($location)) {
        throw new Exception('All required fields must be filled.');
    }
    
    // Validate email only if provided
    if (!empty($email) && !validateEmail($email)) {
        throw new Exception('Invalid email address.');
    }
    
    // Validate age
    if ($age < 18 || $age > 100) {
        throw new Exception('Age must be between 18 and 100.');
    }
    
    // Ensure uploads directory exists
    $uploadDir = ensureUploadsDirectory();
    
    $videoFilename = null;
    
    // Handle video upload
    if (isset($_FILES['video']) && $_FILES['video']['error'] === UPLOAD_ERR_OK) {
        $videoFile = $_FILES['video'];
        $videoExtension = pathinfo($videoFile['name'], PATHINFO_EXTENSION);
        $videoFilename = 'video_' . time() . '_' . uniqid() . '.' . $videoExtension;
        $videoPath = $uploadDir . '/' . $videoFilename;
        
        // Validate video file type
        $allowedVideoTypes = ['webm', 'mp4', 'mov', 'avi'];
        if (!in_array(strtolower($videoExtension), $allowedVideoTypes)) {
            throw new Exception('Invalid video file format.');
        }
        
        // Move uploaded file
        if (!move_uploaded_file($videoFile['tmp_name'], $videoPath)) {
            throw new Exception('Failed to upload video file.');
        }
    } else {
        throw new Exception('Video file is required.');
    }
    
    // Prepare SQL statement (email can be NULL)
    $sql = "INSERT INTO applications (
        name, email, phone, age, qualification, graduation_year, 
        location, video_filename, uploaded_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";
    
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception('Database preparation failed: ' . $conn->error);
    }
    
    // Use NULL if email is empty
    $emailValue = !empty($email) ? $email : null;
    
    // Bind parameters
    $stmt->bind_param(
        'sssissss',
        $name, $emailValue, $phone, $age, $qualification, $graduation_year,
        $location, $videoFilename
    );
    
    // Execute statement
    if (!$stmt->execute()) {
        throw new Exception('Database insertion failed: ' . $stmt->error);
    }
    
    // Close statement
    $stmt->close();
    
    // Close database connection
    closeDBConnection($conn);
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Application submitted successfully!'
    ]);
    
} catch (Exception $e) {
    // Log error
    error_log('Upload error: ' . $e->getMessage());
    
    // Return error response
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

?>

