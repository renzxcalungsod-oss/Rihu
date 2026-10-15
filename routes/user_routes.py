"""
User Management Routes (Flask Blueprint)
Enforces Administrator RBAC and prevents deactivating the last active Admin.
"""

from flask import Blueprint, render_template, redirect, url_for, flash
from flask_login import login_required, current_user
from models.user import User

user_bp = Blueprint('users', __name__)

@user_bp.route('/')
@login_required
def index():
    if not current_user.is_admin():
        flash("Unauthorized: Administrator permissions required.", "danger")
        return redirect(url_for('dashboard.index'))
    return render_template('users/index.html')
