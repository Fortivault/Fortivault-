import { type NextRequest, NextResponse } from "next/server"
import { emailService } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const { email, otp, caseId } = await request.json()

    if (!email || !otp || !caseId) {
      return NextResponse.json({ error: "Email, OTP, and case ID are required" }, { status: 400 })
    }

    // Verify OTP (implement your verification logic here)
    // For demo purposes, we'll accept any 6-digit code
    if (otp.length !== 6) {
      return NextResponse.json({ error: "Invalid OTP format" }, { status: 400 })
    }

    // Generate unique dashboard access link
    const dashboardToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const dashboardLink = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?token=${dashboardToken}&case=${caseId}`

    // Send welcome email with dashboard link
    const result = await emailService.sendWelcomeEmail(email, caseId, dashboardLink)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Email verified successfully",
        dashboardLink: dashboardLink,
      })
    } else {
      return NextResponse.json({ error: "Failed to send welcome email" }, { status: 500 })
    }
  } catch (error) {
    console.error("[v0] Verify OTP API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
