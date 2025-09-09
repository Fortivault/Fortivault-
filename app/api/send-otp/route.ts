import { type NextRequest, NextResponse } from "next/server"
import { emailService } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const { email, caseId } = await request.json()

    if (!email || !caseId) {
      return NextResponse.json({ error: "Email and case ID are required" }, { status: 400 })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP in database/cache (implement your storage logic here)
    // For now, we'll store in memory (use Redis in production)

    // Send OTP email
    const result = await emailService.sendOTP(email, otp, caseId)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "OTP sent successfully",
        // Don't return the actual OTP in production
        otp: process.env.NODE_ENV === "development" ? otp : undefined,
      })
    } else {
      return NextResponse.json({ error: "Failed to send OTP email" }, { status: 500 })
    }
  } catch (error) {
    console.error("[v0] Send OTP API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
