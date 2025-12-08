#!/bin/bash

# Nginx Setup Script for Ubuntu
# This script automates the installation and basic configuration of Nginx

set -e  # Exit on error

echo "🚀 Starting Nginx setup..."

# Step 1: Update system packages
echo "📦 Updating system packages..."
sudo apt update
sudo apt upgrade -y

# Step 2: Install Nginx
echo "📦 Installing Nginx..."
sudo apt install nginx -y

# Step 3: Start and enable Nginx
echo "🔄 Starting Nginx service..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Step 4: Configure firewall
echo "🔥 Configuring firewall..."
if command -v ufw &> /dev/null; then
    sudo ufw allow 'Nginx Full'
    echo "✅ Firewall configured"
else
    echo "⚠️  UFW not found, skipping firewall configuration"
fi

# Step 5: Check Nginx status
echo "📊 Checking Nginx status..."
if sudo systemctl is-active --quiet nginx; then
    echo "✅ Nginx is running"
else
    echo "❌ Nginx failed to start"
    exit 1
fi

# Step 6: Create Nginx configuration
echo "📝 Creating Nginx configuration..."
CONFIG_FILE="/etc/nginx/sites-available/aveti-learning"
NGINX_CONFIG=$(cat <<'EOF'
server {
    listen 80;
    server_name 52.140.68.54;

    # Maximum upload size
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
EOF
)

# Write configuration file
echo "$NGINX_CONFIG" | sudo tee "$CONFIG_FILE" > /dev/null

# Step 7: Enable the site
echo "🔗 Enabling site..."
sudo ln -sf "$CONFIG_FILE" /etc/nginx/sites-enabled/

# Step 8: Remove default site (optional)
read -p "Remove default Nginx site? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo rm -f /etc/nginx/sites-enabled/default
    echo "✅ Default site removed"
fi

# Step 9: Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
if sudo nginx -t; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration test failed"
    exit 1
fi

# Step 10: Reload Nginx
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

# Step 11: Display status
echo ""
echo "📊 Nginx Status:"
sudo systemctl status nginx --no-pager -l

echo ""
echo "✅ Nginx setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Make sure your Flask app is running on port 5000"
echo "2. Test your application: curl http://localhost/health"
echo "3. (Optional) Set up SSL with: sudo certbot --nginx -d your-domain.com"
echo ""
echo "📚 For more details, see NGINX_SETUP.md"

