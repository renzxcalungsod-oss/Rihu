-- ============================================================
-- Computer Repair Shop Management System
-- Database Schema: computer_repair_shop
-- Course: SIA1 (LFCA311M111)
-- ============================================================

CREATE DATABASE IF NOT EXISTS computer_repair_shop
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE computer_repair_shop;

-- 1. USERS TABLE
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

-- 6. REPAIR JOB SERVICES (Bridge Table)
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

-- Insert initial shop settings
INSERT INTO settings (setting_key, setting_value) VALUES
('shop_name', 'TechPulse Computer & Laptop Repair Center'),
('shop_address', 'Unit 304, CyberHub Plaza, EDSA cor. Aurora Blvd, Cubao, Quezon City'),
('contact_number', '+63 (02) 8921-4567 / 0917-889-4321'),
('email_address', 'support@techpulserepairs.ph'),
('currency', '₱'),
('default_warranty', '90 Days Service Warranty'),
('default_estimated_duration_days', '3'),
('tin_number', '248-912-705-000')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);
