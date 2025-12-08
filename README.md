# Aveti Learning - Application Form Website

A complete single-page website with video recording functionality for application submissions.

## Features

- Modern, responsive design with scroll-float animations
- Smooth tilt card effects
- Video recording (30-45 seconds) with camera access
- File upload (CV in PDF/DOC format)
- MySQL database integration
- Hostinger shared hosting compatible

## File Structure

```
/project
    ├── index.html          # Main HTML file
    ├── style.css           # Stylesheet with animations
    ├── script.js           # JavaScript for video recording and form handling
    ├── db.php              # Database connection file
    ├── upload.php          # File upload and form processing handler
    ├── database.sql        # SQL schema for creating the database table
    ├── uploads/            # Directory for uploaded files (videos and CVs)
    └── README.md           # This file
```

## Setup Instructions

### 1. Database Setup

1. Log in to your Hostinger cPanel
2. Go to MySQL Databases
3. Create a new database (or use existing)
4. Create a new MySQL user and assign it to the database
5. Note down:
   - Database name
   - Database username
   - Database password
   - Database host (usually `localhost`)

### 2. Import Database Schema

1. Go to phpMyAdmin in your Hostinger cPanel
2. Select your database
3. Click on "Import" tab
4. Choose the `database.sql` file
5. Click "Go" to import

Alternatively, you can copy and paste the SQL from `database.sql` into the SQL tab in phpMyAdmin.

### 3. Configure Database Connection

1. Open `db.php` in a text editor
2. Update the following constants with your database credentials:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'your_database_username');
define('DB_PASS', 'your_database_password');
define('DB_NAME', 'your_database_name');
```

### 4. Upload Files to Hostinger

1. Connect to your Hostinger hosting via FTP or File Manager
2. Upload all files to your public_html directory (or subdirectory):
   - `index.html`
   - `style.css`
   - `script.js`
   - `db.php`
   - `upload.php`
   - `database.sql` (optional, only needed for reference)
3. Make sure the `uploads/` folder is created and has write permissions (755 or 777)

### 5. Set Permissions

1. Set the `uploads/` folder permissions to 755 (or 777 if 755 doesn't work)
2. This allows PHP to write uploaded files to the directory

### 6. Test the Application

1. Visit your website URL
2. Fill out the application form
3. Test the video recording functionality
4. Submit the form
5. Check the `uploads/` folder to verify files are being saved
6. Check the database to verify records are being inserted

## Browser Compatibility

- Modern browsers with MediaRecorder API support
- Chrome, Firefox, Edge (latest versions)
- Safari (iOS 14.3+)
- Mobile browsers with camera access

## Security Notes

- The `uploads/` folder has `.htaccess` to prevent direct access
- All user inputs are sanitized
- File types are validated
- File sizes are checked
- SQL injection protection using prepared statements

## Troubleshooting

### Video Recording Not Working

- Ensure you're using HTTPS (required for camera access)
- Check browser permissions for camera/microphone
- Try a different browser

### File Upload Errors

- Check `uploads/` folder permissions (should be 755 or 777)
- Verify PHP upload limits in php.ini:
  - `upload_max_filesize` (should be at least 10M)
  - `post_max_size` (should be at least 10M)

### Database Connection Errors

- Verify database credentials in `db.php`
- Check if database user has proper permissions
- Ensure database host is correct (usually `localhost`)

## Support

For issues or questions, please contact the development team.

