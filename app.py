"""
Computer Repair Shop Management System
Main Flask Application & System Architecture Controller
Course: SIA1 (LFCA311M111)
Framework: Flask, Flask-Login, Flask-WTF, mysql-connector-python
"""

import os
from flask import Flask, render_template, redirect, url_for, flash
from flask_login import LoginManager
from flask_wtf.csrf import CSRFProtect
from config import get_config
from database.db_connection import db
from models.user import User

# Route Blueprints
from routes.auth_routes import auth_bp
from routes.dashboard_routes import dashboard_bp
from routes.customer_routes import customer_bp
from routes.device_routes import device_bp
from routes.repair_routes import repair_bp
from routes.service_routes import service_bp
from routes.payment_routes import payment_bp
from routes.report_routes import report_bp
from routes.user_routes import user_bp

def create_app(config_class=None):
    app = Flask(__name__)
    if config_class is None:
        config_class = get_config()
    app.config.from_object(config_class)

    # Initialize Security & Session extensions
    csrf = CSRFProtect(app)
    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.login_message = "Please authenticate to access the Repair Shop Management System."
    login_manager.login_message_category = "warning"
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.find_by_id(int(user_id))

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(dashboard_bp, url_prefix='/')
    app.register_blueprint(customer_bp, url_prefix='/customers')
    app.register_blueprint(device_bp, url_prefix='/devices')
    app.register_blueprint(repair_bp, url_prefix='/repairs')
    app.register_blueprint(service_bp, url_prefix='/services')
    app.register_blueprint(payment_bp, url_prefix='/payments')
    app.register_blueprint(report_bp, url_prefix='/reports')
    app.register_blueprint(user_bp, url_prefix='/users')

    # Global Template Context
    @app.context_processor
    def inject_shop_settings():
        with db.get_cursor() as cursor:
            cursor.execute("SELECT setting_key, setting_value FROM settings;")
            settings = {row['setting_key']: row['setting_value'] for row in cursor.fetchall()}
            return dict(shop=settings)

    # Error Handlers
    @app.errorhandler(404)
    def not_found(e):
        return {"error": "Resource not found", "status": 404}, 404

    @app.errorhandler(500)
    def internal_error(e):
        return {"error": "Internal server error occurred", "status": 500}, 500

    return app

if __name__ == '__main__':
    application = create_app()
    port = int(os.environ.get('PORT', 5000))
    application.run(host='0.0.0.0', port=port, debug=True)
