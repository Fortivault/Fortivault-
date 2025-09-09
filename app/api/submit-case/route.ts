import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const supabase = await createClient()

    const caseData = {
      case_id: formData.get("caseId") as string,
      victim_email: formData.get("contactEmail") as string,
      victim_phone: (formData.get("contactPhone") as string) || null,
      scam_type: formData.get("scamType") as string,
      amount: Number.parseFloat(formData.get("amount") as string),
      currency: formData.get("currency") as string,
      timeline: formData.get("timeline") as string,
      description: formData.get("description") as string,
      transaction_hashes: JSON.parse((formData.get("transactionHashes") as string) || "[]"),
      bank_references: JSON.parse((formData.get("bankReferences") as string) || "[]"),
      evidence_file_count: Number.parseInt((formData.get("evidenceFileCount") as string) || "0"),
      status: "Intake",
    }

    const { data: caseRecord, error: caseError } = await supabase.from("cases").insert(caseData).select().single()

    if (caseError) {
      console.error("[v0] Error saving case to Supabase:", caseError)
      throw caseError
    }

    const { error: chatRoomError } = await supabase.from("chat_rooms").insert({
      case_id: caseRecord.id,
      victim_email: caseData.victim_email,
      assigned_agent_id: "550e8400-e29b-41d4-a716-446655440001", // Default agent
    })

    if (chatRoomError) {
      console.error("[v0] Error creating chat room:", chatRoomError)
    }

    const formspreeEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || "https://formspree.io/f/xeolvgjp"

    try {
      await fetch(formspreeEndpoint, {
        method: "POST",
        body: formData,
      })
    } catch (formspreeError) {
      console.error("[v0] Formspree submission failed:", formspreeError)
      // Don't fail the entire request if Formspree fails
    }

    return NextResponse.json({
      success: true,
      caseId: caseData.case_id,
      message: "Case submitted successfully",
    })
  } catch (error) {
    console.error("[v0] Case submission error:", error)
    return NextResponse.json({ success: false, error: "Failed to submit case" }, { status: 500 })
  }
}
