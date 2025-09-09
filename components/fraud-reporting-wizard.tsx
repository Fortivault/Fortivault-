"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ScamTypeStep } from "@/components/wizard-steps/scam-type-step"
import { DetailsStep } from "@/components/wizard-steps/details-step"
import { TransactionStep } from "@/components/wizard-steps/transaction-step"
import { EvidenceStep } from "@/components/wizard-steps/evidence-step"
import { ConfirmationStep } from "@/components/wizard-steps/confirmation-step"
import { SuccessStep } from "@/components/wizard-steps/success-step"

export interface WizardData {
  scamType: string
  amount: string
  currency: string
  timeline: string
  description: string
  transactionHashes: string[]
  bankReferences: string[]
  evidenceFiles: File[]
  contactEmail: string
  contactPhone: string
}

const initialData: WizardData = {
  scamType: "",
  amount: "",
  currency: "",
  timeline: "",
  description: "",
  transactionHashes: [],
  bankReferences: [],
  evidenceFiles: [],
  contactEmail: "",
  contactPhone: "",
}

const steps = [
  { title: "Scam Type", description: "Select the type of fraud" },
  { title: "Details", description: "Provide incident details" },
  { title: "Transactions", description: "Add transaction references" },
  { title: "Evidence", description: "Upload supporting files" },
  { title: "Confirm", description: "Review and submit" },
]

export function FraudReportingWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<WizardData>(initialData)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [caseId, setCaseId] = useState("")

  const updateData = (updates: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Generate case ID
      const generatedCaseId = `CSRU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      setCaseId(generatedCaseId)

      // Prepare form data for Formspree
      const formData = new FormData()

      // Add all form fields
      formData.append("caseId", generatedCaseId)
      formData.append("scamType", data.scamType)
      formData.append("amount", data.amount)
      formData.append("currency", data.currency)
      formData.append("timeline", data.timeline)
      formData.append("description", data.description)
      formData.append("contactEmail", data.contactEmail)
      formData.append("contactPhone", data.contactPhone)
      formData.append("transactionHashes", JSON.stringify(data.transactionHashes))
      formData.append("bankReferences", JSON.stringify(data.bankReferences))
      formData.append("submissionDate", new Date().toISOString())

      // Add evidence files
      data.evidenceFiles.forEach((file, index) => {
        formData.append(`evidenceFile_${index}`, file)
      })
      formData.append("evidenceFileCount", data.evidenceFiles.length.toString())

      const formspreeEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || "https://formspree.io/f/xeolvgjp"
      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to submit form")
      }

      const caseData = {
        caseId: generatedCaseId,
        status: "Intake",
        submissionDate: new Date().toISOString(),
        ...data,
      }
      localStorage.setItem(`case_${generatedCaseId}`, JSON.stringify(caseData))
      localStorage.setItem("activeCaseId", generatedCaseId)

      setIsSubmitted(true)
    } catch (error) {
      console.error("Form submission error:", error)
      alert("There was an error submitting your report. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return data.scamType !== ""
      case 1:
        return data.amount && data.currency && data.timeline && data.description
      case 2:
        return data.scamType === "crypto" ? data.transactionHashes.length > 0 : data.bankReferences.length > 0
      case 3:
        return data.evidenceFiles.length > 0
      case 4:
        return data.contactEmail !== ""
      default:
        return false
    }
  }

  if (isSubmitted) {
    return <SuccessStep caseId={caseId} userEmail={data.contactEmail} />
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </CardTitle>
            <div className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</div>
          </div>
          <Progress value={progress} className="w-full" />
          <p className="text-muted-foreground">{steps[currentStep].description}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 0 && <ScamTypeStep data={data} updateData={updateData} />}
            {currentStep === 1 && <DetailsStep data={data} updateData={updateData} />}
            {currentStep === 2 && <TransactionStep data={data} updateData={updateData} />}
            {currentStep === 3 && <EvidenceStep data={data} updateData={updateData} />}
            {currentStep === 4 && <ConfirmationStep data={data} updateData={updateData} />}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button onClick={handleSubmit} disabled={!canProceed() || isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          ) : (
            <Button onClick={nextStep} disabled={!canProceed()}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
