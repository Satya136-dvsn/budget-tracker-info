-- Database setup script for Budget Tracker
-- Run this script to create the database and initial admin user

-- Create database
CREATE DATABASE IF NOT EXISTS budget_tracker;
USE budget_tracker;

-- The users table will be created automatically by Hibernate
-- when the application starts due to spring.jpa.hibernate.ddl-auto=update

-- Optional: Create an initial admin user
-- Note: The password will be encrypted by BCrypt when the application runs
-- Default password is 'admin123' - change it after first login

INSERT INTO users (username, email, password, role, created_at, updated_at, is_enabled, is_account_non_expired, is_account_non_locked, is_credentials_non_expired) 
VALUES ('admin', 'admin@budgettracker.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'ADMIN', NOW(), NOW(), true, true, true, true)
ON DUPLICATE KEY UPDATE username = username;

-- Note: The password hash above is for 'admin123'
-- You should change this password after first login for security
-- Create retirement_plans table
CREATE TABLE IF NOT EXISTS retirement_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    current_age INT NOT NULL,
    retirement_age INT NOT NULL,
    current_annual_income DECIMAL(15,2),
    desired_replacement_ratio DECIMAL(5,4),
    current_401k_balance DECIMAL(15,2),
    current_ira_balance DECIMAL(15,2),
    other_retirement_savings DECIMAL(15,2),
    monthly_401k_contribution DECIMAL(10,2),
    monthly_ira_contribution DECIMAL(10,2),
    employer_match_rate DECIMAL(5,4),
    employer_match_limit DECIMAL(5,4),
    expected_annual_return DECIMAL(5,4),
    expected_inflation_rate DECIMAL(5,4),
    social_security_benefit DECIMAL(10,2),
    life_expectancy INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_retirement_plans_user_id (user_id),
    INDEX idx_retirement_plans_updated_at (updated_at)
);

-- Create debts table
CREATE TABLE IF NOT EXISTS debts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('CREDIT_CARD', 'PERSONAL_LOAN', 'STUDENT_LOAN', 'MORTGAGE', 'AUTO_LOAN', 'HOME_EQUITY_LOAN', 'BUSINESS_LOAN', 'OTHER') NOT NULL,
    current_balance DECIMAL(10,2) NOT NULL,
    original_balance DECIMAL(10,2),
    interest_rate DECIMAL(5,4) NOT NULL,
    minimum_payment DECIMAL(10,2) NOT NULL,
    due_date INT,
    payment_start_date DATE,
    status ENUM('ACTIVE', 'PAID_OFF', 'DEFERRED', 'IN_DEFAULT') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    paid_off_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_debts_user_id (user_id),
    INDEX idx_debts_status (status),
    INDEX idx_debts_type (type),
    INDEX idx_debts_updated_at (updated_at),
    INDEX idx_debts_interest_rate (interest_rate),
    INDEX idx_debts_current_balance (current_balance)
);

-- Create tax_plans table
CREATE TABLE IF NOT EXISTS tax_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    tax_year INT NOT NULL,
    filing_status ENUM('SINGLE', 'MARRIED_FILING_JOINTLY', 'MARRIED_FILING_SEPARATELY', 'HEAD_OF_HOUSEHOLD', 'QUALIFYING_WIDOW') NOT NULL,
    annual_income DECIMAL(15,2),
    federal_withholding DECIMAL(10,2) DEFAULT 0.00,
    state_withholding DECIMAL(10,2) DEFAULT 0.00,
    estimated_tax_payments DECIMAL(10,2) DEFAULT 0.00,
    standard_deduction DECIMAL(10,2),
    itemized_deductions DECIMAL(10,2) DEFAULT 0.00,
    mortgage_interest DECIMAL(10,2) DEFAULT 0.00,
    state_local_taxes DECIMAL(10,2) DEFAULT 0.00,
    charitable_contributions DECIMAL(10,2) DEFAULT 0.00,
    medical_expenses DECIMAL(10,2) DEFAULT 0.00,
    traditional_401k_contribution DECIMAL(10,2) DEFAULT 0.00,
    traditional_ira_contribution DECIMAL(10,2) DEFAULT 0.00,
    roth_ira_contribution DECIMAL(10,2) DEFAULT 0.00,
    hsa_contribution DECIMAL(10,2) DEFAULT 0.00,
    capital_gains DECIMAL(10,2) DEFAULT 0.00,
    capital_losses DECIMAL(10,2) DEFAULT 0.00,
    dividend_income DECIMAL(10,2) DEFAULT 0.00,
    interest_income DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_tax_year (user_id, tax_year),
    INDEX idx_tax_plans_user_id (user_id),
    INDEX idx_tax_plans_tax_year (tax_year),
    INDEX idx_tax_plans_filing_status (filing_status),
    INDEX idx_tax_plans_updated_at (updated_at)
);

-- Create bills table
CREATE TABLE IF NOT EXISTS bills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(12,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    frequency ENUM('ONE_TIME', 'WEEKLY', 'BI_WEEKLY', 'MONTHLY', 'QUARTERLY', 'SEMI_ANNUALLY', 'ANNUALLY') NOT NULL,
    due_date DATE NOT NULL,
    next_due_date DATE,
    status ENUM('ACTIVE', 'INACTIVE', 'PAID_OFF', 'OVERDUE') NOT NULL DEFAULT 'ACTIVE',
    auto_pay BOOLEAN NOT NULL DEFAULT FALSE,
    reminder_days_before INT DEFAULT 3,
    payee VARCHAR(255),
    account_number VARCHAR(100),
    website_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_bills_user_id (user_id),
    INDEX idx_bills_status (status),
    INDEX idx_bills_category (category),
    INDEX idx_bills_frequency (frequency),
    INDEX idx_bills_next_due_date (next_due_date),
    INDEX idx_bills_updated_at (updated_at)
);

-- Create bill_payments table
CREATE TABLE IF NOT EXISTS bill_payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bill_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    amount_paid DECIMAL(12,2) NOT NULL,
    payment_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('PENDING', 'PAID', 'OVERDUE', 'PARTIAL', 'FAILED', 'CANCELLED') NOT NULL,
    payment_method ENUM('CASH', 'CHECK', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'ONLINE_PAYMENT', 'AUTO_PAY', 'MOBILE_PAYMENT', 'OTHER'),
    confirmation_number VARCHAR(100),
    notes TEXT,
    late_fee DECIMAL(10,2) DEFAULT 0.00,
    is_auto_pay BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_bill_payments_bill_id (bill_id),
    INDEX idx_bill_payments_user_id (user_id),
    INDEX idx_bill_payments_status (status),
    INDEX idx_bill_payments_payment_date (payment_date),
    INDEX idx_bill_payments_due_date (due_date),
    INDEX idx_bill_payments_updated_at (updated_at)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type ENUM('BILL_REMINDER', 'BILL_OVERDUE', 'PAYMENT_CONFIRMATION', 'BUDGET_ALERT', 'GOAL_MILESTONE', 'SYSTEM_NOTIFICATION', 'SECURITY_ALERT', 'PROMOTIONAL') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_entity_id BIGINT,
    related_entity_type VARCHAR(50),
    status ENUM('PENDING', 'SENT', 'DELIVERED', 'UNREAD', 'READ', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'UNREAD',
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') NOT NULL DEFAULT 'MEDIUM',
    scheduled_at TIMESTAMP NULL,
    sent_at TIMESTAMP NULL,
    read_at TIMESTAMP NULL,
    action_url VARCHAR(500),
    action_text VARCHAR(100),
    email_sent BOOLEAN NOT NULL DEFAULT FALSE,
    push_sent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notifications_user_id (user_id),
    INDEX idx_notifications_type (type),
    INDEX idx_notifications_status (status),
    INDEX idx_notifications_priority (priority),
    INDEX idx_notifications_scheduled_at (scheduled_at),
    INDEX idx_notifications_created_at (created_at)
);

-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    email_bill_reminders BOOLEAN NOT NULL DEFAULT TRUE,
    email_overdue_bills BOOLEAN NOT NULL DEFAULT TRUE,
    email_payment_confirmations BOOLEAN NOT NULL DEFAULT TRUE,
    email_budget_alerts BOOLEAN NOT NULL DEFAULT TRUE,
    email_goal_milestones BOOLEAN NOT NULL DEFAULT TRUE,
    push_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    push_bill_reminders BOOLEAN NOT NULL DEFAULT TRUE,
    push_overdue_bills BOOLEAN NOT NULL DEFAULT TRUE,
    push_payment_confirmations BOOLEAN NOT NULL DEFAULT FALSE,
    push_budget_alerts BOOLEAN NOT NULL DEFAULT TRUE,
    push_goal_milestones BOOLEAN NOT NULL DEFAULT TRUE,
    in_app_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    in_app_bill_reminders BOOLEAN NOT NULL DEFAULT TRUE,
    in_app_overdue_bills BOOLEAN NOT NULL DEFAULT TRUE,
    in_app_payment_confirmations BOOLEAN NOT NULL DEFAULT TRUE,
    in_app_budget_alerts BOOLEAN NOT NULL DEFAULT TRUE,
    in_app_goal_milestones BOOLEAN NOT NULL DEFAULT TRUE,
    quiet_hours_start INT DEFAULT 22,
    quiet_hours_end INT DEFAULT 8,
    timezone VARCHAR(50) DEFAULT 'UTC',
    digest_frequency ENUM('NEVER', 'DAILY', 'WEEKLY', 'MONTHLY') DEFAULT 'DAILY',
    reminder_advance_days INT DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notification_preferences_user_id (user_id)
);