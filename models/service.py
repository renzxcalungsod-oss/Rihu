"""
Service Domain Model (Object-Oriented Programming)
"""

from decimal import Decimal
from database.db_connection import db

class Service:
    def __init__(self, id, service_code, service_name, description, standard_price, estimated_duration_hours=2.0, is_active=True, created_at=None):
        self._id = id
        self._service_code = service_code
        self._service_name = service_name
        self._description = description
        self._standard_price = Decimal(str(standard_price))
        self._estimated_duration_hours = Decimal(str(estimated_duration_hours))
        self._is_active = bool(is_active)
        self._created_at = created_at

    @property
    def id(self): return self._id
    @property
    def service_code(self): return self._service_code
    @property
    def service_name(self): return self._service_name
    @property
    def standard_price(self): return self._standard_price
    @property
    def is_active(self): return self._is_active

    @classmethod
    def get_all(cls, active_only=False):
        with db.get_cursor() as cursor:
            if active_only:
                cursor.execute("SELECT * FROM services WHERE is_active = TRUE ORDER BY id ASC;")
            else:
                cursor.execute("SELECT * FROM services ORDER BY id ASC;")
            return [cls(**row) for row in cursor.fetchall()]

    def toggle_status(self):
        new_status = not self._is_active
        with db.get_cursor() as cursor:
            cursor.execute("UPDATE services SET is_active = %s WHERE id = %s;", (new_status, self._id))
        self._is_active = new_status
        return self._is_active
