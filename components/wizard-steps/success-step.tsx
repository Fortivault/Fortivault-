"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, Clock, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface SuccessStepProps {
  caseId: string
  userEmail: string
}

export function SuccessStep({ caseId, userEmail }: SuccessStepProps) {
  const [showVerification, setShowVerification] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [progressStep, setProgressStep] = useState(0)

  useEffect(() => {
    const sendOTP = async () => {
      try {
        const response = await fetch("/api/send-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            caseId: caseId,
          }),
        })

        const result = await response.json()
        if (result.success) {
          console.log("[v0] OTP sent successfully")
          setShowVerification(true)
        } else {
          console.error("[v0] Failed to send OTP:", result.error)
        }
      } catch (error) {
        console.error("[v0] OTP sending error:", error)
      }
    }

    const timer = setTimeout(() => {
      sendOTP()
    }, 2000)
    return () => clearTimeout(timer)
  }, [userEmail, caseId])

  const handleVerification = async () => {
    if (verificationCode.length !== 6) return

    setIsVerifying(true)

    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          otp: verificationCode,
          caseId: caseId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setIsVerifying(false)
        setIsVerified(true)
        setShowProgress(true)

        // Progress animation sequence
        const progressSteps = [
          "Verifying details...",
          "Analyzing report...",
          "Creating dashboard...",
          "Setting up secure access...",
        ]

        progressSteps.forEach((_, index) => {
          setTimeout(
            () => {
              setProgressStep(index + 1)
            },
            (index + 1) * 1500,
          )
        })

        // Show final message after progress
        setTimeout(() => {
          setShowProgress(false)
        }, 7000)
      } else {
        setIsVerifying(false)
        alert("Invalid verification code. Please try again.")
        setVerificationCode("")
      }
    } catch (error) {
      console.error("[v0] Verification error:", error)
      setIsVerifying(false)
      alert("Verification failed. Please try again.")
    }
  }

  if (showProgress) {
    const progressMessages = [
      "Verifying details...",
      "Analyzing report...",
      "Creating dashboard...",
      "Setting up secure access...",
    ]

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="text-center">
          <CardContent className="p-8 space-y-6">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary animate-pulse" />
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Processing Your Report</h2>
              <div className="space-y-2">
                {progressMessages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: progressStep > index ? 1 : 0.3,
                      x: 0,
                    }}
                    className={`flex items-center justify-center space-x-2 ${
                      progressStep > index ? "text-accent" : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        progressStep > index ? "bg-accent" : "bg-muted-foreground/30"
                      }`}
                    />
                    <span className="text-sm">{message}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (isVerified && !showProgress) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="text-center">
          <CardContent className="p-8 space-y-6">
            <CheckCircle className="w-16 h-16 mx-auto text-accent" />

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-accent">Dashboard Setup Complete!</h2>
              <p className="text-muted-foreground text-pretty">
                Your dashboard access portal will be delivered to your verified email address within the next 30
                minutes.
              </p>
            </div>

            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Mail className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-accent">Dashboard Access Link</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                You'll be able to keep track of your reports, access our services, and communicate with your assigned
                Recovery Agent through your personalized dashboard.
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Your Case Reference Number:</p>
              <p className="text-lg font-mono font-bold text-primary">{caseId}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <Card className="text-center">
        <CardContent className="p-8 space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-16 h-16 mx-auto text-accent" />
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-accent">Almost There!</h2>
            <p className="text-muted-foreground text-pretty">
              Your fraud report has been submitted successfully. Please verify your email address to complete the
              process.
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Your Case Reference Number:</p>
            <p className="text-lg font-mono font-bold text-primary">{caseId}</p>
          </div>

          {showVerification ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-primary">Email Verification Required</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  We've sent a 6-digit verification code to <strong>{userEmail}</strong>
                </p>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full text-center text-lg font-mono tracking-widest border rounded-lg p-3"
                    maxLength={6}
                  />

                  <Button
                    onClick={handleVerification}
                    disabled={verificationCode.length !== 6 || isVerifying}
                    className="w-full"
                  >
                    {isVerifying ? "Verifying..." : "Verify Email"}
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-primary animate-pulse" />
                <h3 className="font-semibold text-primary">Sending Verification Code...</h3>
              </div>
              <p className="text-sm text-muted-foreground">Please check your email inbox for the verification code.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
