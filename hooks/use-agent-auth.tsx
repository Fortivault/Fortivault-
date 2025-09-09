"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface Agent {
  id: string
  email: string
  name: string
  specialization: string
}

interface AgentAuthContextType {
  agent: Agent | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AgentAuthContext = createContext<AgentAuthContextType | undefined>(undefined)

export function AgentAuthProvider({ children }: { children: ReactNode }) {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing agent session
    const agentAuth = localStorage.getItem("agentAuth")
    const agentData = localStorage.getItem("agentData")

    if (agentAuth === "true" && agentData) {
      try {
        setAgent(JSON.parse(agentData))
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem("agentAuth")
        localStorage.removeItem("agentData")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/agent/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const agentData = await response.json()
        setAgent(agentData.agent)
        localStorage.setItem("agentAuth", "true")
        localStorage.setItem("agentData", JSON.stringify(agentData.agent))
        return true
      }
    } catch (error) {
      console.error("Agent login error:", error)
    }

    return false
  }

  const logout = () => {
    setAgent(null)
    localStorage.removeItem("agentAuth")
    localStorage.removeItem("agentData")
    router.push("/agent/login")
  }

  return (
    <AgentAuthContext.Provider
      value={{
        agent,
        login,
        logout,
        isLoading,
        isAuthenticated: !!agent,
      }}
    >
      {children}
    </AgentAuthContext.Provider>
  )
}

export function useAgentAuth() {
  const context = useContext(AgentAuthContext)
  if (context === undefined) {
    throw new Error("useAgentAuth must be used within an AgentAuthProvider")
  }
  return context
}
