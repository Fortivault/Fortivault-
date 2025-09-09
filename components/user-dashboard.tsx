"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CaseOverview } from "@/components/dashboard/case-overview"
import { CaseTimeline } from "@/components/dashboard/case-timeline"
import { EvidenceManager } from "@/components/dashboard/evidence-manager"
import { ChatSystem } from "@/components/chat/chat-system"
import { FileText, Shield, MessageCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

interface CaseData {
  id: string
  type: string
  amount: string
  currency: string
  status: string
  createdAt: string
  lastUpdate: string
  assignedAgent: string
  priority: string
  description: string
}

export function UserDashboard() {
  const [activeCases, setActiveCases] = useState<CaseData[]>([])
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkActiveCases = () => {
      const activeCaseId = localStorage.getItem("activeCaseId")
      const cases: CaseData[] = []

      if (activeCaseId) {
        const caseData = localStorage.getItem(`case_${activeCaseId}`)
        if (caseData) {
          const parsedCase = JSON.parse(caseData)
          cases.push({
            id: parsedCase.caseId,
            type:
              parsedCase.scamType === "crypto"
                ? "Cryptocurrency Fraud"
                : parsedCase.scamType === "fiat"
                  ? "Wire Transfer Fraud"
                  : "Other Fraud",
            amount: parsedCase.amount,
            currency: parsedCase.currency,
            status: parsedCase.status || "intake",
            createdAt: parsedCase.submissionDate,
            lastUpdate: parsedCase.submissionDate,
            assignedAgent: "Recovery Specialist",
            priority: "high",
            description: parsedCase.description,
          })
        }
      }

      setActiveCases(cases)
      if (cases.length > 0) {
        setSelectedCase(cases[0])
      }
      setIsLoading(false)
    }

    checkActiveCases()

    const handleStorageChange = () => {
      checkActiveCases()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your cases...</p>
        </div>
      </div>
    )
  }

  if (activeCases.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Active Reports</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You need to submit a fraud report to access your dashboard. Once you submit a report, you'll be able to
            track its progress and communicate with our recovery specialists.
          </p>
          <Button asChild>
            <Link href="/report">Submit Fraud Report</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "intake":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "under-review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "action-recommended":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "intake":
        return "Intake"
      case "under-review":
        return "Under Review"
      case "action-recommended":
        return "Action Recommended"
      case "closed":
        return "Closed"
      default:
        return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      {/* Cases Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Your Cases
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeCases.map((caseItem) => (
                <Card
                  key={caseItem.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedCase?.id === caseItem.id ? "ring-2 ring-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setSelectedCase(caseItem)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{caseItem.id}</p>
                          <p className="text-xs text-muted-foreground">{caseItem.type}</p>
                        </div>
                        <Badge className={getPriorityColor(caseItem.priority)} variant="secondary">
                          {caseItem.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {caseItem.amount} {caseItem.currency}
                        </span>
                        <Badge className={getStatusColor(caseItem.status)} variant="secondary">
                          {getStatusLabel(caseItem.status)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{caseItem.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {selectedCase && (
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Case Details: {selectedCase.id}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(selectedCase.status)} variant="secondary">
                      {getStatusLabel(selectedCase.status)}
                    </Badge>
                    <Badge className={getPriorityColor(selectedCase.priority)} variant="secondary">
                      {selectedCase.priority} priority
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="evidence">Evidence</TabsTrigger>
                    <TabsTrigger value="chat" className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Agent Chat
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-6">
                    <CaseOverview caseData={selectedCase} />
                  </TabsContent>

                  <TabsContent value="timeline" className="mt-6">
                    <CaseTimeline caseId={selectedCase.id} />
                  </TabsContent>

                  <TabsContent value="evidence" className="mt-6">
                    <EvidenceManager caseId={selectedCase.id} />
                  </TabsContent>

                  <TabsContent value="chat" className="mt-6">
                    <ChatSystem caseId={selectedCase.id} isAgentOnline={true} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
