import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const caseData = {
      caseId: formData.get("caseId") as string,
      victimEmail: formData.get("contactEmail") as string,
      victimPhone: (formData.get("contactPhone") as string) || null,
      scamType: formData.get("scamType") as string,
      amount: formData.get("amount") ? Number.parseFloat(formData.get("amount") as string) : null,
      currency: (formData.get("currency") as string) || null,
      timeline: (formData.get("timeline") as string) || null,
      description: (formData.get("description") as string) || null,
      status: "Intake",
    }

    const createdCase = await prisma.case.create({ data: caseData })

    await prisma.chatRoom.create({
      data: {
        caseId: createdCase.id,
        victimEmail: caseData.victimEmail,
        assignedAgentId: "550e8400-e29b-41d4-a716-446655440001",
      },
    })

    const formspreeEndpoint = process.env.FORMSPREE_URL

    if (formspreeEndpoint) {
      try {
        await fetch(formspreeEndpoint, {
          method: "POST",
          body: formData,
        })
      } catch (formspreeError) {
        console.error("[v0] Formspree submission failed:", formspreeError)
      }
    }

    return NextResponse.json({
      success: true,
      caseId: caseData.caseId,
      message: "Case submitted successfully",
    })
  } catch (error) {
    console.error("[v0] Case submission error:", error)
    return NextResponse.json({ success: false, error: "Failed to submit case" }, { status: 500 })
  }
}
