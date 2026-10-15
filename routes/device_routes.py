"""
Device, Service, and User Management Routes (Flask Blueprints)
"""

from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_required, current_user
from database.db_connection import db
from models.user import User

device_bp = Blueprint('devices', __name__)
service_bp = Blueprint('services', __name__)
user_bp = Blueprint('users', __name__)

# Device routes
@device_bp.route('/')
@login_required
def index():
    return render_template('devices/index.html')

# Service routes
@service_bp.route('/')
@login_required
def index():
    return render_template('services/index.html')

# User routes
@user_bp.route('/')
@login_required
def index():
    if not current_user.is_admin():
        flash("Access restricted to Administrators only.", "danger")
        return redirect(url_for('dashboard.index'))
    return render_template('users/index.html')
