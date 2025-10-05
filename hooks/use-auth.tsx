"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface UserProfile {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  role: "user" | "reviewer" | string
}

interface AuthContextType {
  user: UserProfile | null
  login: (email: string, password: string) => Promise<void>
  signup: (userData: { email: string; password: string; firstName?: string; lastName?: string; role?: string }) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem("userData")
    if (saved) {
      try {
        setUser(JSON.parse(saved))
      } catch {}
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error("Invalid email or password")
    const data = await res.json()
    setUser(data.user)
    localStorage.setItem("userData", JSON.stringify(data.user))
    if (data.user.role === "reviewer") router.push("/reviewer")
    else router.push("/dashboard")
  }

  const signup = async (userData: { email: string; password: string; firstName?: string; lastName?: string; role?: string }) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
    if (!res.ok) throw new Error("Signup failed")
    const data = await res.json()
    setUser(data.user)
    localStorage.setItem("userData", JSON.stringify(data.user))
    router.push("/auth/check-email")
  }

  const logout = async () => {
    setUser(null)
    localStorage.removeItem("userData")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
