"""
Authentication Service (Separation of Concerns)
Handles credential verification, session management, and login rate limiting.
"""

from models.user import User

class AuthenticationService:
    @staticmethod
    def authenticate(username, password):
        user = User.find_by_username(username)
        if not user:
            return None, "Invalid username or password."
        if not user.is_active:
            return None, "Account is deactivated. Please contact the administrator."
        if not user.verify_password(password):
            return None, "Invalid username or password."
        return user, None
