"use client"

export interface Case {
  id: string
  case_id: string
  victim_email: string
  victim_phone?: string
  scam_type: string
  amount?: number
  currency?: string
  timeline?: string
  description?: string
  status: string
  priority: string
  assigned_agent_id?: string
  estimated_recovery_amount?: number
  recovery_probability?: number
  last_agent_contact?: string
  victim_satisfaction_rating?: number
  created_at: string
  updated_at: string
}

export interface CaseNote {
  id: string
  case_id: string
  agent_id: string
  note_type: string
  title?: string
  content: string
  is_confidential: boolean
  priority: string
  created_at: string
  updated_at: string
}

export interface AgentActivity {
  id: string
  agent_id: string
  activity_type: string
  case_id?: string
  description?: string
  metadata: any
  created_at: string
}

export interface CaseAssignment {
  id: string
  case_id: string
  agent_id: string
  assigned_by?: string
  assignment_type: string
  assigned_at: string
  unassigned_at?: string
  is_active: boolean
}

export class RealTimeCaseService {
  subscribeToCaseUpdates(
    _agentId: string,
    _onCaseUpdate: (case_: Case) => void,
    _onCaseAssignment: (assignment: CaseAssignment) => void,
    _onCaseNote: (note: CaseNote) => void,
    _onAgentActivity: (activity: AgentActivity) => void,
  ) {
    return null
  }

  subscribeToAgentPresence(_onAgentStatusChange: (agentId: string, isOnline: boolean, lastSeen: string) => void) {
    return null
  }

  async updateCaseStatus(_caseId: string, _status: string, _agentId: string) {
    return null
  }

  async updateCasePriority(_caseId: string, _priority: string, _agentId: string) {
    return null
  }

  async assignCase(_caseId: string, _agentId: string, _assignedBy?: string) {
    return null
  }

  async addCaseNote(_caseId: string, _agentId: string, _content: string, _title?: string, _noteType = "general", _isConfidential = false, _priority = "Medium") {
    return null
  }

  async getCaseWithDetails(_caseId: string) {
    return null
  }

  async logAgentActivity(_agentId: string, _activityType: string, _caseId?: string, _description?: string, _metadata: any = {}) {}

  unsubscribe() {}
}
