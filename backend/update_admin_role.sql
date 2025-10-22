-- Update admin user role
UPDATE users SET role = 'ADMIN' WHERE username = 'admin';

-- Verify the update
SELECT id, username, email, role FROM users WHERE username = 'admin';