"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User, SupabaseClient } from "@supabase/supabase-js"

interface Profile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: "user" | "reviewer"
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  login: (email: string, password: string) => Promise<void>
  signup: (userData: any) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const router = useRouter()

  const isSupabaseConfigured = useMemo(() => {
    return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) {
      console.warn("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
      setIsLoading(false)
      return
    }

    try {
      const client = createClient()
      setSupabase(client)

      // Get initial session
      const getInitialSession = async () => {
        const {
          data: { session },
        } = await client.auth.getSession()

        if (session?.user) {
          setUser(session.user)
          await fetchProfile(client, session.user.id)
        }

        setIsLoading(false)
      }

      getInitialSession()

      // Listen for auth changes
      const {
        data: { subscription },
      } = client.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          setUser(session.user)
          await fetchProfile(client, session.user.id)
        } else {
          setUser(null)
          setProfile(null)
        }
        setIsLoading(false)
      })

      return () => subscription.unsubscribe()
    } catch (err) {
      console.error("Failed to initialize Supabase client:", err)
      setIsLoading(false)
    }
  }, [isSupabaseConfigured])

  const fetchProfile = async (client: SupabaseClient, userId: string) => {
    try {
      const { data, error } = await client.from("profiles").select("*").eq("id", userId).single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const login = async (email: string, password: string) => {
    if (!supabase) throw new Error("Authentication is not configured. Please set Supabase environment variables.")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
  }

  const signup = async (userData: any) => {
    if (!supabase) throw new Error("Authentication is not configured. Please set Supabase environment variables.")

    const { error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role || "user",
        },
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
      },
    })

    if (error) throw error

    router.push("/auth/check-email")
  }

  const logout = async () => {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    setUser(null)
    setProfile(null)
    router.push("/")
  }

  // Redirect based on profile role when user/profile changes
  useEffect(() => {
    if (user && profile && !isLoading) {
      const currentPath = window.location.pathname

      if (profile.role === "reviewer" && !currentPath.startsWith("/reviewer")) {
        router.push("/reviewer")
      } else if (profile.role === "user" && !currentPath.startsWith("/dashboard")) {
        router.push("/dashboard")
      }
    }
  }, [user, profile, isLoading, router])

  return (
    <AuthContext.Provider value={{ user, profile, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
