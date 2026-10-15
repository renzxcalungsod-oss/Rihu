"""
Repair Service
Handles repair job calculations, service multi-selection, and warranty validations.
"""

from decimal import Decimal
from database.db_connection import db

class RepairService:
    @staticmethod
    def calculate_job_costs(service_ids, parts_cost):
        """Calculates total labor from service catalog items plus parts"""
        labor = Decimal("0.00")
        if service_ids:
            format_strings = ','.join(['%s'] * len(service_ids))
            with db.get_cursor() as cursor:
                cursor.execute(f"SELECT SUM(standard_price) as total_labor FROM services WHERE id IN ({format_strings});", tuple(service_ids))
                res = cursor.fetchone()
                if res and res['total_labor']:
                    labor = Decimal(str(res['total_labor']))
        parts = Decimal(str(parts_cost or 0))
        return labor, parts, (labor + parts)
