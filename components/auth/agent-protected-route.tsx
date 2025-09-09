"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface AgentProtectedRouteProps {
  children: React.ReactNode
}

export function AgentProtectedRoute({ children }: AgentProtectedRouteProps) {
  const router = useRouter()

  useEffect(() => {
    const agentAuth = localStorage.getItem("agentAuth")
    if (agentAuth !== "true") {
      router.push("/agent/login")
      return
    }
  }, [router])

  // Check authentication
  const agentAuth = localStorage.getItem("agentAuth")
  if (agentAuth !== "true") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return <>{children}</>
}
