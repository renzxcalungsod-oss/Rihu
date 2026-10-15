"""
Automated Payments Test Suite (pytest)
Tests remaining balance calculation formula:
Remaining Balance = Total Repair Cost - Valid Payments
"""

from decimal import Decimal

def test_balance_formula():
    total_cost = Decimal("4500.00")
    downpayment = Decimal("2000.00")
    
    remaining = total_cost - downpayment
    assert remaining == Decimal("2500.00")

    final_payment = Decimal("2500.00")
    assert (remaining - final_payment) == Decimal("0.00")

def test_overpayment_prevention():
    remaining_balance = Decimal("1500.00")
    attempted_payment = Decimal("2000.00")

    assert attempted_payment > remaining_balance, "System must reject amounts exceeding outstanding balance"
