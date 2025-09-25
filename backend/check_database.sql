-- Connect to your MySQL database and run these queries to check the data

-- Show all databases
SHOW DATABASES;

-- Use the budget tracker database
USE budget_tracker;

-- Show all tables
SHOW TABLES;

-- Check users table structure
DESCRIBE users;

-- See all registered users
SELECT id, username, email, role, created_at, is_enabled 
FROM users 
ORDER BY created_at DESC;

-- Count total users
SELECT COUNT(*) as total_users FROM users;