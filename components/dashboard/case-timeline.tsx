"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle, FileText } from "lucide-react"

interface TimelineEvent {
  id: string
  title: string
  description: string
  timestamp: string
  type: "completed" | "in-progress" | "pending"
  icon: "check" | "clock" | "alert" | "file"
}

interface CaseTimelineProps {
  caseId: string
}

// Mock timeline data
const mockTimeline: TimelineEvent[] = [
  {
    id: "1",
    title: "Case Submitted",
    description: "Your fraud report has been successfully submitted and assigned case ID.",
    timestamp: "2024-01-15T10:30:00Z",
    type: "completed",
    icon: "check",
  },
  {
    id: "2",
    title: "Initial Review Completed",
    description: "Our intake team has reviewed your submission and verified all required information.",
    timestamp: "2024-01-15T14:45:00Z",
    type: "completed",
    icon: "check",
  },
  {
    id: "3",
    title: "Case Assigned to Investigator",
    description: "Your case has been assigned to Sarah Johnson, a specialist in cryptocurrency fraud recovery.",
    timestamp: "2024-01-16T09:15:00Z",
    type: "completed",
    icon: "check",
  },
  {
    id: "4",
    title: "Evidence Analysis in Progress",
    description: "Our team is analyzing the provided evidence and conducting blockchain analysis.",
    timestamp: "2024-01-17T11:20:00Z",
    type: "in-progress",
    icon: "clock",
  },
  {
    id: "5",
    title: "Recovery Strategy Development",
    description: "Based on our analysis, we are developing a comprehensive recovery strategy.",
    timestamp: "2024-01-18T16:00:00Z",
    type: "pending",
    icon: "file",
  },
  {
    id: "6",
    title: "Action Implementation",
    description: "We will begin executing the recovery plan and coordinating with relevant authorities.",
    timestamp: "2024-01-20T10:00:00Z",
    type: "pending",
    icon: "alert",
  },
]

export function CaseTimeline({ caseId }: CaseTimelineProps) {
  const getIcon = (iconType: string, eventType: string) => {
    const iconClass = "w-4 h-4"
    const iconColor =
      eventType === "completed" ? "text-green-600" : eventType === "in-progress" ? "text-blue-600" : "text-gray-400"

    switch (iconType) {
      case "check":
        return <CheckCircle className={`${iconClass} ${iconColor}`} />
      case "clock":
        return <Clock className={`${iconClass} ${iconColor}`} />
      case "alert":
        return <AlertCircle className={`${iconClass} ${iconColor}`} />
      case "file":
        return <FileText className={`${iconClass} ${iconColor}`} />
      default:
        return <CheckCircle className={`${iconClass} ${iconColor}`} />
    }
  }

  const getStatusBadge = (type: string) => {
    switch (type) {
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Completed
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            In Progress
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
            Pending
          </Badge>
        )
      default:
        return null
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Timeline for case {caseId} - Track the progress of your fraud recovery case
      </div>

      <div className="space-y-4">
        {mockTimeline.map((event, index) => (
          <Card key={event.id} className={event.type === "in-progress" ? "ring-2 ring-blue-200" : ""}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      event.type === "completed"
                        ? "bg-green-100 dark:bg-green-900"
                        : event.type === "in-progress"
                          ? "bg-blue-100 dark:bg-blue-900"
                          : "bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    {getIcon(event.icon, event.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold">{event.title}</h3>
                    {getStatusBadge(event.type)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                  <p className="text-xs text-muted-foreground">{formatTimestamp(event.timestamp)}</p>
                </div>

                {index < mockTimeline.length - 1 && (
                  <div className="absolute left-8 mt-8 w-px h-8 bg-border" style={{ marginLeft: "1rem" }} />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
