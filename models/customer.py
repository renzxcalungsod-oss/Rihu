"""
Customer Domain Model (Object-Oriented Programming)
Encapsulates CRUD processing, data validation, and foreign key dependency protection.
"""

from database.db_connection import db

class Customer:
    def __init__(self, id, customer_code, full_name, phone_number, email, address, registration_date, notes=None, created_at=None):
        self._id = id
        self._customer_code = customer_code
        self._full_name = full_name
        self._phone_number = phone_number
        self._email = email
        self._address = address
        self._registration_date = registration_date
        self._notes = notes
        self._created_at = created_at

    @property
    def id(self): return self._id
    @property
    def customer_code(self): return self._customer_code
    @property
    def full_name(self): return self._full_name
    @property
    def phone_number(self): return self._phone_number
    @property
    def email(self): return self._email
    @property
    def address(self): return self._address

    @classmethod
    def get_all(cls, search_query=None):
        with db.get_cursor() as cursor:
            if search_query:
                param = f"%{search_query}%"
                cursor.execute("""
                    SELECT * FROM customers 
                    WHERE full_name LIKE %s OR customer_code LIKE %s OR phone_number LIKE %s
                    ORDER BY id DESC;
                """, (param, param, param))
            else:
                cursor.execute("SELECT * FROM customers ORDER BY id DESC;")
            return [cls(**row) for row in cursor.fetchall()]

    @classmethod
    def find_by_id(cls, customer_id):
        with db.get_cursor() as cursor:
            cursor.execute("SELECT * FROM customers WHERE id = %s LIMIT 1;", (customer_id,))
            row = cursor.fetchone()
            return cls(**row) if row else None

    def safe_delete(self):
        """Enforces referential integrity check: rejects deletion if repairs or devices exist"""
        with db.get_cursor(dictionary=False) as cursor:
            # Check repair jobs
            cursor.execute("SELECT COUNT(*) FROM repair_jobs WHERE customer_id = %s;", (self._id,))
            if cursor.fetchone()[0] > 0:
                raise ValueError("Cannot delete customer with active or past repair job records.")

            # Check devices
            cursor.execute("SELECT COUNT(*) FROM devices WHERE customer_id = %s;", (self._id,))
            if cursor.fetchone()[0] > 0:
                raise ValueError("Cannot delete customer with registered devices. Delete devices first.")

            cursor.execute("DELETE FROM customers WHERE id = %s;", (self._id,))
            return True
