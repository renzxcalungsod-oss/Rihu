"""
Customer Routes (Flask Blueprint)
"""

from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_required
from models.customer import Customer
from database.db_connection import db

customer_bp = Blueprint('customers', __name__)

@customer_bp.route('/')
@login_required
def index():
    query = request.args.get('q', '')
    customers = Customer.get_all(query)
    return render_template('customers/index.html', customers=customers, search_query=query)

@customer_bp.route('/create', methods=['POST'])
@login_required
def create():
    data = request.form
    with db.get_cursor() as cursor:
        cursor.execute("SELECT COUNT(*) as count FROM customers;")
        next_id = cursor.fetchone()['count'] + 1
        code = f"CUST-{next_id:04d}"
        cursor.execute("""
            INSERT INTO customers (customer_code, full_name, phone_number, email, address, registration_date, notes)
            VALUES (%s, %s, %s, %s, %s, %s, %s);
        """, (code, data['full_name'], data['phone_number'], data['email'], data['address'], data['registration_date'], data.get('notes')))
    flash("Customer registered successfully!", "success")
    return redirect(url_for('customers.index'))

@customer_bp.route('/<int:id>/delete', methods=['POST'])
@login_required
def delete(id):
    customer = Customer.find_by_id(id)
    if not customer:
        flash("Customer not found.", "danger")
        return redirect(url_for('customers.index'))
    try:
        customer.safe_delete()
        flash("Customer removed.", "success")
    except ValueError as e:
        flash(str(e), "danger")
    return redirect(url_for('customers.index'))
