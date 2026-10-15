"""
User Domain Model (Object-Oriented Programming)
Encapsulates authentication, role verification, and password security.
"""

from werkzeug.security import check_password_hash, generate_password_hash
from database.db_connection import db

class User:
    def __init__(self, id, full_name, username, password_hash, role='Staff', status='Active', email=None, created_at=None):
        self._id = id
        self._full_name = full_name
        self._username = username
        self._password_hash = password_hash
        self._role = role
        self._status = status
        self._email = email
        self._created_at = created_at

    # Flask-Login Interface properties
    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return self._status == 'Active'

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self._id)

    # Encapsulated Properties
    @property
    def id(self): return self._id
    @property
    def full_name(self): return self._full_name
    @property
    def username(self): return self._username
    @property
    def role(self): return self._role
    @property
    def status(self): return self._status
    @property
    def email(self): return self._email

    def is_admin(self):
        return self._role == 'Admin'

    def verify_password(self, password):
        """Verifies candidate plaintext against secure Werkzeug hash"""
        return check_password_hash(self._password_hash, password)

    @classmethod
    def find_by_username(cls, username):
        with db.get_cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE username = %s LIMIT 1;", (username,))
            row = cursor.fetchone()
            if row:
                return cls(**row)
        return None

    @classmethod
    def find_by_id(cls, user_id):
        with db.get_cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE id = %s LIMIT 1;", (user_id,))
            row = cursor.fetchone()
            if row:
                return cls(**row)
        return None

    @classmethod
    def count_active_admins(cls):
        with db.get_cursor(dictionary=False) as cursor:
            cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'Admin' AND status = 'Active';")
            return cursor.fetchone()[0]
