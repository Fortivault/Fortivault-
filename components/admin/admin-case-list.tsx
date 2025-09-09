"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock } from "lucide-react"

interface AdminCase {
  id: string
  type: string
  amount: string
  currency: string
  status: string
  priority: string
  submissionDate: string
  contactEmail: string
}

interface AdminCaseListProps {
  cases: AdminCase[]
  selectedCase: AdminCase | null
  onSelectCase: (caseItem: AdminCase) => void
  onUpdateStatus: (caseId: string, status: string) => void
}

export function AdminCaseList({ cases, selectedCase, onSelectCase, onUpdateStatus }: AdminCaseListProps) {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Active Cases ({cases.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {cases.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">No cases submitted yet</p>
          </div>
        ) : (
          cases.map((caseItem) => (
            <Card
              key={caseItem.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedCase?.id === caseItem.id ? "ring-2 ring-primary bg-primary/5" : ""
              }`}
              onClick={() => onSelectCase(caseItem)}
            >
              <CardContent className="p-3">
                <div className="space-y-2">
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
                    <span className="text-xs font-medium">
                      {caseItem.amount} {caseItem.currency}
                    </span>
                    <Badge className={getStatusColor(caseItem.status)} variant="secondary">
                      {caseItem.status.replace("-", " ")}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{caseItem.contactEmail}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  )
}
