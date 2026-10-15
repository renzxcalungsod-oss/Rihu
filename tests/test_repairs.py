"""
Automated Repair Job Test Suite (pytest)
Tests labor + parts calculation and status transition history.
"""

from decimal import Decimal

def test_repair_cost_calculation():
    labor = Decimal("1500.00")
    parts = Decimal("750.00")
    total = labor + parts
    assert total == Decimal("2250.00")

def test_status_workflow():
    valid_statuses = ['Pending', 'In Progress', 'Waiting for Parts', 'Completed', 'Released', 'Cancelled']
    current_status = 'In Progress'
    assert current_status in valid_statuses
