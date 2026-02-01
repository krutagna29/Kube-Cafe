-- Migration: Add role column to users table
-- This allows users to have roles (user, admin) if needed in the future
-- For now, we keep admins separate, but this provides flexibility

ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user' AFTER email;

-- Update existing users to have 'user' role
UPDATE users SET role = 'user' WHERE role IS NULL;

-- Optional: If you want to allow users to be admins via role
-- You can set specific users to 'admin' role:
-- UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';

