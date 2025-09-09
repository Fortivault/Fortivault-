"use client"

import type React from "react"

import { AuthProvider } from "@/hooks/use-auth"
import { AgentAuthProvider } from "@/hooks/use-agent-auth"

export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AgentAuthProvider>
      <AuthProvider>{children}</AuthProvider>
    </AgentAuthProvider>
  )
}
