import { NextResponse, type NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, role } = await request.json()
    if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 })

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: firstName || null,
        lastName: lastName || null,
        role: role || "user",
      },
    })

    const { passwordHash: _, ...userData } = user
    return NextResponse.json({ success: true, user: userData })
  } catch (error) {
    console.error("[v0] User signup error:", error)
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}
