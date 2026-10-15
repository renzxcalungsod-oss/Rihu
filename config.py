"""
Configuration Module for Computer Repair Shop Management System
Manages environment-based settings for Development, Testing, and Production.
"""

import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'techpulse-repair-shop-secret-key-2026-sia1')
    WTF_CSRF_ENABLED = True
    
    # MySQL Database Connection Settings
    DB_HOST = os.environ.get('DB_HOST', 'localhost')
    DB_PORT = int(os.environ.get('DB_PORT', 3306))
    DB_USER = os.environ.get('DB_USER', 'root')
    DB_PASSWORD = os.environ.get('DB_PASSWORD', '')
    DB_NAME = os.environ.get('DB_NAME', 'computer_repair_shop')
    
    # Session Configuration
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    PERMANENT_SESSION_LIFETIME = 86400  # 24 hours

class DevelopmentConfig(Config):
    DEBUG = True
    TESTING = False

class TestingConfig(Config):
    DEBUG = False
    TESTING = True
    DB_NAME = os.environ.get('TEST_DB_NAME', 'computer_repair_shop_test')
    WTF_CSRF_ENABLED = False

class ProductionConfig(Config):
    DEBUG = False
    TESTING = False
    SESSION_COOKIE_SECURE = True

def get_config():
    env = os.environ.get('FLASK_ENV', 'development').lower()
    if env == 'testing':
        return TestingConfig
    elif env == 'production':
        return ProductionConfig
    return DevelopmentConfig
