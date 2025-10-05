import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const agent = await prisma.agent.findUnique({ where: { email } })

    if (!agent || agent.status !== "active") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isValidPassword = await bcrypt.compare(password, agent.passwordHash)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const { passwordHash, ...agentData } = agent

    return NextResponse.json({ success: true, agent: agentData })
  } catch (error) {
    console.error("[v0] Agent auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
