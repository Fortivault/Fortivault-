"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CasesList } from "@/components/reviewer/cases-list"
import { CaseDetails } from "@/components/reviewer/case-details"
import { ReviewerStats } from "@/components/reviewer/reviewer-stats"
import { Search, Users, AlertTriangle } from "lucide-react"

export interface ReviewerCase {
  id: string
  victimName: string
  victimEmail: string
  type: string
  amount: string
  currency: string
  status: "intake" | "under-review" | "action-recommended" | "closed"
  priority: "low" | "medium" | "high"
  assignedAgent: string
  createdAt: string
  lastUpdate: string
  description: string
  evidenceCount: number
  messageCount: number
}

// Mock cases data for reviewer dashboard
const mockReviewerCases: ReviewerCase[] = [
  {
    id: "CSRU-ABC123DEF",
    victimName: "John Smith",
    victimEmail: "john.smith@email.com",
    type: "Cryptocurrency Fraud",
    amount: "15,000",
    currency: "USD",
    status: "under-review",
    priority: "high",
    assignedAgent: "Sarah Johnson",
    createdAt: "2024-01-15",
    lastUpdate: "2024-01-18",
    description: "Investment scam involving fake cryptocurrency trading platform",
    evidenceCount: 4,
    messageCount: 5,
  },
  {
    id: "CSRU-XYZ789GHI",
    victimName: "Maria Garcia",
    victimEmail: "maria.garcia@email.com",
    type: "Wire Transfer Fraud",
    amount: "8,500",
    currency: "USD",
    status: "action-recommended",
    priority: "medium",
    assignedAgent: "Michael Chen",
    createdAt: "2024-01-10",
    lastUpdate: "2024-01-17",
    description: "Romance scam leading to fraudulent wire transfers",
    evidenceCount: 6,
    messageCount: 8,
  },
  {
    id: "CSRU-DEF456JKL",
    victimName: "Robert Wilson",
    victimEmail: "robert.wilson@email.com",
    type: "Investment Fraud",
    amount: "25,000",
    currency: "USD",
    status: "intake",
    priority: "high",
    assignedAgent: "Sarah Johnson",
    createdAt: "2024-01-18",
    lastUpdate: "2024-01-18",
    description: "Ponzi scheme targeting retirement savings",
    evidenceCount: 2,
    messageCount: 1,
  },
  {
    id: "CSRU-GHI012MNO",
    victimName: "Lisa Chen",
    victimEmail: "lisa.chen@email.com",
    type: "Cryptocurrency Fraud",
    amount: "3,200",
    currency: "USD",
    status: "closed",
    priority: "low",
    assignedAgent: "Michael Chen",
    createdAt: "2024-01-05",
    lastUpdate: "2024-01-16",
    description: "Fake ICO investment scam",
    evidenceCount: 3,
    messageCount: 12,
  },
]

export function ReviewerDashboard() {
  const [selectedCase, setSelectedCase] = useState<ReviewerCase | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredCases = mockReviewerCases.filter((caseItem) => {
    const matchesSearch =
      caseItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.victimName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || caseItem.status === statusFilter
    const matchesPriority = priorityFilter === "all" || caseItem.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusStats = () => {
    return {
      intake: mockReviewerCases.filter((c) => c.status === "intake").length,
      underReview: mockReviewerCases.filter((c) => c.status === "under-review").length,
      actionRecommended: mockReviewerCases.filter((c) => c.status === "action-recommended").length,
      closed: mockReviewerCases.filter((c) => c.status === "closed").length,
    }
  }

  const stats = getStatusStats()

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <ReviewerStats stats={stats} totalCases={mockReviewerCases.length} />

      {/* Main Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Cases ({filteredCases.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filters */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search cases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex-1 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="intake">Intake</option>
                    <option value="under-review">Under Review</option>
                    <option value="action-recommended">Action Recommended</option>
                    <option value="closed">Closed</option>
                  </select>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="flex-1 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="all">All Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <CasesList cases={filteredCases} selectedCase={selectedCase} onSelectCase={setSelectedCase} />
            </CardContent>
          </Card>
        </div>

        {/* Case Details */}
        <div className="lg:col-span-2">
          {selectedCase ? (
            <CaseDetails caseData={selectedCase} />
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <CardContent className="text-center">
                <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Case Selected</h3>
                <p className="text-muted-foreground">Select a case from the list to view details and manage it.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
