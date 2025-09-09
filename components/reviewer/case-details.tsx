"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CaseClassification } from "@/components/reviewer/case-classification"
import { AgentChatSystem } from "@/components/chat/agent-chat-system"
import { CaseEvidence } from "@/components/reviewer/case-evidence"
import { User, DollarSign, AlertTriangle, Save, MessageCircle } from "lucide-react"
import type { ReviewerCase } from "@/components/reviewer-dashboard"

interface CaseDetailsProps {
  caseData: ReviewerCase
}

export function CaseDetails({ caseData }: CaseDetailsProps) {
  const [status, setStatus] = useState(caseData.status)
  const [priority, setPriority] = useState(caseData.priority)
  const [notes, setNotes] = useState("")

  const handleSaveChanges = () => {
    // In a real app, this would update the case via API
    console.log("Saving changes:", { status, priority, notes })
  }

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
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Case: {caseData.id}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(status)} variant="secondary">
              {status}
            </Badge>
            <Badge className={getPriorityColor(priority)} variant="secondary">
              {priority} priority
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="classification">Classification</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Victim Chat
            </TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="space-y-6">
              {/* Victim Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Victim Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-8 h-8 text-primary bg-primary/10 rounded-lg p-2" />
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{caseData.victimName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="w-8 h-8 text-primary bg-primary/10 rounded-lg p-2" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{caseData.victimEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-8 h-8 text-accent bg-accent/10 rounded-lg p-2" />
                    <div>
                      <p className="text-sm text-muted-foreground">Amount Lost</p>
                      <p className="font-medium">
                        {caseData.amount} {caseData.currency}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-8 h-8 text-secondary bg-secondary/10 rounded-lg p-2" />
                    <div>
                      <p className="text-sm text-muted-foreground">Fraud Type</p>
                      <p className="font-medium">{caseData.type}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Case Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Case Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{caseData.description}</p>
                </CardContent>
              </Card>

              {/* Case Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Case Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="intake">Intake</SelectItem>
                          <SelectItem value="under-review">Under Review</SelectItem>
                          <SelectItem value="action-recommended">Action Recommended</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Priority</label>
                      <Select value={priority} onValueChange={setPriority}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Internal Notes</label>
                    <Textarea
                      placeholder="Add internal notes about this case..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <Button onClick={handleSaveChanges} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="classification" className="mt-6">
            <CaseClassification caseId={caseData.id} />
          </TabsContent>

          <TabsContent value="evidence" className="mt-6">
            <CaseEvidence caseId={caseData.id} />
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <AgentChatSystem
              caseId={caseData.id}
              victimName={caseData.victimName}
              isVictimOnline={Math.random() > 0.5}
            />
          </TabsContent>

          <TabsContent value="actions" className="mt-6">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Available Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Generate Recovery Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Contact Law Enforcement
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Request Additional Evidence
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Schedule Victim Call
                  </Button>
                  <Button variant="destructive" className="w-full justify-start">
                    Close Case
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
