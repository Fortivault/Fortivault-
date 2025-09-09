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

  // Allow token-based access for victims via emailed link
  const hasTokenAccess = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("token")

  useEffect(() => {
    if (!isLoading) {
      if (!user && !hasTokenAccess) {
        router.push(redirectTo)
        return
      }

      if (!hasTokenAccess && requiredRole && profile && profile.role !== requiredRole) {
        const dashboardPath = profile.role === "reviewer" ? "/reviewer" : "/dashboard"
        router.push(dashboardPath)
        return
      }
    }
  }, [user, profile, isLoading, requiredRole, redirectTo, router, hasTokenAccess])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if ((!user && !hasTokenAccess) || (!hasTokenAccess && requiredRole && profile && profile.role !== requiredRole)) {
    return null
  }

  return <>{children}</>
}
