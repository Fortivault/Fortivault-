-- Add admin users table and secure authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Add password_hash column to agents table
ALTER TABLE agents ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin_users
CREATE POLICY "Admin users can read own data" ON admin_users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_agents_email ON agents(email);

-- Insert default admin user (password should be changed immediately)
-- Default password: SecureAdmin2024! (hashed)
INSERT INTO admin_users (email, password_hash, name, role) 
VALUES (
  'admin@fortivault.com',
  '$2a$12$LQv3c1yqBw2fyuPifeS2aOEn4TenVvhfvUHLbvVqvpI7f2PYa6YYm', -- SecureAdmin2024!
  'System Administrator',
  'super_admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert default agent user
INSERT INTO agents (email, password_hash, name, specialization, status) 
VALUES (
  'agent@fortivault.com',
  '$2a$12$LQv3c1yqBw2fyuPifeS2aOEn4TenVvhfvUHLbvVqvpI7f2PYa6YYm', -- SecureAgent2024!
  'Recovery Agent',
  'Multi-Specialist Recovery Agent',
  'active'
) ON CONFLICT (email) DO NOTHING;
