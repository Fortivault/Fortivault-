import { type NextRequest, NextResponse } from "next/server"
import { emailService } from "@/lib/email-service"
import { OTP_COOKIE_NAME, OTP_TTL_SECONDS, createOtpSessionToken, generateOTP } from "@/lib/otp"
import { rateLimiter } from "@/lib/security/rate-limiter"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const { email, caseId } = await request.json()

    if (!email || !caseId) {
      return NextResponse.json({ error: "Email and case ID are required" }, { status: 400 })
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    const identifier = `${ip}:${email}`
    const allowed = rateLimiter.isAllowed(identifier, { windowMs: 10 * 60 * 1000, maxRequests: 5 })
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 })
    }

    const otp = generateOTP(6)

    const emailResult = await emailService.sendOTP(email, otp, caseId)
    if (!emailResult.success) {
      return NextResponse.json({ error: "Failed to send OTP email" }, { status: 500 })
    }

    const token = await createOtpSessionToken(email, caseId, otp, OTP_TTL_SECONDS)

    const res = NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
    })

    res.cookies.set(OTP_COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: OTP_TTL_SECONDS,
    })

    return res
  } catch (error) {
    console.error("[v0] Send OTP API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
