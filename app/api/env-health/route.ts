import { NextResponse, type NextRequest } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function isTruthy(v: unknown) {
  return typeof v === "string" && v.trim().length > 0
}

export async function GET(_req: NextRequest) {
  const smtpMissing: string[] = []
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const smtpFrom = process.env.SMTP_FROM || process.env.EMAIL_FROM

  if (!isTruthy(smtpHost)) smtpMissing.push("SMTP_HOST")
  if (!isTruthy(smtpPort)) smtpMissing.push("SMTP_PORT")
  if (!isTruthy(smtpUser)) smtpMissing.push("SMTP_USER")
  if (!isTruthy(smtpPass)) smtpMissing.push("SMTP_PASS")
  if (!isTruthy(smtpFrom)) smtpMissing.push("SMTP_FROM/EMAIL_FROM")

  const formspreePublic = process.env.NEXT_PUBLIC_FORMSPREE_URL

  const details = {
    smtp: {
      configured: smtpMissing.length === 0,
      missing: smtpMissing,
    },
    database: {
      provider: "sqlite",
      configured: true,
    },
    forms: {
      formspreePublicConfigured: isTruthy(formspreePublic),
    },
    notes: [
      "This endpoint validates presence only and never returns secret values.",
      "Database uses local SQLite via Prisma for dev/test.",
    ],
  }

  const ok = details.smtp.configured && details.database.configured

  return NextResponse.json({ ok, details })
}
