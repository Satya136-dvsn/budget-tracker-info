-- BudgetWise Application - Clean Database
-- No sample data - users will add their own transactions

-- Ensure testuser1 exists for testing (insert if not exists)
INSERT IGNORE INTO users (username, email, password, role, created_at, updated_at, is_account_non_expired, is_account_non_locked, is_credentials_non_expired, is_enabled) 
VALUES ('testuser1', 'testuser1@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'USER', NOW(), NOW(), true, true, true, true);

-- Clean database - remove any existing sample data for testuser1
DELETE FROM transactions WHERE user_id = (SELECT id FROM users WHERE username = 'testuser1');
DELETE FROM budgets WHERE user_id = (SELECT id FROM users WHERE username = 'testuser1');
DELETE FROM savings_goals WHERE user_id = (SELECT id FROM users WHERE username = 'testuser1');