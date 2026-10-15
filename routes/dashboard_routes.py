"""
Dashboard Routes (Flask Blueprint)
Retrieves statistics directly from MySQL for the 8 KPI cards and Chart.js charts.
"""

from flask import Blueprint, render_template
from flask_login import login_required
from database.db_connection import db

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/')
@login_required
def index():
    with db.get_cursor() as cursor:
        # Customers & Devices count
        cursor.execute("SELECT COUNT(*) as count FROM customers;")
        total_customers = cursor.fetchone()['count']

        cursor.execute("SELECT COUNT(*) as count FROM devices;")
        total_devices = cursor.fetchone()['count']

        # Repairs counts
        cursor.execute("SELECT COUNT(*) as count FROM repair_jobs;")
        total_repairs = cursor.fetchone()['count']

        cursor.execute("SELECT COUNT(*) as count FROM repair_jobs WHERE repair_status = 'Pending';")
        pending_repairs = cursor.fetchone()['count']

        cursor.execute("SELECT COUNT(*) as count FROM repair_jobs WHERE repair_status = 'In Progress';")
        in_progress_repairs = cursor.fetchone()['count']

        cursor.execute("SELECT COUNT(*) as count FROM repair_jobs WHERE repair_status IN ('Completed', 'Released');")
        completed_repairs = cursor.fetchone()['count']

        # Financial totals
        cursor.execute("SELECT COALESCE(SUM(amount_paid), 0) as total FROM payments;")
        total_revenue = cursor.fetchone()['total']

        cursor.execute("SELECT COALESCE(SUM(total_repair_cost), 0) as total FROM repair_jobs WHERE repair_status != 'Cancelled';")
        total_costs = cursor.fetchone()['total']
        total_outstanding = max(0, total_costs - total_revenue)

        # Recent records
        cursor.execute("""
            SELECT r.*, c.full_name as customer_name 
            FROM repair_jobs r 
            JOIN customers c ON r.customer_id = c.id 
            ORDER BY r.id DESC LIMIT 5;
        """)
        recent_repairs = cursor.fetchall()

    return render_template(
        'dashboard.html',
        total_customers=total_customers,
        total_devices=total_devices,
        total_repairs=total_repairs,
        pending_repairs=pending_repairs,
        in_progress_repairs=in_progress_repairs,
        completed_repairs=completed_repairs,
        total_revenue=total_revenue,
        total_outstanding=total_outstanding,
        recent_repairs=recent_repairs
    )
