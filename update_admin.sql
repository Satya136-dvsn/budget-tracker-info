UPDATE users SET role = 'ADMIN' WHERE username = 'admin';
SELECT id, username, email, role FROM users WHERE username = 'admin';