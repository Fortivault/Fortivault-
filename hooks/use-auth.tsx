"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "user" | "reviewer"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (userData: any) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Mock authentication - in real app, this would call your API
    const mockUser: User = {
      id: "1",
      email,
      firstName: "John",
      lastName: "Doe",
      role: email.includes("reviewer") ? "reviewer" : "user",
    }

    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))

    // Redirect based on role
    if (mockUser.role === "reviewer") {
      router.push("/reviewer")
    } else {
      router.push("/dashboard")
    }
  }

  const signup = async (userData: any) => {
    // Mock signup - in real app, this would call your API
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
    }

    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))

    // Redirect based on role
    if (newUser.role === "reviewer") {
      router.push("/reviewer")
    } else {
      router.push("/dashboard")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
