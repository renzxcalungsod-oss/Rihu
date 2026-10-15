"""
Customer Test Suite (pytest)
"""

from models.customer import Customer

def test_customer_creation():
    cust = Customer(
        id=1,
        customer_code="CUST-0001",
        full_name="Juan Dela Cruz",
        phone_number="0917-123-4567",
        email="juan.delacruz@gmail.com",
        address="#12 Aurora Blvd, Cubao, Quezon City",
        registration_date="2026-10-15"
    )

    assert cust.id == 1
    assert cust.customer_code == "CUST-0001"
    assert cust.full_name == "Juan Dela Cruz"
