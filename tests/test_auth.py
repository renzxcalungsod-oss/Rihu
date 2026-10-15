"""
Automated Authentication Test Suite (pytest)
Tests login, password hashing, and role-based permissions.
"""

import pytest
from werkzeug.security import check_password_hash, generate_password_hash
from models.user import User

def test_password_hashing():
    raw_password = "SecureTechPassword2026!"
    hashed = generate_password_hash(raw_password)
    
    assert check_password_hash(hashed, raw_password) is True
    assert check_password_hash(hashed, "WrongPassword") is False
    assert raw_password not in hashed

def test_admin_vs_staff_role_permissions():
    admin = User(1, "Juan Admin", "admin", "hash", "Admin", "Active")
    staff = User(2, "Mark Tech", "tech_mark", "hash", "Staff", "Active")

    assert admin.is_admin() is True
    assert staff.is_admin() is False
