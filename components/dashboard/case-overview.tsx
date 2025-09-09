"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar, DollarSign, User, AlertCircle } from "lucide-react"

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

interface CaseOverviewProps {
  caseData: CaseData
}

export function CaseOverview({ caseData }: CaseOverviewProps) {
  const getProgressValue = (status: string) => {
    switch (status) {
      case "intake":
        return 25
      case "under-review":
        return 60
      case "action-recommended":
        return 85
      case "closed":
        return 100
      default:
        return 0
    }
  }

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "intake":
        return "Your case has been received and is being processed by our intake team."
      case "under-review":
        return "Our expert investigators are analyzing your case and gathering additional information."
      case "action-recommended":
        return "We have developed a recovery strategy and are ready to take action on your behalf."
      case "closed":
        return "Your case has been completed. Check the timeline for final results."
      default:
        return "Status unknown"
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recovery Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Case Progress</span>
              <span>{getProgressValue(caseData.status)}%</span>
            </div>
            <Progress value={getProgressValue(caseData.status)} className="w-full" />
          </div>
          <p className="text-sm text-muted-foreground">{getStatusDescription(caseData.status)}</p>
        </CardContent>
      </Card>

      {/* Case Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-8 h-8 text-accent bg-accent/10 rounded-lg p-2" />
              <div>
                <p className="text-sm text-muted-foreground">Amount Lost</p>
                <p className="text-lg font-semibold">
                  {caseData.amount} {caseData.currency}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-8 h-8 text-primary bg-primary/10 rounded-lg p-2" />
              <div>
                <p className="text-sm text-muted-foreground">Fraud Type</p>
                <p className="text-lg font-semibold">{caseData.type}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-secondary bg-secondary/10 rounded-lg p-2" />
              <div>
                <p className="text-sm text-muted-foreground">Case Created</p>
                <p className="text-lg font-semibold">{new Date(caseData.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <User className="w-8 h-8 text-accent bg-accent/10 rounded-lg p-2" />
              <div>
                <p className="text-sm text-muted-foreground">Assigned Agent</p>
                <p className="text-lg font-semibold">{caseData.assignedAgent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Case Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Case Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{caseData.description}</p>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {caseData.status === "under-review" && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm">Our team is conducting a thorough investigation of your case</p>
              </div>
            )}
            {caseData.status === "action-recommended" && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm">We will contact you within 24 hours to discuss recovery options</p>
              </div>
            )}
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm">You will receive email updates as your case progresses</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm">Contact your assigned agent if you have additional information</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
