# Admin Panel Documentation

Complete admin panel for managing Aveti Learning application submissions.

## Files

1. **admin_login.php** - Password-protected login page
2. **admin.php** - Main admin dashboard with submissions table
3. **export_csv.php** - Export all submissions to CSV
4. **export_pdf.php** - Export all submissions to PDF (printable)
5. **logout.php** - End admin session

## Setup Instructions

### 1. Change Admin Password

**IMPORTANT:** Change the default password in `admin_login.php`:

```php
// Line 18 in admin_login.php
$admin_password = 'your_secure_password_here'; // Change this!
```

### 2. Database Configuration

Ensure `db.php` has correct database credentials:
- DB_HOST
- DB_USER
- DB_PASS
- DB_NAME

### 3. File Permissions

Make sure the `uploads/` directory is accessible for video playback:
```bash
chmod 755 uploads/
```

## Features

### Admin Login (admin_login.php)
- Password-protected access
- Session-based authentication
- Clean, modern UI with Tailwind CSS
- Auto-redirect if already logged in

### Admin Dashboard (admin.php)
- **View All Submissions**: Complete table with all application data
- **Video Playback**: Click "Play Video" to view submitted videos in a modal
- **Search & Filter**:
  - Quick search across all fields
  - Filter by Name
  - Filter by Email
  - Filter by Phone
  - Filter by Location
  - Filter by Date
- **Export Options**:
  - Export to CSV
  - Export to PDF
- **Responsive Design**: Works on desktop and mobile devices

### Export CSV (export_csv.php)
- Downloads all submissions as CSV file
- UTF-8 encoded (Excel compatible)
- Includes all fields
- Timestamped filename

### Export PDF (export_pdf.php)
- Printable PDF format
- Professional layout
- Includes summary statistics
- Print-friendly styling

### Logout (logout.php)
- Properly destroys session
- Clears all session data
- Redirects to login page

## Usage

### Accessing Admin Panel

1. Navigate to `admin_login.php` in your browser
2. Enter the admin password
3. You'll be redirected to `admin.php`

### Viewing Submissions

- All submissions are displayed in a table
- Click "Play Video" to watch submitted videos
- Use filters to find specific submissions

### Exporting Data

1. Click "Export CSV" to download all data as CSV
2. Click "Export PDF" to view/print as PDF
3. PDF can be saved using browser's print function

### Logging Out

- Click "Logout" button in the header
- Session will be destroyed
- You'll be redirected to login page

## Security Notes

⚠️ **IMPORTANT SECURITY RECOMMENDATIONS:**

1. **Change Default Password**: The default password is `admin123` - CHANGE THIS IMMEDIATELY!

2. **Use Strong Password**: Use a strong, unique password for the admin panel

3. **HTTPS**: Always use HTTPS in production to protect login credentials

4. **Session Security**: Consider adding:
   - Session timeout
   - IP address validation
   - Failed login attempt tracking

5. **File Protection**: Consider protecting admin files with `.htaccess`:
   ```apache
   # Protect admin files
   <Files "admin*.php">
       Order Deny,Allow
       Deny from all
       Allow from YOUR_IP_ADDRESS
   </Files>
   ```

6. **Database Security**: Ensure database credentials are secure and not exposed

## Customization

### Change Admin Password
Edit `admin_login.php`, line 18:
```php
$admin_password = 'your_new_password';
```

### Styling
All pages use Tailwind CSS via CDN. You can customize colors and styles in the HTML.

### Table Columns
Edit the table headers and data in `admin.php` to add/remove columns.

## Troubleshooting

### Can't Login
- Check that password matches in `admin_login.php`
- Clear browser cookies
- Check PHP session configuration

### Videos Not Playing
- Verify `uploads/` directory exists and is accessible
- Check file permissions (should be 755)
- Verify video files are uploaded correctly

### Export Not Working
- Check PHP write permissions
- Verify database connection
- Check for PHP errors in logs

### Session Issues
- Check PHP session configuration
- Verify session directory is writable
- Clear browser cookies and try again

## Support

For issues or questions, check:
- PHP error logs
- Database connection settings
- File permissions
- Session configuration

