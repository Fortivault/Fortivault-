"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react"

interface AdminCase {
  id: string
  status: string
  priority: string
}

interface AdminStatsProps {
  cases: AdminCase[]
}

export function AdminStats({ cases }: AdminStatsProps) {
  const totalCases = cases.length
  const intakeCases = cases.filter((c) => c.status === "intake").length
  const underReviewCases = cases.filter((c) => c.status === "under-review").length
  const actionRecommendedCases = cases.filter((c) => c.status === "action-recommended").length
  const closedCases = cases.filter((c) => c.status === "closed").length
  const highPriorityCases = cases.filter((c) => c.priority === "high").length

  const stats = [
    {
      title: "Total Cases",
      value: totalCases,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Intake",
      value: intakeCases,
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Under Review",
      value: underReviewCases,
      icon: AlertTriangle,
      color: "text-yellow-600",
    },
    {
      title: "Action Recommended",
      value: actionRecommendedCases,
      icon: CheckCircle,
      color: "text-green-600",
    },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Case Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.map((stat) => (
            <div key={stat.title} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-sm font-medium">{stat.title}</span>
              </div>
              <Badge variant="secondary">{stat.value}</Badge>
            </div>
          ))}
          {highPriorityCases > 0 && (
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-600">High Priority</span>
                <Badge variant="destructive">{highPriorityCases}</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
