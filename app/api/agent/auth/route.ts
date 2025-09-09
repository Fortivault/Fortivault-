import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: agent, error } = await supabase
      .from("agents")
      .select("*")
      .eq("email", email)
      .eq("status", "active")
      .single()

    if (error || !agent) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password (assuming passwords are hashed in database)
    const isValidPassword = await bcrypt.compare(password, agent.password_hash)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Return agent data without password
    const { password_hash, ...agentData } = agent

    return NextResponse.json({
      success: true,
      agent: agentData,
    })
  } catch (error) {
    console.error("[v0] Agent auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
