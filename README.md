# Computer Repair Shop Management System

**Academic Subject:** System Integration and Architecture (SIA1)  
**Course / Section:** LFCA311M111  
**Application Type:** Web-Based GUI Application  
**Primary Language:** Python 3.10+ (Flask, OOP, mysql-connector-python)  
**Database:** MySQL (Normalized 3NF - `computer_repair_shop`)  
**Frontend GUI:** Responsive Admin Dashboard with Dark Navy Sidebar, Bootstrap 5 / Tailwind styling, Chart.js, and ReportLab PDF Generation.

---

## 1. Project Overview

The **Computer Repair Shop Management System** is a complete, full-stack web application designed for computer repair shops to manage customers, hardware computer devices, repair tickets, diagnostic bench workflows, standardized services, billing and payments (₱ PHP), and automated PDF/CSV reporting.

The system features:
- **Authentication & RBAC:** Session management via Flask-Login with Admin and Staff roles, Werkzeug SHA-256 password hashing, and CSRF protection.
- **Customer Directory:** Full CRUD operations with foreign key dependency protection.
- **Device Inventory:** Tracks laptops, desktops, MacBooks, and custom gaming PCs with serial numbers, OS, and physical condition.
- **Repair Job Workflow:** 6 status milestones (`Pending`, `In Progress`, `Waiting for Parts`, `Completed`, `Released`, `Cancelled`), dynamic labor + parts calculation, overdue alerts, and audit trail history (`repair_status_history`).
- **Service Catalog:** 15+ standardized hardware and software repair services with active/inactive toggles.
- **Payments Management:** Full and partial payments, remaining balance calculation (`Remaining Balance = Total Cost - Valid Payments`), cash, GCash, Maya, and bank transfers with printable receipts.
- **Reports & Analytics:** 9 business reports with date/status filters, CSV export, and ReportLab PDF generation.
- **200+ Verified Sample Records:** Pre-seeded with 205 realistic Philippine customer records, devices, repair jobs, and payments.

---

## 2. Installation & Setup Guide (Windows & VS Code)

### Prerequisites
1. **Python 3.10 or higher** installed. Ensure "Add Python to PATH" was checked during installation.
2. **MySQL Server** installed and running (via MySQL Community Server or XAMPP) on `localhost:3306`.
3. **Visual Studio Code** installed.

### Step 1: Clone and Create Virtual Environment
Open PowerShell or Command Prompt inside the project directory in VS Code:
```bash
python -m venv venv
venv\Scripts\activate
```

### Step 2: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env` and configure your MySQL credentials:
```bash
copy .env.example .env
```
Default `.env` configuration:
```env
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=techpulse_super_secret_jwt_key_2026_sia1
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=computer_repair_shop
```

### Step 4: Initialize MySQL Database Schema
Open MySQL Workbench, phpMyAdmin, or the MySQL command line, and execute:
```sql
SOURCE database/schema.sql;
```
This creates the normalized `computer_repair_shop` database and all 9 tables:
`users`, `customers`, `devices`, `services`, `repair_jobs`, `repair_job_services`, `payments`, `repair_status_history`, and `settings`.

### Step 5: Seed 200+ Verified Sample Records
Run the Python seed script to generate over 200 realistic Philippine records:
```bash
python seed_data.py --reset
```
Output summary:
```text
✓ Customers:   205
✓ Devices:     205
✓ Repair Jobs: 205
✓ Payments:    205
✓ Services:    15
✓ Staff Users: 5
```

### Step 6: Start the Flask Web Application
```bash
python app.py
```
Open your browser and navigate to:
**http://localhost:5000** (or http://localhost:3000 in the live preview).

### Step 7: Log in with Documented Test Accounts
- **Administrator:** Username: `admin` | Password: `admin123`
- **Lead Technician (Staff):** Username: `tech_mark` | Password: `tech123`

### Step 8: Run Automated Tests
```bash
pytest
```
All unit tests in `tests/test_auth.py`, `tests/test_customers.py`, `tests/test_repairs.py`, and `tests/test_payments.py` will execute and verify the business logic.
