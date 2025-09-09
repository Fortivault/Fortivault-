import { type NextRequest, NextResponse } from "next/server"
import { emailService } from "@/lib/email-service"
import { OTP_COOKIE_NAME, verifyOtpSessionToken, verifyOTPHash } from "@/lib/otp"
import { rateLimiter } from "@/lib/security/rate-limiter"
import { createClient as createSupabaseServer } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const { email, otp, caseId } = await request.json()

    if (!email || !otp || !caseId) {
      return NextResponse.json({ error: "Email, OTP, and case ID are required" }, { status: 400 })
    }

    if (typeof otp !== "string" || otp.length !== 6) {
      return NextResponse.json({ error: "Invalid OTP format" }, { status: 400 })
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    const identifier = `${ip}:${email}:verify`
    const allowed = rateLimiter.isAllowed(identifier, { windowMs: 10 * 60 * 1000, maxRequests: 10 })
    if (!allowed) {
      return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 })
    }

    const token = request.cookies.get(OTP_COOKIE_NAME)?.value
    if (!token) {
      return NextResponse.json({ error: "Verification session not found or expired" }, { status: 400 })
    }

    const payload = verifyOtpSessionToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired verification session" }, { status: 400 })
    }

    if (payload.email !== email || payload.caseId !== caseId) {
      return NextResponse.json({ error: "Session does not match the provided details" }, { status: 400 })
    }

    const valid = await verifyOTPHash(otp, payload.hash)
    if (!valid) {
      return NextResponse.json({ error: "Incorrect verification code" }, { status: 401 })
    }

    const origin = request.nextUrl.origin

    // Send Supabase magic link to auto-login the victim into their dashboard
    const supabase = await createSupabaseServer()
    await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${origin}/dashboard`,
      },
    })

    // Send a welcome email (informational) — user will receive a separate magic-link email from Supabase
    const result = await emailService.sendWelcomeEmail(email, caseId, `${origin}/dashboard`)

    const res = NextResponse.json({
      success: true,
      message: "Email verified successfully. A secure magic link has been sent to your email.",
    })

    // Clear OTP cookie after successful verification
    res.cookies.set(OTP_COOKIE_NAME, "", { path: "/", maxAge: 0 })

    if (!result.success) {
      console.error("[v0] Failed to send welcome email:", result.error)
    }

    return res
  } catch (error) {
    console.error("[v0] Verify OTP API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
