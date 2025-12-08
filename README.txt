================================================================================
AVETI LEARNING - APPLICATION FORM SYSTEM
VPS Setup Instructions
================================================================================

REQUIRED FILES:
---------------
1. index.html          - Main application form page
2. style.css           - Stylesheet
3. script.js           - JavaScript for form handling and video recording
4. db.php              - Database connection file
5. upload.php          - File upload and form processing handler
6. admin_login.php     - Admin panel login page
7. admin.php           - Admin dashboard
8. export_csv.php      - CSV export functionality
9. export_pdf.php      - PDF export functionality
10. logout.php         - Admin logout handler
11. database.sql       - Database schema
12. uploads/videos/    - Directory for uploaded videos

================================================================================
STEP 1: SERVER REQUIREMENTS
================================================================================

- PHP 7.4 or higher
- MySQL/MariaDB database
- Apache/Nginx web server
- mod_rewrite enabled (for Apache)
- PHP extensions: mysqli, gd, mbstring

================================================================================
STEP 2: UPLOAD FILES TO VPS
================================================================================

1. Connect to your VPS via SSH:
   ssh root@your-server-ip

2. Navigate to web root directory:
   cd /var/www/html
   (or your web root directory)

3. Upload all files using SCP, FTP, or Git:
   - index.html
   - style.css
   - script.js
   - db.php
   - upload.php
   - admin_login.php
   - admin.php
   - export_csv.php
   - export_pdf.php
   - logout.php
   - database.sql

4. Create uploads directory structure:
   mkdir -p uploads/videos
   chmod 755 uploads
   chmod 755 uploads/videos

================================================================================
STEP 3: DATABASE SETUP
================================================================================

1. Log in to MySQL:
   mysql -u root -p

2. Create database:
   CREATE DATABASE aveti_learning CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

3. Create database user (optional but recommended):
   CREATE USER 'aveti_user'@'localhost' IDENTIFIED BY 'your_secure_password';
   GRANT ALL PRIVILEGES ON aveti_learning.* TO 'aveti_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;

4. Import database schema:
   mysql -u aveti_user -p aveti_learning < database.sql
   (or use phpMyAdmin to import database.sql)

================================================================================
STEP 4: CONFIGURE DATABASE CONNECTION
================================================================================

Edit db.php and update these values:

define('DB_HOST', 'localhost');
define('DB_USER', 'aveti_user');        // Your database username
define('DB_PASS', 'your_secure_password'); // Your database password
define('DB_NAME', 'aveti_learning');     // Your database name

================================================================================
STEP 5: SET FILE PERMISSIONS
================================================================================

Set proper permissions:

chmod 644 *.php *.html *.css *.js
chmod 755 uploads
chmod 755 uploads/videos
chmod 644 database.sql

Set ownership (adjust user/group as needed):
chown -R www-data:www-data /var/www/html
(For Apache, user is usually www-data or apache)

================================================================================
STEP 6: CONFIGURE ADMIN PASSWORD
================================================================================

Edit admin_login.php and change the default password:

Find this line (around line 18):
$admin_password = 'admin123';

Change to:
$admin_password = 'your_secure_admin_password';

IMPORTANT: Use a strong password!

================================================================================
STEP 7: APACHE CONFIGURATION (if using Apache)
================================================================================

1. Enable mod_rewrite:
   a2enmod rewrite
   systemctl restart apache2

2. Create/Edit .htaccess in web root (optional):
   <IfModule mod_rewrite.c>
   RewriteEngine On
   RewriteBase /
   </IfModule>

3. Set PHP upload limits in php.ini:
   upload_max_filesize = 100M
   post_max_size = 100M
   max_execution_time = 300
   memory_limit = 256M

4. Restart Apache:
   systemctl restart apache2

================================================================================
STEP 8: NGINX CONFIGURATION (if using Nginx)
================================================================================

1. Create server block configuration:
   /etc/nginx/sites-available/aveti-learning

2. Add configuration:
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/html;
       index index.html index.php;

       location / {
           try_files $uri $uri/ =404;
       }

       location ~ \.php$ {
           include snippets/fastcgi-php.conf;
           fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
       }

       location /uploads {
           deny all;
       }
   }

3. Enable site:
   ln -s /etc/nginx/sites-available/aveti-learning /etc/nginx/sites-enabled/
   nginx -t
   systemctl reload nginx

4. Set PHP upload limits in php.ini:
   upload_max_filesize = 100M
   post_max_size = 100M

================================================================================
STEP 9: PHP-FPM CONFIGURATION (if using PHP-FPM)
================================================================================

Edit PHP-FPM pool configuration:
/etc/php/7.4/fpm/pool.d/www.conf

Set:
upload_max_filesize = 100M
post_max_size = 100M
max_execution_time = 300

Restart PHP-FPM:
systemctl restart php7.4-fpm

================================================================================
STEP 10: FIREWALL CONFIGURATION
================================================================================

Allow HTTP and HTTPS:
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

================================================================================
STEP 11: SSL CERTIFICATE (Recommended)
================================================================================

Install Certbot:
apt-get update
apt-get install certbot python3-certbot-nginx  # For Nginx
# OR
apt-get install certbot python3-certbot-apache  # For Apache

Get certificate:
certbot --nginx -d your-domain.com
# OR
certbot --apache -d your-domain.com

Auto-renewal is set up automatically.

================================================================================
STEP 12: TEST THE APPLICATION
================================================================================

1. Test main form:
   - Visit: http://your-domain.com/index.html
   - Fill out the form
   - Record a video
   - Submit the form

2. Test admin panel:
   - Visit: http://your-domain.com/admin_login.php
   - Login with admin password
   - View submissions
   - Test video playback
   - Test search/filter
   - Test CSV export
   - Test PDF export

3. Check uploads directory:
   ls -la uploads/videos/
   (Should show uploaded video files)

================================================================================
STEP 13: SECURITY RECOMMENDATIONS
================================================================================

1. Change admin password immediately
2. Use HTTPS (SSL certificate)
3. Restrict admin panel access (optional):
   - Use .htaccess to restrict by IP
   - Or use firewall rules

4. Regular backups:
   - Database: mysqldump aveti_learning > backup.sql
   - Files: tar -czf backup.tar.gz /var/www/html

5. Keep system updated:
   apt-get update && apt-get upgrade

6. Monitor logs:
   tail -f /var/log/apache2/error.log
   # OR
   tail -f /var/log/nginx/error.log

================================================================================
TROUBLESHOOTING
================================================================================

Problem: Can't upload videos
Solution:
- Check uploads/videos/ directory permissions (755)
- Check PHP upload_max_filesize and post_max_size
- Check disk space: df -h

Problem: Database connection error
Solution:
- Verify credentials in db.php
- Check MySQL service: systemctl status mysql
- Test connection: mysql -u user -p database

Problem: Admin login not working
Solution:
- Check password in admin_login.php
- Clear browser cookies
- Check PHP session configuration

Problem: Videos not playing
Solution:
- Verify file path: uploads/videos/
- Check file permissions
- Check web server configuration

Problem: 500 Internal Server Error
Solution:
- Check PHP error logs
- Verify file permissions
- Check .htaccess syntax (if using Apache)

================================================================================
FILE STRUCTURE
================================================================================

/var/www/html/
├── index.html
├── style.css
├── script.js
├── db.php
├── upload.php
├── admin_login.php
├── admin.php
├── export_csv.php
├── export_pdf.php
├── logout.php
├── database.sql
└── uploads/
    └── videos/
        └── .htaccess

================================================================================
SUPPORT
================================================================================

For issues:
1. Check PHP error logs
2. Check web server error logs
3. Verify database connection
4. Check file permissions
5. Review configuration files

================================================================================
END OF SETUP INSTRUCTIONS
================================================================================

