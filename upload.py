"""
File Upload Handler
Python equivalent of upload.php
Handles form submission, file uploads, and database storage
"""

import os
import json
import logging
import time
import uuid
import re
from datetime import datetime
from pathlib import Path
from werkzeug.utils import secure_filename
from werkzeug.exceptions import RequestEntityTooLarge
from flask import Flask, request, jsonify
from db import get_db_connection, close_db_connection

# Configure logging
logging.basicConfig(
    level=logging.ERROR,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
ALLOWED_VIDEO_EXTENSIONS = {'webm', 'mp4', 'mov', 'avi'}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB

# Ensure uploads directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def ensure_uploads_directory():
    """
    Create uploads directory if it doesn't exist
    Returns: Path to uploads directory
    """
    upload_dir = Path(UPLOAD_FOLDER)
    upload_dir.mkdir(parents=True, exist_ok=True)
    return str(upload_dir)


def sanitize_input(data):
    """
    Sanitize input data
    Args:
        data: Input string to sanitize
    Returns: Sanitized string
    """
    if data is None:
        return ''
    data = str(data).strip()
    # Remove slashes and escape HTML
    data = data.replace('\\', '')
    # Basic HTML escaping
    data = data.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;').replace("'", '&#x27;')
    return data


def validate_email(email):
    """
    Validate email address
    Args:
        email: Email string to validate
    Returns: True if valid, False otherwise
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def allowed_file(filename):
    """
    Check if file extension is allowed
    Args:
        filename: Name of the file
    Returns: True if allowed, False otherwise
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_VIDEO_EXTENSIONS


@app.route('/upload.php', methods=['POST'])
@app.route('/upload', methods=['POST'])
def upload_file():
    """
    Main upload handler
    Handles form submission, file uploads, and database storage
    """
    try:
        # Check if request is POST
        if request.method != 'POST':
            raise ValueError('Invalid request method.')
        
        # Get database connection
        conn = get_db_connection()
        if not conn:
            raise ValueError('Database connection failed.')
        
        try:
            # Sanitize and validate form inputs
            name = sanitize_input(request.form.get('name', ''))
            email = sanitize_input(request.form.get('email', ''))
            phone = sanitize_input(request.form.get('phone', ''))
            age = int(request.form.get('age', 0) or 0)
            qualification = sanitize_input(request.form.get('qualification', ''))
            graduation_year = int(request.form.get('graduation_year', 0) or 0)
            location = sanitize_input(request.form.get('location', ''))
            
            # Validate required fields (email is optional)
            if not all([name, phone, age, qualification, graduation_year, location]):
                raise ValueError('All required fields must be filled.')
            
            # Validate email only if provided
            if email and not validate_email(email):
                raise ValueError('Invalid email address.')
            
            # Validate age
            if age < 18 or age > 100:
                raise ValueError('Age must be between 18 and 100.')
            
            # Ensure uploads directory exists
            upload_dir = ensure_uploads_directory()
            
            # Handle video upload
            if 'video' not in request.files:
                raise ValueError('Video file is required.')
            
            video_file = request.files['video']
            
            if video_file.filename == '':
                raise ValueError('No video file selected.')
            
            if not allowed_file(video_file.filename):
                raise ValueError('Invalid video file format.')
            
            # Generate unique filename
            file_extension = video_file.filename.rsplit('.', 1)[1].lower()
            video_filename = f'video_{int(time.time())}_{uuid.uuid4().hex}.{file_extension}'
            video_path = os.path.join(upload_dir, video_filename)
            
            # Save uploaded file
            video_file.save(video_path)
            
            # Check file size
            file_size = os.path.getsize(video_path)
            if file_size > MAX_FILE_SIZE:
                os.remove(video_path)
                raise ValueError('File size exceeds maximum allowed size.')
            
            # Prepare SQL statement (email can be NULL)
            sql = """INSERT INTO applications (
                name, email, phone, age, qualification, graduation_year, 
                location, video_filename, uploaded_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())"""
            
            cursor = conn.cursor()
            
            # Use None if email is empty
            email_value = email if email else None
            
            # Execute statement with parameters
            cursor.execute(sql, (
                name, email_value, phone, age, qualification, graduation_year,
                location, video_filename
            ))
            
            # Commit transaction
            conn.commit()
            
            # Close cursor
            cursor.close()
            
            # Return success response
            return jsonify({
                'success': True,
                'message': 'Application submitted successfully!'
            }), 200
            
        except ValueError as e:
            # Rollback on error
            conn.rollback()
            raise e
        finally:
            # Close database connection
            close_db_connection(conn)
            
    except ValueError as e:
        # Log error
        logging.error(f'Upload error: {str(e)}')
        
        # Return error response
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400
        
    except RequestEntityTooLarge:
        logging.error('Upload error: File too large')
        return jsonify({
            'success': False,
            'message': 'File size exceeds maximum allowed size.'
        }), 400
        
    except Exception as e:
        # Log error
        logging.error(f'Upload error: {str(e)}')
        
        # Return error response
        return jsonify({
            'success': False,
            'message': 'An unexpected error occurred. Please try again.'
        }), 500


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok'}), 200


if __name__ == '__main__':
    # For development
    app.run(debug=False, host='0.0.0.0', port=5000)

