"use client"

import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

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
  private supabase = createClient()
  private caseChannel: RealtimeChannel | null = null
  private agentChannel: RealtimeChannel | null = null

  // Subscribe to case updates for an agent
  subscribeToCaseUpdates(
    agentId: string,
    onCaseUpdate: (case_: Case) => void,
    onCaseAssignment: (assignment: CaseAssignment) => void,
    onCaseNote: (note: CaseNote) => void,
    onAgentActivity: (activity: AgentActivity) => void,
  ) {
    this.caseChannel = this.supabase
      .channel(`agent_cases_${agentId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cases",
          filter: `assigned_agent_id=eq.${agentId}`,
        },
        (payload) => {
          if (payload.eventType === "UPDATE" || payload.eventType === "INSERT") {
            onCaseUpdate(payload.new as Case)
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "case_assignments",
          filter: `agent_id=eq.${agentId}`,
        },
        (payload) => {
          onCaseAssignment(payload.new as CaseAssignment)
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "case_notes",
        },
        (payload) => {
          onCaseNote(payload.new as CaseNote)
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "agent_activity_logs",
          filter: `agent_id=eq.${agentId}`,
        },
        (payload) => {
          onAgentActivity(payload.new as AgentActivity)
        },
      )
      .subscribe()

    return this.caseChannel
  }

  // Subscribe to agent presence updates
  subscribeToAgentPresence(onAgentStatusChange: (agentId: string, isOnline: boolean, lastSeen: string) => void) {
    this.agentChannel = this.supabase
      .channel("agent_presence")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "agents",
        },
        (payload) => {
          const agent = payload.new as any
          onAgentStatusChange(agent.id, agent.is_online, agent.last_seen)
        },
      )
      .on("presence", { event: "sync" }, () => {
        // Handle presence sync
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        // Handle agent joining
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        // Handle agent leaving
      })
      .subscribe()

    return this.agentChannel
  }

  // Update case status
  async updateCaseStatus(caseId: string, status: string, agentId: string) {
    const { data, error } = await this.supabase
      .from("cases")
      .update({
        status,
        updated_at: new Date().toISOString(),
        last_agent_contact: new Date().toISOString(),
      })
      .eq("id", caseId)
      .select()
      .single()

    if (error) throw error

    // Log the activity
    await this.logAgentActivity(agentId, "status_update", caseId, `Case status updated to ${status}`)

    return data
  }

  // Update case priority
  async updateCasePriority(caseId: string, priority: string, agentId: string) {
    const { data, error } = await this.supabase
      .from("cases")
      .update({
        priority,
        updated_at: new Date().toISOString(),
      })
      .eq("id", caseId)
      .select()
      .single()

    if (error) throw error

    await this.logAgentActivity(agentId, "priority_update", caseId, `Case priority updated to ${priority}`)

    return data
  }

  // Assign case to agent
  async assignCase(caseId: string, agentId: string, assignedBy: string) {
    // Update case assignment
    const { data: caseData, error: caseError } = await this.supabase
      .from("cases")
      .update({
        assigned_agent_id: agentId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", caseId)
      .select()
      .single()

    if (caseError) throw caseError

    // Create assignment record
    const { data: assignmentData, error: assignmentError } = await this.supabase
      .from("case_assignments")
      .insert({
        case_id: caseId,
        agent_id: agentId,
        assigned_by: assignedBy,
        assignment_type: "primary",
      })
      .select()
      .single()

    if (assignmentError) throw assignmentError

    await this.logAgentActivity(assignedBy, "case_assignment", caseId, `Case assigned to agent ${agentId}`)

    return { case: caseData, assignment: assignmentData }
  }

  // Add case note
  async addCaseNote(
    caseId: string,
    agentId: string,
    content: string,
    noteType = "internal",
    title?: string,
    priority = "normal",
    isConfidential = true,
  ) {
    const { data, error } = await this.supabase
      .from("case_notes")
      .insert({
        case_id: caseId,
        agent_id: agentId,
        note_type: noteType,
        title,
        content,
        is_confidential: isConfidential,
        priority,
      })
      .select()
      .single()

    if (error) throw error

    await this.logAgentActivity(agentId, "case_note_added", caseId, `Added ${noteType} note`)

    return data
  }

  // Escalate case
  async escalateCase(
    caseId: string,
    escalatedBy: string,
    escalatedTo: string,
    reason: string,
    escalationLevel = "supervisor",
  ) {
    const { data, error } = await this.supabase
      .from("case_escalations")
      .insert({
        case_id: caseId,
        escalated_by: escalatedBy,
        escalated_to: escalatedTo,
        escalation_reason: reason,
        escalation_level: escalationLevel,
      })
      .select()
      .single()

    if (error) throw error

    // Update case status to escalated
    await this.updateCaseStatus(caseId, "escalated", escalatedBy)

    await this.logAgentActivity(escalatedBy, "case_escalation", caseId, `Case escalated to ${escalationLevel}`)

    return data
  }

  // Get agent's cases
  async getAgentCases(agentId: string) {
    const { data, error } = await this.supabase
      .from("cases")
      .select(`
        *,
        chat_rooms(id, is_active),
        case_notes(id, note_type, priority, created_at)
      `)
      .eq("assigned_agent_id", agentId)
      .order("updated_at", { ascending: false })

    if (error) throw error
    return data
  }

  // Get case activity feed
  async getCaseActivity(caseId: string, limit = 20) {
    const { data, error } = await this.supabase
      .from("agent_activity_logs")
      .select(`
        *,
        agents(name, role)
      `)
      .eq("case_id", caseId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  }

  // Update agent presence
  async updateAgentPresence(agentId: string, isOnline: boolean) {
    const { error } = await this.supabase
      .from("agents")
      .update({
        is_online: isOnline,
        last_seen: new Date().toISOString(),
      })
      .eq("id", agentId)

    if (error) throw error

    // Track presence in realtime channel
    if (this.agentChannel) {
      if (isOnline) {
        this.agentChannel.track({ agent_id: agentId, online_at: new Date().toISOString() })
      } else {
        this.agentChannel.untrack()
      }
    }
  }

  // Log agent activity
  private async logAgentActivity(
    agentId: string,
    activityType: string,
    caseId?: string,
    description?: string,
    metadata: any = {},
  ) {
    const { error } = await this.supabase.from("agent_activity_logs").insert({
      agent_id: agentId,
      activity_type: activityType,
      case_id: caseId,
      description,
      metadata,
    })

    if (error) console.error("Failed to log activity:", error)
  }

  // Get real-time case statistics
  async getCaseStatistics(agentId: string) {
    const { data, error } = await this.supabase
      .from("cases")
      .select("status, priority")
      .eq("assigned_agent_id", agentId)

    if (error) throw error

    const stats = {
      total: data.length,
      active: data.filter((c) => c.status === "active").length,
      underReview: data.filter((c) => c.status === "under-review").length,
      escalated: data.filter((c) => c.status === "escalated").length,
      resolved: data.filter((c) => c.status === "resolved").length,
      urgent: data.filter((c) => c.priority === "urgent").length,
      high: data.filter((c) => c.priority === "high").length,
    }

    return stats
  }

  // Broadcast case update to all connected agents
  broadcastCaseUpdate(caseId: string, updateType: string, data: any) {
    if (this.caseChannel) {
      this.caseChannel.send({
        type: "broadcast",
        event: "case_update",
        payload: { caseId, updateType, data, timestamp: new Date().toISOString() },
      })
    }
  }

  // Clean up subscriptions
  unsubscribe() {
    if (this.caseChannel) {
      this.supabase.removeChannel(this.caseChannel)
      this.caseChannel = null
    }
    if (this.agentChannel) {
      this.supabase.removeChannel(this.agentChannel)
      this.agentChannel = null
    }
  }
}
