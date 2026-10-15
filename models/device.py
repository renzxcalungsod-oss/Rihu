"""
Device Domain Model (Object-Oriented Programming)
"""

from database.db_connection import db

class Device:
    def __init__(self, id, device_code, customer_id, device_type, brand, model, 
                 serial_number, operating_system, reported_problem, 
                 accessories_received=None, physical_condition=None, 
                 date_registered=None, notes=None, created_at=None):
        self._id = id
        self._device_code = device_code
        self._customer_id = customer_id
        self._device_type = device_type
        self._brand = brand
        self._model = model
        self._serial_number = serial_number
        self._operating_system = operating_system
        self._reported_problem = reported_problem
        self._accessories_received = accessories_received
        self._physical_condition = physical_condition
        self._date_registered = date_registered
        self._notes = notes
        self._created_at = created_at

    @property
    def id(self): return self._id
    @property
    def device_code(self): return self._device_code
    @property
    def brand(self): return self._brand
    @property
    def model(self): return self._model
    @property
    def serial_number(self): return self._serial_number

    @classmethod
    def get_by_customer(cls, customer_id):
        with db.get_cursor() as cursor:
            cursor.execute("SELECT * FROM devices WHERE customer_id = %s ORDER BY id DESC;", (customer_id,))
            return [cls(**row) for row in cursor.fetchall()]

    def safe_delete(self):
        with db.get_cursor(dictionary=False) as cursor:
            cursor.execute("SELECT COUNT(*) FROM repair_jobs WHERE device_id = %s;", (self._id,))
            if cursor.fetchone()[0] > 0:
                raise ValueError("Cannot delete device associated with repair job records.")
            cursor.execute("DELETE FROM devices WHERE id = %s;", (self._id,))
            return True
