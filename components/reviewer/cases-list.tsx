"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, FileText } from "lucide-react"
import type { ReviewerCase } from "@/components/reviewer-dashboard"

interface CasesListProps {
  cases: ReviewerCase[]
  selectedCase: ReviewerCase | null
  onSelectCase: (caseItem: ReviewerCase) => void
}

export function CasesList({ cases, selectedCase, onSelectCase }: CasesListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "intake":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "under-review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "action-recommended":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "closed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "intake":
        return "Intake"
      case "under-review":
        return "Review"
      case "action-recommended":
        return "Action"
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
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {cases.map((caseItem) => (
        <Card
          key={caseItem.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedCase?.id === caseItem.id ? "ring-2 ring-primary bg-primary/5" : ""
          }`}
          onClick={() => onSelectCase(caseItem)}
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">{caseItem.id}</p>
                  <p className="text-xs text-muted-foreground">{caseItem.victimName}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getPriorityColor(caseItem.priority)} variant="secondary">
                    {caseItem.priority}
                  </Badge>
                  <Badge className={getStatusColor(caseItem.status)} variant="secondary">
                    {getStatusLabel(caseItem.status)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">{caseItem.type}</p>
                <p className="text-sm text-muted-foreground">
                  {caseItem.amount} {caseItem.currency}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Updated {new Date(caseItem.lastUpdate).toLocaleDateString()}</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span>{caseItem.evidenceCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>{caseItem.messageCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
