# Nginx Setup Guide for Ubuntu

Complete step-by-step guide to install and configure Nginx on Ubuntu for your Flask application.

## Step 1: Update System Packages

```bash
sudo apt update
sudo apt upgrade -y
```

## Step 2: Install Nginx

```bash
sudo apt install nginx -y
```

## Step 3: Check Nginx Status

```bash
sudo systemctl status nginx
```

You should see that Nginx is active and running. If not, start it:

```bash
sudo systemctl start nginx
sudo systemctl enable nginx  # Enable to start on boot
```

## Step 4: Configure Firewall

Allow HTTP and HTTPS traffic through the firewall:

```bash
sudo ufw allow 'Nginx Full'
# Or individually:
sudo ufw allow 'Nginx HTTP'
sudo ufw allow 'Nginx HTTPS'
```

Check firewall status:
```bash
sudo ufw status
```

## Step 5: Test Nginx

Open your browser and visit:
- `http://your-server-ip` or
- `http://52.140.68.54`

You should see the default Nginx welcome page.

## Step 6: Create Nginx Configuration for Flask App

Create a new configuration file for your application:

```bash
sudo nano /etc/nginx/sites-available/aveti-learning
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name 52.140.68.54 your-domain.com;  # Replace with your domain if you have one

    # Maximum upload size (adjust as needed)
    client_max_body_size 100M;

    # Root directory for static files
    root /home/ubuntu/public_html;
    index index.html;

    # Serve static files directly
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Serve static assets
    location /assets/ {
        alias /home/ubuntu/public_html/assets/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Proxy Flask application
    location /upload {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $server_name;
        
        # Timeouts for large file uploads
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    # Also handle /upload.php for compatibility
    location /upload.php {
        proxy_pass http://127.0.0.1:5000/upload;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $server_name;
        
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    # Block direct access to uploads directory
    location /uploads {
        deny all;
        return 403;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://127.0.0.1:5000/health;
        proxy_set_header Host $host;
    }

    # Logging
    access_log /var/log/nginx/aveti-learning-access.log;
    error_log /var/log/nginx/aveti-learning-error.log;
}
```

Save and exit (Ctrl+X, then Y, then Enter).

## Step 7: Enable the Site

Create a symbolic link to enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/aveti-learning /etc/nginx/sites-enabled/
```

## Step 8: Test Nginx Configuration

Always test your configuration before reloading:

```bash
sudo nginx -t
```

You should see:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

## Step 9: Remove Default Site (Optional)

If you want to remove the default Nginx site:

```bash
sudo rm /etc/nginx/sites-enabled/default
```

## Step 10: Reload Nginx

```bash
sudo systemctl reload nginx
```

Or restart if reload doesn't work:

```bash
sudo systemctl restart nginx
```

## Step 11: Verify Configuration

Check that Nginx is running:

```bash
sudo systemctl status nginx
```

## Step 12: Set Up SSL with Let's Encrypt (Recommended)

### Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Obtain SSL Certificate

```bash
sudo certbot --nginx -d your-domain.com
```

If you don't have a domain, you can skip SSL for now, but it's highly recommended for production.

### Auto-renewal

Certbot sets up auto-renewal automatically. Test it:

```bash
sudo certbot renew --dry-run
```

## Step 13: Common Nginx Commands

```bash
# Start Nginx
sudo systemctl start nginx

# Stop Nginx
sudo systemctl stop nginx

# Restart Nginx
sudo systemctl restart nginx

# Reload Nginx (without downtime)
sudo systemctl reload nginx

# Check status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log
```

## Step 14: Ensure Flask App is Running

Make sure your Flask application is running on port 5000. You can use:

### Option A: Run directly (for testing)
```bash
cd /home/ubuntu/public_html
python3 upload.py
```

### Option B: Use Gunicorn (recommended for production)
```bash
pip3 install gunicorn
cd /home/ubuntu/public_html
gunicorn -w 4 -b 127.0.0.1:5000 upload:app
```

### Option C: Create a systemd service (best for production)

Create `/etc/systemd/system/aveti-upload.service`:

```bash
sudo nano /etc/systemd/system/aveti-upload.service
```

Add:

```ini
[Unit]
Description=Aveti Learning Upload Service
After=network.target

[Service]
User=ubuntu
Group=ubuntu
WorkingDirectory=/home/ubuntu/public_html
Environment="PATH=/usr/bin:/usr/local/bin"
ExecStart=/usr/local/bin/gunicorn -w 4 -b 127.0.0.1:5000 upload:app
Restart=always

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable aveti-upload
sudo systemctl start aveti-upload
sudo systemctl status aveti-upload
```

## Troubleshooting

### Check Nginx Error Logs
```bash
sudo tail -50 /var/log/nginx/error.log
```

### Check Flask App Logs
If using systemd service:
```bash
sudo journalctl -u aveti-upload -f
```

### Test Flask App Directly
```bash
curl http://127.0.0.1:5000/health
```

### Check if Port 5000 is Listening
```bash
sudo netstat -tlnp | grep 5000
# or
sudo ss -tlnp | grep 5000
```

### Verify File Permissions
```bash
sudo chown -R ubuntu:ubuntu /home/ubuntu/public_html
sudo chmod -R 755 /home/ubuntu/public_html
sudo chmod -R 755 /home/ubuntu/public_html/uploads
```

## Security Recommendations

1. **Keep Nginx updated:**
   ```bash
   sudo apt update && sudo apt upgrade nginx
   ```

2. **Set up fail2ban:**
   ```bash
   sudo apt install fail2ban -y
   ```

3. **Regular backups:**
   - Backup your configuration files
   - Backup your database
   - Backup uploaded files

4. **Monitor logs:**
   ```bash
   sudo tail -f /var/log/nginx/access.log
   ```

## Next Steps

1. ✅ Nginx is installed and running
2. ✅ Configuration is set up
3. ✅ Flask app should be accessible via Nginx
4. ⬜ Set up SSL certificate (if you have a domain)
5. ⬜ Configure systemd service for Flask app
6. ⬜ Set up monitoring and logging

Your application should now be accessible at:
- `http://52.140.68.54` (or your domain)
- `http://52.140.68.54/upload` (Flask endpoint)

