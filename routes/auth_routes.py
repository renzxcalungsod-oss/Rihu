"""
Authentication Routes (Flask Blueprint)
Handles Login, Session Management, Logout, and Role Verification.
"""

from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_user, logout_user, login_required, current_user
from services.auth_service import AuthenticationService

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard.index'))

    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user, error = AuthenticationService.authenticate(username, password)
        if user:
            login_user(user)
            flash(f"Welcome back, {user.full_name}!", "success")
            return redirect(url_for('dashboard.index'))
        flash(error, "danger")

    return render_template('login.html')

@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    flash("You have been successfully logged out.", "info")
    return redirect(url_for('auth.login'))
