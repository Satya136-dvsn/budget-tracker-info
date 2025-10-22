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
