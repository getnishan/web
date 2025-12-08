# Nginx Quick Reference

## Essential Commands

### Installation
```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Configuration
```bash
# Edit configuration
sudo nano /etc/nginx/sites-available/aveti-learning

# Test configuration
sudo nginx -t

# Reload Nginx (no downtime)
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx
```

### Service Management
```bash
# Start
sudo systemctl start nginx

# Stop
sudo systemctl stop nginx

# Status
sudo systemctl status nginx

# Enable on boot
sudo systemctl enable nginx
```

### Logs
```bash
# Error logs
sudo tail -f /var/log/nginx/error.log

# Access logs
sudo tail -f /var/log/nginx/access.log

# Application-specific logs
sudo tail -f /var/log/nginx/aveti-learning-error.log
```

### Firewall
```bash
sudo ufw allow 'Nginx Full'
sudo ufw status
```

### SSL Setup (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
sudo certbot renew --dry-run
```

## Quick Setup (Automated)

Run the setup script:
```bash
./setup-nginx.sh
```

Or manually follow the steps in `NGINX_SETUP.md`

