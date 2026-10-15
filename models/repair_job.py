"""
RepairJob Domain Model (Object-Oriented Programming)
Encapsulates financial calculation, status transitions, and warranty logic.
"""

from decimal import Decimal
import datetime
from database.db_connection import db

class RepairJob:
    def __init__(self, id, job_code, customer_id, device_id, date_received, 
                 reported_problem, initial_diagnosis, recommended_solution,
                 assigned_technician, labor_cost, parts_cost, total_repair_cost,
                 estimated_completion_date, actual_completion_date, repair_status,
                 technician_notes=None, warranty_period="90 Days Service Warranty",
                 created_at=None, parts_and_materials_used=None):
        self._id = id
        self._job_code = job_code
        self._customer_id = customer_id
        self._device_id = device_id
        self._date_received = date_received
        self._reported_problem = reported_problem
        self._initial_diagnosis = initial_diagnosis
        self._recommended_solution = recommended_solution
        self._assigned_technician = assigned_technician
        self._parts_and_materials_used = parts_and_materials_used
        self._labor_cost = Decimal(str(labor_cost))
        self._parts_cost = Decimal(str(parts_cost))
        self._total_repair_cost = Decimal(str(total_repair_cost))
        self._estimated_completion_date = estimated_completion_date
        self._actual_completion_date = actual_completion_date
        self._repair_status = repair_status
        self._technician_notes = technician_notes
        self._warranty_period = warranty_period
        self._created_at = created_at

    @property
    def id(self): return self._id
    @property
    def job_code(self): return self._job_code
    @property
    def total_cost(self): return self._total_repair_cost
    @property
    def repair_status(self): return self._repair_status

    def calculate_total_cost(self):
        """Total = Labor + Parts"""
        self._total_repair_cost = self._labor_cost + self._parts_cost
        return self._total_repair_cost

    def update_status(self, new_status, remarks, updated_by_user):
        """Updates repair status and records entry in repair_status_history audit trail"""
        old_status = self._repair_status
        self._repair_status = new_status
        
        with db.get_cursor() as cursor:
            # 1. Update job row
            cursor.execute("""
                UPDATE repair_jobs 
                SET repair_status = %s, actual_completion_date = %s
                WHERE id = %s;
            """, (new_status, datetime.date.today() if new_status in ['Completed', 'Released'] else None, self._id))

            # 2. Insert audit trail
            cursor.execute("""
                INSERT INTO repair_status_history (repair_job_id, old_status, new_status, changed_by, remarks)
                VALUES (%s, %s, %s, %s, %s);
            """, (self._id, old_status, new_status, updated_by_user, remarks))

    def get_remaining_balance(self):
        """Remaining Balance = Total Cost - Valid Recorded Payments"""
        with db.get_cursor() as cursor:
            cursor.execute("""
                SELECT COALESCE(SUM(amount_paid), 0) FROM payments
                WHERE repair_job_id = %s AND payment_status != 'Refunded';
            """, (self._id,))
            paid = Decimal(str(cursor.fetchone()['COALESCE(SUM(amount_paid), 0)']))
            return max(Decimal("0.00"), self._total_repair_cost - paid)
