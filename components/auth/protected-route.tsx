"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "user" | "reviewer"
  redirectTo?: string
}

export function ProtectedRoute({ children, requiredRole, redirectTo = "/login" }: ProtectedRouteProps) {
  const { user, profile, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(redirectTo)
        return
      }

      if (requiredRole && profile && profile.role !== requiredRole) {
        // Redirect to appropriate dashboard based on role
        const dashboardPath = profile.role === "reviewer" ? "/reviewer" : "/dashboard"
        router.push(dashboardPath)
        return
      }
    }
  }, [user, profile, isLoading, requiredRole, redirectTo, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || !profile || (requiredRole && profile.role !== requiredRole)) {
    return null
  }

  return <>{children}</>
}
