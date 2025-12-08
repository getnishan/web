<?php
/**
 * Admin Panel - View All Submissions
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

// Get search and filter parameters
$search = $_GET['search'] ?? '';
$filter_name = $_GET['filter_name'] ?? '';
$filter_email = $_GET['filter_email'] ?? '';
$filter_phone = $_GET['filter_phone'] ?? '';
$filter_location = $_GET['filter_location'] ?? '';
$filter_date = $_GET['filter_date'] ?? '';

// Build query with filters
$where_conditions = [];
$params = [];
$types = '';

if ($search) {
    $where_conditions[] = "(name LIKE ? OR email LIKE ? OR phone LIKE ? OR location LIKE ?)";
    $search_param = "%$search%";
    $params[] = $search_param;
    $params[] = $search_param;
    $params[] = $search_param;
    $params[] = $search_param;
    $types .= 'ssss';
}

if ($filter_name) {
    $where_conditions[] = "name LIKE ?";
    $params[] = "%$filter_name%";
    $types .= 's';
}

if ($filter_email) {
    $where_conditions[] = "email LIKE ?";
    $params[] = "%$filter_email%";
    $types .= 's';
}

if ($filter_phone) {
    $where_conditions[] = "phone LIKE ?";
    $params[] = "%$filter_phone%";
    $types .= 's';
}

if ($filter_location) {
    $where_conditions[] = "location LIKE ?";
    $params[] = "%$filter_location%";
    $types .= 's';
}

if ($filter_date) {
    $where_conditions[] = "DATE(uploaded_at) = ?";
    $params[] = $filter_date;
    $types .= 's';
}

$where_clause = !empty($where_conditions) ? 'WHERE ' . implode(' AND ', $where_conditions) : '';

// Get total count
$count_sql = "SELECT COUNT(*) as total FROM applications $where_clause";
$count_stmt = $conn->prepare($count_sql);
if ($params) {
    $count_stmt->bind_param($types, ...$params);
}
$count_stmt->execute();
$total_count = $count_stmt->get_result()->fetch_assoc()['total'];
$count_stmt->close();

// Get submissions
$sql = "SELECT * FROM applications $where_clause ORDER BY uploaded_at DESC";
$stmt = $conn->prepare($sql);
if ($params) {
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();
$result = $stmt->get_result();
$submissions = $result->fetch_all(MYSQLI_ASSOC);
$stmt->close();

close_db_connection($conn);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - Aveti Learning</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .video-modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            align-items: center;
            justify-content: center;
        }
        .video-modal-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        .video-modal video {
            width: 100%;
            height: auto;
            max-height: 80vh;
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex justify-between items-center">
                <div class="flex items-center space-x-3">
                    <div class="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                        A
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold text-gray-800">Admin Panel</h1>
                        <p class="text-sm text-gray-500">Aveti Learning Submissions</p>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="text-sm text-gray-600">Total: <strong><?php echo $total_count; ?></strong> submissions</span>
                    <a href="export_csv.php" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                        Export CSV
                    </a>
                    <a href="export_pdf.php" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                        Export PDF
                    </a>
                    <a href="logout.php" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                        Logout
                    </a>
                </div>
            </div>
        </div>
    </header>

    <!-- Filters -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="bg-white rounded-lg shadow p-6 mb-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Search & Filter</h2>
            <form method="GET" action="" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Quick Search</label>
                    <input 
                        type="text" 
                        name="search" 
                        value="<?php echo htmlspecialchars($search); ?>"
                        placeholder="Search all fields..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input 
                        type="text" 
                        name="filter_name" 
                        value="<?php echo htmlspecialchars($filter_name); ?>"
                        placeholder="Filter by name..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                        type="text" 
                        name="filter_email" 
                        value="<?php echo htmlspecialchars($filter_email); ?>"
                        placeholder="Filter by email..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input 
                        type="text" 
                        name="filter_phone" 
                        value="<?php echo htmlspecialchars($filter_phone); ?>"
                        placeholder="Filter by phone..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input 
                        type="text" 
                        name="filter_location" 
                        value="<?php echo htmlspecialchars($filter_location); ?>"
                        placeholder="Filter by location..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input 
                        type="date" 
                        name="filter_date" 
                        value="<?php echo htmlspecialchars($filter_date); ?>"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                </div>
                <div class="md:col-span-3 lg:col-span-6 flex space-x-2">
                    <button 
                        type="submit"
                        class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition"
                    >
                        Apply Filters
                    </button>
                    <a 
                        href="admin.php"
                        class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-medium transition"
                    >
                        Clear
                    </a>
                </div>
            </form>
        </div>

        <!-- Submissions Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualification</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Graduation Year</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <?php if (empty($submissions)): ?>
                            <tr>
                                <td colspan="10" class="px-6 py-8 text-center text-gray-500">
                                    No submissions found.
                                </td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($submissions as $submission): ?>
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"><?php echo htmlspecialchars($submission['id']); ?></td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"><?php echo htmlspecialchars($submission['name']); ?></td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><?php echo htmlspecialchars($submission['email'] ?? 'N/A'); ?></td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><?php echo htmlspecialchars($submission['phone']); ?></td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><?php echo htmlspecialchars($submission['age']); ?></td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><?php echo htmlspecialchars($submission['qualification']); ?></td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><?php echo htmlspecialchars($submission['graduation_year']); ?></td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><?php echo htmlspecialchars($submission['location']); ?></td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                                        <?php if ($submission['video_filename']): ?>
                                            <button 
                                                onclick="playVideo('uploads/videos/<?php echo htmlspecialchars($submission['video_filename']); ?>')"
                                                class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition"
                                            >
                                                Play Video
                                            </button>
                                        <?php else: ?>
                                            <span class="text-gray-400">No video</span>
                                        <?php endif; ?>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <?php echo date('M d, Y H:i', strtotime($submission['uploaded_at'])); ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Video Modal -->
    <div id="videoModal" class="video-modal">
        <div class="video-modal-content">
            <button 
                onclick="closeVideo()"
                class="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl"
            >
                ×
            </button>
            <video id="videoPlayer" controls class="rounded-lg">
                Your browser does not support the video tag.
            </video>
        </div>
    </div>

    <script>
        function playVideo(videoPath) {
            const modal = document.getElementById('videoModal');
            const videoPlayer = document.getElementById('videoPlayer');
            videoPlayer.src = videoPath;
            modal.style.display = 'flex';
            videoPlayer.play();
        }

        function closeVideo() {
            const modal = document.getElementById('videoModal');
            const videoPlayer = document.getElementById('videoPlayer');
            videoPlayer.pause();
            videoPlayer.src = '';
            modal.style.display = 'none';
        }

        // Close modal when clicking outside
        document.getElementById('videoModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeVideo();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeVideo();
            }
        });
    </script>
</body>
</html>

