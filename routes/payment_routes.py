"""
Payment Routes (Flask Blueprint)
"""

from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_required
from models.payment import Payment

payment_bp = Blueprint('payments', __name__)

@payment_bp.route('/')
@login_required
def index():
    return render_template('payments/index.html')

@payment_bp.route('/record', methods=['POST'])
@login_required
def record():
    try:
        Payment.record_transaction(
            repair_job_id=int(request.form.get('repair_job_id')),
            amount=request.form.get('amount_paid'),
            payment_method=request.form.get('payment_method'),
            reference=request.form.get('transaction_reference'),
            notes=request.form.get('notes')
        )
        flash("Payment successfully processed!", "success")
    except ValueError as e:
        flash(str(e), "danger")
    return redirect(url_for('payments.index'))
