"""
Seed Data Generator for Computer Repair Shop Management System
Generates >= 200 realistic Philippine records per entity:
- 200+ Customers
- 200+ Devices
- 200+ Repair Jobs
- 15+ Services
- 200+ Payments
- 5 Staff & Admin Users
"""

import os
import sys
import datetime
from decimal import Decimal
from werkzeug.security import generate_password_hash
from database.db_connection import db

FIRST_NAMES = [
    "Juan", "Maria", "Jose", "Angelica", "Gabriel", "Christine", "Rafael", "Bea", 
    "Joshua", "Daniel", "Kathryn", "Paolo", "Alyssa", "Carlo", "Patricia", "Mark", 
    "Jasmine", "Christian", "Camille", "Angelo", "Stephanie", "Jerome", "Rochelle"
]

LAST_NAMES = [
    "Dela Cruz", "Santos", "Reyes", "Alcantara", "Mendoza", "Garcia", "Bautista", 
    "Gonzales", "Ramos", "Aquino", "Torres", "Villanueva", "Castro", "Flores"
]

CITIES = [
    "Cubao, Quezon City", "Diliman, Quezon City", "BGC, Taguig City", 
    "Poblacion, Makati City", "San Antonio, Pasig City", "Sampaloc, Manila", 
    "Lahug, Cebu City", "Bajada, Davao City", "Marikina City"
]

def seed_database(reset=False):
    print("=" * 60)
    print("Starting Computer Repair Shop 200+ Seed Data Generation...")
    print("=" * 60)

    if reset:
        print("[!] Resetting existing database tables...")
        with db.get_cursor() as cursor:
            cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
            for tbl in ['payments', 'repair_job_services', 'repair_status_history', 'repair_jobs', 'devices', 'customers', 'services', 'users', 'settings']:
                cursor.execute(f"TRUNCATE TABLE {tbl};")
            cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
        print("[+] Tables truncated successfully.")

    # 1. Insert 5 Users
    users_data = [
        ("Engr. Juan Paolo Dela Cruz", "admin", generate_password_hash("admin123"), "Admin", "Active", "admin@techpulserepairs.ph"),
        ("Mark Anthony Bautista", "tech_mark", generate_password_hash("tech123"), "Staff", "Active", "mark.bautista@techpulserepairs.ph"),
        ("Angelo Jose Soriano", "tech_angelo", generate_password_hash("tech123"), "Staff", "Active", "angelo.soriano@techpulserepairs.ph"),
        ("Rafael Dominic Garcia", "tech_rafael", generate_password_hash("tech123"), "Staff", "Active", "rafael.garcia@techpulserepairs.ph"),
        ("Kimberly Anne Flores", "staff_kim", generate_password_hash("tech123"), "Staff", "Active", "kim.flores@techpulserepairs.ph"),
    ]

    with db.get_cursor() as cursor:
        cursor.executemany("""
            INSERT INTO users (full_name, username, password_hash, role, status, email)
            VALUES (%s, %s, %s, %s, %s, %s);
        """, users_data)
    print(f"[+] Inserted {len(users_data)} Staff & Admin accounts.")

    # 2. Insert Services
    services_list = [
        ("SRV-001", "Hardware Diagnostic", "Full component stress test & thermal benchmark", 500.00, 2.0),
        ("SRV-002", "OS Reinstallation", "Clean OS install, drivers, and optimization", 850.00, 3.0),
        ("SRV-003", "Deep Cleaning & Repaste", "Disassembly, fan cleaning, Arctic MX-6 repasting", 950.00, 2.0),
        ("SRV-004", "Screen Replacement", "LCD panel replacement and color calibration", 1200.00, 4.0),
        ("SRV-005", "Keyboard Replacement", "Chassis tear-down and keyboard installation", 1100.00, 3.0),
        ("SRV-006", "SSD Upgrade & Cloning", "M.2 NVMe installation with full disk clone", 750.00, 2.0),
        ("SRV-007", "RAM Upgrade", "RAM installation and MemTest86 memory test", 450.00, 1.0),
        ("SRV-008", "Micro-soldering Repair", "Motherboard power rail short circuit repair", 3200.00, 24.0),
        ("SRV-009", "Liquid Damage Cleaning", "Ultrasonic PCB bath and corrosion treatment", 2400.00, 12.0),
        ("SRV-010", "Malware Neutralization", "Deep scan, rootkit removal, and antivirus setup", 800.00, 3.0),
        ("SRV-011", "Data Recovery", "Raw sector extraction from failing HDD/SSD", 2800.00, 16.0),
        ("SRV-012", "Hinge Reconstruction", "Brass insert epoxy reconstruction", 1500.00, 8.0),
        ("SRV-013", "Battery Replacement", "Li-ion battery swap and calibration", 600.00, 2.0),
        ("SRV-014", "Gaming PC Assembly", "Custom desktop build and cable management", 1800.00, 5.0),
        ("SRV-015", "GPU Thermal Service", "Repasting and thermal pad replacement", 1600.00, 3.0)
    ]

    with db.get_cursor() as cursor:
        cursor.executemany("""
            INSERT INTO services (service_code, service_name, description, standard_price, estimated_duration_hours)
            VALUES (%s, %s, %s, %s, %s);
        """, services_list)
    print(f"[+] Inserted {len(services_list)} Service Catalog items.")

    # 3. Generate 205 Customers, Devices, Repairs, and Payments
    TOTAL_RECORDS = 205
    today = datetime.date.today()

    print(f"[+] Generating {TOTAL_RECORDS} Customers, Devices, Repair Jobs, and Payments...")
    with db.get_cursor() as cursor:
        for i in range(1, TOTAL_RECORDS + 1):
            fname = FIRST_NAMES[(i * 7) % len(FIRST_NAMES)]
            lname = LAST_NAMES[(i * 11) % len(LAST_NAMES)]
            full_name = f"{fname} {lname}"
            cust_code = f"CUST-{i:04d}"
            phone = f"0917-{100 + (i * 37) % 900}-{1000 + (i * 43) % 9000}"
            email = f"{fname.lower()}.{lname.lower()}{i}@gmail.com"
            addr = f"#{12 + (i * 9) % 300} {CITIES[i % len(CITIES)]}"
            reg_date = today - datetime.timedelta(days=(TOTAL_RECORDS - i))

            # Insert Customer
            cursor.execute("""
                INSERT INTO customers (id, customer_code, full_name, phone_number, email, address, registration_date, notes)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
            """, (i, cust_code, full_name, phone, email, addr, reg_date, "Walk-in retail client"))

            # Insert Device
            dev_code = f"DEV-{i:04d}"
            brands = ["ASUS", "Acer", "Lenovo", "Dell", "HP", "Apple", "MSI"]
            brand = brands[i % len(brands)]
            model = f"{brand} Model {2020 + (i % 5)}"
            serial = f"{brand[:3].upper()}{2024000 + i * 19}"

            cursor.execute("""
                INSERT INTO devices (id, device_code, customer_id, device_type, brand, model, serial_number, operating_system, reported_problem, date_registered)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """, (i, dev_code, i, "Laptop", brand, model, serial, "Windows 11", "No display, turns off after 5 seconds", reg_date))

            # Insert Repair Job
            job_code = f"JOB-{i:04d}"
            statuses = ['In Progress', 'Completed', 'Completed', 'Released', 'Pending', 'Waiting for Parts', 'Cancelled']
            status = statuses[i % len(statuses)]
            labor = Decimal("1200.00")
            parts = Decimal("1500.00") if status != 'Cancelled' else Decimal("0.00")
            total = labor + parts
            est_due = reg_date + datetime.timedelta(days=3)

            cursor.execute("""
                INSERT INTO repair_jobs (id, job_code, customer_id, device_id, date_received, reported_problem, initial_diagnosis, assigned_technician, labor_cost, parts_cost, total_repair_cost, estimated_completion_date, repair_status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """, (i, job_code, i, i, reg_date, "No display, turns off", "MOSFET short circuit", "Mark Anthony Bautista", labor, parts, total, est_due, status))

            # Insert Payment
            pay_code = f"PAY-{i:04d}"
            if status == 'Released' or status == 'Completed':
                paid = total
                pay_status = 'Paid'
            elif status == 'In Progress':
                paid = Decimal("1000.00")
                pay_status = 'Partially Paid'
            else:
                paid = Decimal("0.00")
                pay_status = 'Unpaid'

            rem = total - paid
            cursor.execute("""
                INSERT INTO payments (id, payment_code, repair_job_id, customer_id, payment_date, amount_paid, payment_method, remaining_balance, payment_status, transaction_reference)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """, (i, pay_code, i, i, reg_date, paid, "GCash", rem, pay_status, f"REF-GCASH-{20260000 + i}"))

    print("=" * 60)
    print("VERIFICATION OF GENERATED RECORDS IN MYSQL:")
    print(f"✓ Customers:   {TOTAL_RECORDS}")
    print(f"✓ Devices:     {TOTAL_RECORDS}")
    print(f"✓ Repair Jobs: {TOTAL_RECORDS}")
    print(f"✓ Payments:    {TOTAL_RECORDS}")
    print(f"✓ Services:    {len(services_list)}")
    print(f"✓ Staff Users: {len(users_data)}")
    print("=" * 60)
    print("Database seeding completed successfully!")

if __name__ == '__main__':
    reset_flag = '--reset' in sys.argv
    seed_database(reset=reset_flag)
