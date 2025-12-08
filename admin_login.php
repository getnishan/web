<?php
/**
 * Admin Login Page
 * Password-protected admin panel access
 */

session_start();

// If already logged in, redirect to admin panel
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header('Location: admin.php');
    exit;
}

$error = '';

// Handle login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $password = $_POST['password'] ?? '';
    
    // Default password - CHANGE THIS IN PRODUCTION
    $admin_password = 'admin123'; // TODO: Change this to a secure password
    
    if ($password === $admin_password) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_login_time'] = time();
        header('Location: admin.php');
        exit;
    } else {
        $error = 'Invalid password. Please try again.';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - Aveti Learning</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-green-50 to-green-100 min-h-screen flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div class="text-center mb-8">
            <div class="inline-block bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                A
            </div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">Admin Login</h1>
            <p class="text-gray-600">Enter your password to access the admin panel</p>
        </div>

        <?php if ($error): ?>
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="" class="space-y-6">
            <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                    Password
                </label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    placeholder="Enter admin password"
                    autofocus
                >
            </div>

            <button 
                type="submit"
                class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            >
                Login
            </button>
        </form>

        <div class="mt-6 text-center text-sm text-gray-500">
            <p>Aveti Learning Admin Panel</p>
        </div>
    </div>
</body>
</html>

