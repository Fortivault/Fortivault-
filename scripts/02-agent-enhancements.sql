-- Agent system enhancements for advanced case management
-- This script extends the existing schema with agent-specific features

-- Create agent_specializations table
CREATE TABLE IF NOT EXISTS agent_specializations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  specialization VARCHAR(100) NOT NULL,
  experience_level VARCHAR(50) DEFAULT 'Intermediate',
  certification_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create case_notes table for internal agent communications
CREATE TABLE IF NOT EXISTS case_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id),
  note_type VARCHAR(50) DEFAULT 'internal' CHECK (note_type IN ('internal', 'status_update', 'escalation', 'evidence')),
  title VARCHAR(255),
  content TEXT NOT NULL,
  is_confidential BOOLEAN DEFAULT true,
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agent_activity_logs table
CREATE TABLE IF NOT EXISTS agent_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create case_assignments table for tracking case ownership
CREATE TABLE IF NOT EXISTS case_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES agents(id),
  assignment_type VARCHAR(50) DEFAULT 'primary' CHECK (assignment_type IN ('primary', 'secondary', 'supervisor')),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unassigned_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Create agent_performance_metrics table
CREATE TABLE IF NOT EXISTS agent_performance_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  metric_date DATE DEFAULT CURRENT_DATE,
  cases_handled INTEGER DEFAULT 0,
  cases_resolved INTEGER DEFAULT 0,
  avg_response_time_minutes INTEGER DEFAULT 0,
  victim_satisfaction_score DECIMAL(3,2) DEFAULT 0.00,
  recovery_success_rate DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(agent_id, metric_date)
);

-- Create case_escalations table
CREATE TABLE IF NOT EXISTS case_escalations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  escalated_by UUID REFERENCES agents(id),
  escalated_to UUID REFERENCES agents(id),
  escalation_reason VARCHAR(255) NOT NULL,
  escalation_level VARCHAR(50) DEFAULT 'supervisor' CHECK (escalation_level IN ('supervisor', 'manager', 'director')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'acknowledged', 'resolved', 'rejected')),
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Add additional columns to existing tables
ALTER TABLE cases ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent'));
ALTER TABLE cases ADD COLUMN IF NOT EXISTS estimated_recovery_amount DECIMAL(15,2);
ALTER TABLE cases ADD COLUMN IF NOT EXISTS recovery_probability DECIMAL(5,2) DEFAULT 0.00;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS last_agent_contact TIMESTAMP WITH TIME ZONE;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS victim_satisfaction_rating INTEGER CHECK (victim_satisfaction_rating >= 1 AND victim_satisfaction_rating <= 5);

ALTER TABLE agents ADD COLUMN IF NOT EXISTS specialization VARCHAR(100) DEFAULT 'General Recovery';
ALTER TABLE agents ADD COLUMN IF NOT EXISTS total_cases_handled INTEGER DEFAULT 0;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS success_rate DECIMAL(5,2) DEFAULT 0.00;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS avg_response_time_minutes INTEGER DEFAULT 0;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS is_supervisor BOOLEAN DEFAULT false;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_case_notes_case_id ON case_notes(case_id);
CREATE INDEX IF NOT EXISTS idx_case_notes_agent_id ON case_notes(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_activity_logs_agent_id ON agent_activity_logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_case_assignments_case_id ON case_assignments(case_id);
CREATE INDEX IF NOT EXISTS idx_case_assignments_agent_id ON case_assignments(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_performance_metrics_agent_id ON agent_performance_metrics(agent_id);
CREATE INDEX IF NOT EXISTS idx_case_escalations_case_id ON case_escalations(case_id);

-- Enable RLS on new tables
ALTER TABLE agent_specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_escalations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for agent_specializations
CREATE POLICY "Agents can view all specializations" ON agent_specializations
  FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for case_notes
CREATE POLICY "Agents can view case notes for their cases" ON case_notes
  FOR SELECT USING (
    case_id IN (
      SELECT id FROM cases WHERE assigned_agent_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
    ) OR
    agent_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
  );

CREATE POLICY "Agents can insert case notes for their cases" ON case_notes
  FOR INSERT WITH CHECK (
    case_id IN (
      SELECT id FROM cases WHERE assigned_agent_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
    )
  );

-- RLS Policies for agent_activity_logs
CREATE POLICY "Agents can view their own activity logs" ON agent_activity_logs
  FOR SELECT USING (agent_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid);

-- RLS Policies for case_assignments
CREATE POLICY "Agents can view case assignments" ON case_assignments
  FOR SELECT USING (
    agent_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid OR
    assigned_by = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
  );

-- RLS Policies for agent_performance_metrics
CREATE POLICY "Agents can view their own performance metrics" ON agent_performance_metrics
  FOR SELECT USING (agent_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid);

-- RLS Policies for case_escalations
CREATE POLICY "Agents can view escalations for their cases" ON case_escalations
  FOR SELECT USING (
    escalated_by = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid OR
    escalated_to = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid OR
    case_id IN (
      SELECT id FROM cases WHERE assigned_agent_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
    )
  );

-- Insert sample agent specializations
INSERT INTO agent_specializations (agent_id, specialization, experience_level) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Cryptocurrency Recovery', 'Expert'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Investment Scams', 'Advanced'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Wire Transfer Fraud', 'Expert'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Banking Fraud', 'Advanced'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Romance Scams', 'Expert'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Social Engineering', 'Advanced')
ON CONFLICT DO NOTHING;

-- Update existing agents with enhanced data
UPDATE agents SET 
  specialization = 'Cryptocurrency Recovery',
  is_supervisor = true,
  total_cases_handled = 127,
  success_rate = 78.50,
  avg_response_time_minutes = 15
WHERE email = 'sarah.martinez@fortivault.com';

UPDATE agents SET 
  specialization = 'Wire Transfer Fraud',
  is_supervisor = false,
  total_cases_handled = 89,
  success_rate = 82.30,
  avg_response_time_minutes = 12
WHERE email = 'john.smith@fortivault.com';

UPDATE agents SET 
  specialization = 'Investment Scams',
  is_supervisor = false,
  total_cases_handled = 156,
  success_rate = 75.60,
  avg_response_time_minutes = 18
WHERE email = 'emily.johnson@fortivault.com';

-- Create function to automatically log agent activities
CREATE OR REPLACE FUNCTION log_agent_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO agent_activity_logs (agent_id, activity_type, case_id, description)
    VALUES (NEW.assigned_agent_id, 'case_assigned', NEW.id, 'Case assigned to agent');
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != NEW.status THEN
      INSERT INTO agent_activity_logs (agent_id, activity_type, case_id, description)
      VALUES (NEW.assigned_agent_id, 'status_update', NEW.id, 'Case status updated from ' || OLD.status || ' to ' || NEW.status);
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic activity logging
DROP TRIGGER IF EXISTS trigger_log_agent_activity ON cases;
CREATE TRIGGER trigger_log_agent_activity
  AFTER INSERT OR UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION log_agent_activity();
