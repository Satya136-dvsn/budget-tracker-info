-- Sample data for BudgetWise application
-- This will be loaded automatically by Spring Boot

-- First, ensure testuser1 exists (insert if not exists)
INSERT IGNORE INTO users (username, email, password, role, created_at, updated_at, is_account_non_expired, is_account_non_locked, is_credentials_non_expired, is_enabled) 
VALUES ('testuser1', 'testuser1@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'USER', NOW(), NOW(), true, true, true, true);

-- Get the user ID for testuser1
SET @user_id = (SELECT id FROM users WHERE username = 'testuser1');

-- Insert sample transactions for the past 6 months
-- May 2024 transactions
INSERT IGNORE INTO transactions (user_id, title, description, amount, type, category, transaction_date, created_at, updated_at) VALUES
(@user_id, 'Grocery Shopping', 'Weekly groceries at Walmart', 85.50, 'EXPENSE', 'Food & Dining', '2024-05-02 10:30:00', NOW(), NOW()),
(@user_id, 'Salary Payment', 'Monthly salary deposit', 3500.00, 'INCOME', 'Salary', '2024-05-01 09:00:00', NOW(), NOW()),
(@user_id, 'Gas Station', 'Fuel for car', 45.20, 'EXPENSE', 'Transportation', '2024-05-03 16:45:00', NOW(), NOW()),
(@user_id, 'Netflix Subscription', 'Monthly streaming service', 15.99, 'EXPENSE', 'Entertainment', '2024-05-05 12:00:00', NOW(), NOW()),
(@user_id, 'Electricity Bill', 'Monthly utility payment', 120.75, 'EXPENSE', 'Bills & Utilities', '2024-05-10 14:20:00', NOW(), NOW()),
(@user_id, 'Restaurant Dinner', 'Dinner at Italian restaurant', 67.80, 'EXPENSE', 'Food & Dining', '2024-05-12 19:30:00', NOW(), NOW()),
(@user_id, 'Online Shopping', 'Clothes from Amazon', 89.99, 'EXPENSE', 'Shopping', '2024-05-15 11:15:00', NOW(), NOW()),
(@user_id, 'Doctor Visit', 'Regular checkup', 150.00, 'EXPENSE', 'Healthcare', '2024-05-18 10:00:00', NOW(), NOW()),
(@user_id, 'Freelance Work', 'Web design project', 500.00, 'INCOME', 'Freelance', '2024-05-20 15:30:00', NOW(), NOW()),
(@user_id, 'Grocery Shopping', 'Weekly groceries', 92.30, 'EXPENSE', 'Food & Dining', '2024-05-22 11:00:00', NOW(), NOW()),

-- June 2024 transactions
(@user_id, 'Salary Payment', 'Monthly salary deposit', 3500.00, 'INCOME', 'Salary', '2024-06-01 09:00:00', NOW(), NOW()),
(@user_id, 'Rent Payment', 'Monthly apartment rent', 1200.00, 'EXPENSE', 'Bills & Utilities', '2024-06-01 10:00:00', NOW(), NOW()),
(@user_id, 'Grocery Shopping', 'Weekly groceries', 78.45, 'EXPENSE', 'Food & Dining', '2024-06-03 10:30:00', NOW(), NOW()),
(@user_id, 'Gas Station', 'Fuel for car', 52.10, 'EXPENSE', 'Transportation', '2024-06-05 17:20:00', NOW(), NOW()),
(@user_id, 'Coffee Shop', 'Morning coffee', 4.75, 'EXPENSE', 'Food & Dining', '2024-06-07 08:15:00', NOW(), NOW()),
(@user_id, 'Gym Membership', 'Monthly fitness membership', 45.00, 'EXPENSE', 'Healthcare', '2024-06-10 12:00:00', NOW(), NOW()),
(@user_id, 'Online Course', 'Programming course', 99.99, 'EXPENSE', 'Education', '2024-06-12 14:30:00', NOW(), NOW()),
(@user_id, 'Restaurant Lunch', 'Business lunch', 35.60, 'EXPENSE', 'Food & Dining', '2024-06-15 12:30:00', NOW(), NOW()),
(@user_id, 'Investment Dividend', 'Stock dividend payment', 75.50, 'INCOME', 'Investment', '2024-06-22 10:00:00', NOW(), NOW()),

-- July 2024 transactions
(@user_id, 'Salary Payment', 'Monthly salary deposit', 3500.00, 'INCOME', 'Salary', '2024-07-01 09:00:00', NOW(), NOW()),
(@user_id, 'Rent Payment', 'Monthly apartment rent', 1200.00, 'EXPENSE', 'Bills & Utilities', '2024-07-01 10:00:00', NOW(), NOW()),
(@user_id, 'Vacation Expenses', 'Weekend trip hotel', 280.00, 'EXPENSE', 'Entertainment', '2024-07-05 16:00:00', NOW(), NOW()),
(@user_id, 'Grocery Shopping', 'Weekly groceries', 88.75, 'EXPENSE', 'Food & Dining', '2024-07-08 10:45:00', NOW(), NOW()),
(@user_id, 'Car Maintenance', 'Oil change and inspection', 85.00, 'EXPENSE', 'Transportation', '2024-07-10 14:30:00', NOW(), NOW()),
(@user_id, 'Pharmacy', 'Prescription medication', 25.99, 'EXPENSE', 'Healthcare', '2024-07-12 11:20:00', NOW(), NOW()),
(@user_id, 'Restaurant Dinner', 'Date night dinner', 95.40, 'EXPENSE', 'Food & Dining', '2024-07-18 19:45:00', NOW(), NOW()),
(@user_id, 'Freelance Work', 'Logo design project', 300.00, 'INCOME', 'Freelance', '2024-07-20 16:30:00', NOW(), NOW()),

-- August 2024 transactions
(@user_id, 'Salary Payment', 'Monthly salary deposit', 3500.00, 'INCOME', 'Salary', '2024-08-01 09:00:00', NOW(), NOW()),
(@user_id, 'Rent Payment', 'Monthly apartment rent', 1200.00, 'EXPENSE', 'Bills & Utilities', '2024-08-01 10:00:00', NOW(), NOW()),
(@user_id, 'Back to School Shopping', 'Office supplies', 125.60, 'EXPENSE', 'Shopping', '2024-08-03 15:30:00', NOW(), NOW()),
(@user_id, 'Grocery Shopping', 'Weekly groceries', 94.25, 'EXPENSE', 'Food & Dining', '2024-08-05 11:00:00', NOW(), NOW()),
(@user_id, 'Concert Tickets', 'Live music event', 120.00, 'EXPENSE', 'Entertainment', '2024-08-10 20:00:00', NOW(), NOW()),
(@user_id, 'Dental Cleaning', 'Routine dental care', 180.00, 'EXPENSE', 'Healthcare', '2024-08-12 14:00:00', NOW(), NOW()),
(@user_id, 'Online Shopping', 'Electronics accessories', 67.99, 'EXPENSE', 'Shopping', '2024-08-15 12:30:00', NOW(), NOW()),

-- September 2024 transactions
(@user_id, 'Salary Payment', 'Monthly salary deposit', 3500.00, 'INCOME', 'Salary', '2024-09-01 09:00:00', NOW(), NOW()),
(@user_id, 'Rent Payment', 'Monthly apartment rent', 1200.00, 'EXPENSE', 'Bills & Utilities', '2024-09-01 10:00:00', NOW(), NOW()),
(@user_id, 'Grocery Shopping', 'Weekly groceries', 89.15, 'EXPENSE', 'Food & Dining', '2024-09-03 10:45:00', NOW(), NOW()),
(@user_id, 'Car Insurance', 'Semi-annual premium', 320.00, 'EXPENSE', 'Transportation', '2024-09-05 11:30:00', NOW(), NOW()),
(@user_id, 'Gym Membership', 'Monthly fitness membership', 45.00, 'EXPENSE', 'Healthcare', '2024-09-10 12:00:00', NOW(), NOW()),
(@user_id, 'Software Subscription', 'Adobe Creative Suite', 52.99, 'EXPENSE', 'Education', '2024-09-12 15:45:00', NOW(), NOW()),
(@user_id, 'Restaurant Dinner', 'Family dinner', 78.90, 'EXPENSE', 'Food & Dining', '2024-09-15 18:30:00', NOW(), NOW()),
(@user_id, 'Freelance Work', 'Website development', 800.00, 'INCOME', 'Freelance', '2024-09-18 17:00:00', NOW(), NOW()),

-- October 2024 transactions (current month)
(@user_id, 'Salary Payment', 'Monthly salary deposit', 3500.00, 'INCOME', 'Salary', '2024-10-01 09:00:00', NOW(), NOW()),
(@user_id, 'Rent Payment', 'Monthly apartment rent', 1200.00, 'EXPENSE', 'Bills & Utilities', '2024-10-01 10:00:00', NOW(), NOW()),
(@user_id, 'Grocery Shopping', 'Weekly groceries', 92.35, 'EXPENSE', 'Food & Dining', '2024-10-03 10:30:00', NOW(), NOW()),
(@user_id, 'Gas Station', 'Fuel for car', 51.20, 'EXPENSE', 'Transportation', '2024-10-05 16:15:00', NOW(), NOW()),
(@user_id, 'Halloween Decorations', 'Seasonal shopping', 35.99, 'EXPENSE', 'Shopping', '2024-10-08 13:45:00', NOW(), NOW()),
(@user_id, 'Restaurant Lunch', 'Client meeting lunch', 58.75, 'EXPENSE', 'Food & Dining', '2024-10-10 12:30:00', NOW(), NOW()),
(@user_id, 'Health Insurance', 'Monthly premium', 285.00, 'EXPENSE', 'Healthcare', '2024-10-12 10:00:00', NOW(), NOW()),
(@user_id, 'Online Course', 'Data science certification', 149.99, 'EXPENSE', 'Education', '2024-10-15 14:00:00', NOW(), NOW()),
(@user_id, 'Investment Dividend', 'Quarterly dividend', 125.75, 'INCOME', 'Investment', '2024-10-16 10:30:00', NOW(), NOW());