"""
Database Connection File
Python equivalent of db.php
"""

import mysql.connector
from mysql.connector import Error
import logging

# Database configuration
# Update these values according to your database settings
DB_HOST = 'localhost'
DB_USER = 'your_database_username'
DB_PASS = 'your_database_password'
DB_NAME = 'your_database_name'

# Configure logging
logging.basicConfig(level=logging.ERROR)


def get_db_connection():
    """
    Create database connection
    Returns: mysql.connector.connection.MySQLConnection or None on failure
    """
    try:
        # Create connection using mysql-connector-python
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASS,
            database=DB_NAME,
            charset='utf8mb4',
            collation='utf8mb4_unicode_ci'
        )
        
        if conn.is_connected():
            return conn
        else:
            logging.error("Database connection failed: Unable to establish connection")
            return None
            
    except Error as e:
        logging.error(f"Database connection failed: {e}")
        return None


def close_db_connection(conn):
    """
    Close database connection
    Args:
        conn: Database connection object
    """
    if conn and conn.is_connected():
        conn.close()

