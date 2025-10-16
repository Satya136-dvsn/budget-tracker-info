-- ==========================================
-- Milestone 3: Budget and Savings Goals
-- Database Migration Script
-- ==========================================
-- Date: October 6, 2025
-- Description: Create tables for Budget and Savings Goals features
-- ==========================================

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    category VARCHAR(100) NOT NULL,
    budget_amount DECIMAL(10, 2) NOT NULL,
    spent_amount DECIMAL(10, 2) DEFAULT 0.00,
    month INT NOT NULL,
    year INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Unique constraint: one budget per category per month/year per user
    UNIQUE KEY unique_budget (user_id, category, month, year),
    
    -- Index for faster queries
    INDEX idx_user_month_year (user_id, month, year),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create savings_goals table
CREATE TABLE IF NOT EXISTS savings_goals (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    target_amount DECIMAL(10, 2) NOT NULL,
    current_amount DECIMAL(10, 2) DEFAULT 0.00,
    target_date DATE,
    status VARCHAR(20) DEFAULT 'IN_PROGRESS',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    
    -- Foreign key constraint
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Index for faster queries
    INDEX idx_user_status (user_id, status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Sample Data (Optional - for testing)
-- ==========================================

-- Sample budgets for user with id=1 (if exists)
-- INSERT INTO budgets (user_id, category, budget_amount, spent_amount, month, year) VALUES
-- (1, 'Food', 500.00, 0.00, 10, 2025),
-- (1, 'Transportation', 200.00, 0.00, 10, 2025),
-- (1, 'Entertainment', 150.00, 0.00, 10, 2025);

-- Sample savings goals for user with id=1 (if exists)
-- INSERT INTO savings_goals (user_id, name, description, target_amount, current_amount, target_date) VALUES
-- (1, 'Emergency Fund', 'Build 6 months of expenses', 10000.00, 0.00, '2026-06-01'),
-- (1, 'Vacation', 'Trip to Europe', 3000.00, 0.00, '2025-12-31'),
-- (1, 'New Laptop', 'MacBook Pro', 2500.00, 500.00, '2025-11-30');

-- ==========================================
-- Verification Queries
-- ==========================================

-- Check if tables were created
SELECT 
    TABLE_NAME, 
    TABLE_ROWS, 
    CREATE_TIME 
FROM 
    information_schema.TABLES 
WHERE 
    TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME IN ('budgets', 'savings_goals');

-- Count records (should be 0 initially)
SELECT 'budgets' AS table_name, COUNT(*) AS count FROM budgets
UNION ALL
SELECT 'savings_goals' AS table_name, COUNT(*) AS count FROM savings_goals;
