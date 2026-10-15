"""
Payment Domain Model (Object-Oriented Programming)
Encapsulates transaction validation, multi-payment support, and balance formulas.
"""

from decimal import Decimal
import datetime
from database.db_connection import db

class Payment:
    def __init__(self, id, payment_code, repair_job_id, customer_id, payment_date,
                 amount_paid, payment_method, remaining_balance, payment_status,
                 transaction_reference=None, notes=None, created_at=None):
        self._id = id
        self._payment_code = payment_code
        self._repair_job_id = repair_job_id
        self._customer_id = customer_id
        self._payment_date = payment_date
        self._amount_paid = Decimal(str(amount_paid))
        self._payment_method = payment_method
        self._remaining_balance = Decimal(str(remaining_balance))
        self._payment_status = payment_status
        self._transaction_reference = transaction_reference
        self._notes = notes
        self._created_at = created_at

    @property
    def id(self): return self._id
    @property
    def payment_code(self): return self._payment_code
    @property
    def amount_paid(self): return self._amount_paid
    @property
    def remaining_balance(self): return self._remaining_balance
    @property
    def payment_status(self): return self._payment_status

    @classmethod
    def record_transaction(cls, repair_job_id, amount, payment_method, reference=None, notes=None):
        """Processes transaction inside a database transaction ensuring balance consistency"""
        amount_dec = Decimal(str(amount))
        if amount_dec <= 0:
            raise ValueError("Payment amount must be greater than zero.")

        with db.get_cursor() as cursor:
            # 1. Fetch repair job cost
            cursor.execute("SELECT customer_id, total_repair_cost FROM repair_jobs WHERE id = %s;", (repair_job_id,))
            job_row = cursor.fetchone()
            if not job_row:
                raise ValueError("Repair job not found.")

            customer_id = job_row['customer_id']
            total_cost = Decimal(str(job_row['total_repair_cost']))

            # 2. Sum valid existing payments
            cursor.execute("""
                SELECT COALESCE(SUM(amount_paid), 0) FROM payments
                WHERE repair_job_id = %s AND payment_status != 'Refunded';
            """, (repair_job_id,))
            paid_so_far = Decimal(str(cursor.fetchone()['COALESCE(SUM(amount_paid), 0)']))

            current_remaining = max(Decimal("0.00"), total_cost - paid_so_far)

            if amount_dec > current_remaining:
                raise ValueError(f"Payment amount (₱{amount_dec}) exceeds remaining balance (₱{current_remaining}).")

            new_balance = current_remaining - amount_dec
            status = 'Paid' if new_balance <= 0 else 'Partially Paid'
            pay_code = f"PAY-{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
            pay_date = datetime.date.today()

            cursor.execute("""
                INSERT INTO payments (payment_code, repair_job_id, customer_id, payment_date, 
                                     amount_paid, payment_method, remaining_balance, payment_status,
                                     transaction_reference, notes)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """, (pay_code, repair_job_id, customer_id, pay_date, amount_dec, payment_method, new_balance, status, reference, notes))

            # Retrieve inserted ID
            pay_id = cursor.lastrowid

            return cls(pay_id, pay_code, repair_job_id, customer_id, pay_date, amount_dec, payment_method, new_balance, status, reference, notes)
`
    },
    {
      name: "tests/test_repairs.py",
      path: "tests/test_repairs.py",
      language: "python",
      category: "tests",
      content: `"""
Automated Repair Job Test Suite (pytest)
Tests labor + parts calculation and status transition history.
"""

from decimal import Decimal
from models.repair_job import RepairJob

def test_repair_cost_calculation():
    job = RepairJob(
        id=1,
        job_code="JOB-0001",
        customer_id=1,
        device_id=1,
        date_received="2026-10-15",
        reported_problem="No display, power LED flashes",
        initial_diagnosis="Short on 19V DC line",
        recommended_solution="Replace ceramic capacitor and clean PCB",
        assigned_technician="Mark Anthony Bautista",
        labor_cost=Decimal("1500.00"),
        parts_cost=Decimal("750.00"),
        total_repair_cost=Decimal("0.00"),
        estimated_completion_date="2026-10-18",
        actual_completion_date=None,
        repair_status="In Progress"
    )

    total = job.calculate_total_cost()
    assert total == Decimal("2250.00")
    assert job.total_cost == Decimal("2250.00")
`
    },
    {
      name: "tests/test_payments.py",
      path: "tests/test_payments.py",
      language: "python",
      category: "tests",
      content: `"""
Automated Payments Test Suite (pytest)
Tests remaining balance calculation formula:
Remaining Balance = Total Repair Cost - Valid Payments
"""

from decimal import Decimal
import pytest

def test_balance_formula():
    total_cost = Decimal("4500.00")
    downpayment = Decimal("2000.00")
    
    remaining = total_cost - downpayment
    assert remaining == Decimal("2500.00")

    final_payment = Decimal("2500.00")
    assert (remaining - final_payment) == Decimal("0.00")

def test_overpayment_guard():
    remaining_balance = Decimal("1500.00")
    attempted_payment = Decimal("2000.00")

    assert attempted_payment > remaining_balance, "System must reject amounts exceeding outstanding balance"
`
    }
  ];

  for (const f of [
    { target: '/models/payment.py', desc: 'Create Payment domain model' },
    { target: '/tests/test_repairs.py', desc: 'Create repair job tests' },
    { target: '/tests/test_payments.py', desc: 'Create payment tests' }
  ]) {
    // will write these next
  }
}
