#!/bin/bash

# Deployment script for Aveti Learning Application
# Deploys all necessary files to the Ubuntu server

SERVER="ubuntu@52.140.68.54"
REMOTE_DIR="${1:-/home/ubuntu/public_html}"  # Default to public_html, or use first argument

echo "🚀 Starting deployment to $SERVER..."
echo "📁 Target directory: $REMOTE_DIR"

# Check if rsync is available
if ! command -v rsync &> /dev/null; then
    echo "❌ rsync is not installed. Please install it first."
    exit 1
fi

# Create remote directory if it doesn't exist
echo "📂 Creating remote directory if needed..."
ssh $SERVER "mkdir -p $REMOTE_DIR"

# Deploy built frontend files from dist/
echo "📦 Deploying frontend files..."
rsync -avz --delete \
    dist/ \
    $SERVER:$REMOTE_DIR/

# Deploy PHP files
echo "📦 Deploying PHP files..."
rsync -avz \
    db.php \
    upload.php \
    $SERVER:$REMOTE_DIR/

# Deploy database.sql
echo "📦 Deploying database.sql..."
rsync -avz \
    database.sql \
    $SERVER:$REMOTE_DIR/

# Create uploads directory and deploy .htaccess
echo "📦 Setting up uploads directory..."
ssh $SERVER "mkdir -p $REMOTE_DIR/uploads"

# Deploy .htaccess file
if [ -f "uploads/.htaccess" ]; then
    rsync -avz \
        uploads/.htaccess \
        $SERVER:$REMOTE_DIR/uploads/
fi

# Set proper permissions
echo "🔐 Setting file permissions..."
ssh $SERVER "chmod -R 755 $REMOTE_DIR && \
             find $REMOTE_DIR -type f -exec chmod 644 {} \; && \
             chmod 755 $REMOTE_DIR/uploads && \
             chmod 644 $REMOTE_DIR/uploads/.htaccess 2>/dev/null || true"

echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. SSH into the server: ssh $SERVER"
echo "2. Update database credentials in $REMOTE_DIR/db.php"
echo "3. Import the database schema: mysql -u your_user -p your_database < $REMOTE_DIR/database.sql"
echo "4. Verify the uploads directory: ls -la $REMOTE_DIR/uploads"
echo ""
echo "💡 If you need to deploy to a different directory, run:"
echo "   ./deploy.sh /path/to/your/web/directory"

