-- Create database schema for real-time chat functionality
-- This script sets up tables for cases, messages, and user management

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create cases table
CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id VARCHAR(20) UNIQUE NOT NULL, -- Format: CSRU-XXXXXXXXX
  victim_email VARCHAR(255) NOT NULL,
  victim_phone VARCHAR(50),
  scam_type VARCHAR(50) NOT NULL,
  amount DECIMAL(15,2),
  currency VARCHAR(10),
  timeline VARCHAR(50),
  description TEXT,
  transaction_hashes JSONB DEFAULT '[]',
  bank_references JSONB DEFAULT '[]',
  evidence_file_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Intake',
  assigned_agent_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) DEFAULT 'Recovery Specialist',
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  victim_email VARCHAR(255) NOT NULL,
  assigned_agent_id UUID REFERENCES agents(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('victim', 'agent')),
  sender_id VARCHAR(255) NOT NULL, -- email for victims, agent UUID for agents
  sender_name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'system')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cases_case_id ON cases(case_id);
CREATE INDEX IF NOT EXISTS idx_cases_victim_email ON cases(victim_email);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_case_id ON chat_rooms(case_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_room_id ON messages(chat_room_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Enable Row Level Security
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cases table
CREATE POLICY "Users can view their own cases" ON cases
  FOR SELECT USING (victim_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Agents can view assigned cases" ON cases
  FOR SELECT USING (assigned_agent_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid);

CREATE POLICY "Users can insert their own cases" ON cases
  FOR INSERT WITH CHECK (victim_email = current_setting('request.jwt.claims', true)::json->>'email');

-- RLS Policies for agents table
CREATE POLICY "Agents can view all agents" ON agents
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Agents can update their own profile" ON agents
  FOR UPDATE USING (id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid);

-- RLS Policies for chat_rooms table
CREATE POLICY "Users can view their chat rooms" ON chat_rooms
  FOR SELECT USING (
    victim_email = current_setting('request.jwt.claims', true)::json->>'email' OR
    assigned_agent_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
  );

-- RLS Policies for messages table
CREATE POLICY "Users can view messages in their chat rooms" ON messages
  FOR SELECT USING (
    chat_room_id IN (
      SELECT id FROM chat_rooms WHERE 
      victim_email = current_setting('request.jwt.claims', true)::json->>'email' OR
      assigned_agent_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
    )
  );

CREATE POLICY "Users can insert messages in their chat rooms" ON messages
  FOR INSERT WITH CHECK (
    chat_room_id IN (
      SELECT id FROM chat_rooms WHERE 
      victim_email = current_setting('request.jwt.claims', true)::json->>'email' OR
      assigned_agent_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
    )
  );

-- Insert sample agents
INSERT INTO agents (id, email, name, role, is_online) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'sarah.martinez@fortivault.com', 'Sarah Martinez', 'Senior Recovery Specialist', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'john.smith@fortivault.com', 'John Smith', 'Fraud Investigator', false),
  ('550e8400-e29b-41d4-a716-446655440003', 'emily.johnson@fortivault.com', 'Emily Johnson', 'Recovery Specialist', true)
ON CONFLICT (email) DO NOTHING;
