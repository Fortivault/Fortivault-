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

  const supabasePublicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseService = process.env.SUPABASE_SERVICE_ROLE_KEY

  const postgresUrl = process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL

  const formspreePublic = process.env.NEXT_PUBLIC_FORMSPREE_URL

  const details = {
    smtp: {
      configured: smtpMissing.length === 0,
      missing: smtpMissing,
    },
    supabase: {
      publicConfigured: isTruthy(supabasePublicUrl) && isTruthy(supabaseAnon),
      serviceRoleConfigured: isTruthy(supabaseService),
    },
    postgres: {
      configured: isTruthy(postgresUrl),
    },
    forms: {
      formspreePublicConfigured: isTruthy(formspreePublic),
    },
    notes: [
      "This endpoint validates presence only and never returns secret values.",
      "Service connectivity is not tested to avoid leaking sensitive information.",
    ],
  }

  const ok = details.smtp.configured && details.supabase.publicConfigured && details.postgres.configured

  return NextResponse.json({ ok, details })
}
