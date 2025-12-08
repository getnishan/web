"""
WSGI entry point for production deployment
Use with Gunicorn, uWSGI, or other WSGI servers
"""

from upload import app

if __name__ == "__main__":
    app.run()

