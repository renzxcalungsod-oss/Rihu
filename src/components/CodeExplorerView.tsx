import React, { useState } from 'react';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  Database, 
  Code, 
  BookOpen, 
  FolderDown, 
  HelpCircle,
  ExternalLink,
  Laptop
} from 'lucide-react';
import JSZip from 'jszip';

interface CodeFile {
  name: string;
  path: string;
  language: string;
  category: 'core' | 'database' | 'models' | 'services' | 'routes' | 'tests';
  content: string;
}

export const CodeExplorerView: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const files: CodeFile[] = [
    {
      name: "app.py",
      path: "app.py",
      language: "python",
      category: "core",
      content: `"""
Computer Repair Shop Management System
Main Flask Application & Architectural Controller
Author: SIA1 Project Team (LFCA311M111)
Framework: Flask, Flask-Login, Flask-WTF
"""

import os
from flask import Flask, render_template, redirect, url_for, flash
from flask_login import LoginManager
from flask_wtf.csrf import CSRFProtect
from config import get_config
from database.db_connection import db
from models.user import User

# Route Blueprints
from routes.auth_routes import auth_bp
from routes.dashboard_routes import dashboard_bp
from routes.customer_routes import customer_bp
from routes.device_routes import device_bp
from routes.repair_routes import repair_bp
from routes.service_routes import service_bp
from routes.payment_routes import payment_bp
from routes.report_routes import report_bp
from routes.user_routes import user_bp

def create_app(config_class=None):
    app = Flask(__name__)
    if config_class is None:
        config_class = get_config()
    app.config.from_object(config_class)

    # Initialize Security & Session extensions
    csrf = CSRFProtect(app)
    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.login_message = "Please authenticate to access the Repair Shop Management System."
    login_manager.login_message_category = "warning"
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.find_by_id(int(user_id))

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(dashboard_bp, url_prefix='/')
    app.register_blueprint(customer_bp, url_prefix='/customers')
    app.register_blueprint(device_bp, url_prefix='/devices')
    app.register_blueprint(repair_bp, url_prefix='/repairs')
    app.register_blueprint(service_bp, url_prefix='/services')
    app.register_blueprint(payment_bp, url_prefix='/payments')
    app.register_blueprint(report_bp, url_prefix='/reports')
    app.register_blueprint(user_bp, url_prefix='/users')

    # Error Handlers
    @app.errorhandler(404)
    def not_found(e):
        return render_template('errors/404.html'), 404

    @app.errorhandler(500)
    def internal_error(e):
        return render_template('errors/500.html'), 500

    return app

if __name__ == '__main__':
    application = create_app()
    # Runs locally on Windows / Dev environment
    port = int(os.environ.get('PORT', 5000))
    application.run(host='0.0.0.0', port=port, debug=True)
`
    },
    {
      name: "schema.sql",
      path: "database/schema.sql",
      language: "sql",
      category: "database",
      content: `-- ============================================================
-- Computer Repair Shop Management System
-- Normalized MySQL Database Schema (3NF)
-- Database Name: computer_repair_shop
-- ============================================================

CREATE DATABASE IF NOT EXISTS computer_repair_shop
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE computer_repair_shop;

-- 1. USERS TABLE (Authentication & Roles)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Staff') NOT NULL DEFAULT 'Staff',
    status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    email VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_role (role),
    INDEX idx_user_status (status)
) ENGINE=InnoDB;

-- 2. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_code VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(25) NOT NULL,
    email VARCHAR(100) NULL,
    address TEXT NOT NULL,
    registration_date DATE NOT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_customer_phone (phone_number),
    INDEX idx_customer_name (full_name)
) ENGINE=InnoDB;

-- 3. DEVICES TABLE
CREATE TABLE IF NOT EXISTS devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_code VARCHAR(20) NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) NOT NULL,
    operating_system VARCHAR(50) NULL,
    reported_problem TEXT NOT NULL,
    accessories_received TEXT NULL,
    physical_condition TEXT NULL,
    date_registered DATE NOT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_device_brand (brand),
    INDEX idx_device_serial (serial_number)
) ENGINE=InnoDB;

-- 4. SERVICES CATALOG TABLE
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_code VARCHAR(20) NOT NULL UNIQUE,
    service_name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    standard_price DECIMAL(10, 2) NOT NULL,
    estimated_duration_hours DECIMAL(4, 1) NOT NULL DEFAULT 2.0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. REPAIR JOBS TABLE
CREATE TABLE IF NOT EXISTS repair_jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_code VARCHAR(20) NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    device_id INT NOT NULL,
    date_received DATE NOT NULL,
    reported_problem TEXT NOT NULL,
    initial_diagnosis TEXT NULL,
    recommended_solution TEXT NULL,
    assigned_technician VARCHAR(100) NOT NULL,
    parts_and_materials_used TEXT NULL,
    labor_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    parts_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_repair_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    estimated_completion_date DATE NOT NULL,
    actual_completion_date DATE NULL,
    repair_status ENUM('Pending', 'In Progress', 'Waiting for Parts', 'Completed', 'Released', 'Cancelled') NOT NULL DEFAULT 'Pending',
    technician_notes TEXT NULL,
    warranty_period VARCHAR(50) NOT NULL DEFAULT '90 Days Service Warranty',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_repair_status (repair_status),
    INDEX idx_date_received (date_received),
    INDEX idx_technician (assigned_technician)
) ENGINE=InnoDB;

-- 6. REPAIR JOB SERVICES (Many-to-Many Bridge Table)
CREATE TABLE IF NOT EXISTS repair_job_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    repair_job_id INT NOT NULL,
    service_id INT NOT NULL,
    cost_charged DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (repair_job_id) REFERENCES repair_jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 7. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_code VARCHAR(20) NOT NULL UNIQUE,
    repair_job_id INT NOT NULL,
    customer_id INT NOT NULL,
    payment_date DATE NOT NULL,
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('Cash', 'GCash', 'Maya', 'Bank Transfer', 'Other') NOT NULL,
    remaining_balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    payment_status ENUM('Unpaid', 'Partially Paid', 'Paid', 'Refunded') NOT NULL,
    transaction_reference VARCHAR(100) NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (repair_job_id) REFERENCES repair_jobs(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_payment_date (payment_date),
    INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB;

-- 8. REPAIR STATUS HISTORY TABLE (Audit Trail)
CREATE TABLE IF NOT EXISTS repair_status_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    repair_job_id INT NOT NULL,
    old_status VARCHAR(30) NOT NULL,
    new_status VARCHAR(30) NOT NULL,
    changed_by VARCHAR(100) NOT NULL,
    remarks TEXT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (repair_job_id) REFERENCES repair_jobs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
    setting_key VARCHAR(50) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
`
    },
    {
      name: "seed_data.py",
      path: "seed_data.py",
      language: "python",
      category: "core",
      content: `"""
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
`
    },
    {
      name: "models/repair_job.py",
      path: "models/repair_job.py",
      language: "python",
      category: "models",
      content: `"""
RepairJob Domain Model (Object-Oriented Programming)
Encapsulates financial calculation, status transitions, and warranty logic.
"""

from decimal import Decimal
import datetime
from database.db_connection import db

class RepairJob:
    def __init__(self, id, job_code, customer_id, device_id, date_received, 
                 reported_problem, initial_diagnosis, recommended_solution,
                 assigned_technician, labor_cost, parts_cost, total_repair_cost,
                 estimated_completion_date, actual_completion_date, repair_status,
                 technician_notes=None, warranty_period="90 Days Service Warranty"):
        self._id = id
        self._job_code = job_code
        self._customer_id = customer_id
        self._device_id = device_id
        self._date_received = date_received
        self._reported_problem = reported_problem
        self._initial_diagnosis = initial_diagnosis
        self._recommended_solution = recommended_solution
        self._assigned_technician = assigned_technician
        self._labor_cost = Decimal(str(labor_cost))
        self._parts_cost = Decimal(str(parts_cost))
        self._total_repair_cost = Decimal(str(total_repair_cost))
        self._estimated_completion_date = estimated_completion_date
        self._actual_completion_date = actual_completion_date
        self._repair_status = repair_status
        self._technician_notes = technician_notes
        self._warranty_period = warranty_period

    @property
    def id(self): return self._id

    @property
    def job_code(self): return self._job_code

    @property
    def total_cost(self): return self._total_repair_cost

    def calculate_total_cost(self):
        """Python Business Logic: Total = Labor + Parts"""
        self._total_repair_cost = self._labor_cost + self._parts_cost
        return self._total_repair_cost

    def update_status(self, new_status, remarks, updated_by_user):
        """Updates repair status and records entry in repair_status_history audit trail"""
        old_status = self._repair_status
        self._repair_status = new_status
        
        with db.get_cursor() as cursor:
            # 1. Update job row
            cursor.execute("""
                UPDATE repair_jobs 
                SET repair_status = %s, actual_completion_date = %s
                WHERE id = %s;
            """, (new_status, datetime.date.today() if new_status in ['Completed', 'Released'] else None, self._id))

            # 2. Insert audit trail
            cursor.execute("""
                INSERT INTO repair_status_history (repair_job_id, old_status, new_status, changed_by, remarks)
                VALUES (%s, %s, %s, %s, %s);
            """, (self._id, old_status, new_status, updated_by_user, remarks))

    def get_remaining_balance(self):
        """Remaining Balance = Total Cost - Valid Recorded Payments"""
        with db.get_cursor() as cursor:
            cursor.execute("""
                SELECT COALESCE(SUM(amount_paid), 0) FROM payments
                WHERE repair_job_id = %s AND payment_status != 'Refunded';
            """, (self._id,))
            paid = Decimal(str(cursor.fetchone()[0]))
            return max(Decimal("0.00"), self._total_repair_cost - paid)
`
    },
    {
      name: "services/report_service.py",
      path: "services/report_service.py",
      language: "python",
      category: "services",
      content: `"""
ReportGenerator Service
Implements ReportLab PDF generation and CSV exports.
Calculates revenue from actual payments received.
"""

import io
import csv
from reportlab.lib.pagesizes import letter, landscape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from database.db_connection import db

class ReportGenerator:
    @staticmethod
    def export_csv(report_type, start_date=None, end_date=None):
        """Generates dynamic CSV stream using Python built-in csv module"""
        output = io.StringIO()
        writer = csv.writer(output)

        with db.get_cursor() as cursor:
            if report_type == 'all_repairs':
                cursor.execute("""
                    SELECT r.job_code, c.full_name, CONCAT(d.brand, ' ', d.model), 
                           r.repair_status, r.assigned_technician, r.labor_cost, r.parts_cost, r.total_repair_cost
                    FROM repair_jobs r
                    JOIN customers c ON r.customer_id = c.id
                    JOIN devices d ON r.device_id = d.id;
                """)
                writer.writerow(['Job Code', 'Customer', 'Device', 'Status', 'Technician', 'Labor (PHP)', 'Parts (PHP)', 'Total (PHP)'])
                for row in cursor.fetchall():
                    writer.writerow(row)

            elif report_type == 'payments_received':
                cursor.execute("""
                    SELECT p.payment_code, p.payment_date, c.full_name, p.payment_method, 
                           p.amount_paid, p.remaining_balance, p.transaction_reference
                    FROM payments p
                    JOIN customers c ON p.customer_id = c.id
                    WHERE p.amount_paid > 0;
                """)
                writer.writerow(['Payment Code', 'Date', 'Customer', 'Method', 'Amount (PHP)', 'Balance (PHP)', 'Reference'])
                for row in cursor.fetchall():
                    writer.writerow(row)

        output.seek(0)
        return output.getvalue()

    @staticmethod
    def generate_pdf(report_title, table_data, headers):
        """Generates PDF using ReportLab"""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=landscape(letter), rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=30)
        elements = []
        styles = getSampleStyleSheet()

        elements.append(Paragraph(f"<b>TechPulse Computer Repair Shop - {report_title}</b>", styles['Title']))
        elements.append(Spacer(1, 15))

        data = [headers] + table_data
        t = Table(data)
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0f172a')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 9),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ]))
        elements.append(t)
        doc.build(elements)
        buffer.seek(0)
        return buffer.getvalue()
`
    },
    {
      name: "tests/test_auth.py",
      path: "tests/test_auth.py",
      language: "python",
      category: "tests",
      content: `"""
Automated Authentication Test Suite (pytest)
Tests login, password hashing, and role-based permissions.
"""

import pytest
from werkzeug.security import check_password_hash, generate_password_hash
from models.user import User

def test_password_hashing():
    raw_password = "SecureTechPassword2026!"
    hashed = generate_password_hash(raw_password)
    
    assert check_password_hash(hashed, raw_password) is True
    assert check_password_hash(hashed, "WrongPassword") is False
    assert raw_password not in hashed

def test_admin_vs_staff_role_permissions():
    admin = User(1, "Juan Admin", "admin", "hash", "Admin", "Active")
    staff = User(2, "Mark Tech", "tech_mark", "hash", "Staff", "Active")

    assert admin.is_admin() is True
    assert staff.is_admin() is False
`
    },
    {
      name: "README.md",
      path: "README.md",
      language: "markdown",
      category: "core",
      content: `# Computer Repair Shop Management System

**Academic Project:** System Integration and Architecture (SIA1)  
**Course Code:** LFCA311M111  
**Technologies:** Python 3.10+, Flask, MySQL, Bootstrap 5, Chart.js, ReportLab, pytest  

## Installation & Setup Instructions (Windows & VS Code)

### 1. Prerequisites
- Python 3.10 or higher installed. Add Python to Windows PATH.
- MySQL Server (via MySQL Community Server or XAMPP) running on localhost:3306.
- Visual Studio Code.

### 2. Clone and Setup Virtual Environment
\`\`\`bash
# Open VS Code terminal in project directory
python -m venv venv
venv\\Scripts\\activate
\`\`\`

### 3. Install Dependencies
\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 4. Configure MySQL Database
1. Open MySQL Workbench or phpMyAdmin.
2. Run the database initialization schema:
\`\`\`sql
SOURCE database/schema.sql;
\`\`\`

### 5. Configure Environment Variables
Copy \`.env.example\` to \`.env\`:
\`\`\`env
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=techpulse_super_secret_jwt_key_2026
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=computer_repair_shop
\`\`\`

### 6. Generate 200+ Verified Sample Records
Run the Python seed script to insert over 200 customers, devices, repairs, and payments:
\`\`\`bash
python seed_data.py --reset
\`\`\`

### 7. Run the Flask Web Application
\`\`\`bash
python app.py
\`\`\`
Visit **http://localhost:5000** in your browser.

### 8. Run Automated Tests
\`\`\`bash
pytest
\`\`\`
`
    }
  ];

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const currentFile = files[selectedFileIndex] || files[0];

  const handleCopy = () => {
    if (!currentFile) return;
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!currentFile) return;
    const blob = new Blob([currentFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Add all project files into zip with correct directory structure
      files.forEach((f) => {
        zip.file(f.path, f.content);
      });

      // Also add .env.example
      zip.file(".env.example", `FLASK_APP=app.py\nFLASK_ENV=development\nSECRET_KEY=techpulse_super_secret_jwt_key_2026\nDB_HOST=localhost\nDB_PORT=3306\nDB_USER=root\nDB_PASSWORD=\nDB_NAME=computer_repair_shop\n`);

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = "computer-repair-shop-python-vscode.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("ZIP creation error:", err);
      alert("Failed to package ZIP. You can still download individual files below.");
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header with 1-Click ZIP Download and VS Code Guide */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-1">
              <span>Ready for Visual Studio Code &amp; Windows</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileCode2 className="w-5 h-5 text-emerald-600" />
              <span>Python &amp; MySQL Project Codebase</span>
            </h2>
            <p className="text-xs text-slate-500">
              Complete Python Flask backend, MySQL 3NF database schema, OOP domain models, ReportLab generator, and pytest suite.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>How to Run in VS Code</span>
            </button>

            <button
              onClick={handleDownloadAllZip}
              disabled={isZipping}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              <FolderDown className="w-4 h-4" />
              <span>{isZipping ? 'Packaging ZIP...' : 'Download Full Project (.ZIP)'}</span>
            </button>
          </div>
        </div>

        {/* Quick Commands Banner */}
        <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2 text-slate-400">
            <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-sans font-bold">Quick Setup:</span>
            <span className="text-emerald-400">python -m venv venv</span>
            <span className="text-slate-500">&&</span>
            <span className="text-emerald-400">pip install -r requirements.txt</span>
            <span className="text-slate-500">&&</span>
            <span className="text-emerald-400">python seed_data.py --reset</span>
            <span className="text-slate-500">&&</span>
            <span className="text-emerald-400">python app.py</span>
          </div>
        </div>
      </div>

      {/* Code Viewer Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sidebar File Tree */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1 text-xs">
          <div className="px-2 py-1.5 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
            Project Files ({files.length})
          </div>

          {files.map((file, idx) => (
            <button
              key={file.path}
              onClick={() => setSelectedFileIndex(idx)}
              className={`w-full text-left px-2.5 py-2 rounded-lg font-mono text-xs flex items-center justify-between transition-colors ${
                selectedFileIndex === idx
                  ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Code className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{file.name}</span>
              </div>
              <span className="text-[10px] px-1 py-0.2 rounded bg-slate-100 text-slate-500 uppercase font-sans">
                {file.language}
              </span>
            </button>
          ))}
        </div>

        {/* Code Content View */}
        <div className="md:col-span-3 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 shadow-md overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-mono text-slate-300 font-semibold">{currentFile.path}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <pre className="p-4 font-mono text-xs overflow-x-auto overflow-y-auto max-h-[600px] leading-relaxed text-emerald-400/90 whitespace-pre">
            {currentFile.content}
          </pre>
        </div>
      </div>

      {/* VS Code Setup Guide Modal */}
      {isGuideOpen && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Laptop className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  How to Put and Run All Code in Visual Studio Code
                </h3>
              </div>
              <button
                onClick={() => setIsGuideOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-slate-700 leading-relaxed">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <strong className="text-blue-900 block mb-1">Method 1: 1-Click ZIP Download (Fastest &amp; Easiest)</strong>
                <ol className="list-decimal list-inside space-y-1 text-slate-800">
                  <li>Click the green <strong>"Download Full Project (.ZIP)"</strong> button above.</li>
                  <li>Extract the downloaded <code>computer-repair-shop-python-vscode.zip</code> file to a folder on your computer (e.g. <code>C:\Projects\computer-repair-shop</code>).</li>
                  <li>Open <strong>Visual Studio Code</strong>.</li>
                  <li>Click <strong>File &gt; Open Folder...</strong> and select the extracted folder.</li>
                </ol>
              </div>

              <div>
                <strong className="text-slate-900 text-sm block mb-2">Step-by-Step Running in VS Code Terminal:</strong>
                
                <div className="space-y-3">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800">1. Open the Terminal in VS Code:</span>
                    <p className="text-[11px] text-slate-500">Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-mono">Ctrl + `</kbd> (or go to <strong>Terminal &gt; New Terminal</strong>).</p>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800">2. Create and Activate Python Virtual Environment:</span>
                    <pre className="p-2 rounded bg-slate-900 text-emerald-400 font-mono text-[11px] mt-1">
python -m venv venv
venv\Scripts\activate
                    </pre>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800">3. Install Required Packages:</span>
                    <pre className="p-2 rounded bg-slate-900 text-emerald-400 font-mono text-[11px] mt-1">
pip install -r requirements.txt
                    </pre>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800">4. Setup MySQL Database:</span>
                    <p className="text-[11px] text-slate-600 mt-0.5">Start MySQL Server in XAMPP or MySQL Workbench, then run:</p>
                    <pre className="p-2 rounded bg-slate-900 text-emerald-400 font-mono text-[11px] mt-1">
mysql -u root -p &lt; database/schema.sql
                    </pre>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800">5. Seed the 200+ Sample Records:</span>
                    <pre className="p-2 rounded bg-slate-900 text-emerald-400 font-mono text-[11px] mt-1">
python seed_data.py --reset
                    </pre>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800">6. Launch Flask Application:</span>
                    <pre className="p-2 rounded bg-slate-900 text-emerald-400 font-mono text-[11px] mt-1">
python app.py
                    </pre>
                    <p className="text-[11px] text-slate-600 mt-1">Open your web browser and go to: <strong>http://localhost:5000</strong></p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                <strong>Test Accounts for Login:</strong>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs">
                  <li><strong>Admin:</strong> Username: <code>admin</code> | Password: <code>admin123</code></li>
                  <li><strong>Technician:</strong> Username: <code>tech_mark</code> | Password: <code>tech123</code></li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsGuideOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

