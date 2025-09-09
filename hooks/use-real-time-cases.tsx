"use client"

import { useState, useEffect, useCallback } from "react"
import {
  RealTimeCaseService,
  type Case,
  type CaseNote,
  type AgentActivity,
  type CaseAssignment,
} from "@/lib/case-management/real-time-case-service"

export function useRealTimeCases(agentId: string) {
  const [cases, setCases] = useState<Case[]>([])
  const [caseNotes, setCaseNotes] = useState<CaseNote[]>([])
  const [activities, setActivities] = useState<AgentActivity[]>([])
  const [assignments, setAssignments] = useState<CaseAssignment[]>([])
  const [statistics, setStatistics] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [caseService] = useState(() => new RealTimeCaseService())

  // Handle real-time case updates
  const handleCaseUpdate = useCallback((updatedCase: Case) => {
    setCases((prev) => {
      const existingIndex = prev.findIndex((c) => c.id === updatedCase.id)
      if (existingIndex >= 0) {
        const newCases = [...prev]
        newCases[existingIndex] = updatedCase
        return newCases
      } else {
        return [updatedCase, ...prev]
      }
    })
  }, [])

  const handleCaseAssignment = useCallback((assignment: CaseAssignment) => {
    setAssignments((prev) => [assignment, ...prev])
  }, [])

  const handleCaseNote = useCallback((note: CaseNote) => {
    setCaseNotes((prev) => [note, ...prev])
  }, [])

  const handleAgentActivity = useCallback((activity: AgentActivity) => {
    setActivities((prev) => [activity, ...prev.slice(0, 49)]) // Keep last 50 activities
  }, [])

  // Initialize and subscribe to real-time updates
  useEffect(() => {
    if (!agentId) return

    const initializeData = async () => {
      try {
        setIsLoading(true)

        // Load initial data
        const [casesData, statsData] = await Promise.all([
          caseService.getAgentCases(agentId),
          caseService.getCaseStatistics(agentId),
        ])

        setCases(casesData || [])
        setStatistics(statsData)

        // Subscribe to real-time updates
        caseService.subscribeToCaseUpdates(
          agentId,
          handleCaseUpdate,
          handleCaseAssignment,
          handleCaseNote,
          handleAgentActivity,
        )

        // Update agent presence to online
        await caseService.updateAgentPresence(agentId, true)
      } catch (error) {
        console.error("Failed to initialize real-time cases:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()

    // Cleanup on unmount
    return () => {
      caseService.updateAgentPresence(agentId, false)
      caseService.unsubscribe()
    }
  }, [agentId, caseService, handleCaseUpdate, handleCaseAssignment, handleCaseNote, handleAgentActivity])

  // Case management functions
  const updateCaseStatus = useCallback(
    async (caseId: string, status: string) => {
      try {
        await caseService.updateCaseStatus(caseId, status, agentId)
      } catch (error) {
        console.error("Failed to update case status:", error)
        throw error
      }
    },
    [caseService, agentId],
  )

  const updateCasePriority = useCallback(
    async (caseId: string, priority: string) => {
      try {
        await caseService.updateCasePriority(caseId, priority, agentId)
      } catch (error) {
        console.error("Failed to update case priority:", error)
        throw error
      }
    },
    [caseService, agentId],
  )

  const addCaseNote = useCallback(
    async (caseId: string, content: string, noteType = "internal", title?: string, priority = "normal") => {
      try {
        return await caseService.addCaseNote(caseId, agentId, content, noteType, title, priority)
      } catch (error) {
        console.error("Failed to add case note:", error)
        throw error
      }
    },
    [caseService, agentId],
  )

  const escalateCase = useCallback(
    async (caseId: string, escalatedTo: string, reason: string, escalationLevel = "supervisor") => {
      try {
        return await caseService.escalateCase(caseId, agentId, escalatedTo, reason, escalationLevel)
      } catch (error) {
        console.error("Failed to escalate case:", error)
        throw error
      }
    },
    [caseService, agentId],
  )

  const getCaseActivity = useCallback(
    async (caseId: string) => {
      try {
        return await caseService.getCaseActivity(caseId)
      } catch (error) {
        console.error("Failed to get case activity:", error)
        throw error
      }
    },
    [caseService],
  )

  return {
    cases,
    caseNotes,
    activities,
    assignments,
    statistics,
    isLoading,
    updateCaseStatus,
    updateCasePriority,
    addCaseNote,
    escalateCase,
    getCaseActivity,
  }
}
