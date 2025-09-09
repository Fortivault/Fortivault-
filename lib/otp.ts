import { randomInt, createHmac, timingSafeEqual, randomBytes } from "crypto"
import bcrypt from "bcryptjs"

export const OTP_TTL_SECONDS = 600 // 10 minutes
export const OTP_COOKIE_NAME = "fv_otp"

function base64url(input: Buffer | string): string {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input)
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
}

function fromBase64url(input: string): Buffer {
  const pad = 4 - (input.length % 4)
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/") + (pad < 4 ? "=".repeat(pad) : "")
  return Buffer.from(base64, "base64")
}

function getSecret(): string {
  const secret = process.env.SUPABASE_JWT_SECRET || process.env.NEXTAUTH_SECRET || "development-secret"
  return secret
}

export function generateOTP(length = 6): string {
  let code = ""
  for (let i = 0; i < length; i++) {
    code += randomInt(0, 10).toString()
  }
  return code
}

export async function hashOTP(otp: string): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(otp, saltRounds)
}

export async function verifyOTPHash(otp: string, hash: string): Promise<boolean> {
  return bcrypt.compare(otp, hash)
}

export interface OtpSessionPayload {
  email: string
  caseId: string
  hash: string
  exp: number // epoch seconds
  nonce: string
}

export function signOtpSession(payload: OtpSessionPayload): string {
  const secret = getSecret()
  const body = base64url(JSON.stringify(payload))
  const sig = base64url(createHmac("sha256", secret).update(body).digest())
  return `${body}.${sig}`
}

export function verifyOtpSessionToken(token: string): OtpSessionPayload | null {
  try {
    const [body, sig] = token.split(".")
    if (!body || !sig) return null
    const expectedSig = base64url(createHmac("sha256", getSecret()).update(body).digest())

    const a = Buffer.from(sig)
    const b = Buffer.from(expectedSig)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null

    const payload = JSON.parse(fromBase64url(body).toString("utf8")) as OtpSessionPayload
    if (typeof payload.exp !== "number" || Date.now() / 1000 > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

export async function createOtpSessionToken(email: string, caseId: string, otp: string, ttlSeconds = OTP_TTL_SECONDS) {
  const hash = await hashOTP(otp)
  const payload: OtpSessionPayload = {
    email,
    caseId,
    hash,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
    nonce: base64url(randomBytes(16)),
  }
  return signOtpSession(payload)
}
