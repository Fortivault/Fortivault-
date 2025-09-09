"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Clock, CheckCircle, FileText } from "lucide-react"

interface ReviewerStatsProps {
  stats: {
    intake: number
    underReview: number
    actionRecommended: number
    closed: number
  }
  totalCases: number
}

export function ReviewerStats({ stats, totalCases }: ReviewerStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-blue-600 bg-blue-100 dark:bg-blue-900 rounded-lg p-2" />
            <div>
              <p className="text-sm text-muted-foreground">New Intake</p>
              <p className="text-2xl font-bold text-blue-600">{stats.intake}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-yellow-600 bg-yellow-100 dark:bg-yellow-900 rounded-lg p-2" />
            <div>
              <p className="text-sm text-muted-foreground">Under Review</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.underReview}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8 text-orange-600 bg-orange-100 dark:bg-orange-900 rounded-lg p-2" />
            <div>
              <p className="text-sm text-muted-foreground">Action Needed</p>
              <p className="text-2xl font-bold text-orange-600">{stats.actionRecommended}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600 bg-green-100 dark:bg-green-900 rounded-lg p-2" />
            <div>
              <p className="text-sm text-muted-foreground">Closed</p>
              <p className="text-2xl font-bold text-green-600">{stats.closed}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
