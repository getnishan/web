# Python Deployment Guide

This guide explains how to deploy the Python version of the upload handler.

## Files

- `upload.py` - Main Flask application (equivalent to `upload.php`)
- `db.py` - Database connection module (equivalent to `db.php`)
- `wsgi.py` - WSGI entry point for production
- `requirements.txt` - Python dependencies

## Installation

### 1. Install Python Dependencies

```bash
pip3 install -r requirements.txt
```

Or using virtual environment (recommended):

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Database

Edit `db.py` and update the database credentials:

```python
DB_HOST = 'localhost'
DB_USER = 'your_database_username'
DB_PASS = 'your_database_password'
DB_NAME = 'your_database_name'
```

### 3. Set Up Uploads Directory

The uploads directory will be created automatically, but you can manually create it:

```bash
mkdir -p uploads
chmod 755 uploads
```

## Running the Application

### Development Mode

```bash
python3 upload.py
```

The application will run on `http://localhost:5000`

### Production Mode with Gunicorn

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 upload:app
```

### Production Mode with uWSGI

```bash
pip install uwsgi
uwsgi --http :5000 --wsgi-file wsgi.py --callable app --processes 4 --threads 2
```

## Nginx Configuration

Example Nginx configuration to proxy requests to the Flask app:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads {
        alias /path/to/your/uploads;
        deny all;
    }
}
```

## Systemd Service (Optional)

Create `/etc/systemd/system/upload-service.service`:

```ini
[Unit]
Description=Aveti Learning Upload Service
After=network.target

[Service]
User=ubuntu
Group=ubuntu
WorkingDirectory=/home/ubuntu/public_html
Environment="PATH=/home/ubuntu/public_html/venv/bin"
ExecStart=/home/ubuntu/public_html/venv/bin/gunicorn -w 4 -b 127.0.0.1:5000 upload:app

[Install]
WantedBy=multi-user.target
```

Then enable and start the service:

```bash
sudo systemctl enable upload-service
sudo systemctl start upload-service
sudo systemctl status upload-service
```

## API Endpoints

- `POST /upload.php` or `POST /upload` - Handle file uploads and form submissions
- `GET /health` - Health check endpoint

## Differences from PHP Version

1. **File Upload**: Uses Flask's `request.files` instead of `$_FILES`
2. **Database**: Uses `mysql-connector-python` instead of `mysqli`
3. **Error Handling**: Python exceptions instead of PHP exceptions
4. **Response**: JSON responses using Flask's `jsonify()`

## Security Notes

- All user inputs are sanitized
- File types are validated
- File sizes are checked
- SQL injection protection using parameterized queries
- The uploads directory should not be directly accessible via web server

## Troubleshooting

### Database Connection Errors

- Verify database credentials in `db.py`
- Ensure MySQL server is running
- Check if the database user has proper permissions

### File Upload Errors

- Check `uploads/` directory permissions (should be 755)
- Verify file size limits in Flask configuration
- Check disk space availability

### Module Not Found Errors

- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Activate virtual environment if using one

