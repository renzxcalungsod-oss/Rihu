"""
Repair Job Routes (Flask Blueprint)
"""

from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_required, current_user
from database.db_connection import db

repair_bp = Blueprint('repairs', __name__)

@repair_bp.route('/')
@login_required
def index():
    with db.get_cursor() as cursor:
        cursor.execute("""
            SELECT r.*, c.full_name as customer_name, CONCAT(d.brand, ' ', d.model) as device_info
            FROM repair_jobs r
            JOIN customers c ON r.customer_id = c.id
            JOIN devices d ON r.device_id = d.id
            ORDER BY r.id DESC;
        """)
        repairs = cursor.fetchall()
    return render_template('repairs/index.html', repairs=repairs)

@repair_bp.route('/<int:id>/status', methods=['POST'])
@login_required
def update_status(id):
    new_status = request.form.get('repair_status')
    remarks = request.form.get('remarks', 'Status updated by technician.')
    
    with db.get_cursor() as cursor:
        cursor.execute("SELECT repair_status FROM repair_jobs WHERE id = %s;", (id,))
        old = cursor.fetchone()
        if old:
            old_status = old['repair_status']
            cursor.execute("UPDATE repair_jobs SET repair_status = %s WHERE id = %s;", (new_status, id))
            cursor.execute("""
                INSERT INTO repair_status_history (repair_job_id, old_status, new_status, changed_by, remarks)
                VALUES (%s, %s, %s, %s, %s);
            """, (id, old_status, new_status, current_user.full_name, remarks))
            flash(f"Repair status updated to {new_status}!", "success")
    return redirect(url_for('repairs.index'))
