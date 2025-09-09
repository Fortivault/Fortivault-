"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AgentProtectedRoute } from "@/components/auth/agent-protected-route"
import { AgentVictimCommunicationHub } from "@/components/chat/agent-victim-communication-hub"
import { AgentAnalyticsDashboard } from "@/components/analytics/agent-analytics-dashboard"
import {
  Shield,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  FileText,
  Phone,
  Video,
  LogOut,
  Bell,
  Search,
  Target,
  BarChart3,
  Settings,
  HelpCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRealTimeCases } from "@/hooks/use-real-time-cases"

interface AgentCase {
  id: string
  caseId: string
  victimName: string
  victimEmail: string
  type: string
  amount: string
  currency: string
  status: string
  priority: string
  lastContact: string
  unreadMessages: number
  recoveryProbability: number
}

export default function AgentDashboard() {
  const [agentData, setAgentData] = useState<any>(null)
  const {
    cases,
    statistics,
    isLoading: casesLoading,
    updateCaseStatus,
    updateCasePriority,
    addCaseNote,
    escalateCase,
  } = useRealTimeCases(agentData?.id || "")

  const [selectedCase, setSelectedCase] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showCommunicationHub, setShowCommunicationHub] = useState(false)

  useEffect(() => {
    // Load agent data from localStorage
    const storedAgentData = localStorage.getItem("agentData")
    if (storedAgentData) {
      const parsed = JSON.parse(storedAgentData)
      const agentIdMap: { [key: string]: string } = {
        "sarah.martinez@fortivault.com": "550e8400-e29b-41d4-a716-446655440001",
        "mike.chen@fortivault.com": "550e8400-e29b-41d4-a716-446655440002",
        "lisa.rodriguez@fortivault.com": "550e8400-e29b-41d4-a716-446655440003",
      }
      parsed.id = agentIdMap[parsed.email] || "550e8400-e29b-41d4-a716-446655440001"
      setAgentData(parsed)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("agentAuth")
    localStorage.removeItem("agentData")
    window.location.href = "/agent/login"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "under-review":
        return "bg-yellow-500"
      case "escalated":
        return "bg-red-500"
      case "resolved":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive"
      case "high":
        return "secondary"
      case "medium":
        return "outline"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const filteredCases = cases.filter((case_) => {
    const matchesSearch =
      case_.victim_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.case_id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || case_.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const openCommunicationHub = (case_: any) => {
    setSelectedCase(case_)
    setShowCommunicationHub(true)
  }

  if (!agentData || casesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AgentProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-card">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Agent Portal</h1>
                  <p className="text-sm text-muted-foreground">Cyber Scam Recovery Unit</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm">
                  <Bell className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder.svg?key=agent-avatar" />
                    <AvatarFallback>
                      {agentData.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">{agentData.name}</p>
                    <p className="text-muted-foreground">{agentData.specialization}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-6">
          {showCommunicationHub && selectedCase ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Communication Hub</h2>
                  <p className="text-muted-foreground">Case: {selectedCase.case_id}</p>
                </div>
                <Button variant="outline" onClick={() => setShowCommunicationHub(false)}>
                  Back to Dashboard
                </Button>
              </div>

              <AgentVictimCommunicationHub
                caseId={selectedCase.case_id}
                victimEmail={selectedCase.victim_email}
                victimName={selectedCase.victim_email}
                agentId={agentData.id}
                agentName={agentData.name}
                isVictimOnline={false}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar - Agent Stats & Quick Actions */}
              <div className="lg:col-span-1 space-y-6">
                {/* Agent Performance Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Cases Resolved</span>
                        <span className="font-medium">127/156</span>
                      </div>
                      <Progress value={81} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Success Rate</span>
                        <span className="font-medium">78.5%</span>
                      </div>
                      <Progress value={78.5} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Avg Response</span>
                        <span className="font-medium">15 min</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{statistics.active || 0}</p>
                          <p className="text-sm text-muted-foreground">Active Cases</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <MessageCircle className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{statistics.underReview || 0}</p>
                          <p className="text-sm text-muted-foreground">Under Review</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/10 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{statistics.urgent || 0}</p>
                          <p className="text-sm text-muted-foreground">Urgent Cases</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <Tabs defaultValue="cases" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="cases">Active Cases</TabsTrigger>
                    <TabsTrigger value="communications">Communications</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="tools">Tools</TabsTrigger>
                  </TabsList>

                  <TabsContent value="cases" className="mt-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Case Management</CardTitle>
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                placeholder="Search cases..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-64"
                              />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="under-review">Under Review</SelectItem>
                                <SelectItem value="escalated">Escalated</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Cases List */}
                          <div className="space-y-4">
                            {filteredCases.map((case_) => (
                              <Card
                                key={case_.id}
                                className={`cursor-pointer transition-all hover:shadow-md ${
                                  selectedCase?.id === case_.id ? "ring-2 ring-primary" : ""
                                }`}
                                onClick={() => setSelectedCase(case_)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <h3 className="font-semibold">{case_.victim_email}</h3>
                                      <p className="text-sm text-muted-foreground">{case_.case_id}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant={getPriorityColor(case_.priority)}>{case_.priority}</Badge>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-2 h-2 rounded-full ${getStatusColor(case_.status)}`} />
                                      <span className="text-sm capitalize">{case_.status.replace("-", " ")}</span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                      <span className="text-muted-foreground">Amount:</span>
                                      <span className="font-medium">
                                        ${case_.amount} {case_.currency}
                                      </span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                      <span className="text-muted-foreground">Recovery Probability:</span>
                                      <span className="font-medium">{case_.recovery_probability || 0}%</span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                      <span className="text-muted-foreground">Last Contact:</span>
                                      <span>
                                        {case_.last_agent_contact
                                          ? new Date(case_.last_agent_contact).toLocaleDateString()
                                          : "Never"}
                                      </span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>

                          {/* Case Details */}
                          {selectedCase && (
                            <Card>
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <CardTitle>Case Details</CardTitle>
                                  <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm">
                                      <Phone className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <Video className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => openCommunicationHub(selectedCase)}
                                    >
                                      <MessageCircle className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Victim</label>
                                    <p className="text-sm text-muted-foreground">{selectedCase.victim_email}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Case ID</label>
                                    <p className="text-sm text-muted-foreground">{selectedCase.case_id}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Type</label>
                                    <p className="text-sm text-muted-foreground">{selectedCase.type}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Status</label>
                                    <Badge variant="outline" className="capitalize">
                                      {selectedCase.status.replace("-", " ")}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Recovery Progress</label>
                                  <Progress value={selectedCase.recovery_probability || 0} className="h-3" />
                                  <p className="text-sm text-muted-foreground">
                                    {selectedCase.recovery_probability || 0}% probability of recovery
                                  </p>
                                </div>

                                <div className="flex gap-2">
                                  <Button className="flex-1" onClick={() => openCommunicationHub(selectedCase)}>
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Open Chat
                                  </Button>
                                  <Button variant="outline" className="flex-1 bg-transparent">
                                    <FileText className="w-4 h-4 mr-2" />
                                    View Details
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="communications" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Communication Hub</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredCases.slice(0, 6).map((case_) => (
                            <Card key={case_.id} className="cursor-pointer hover:shadow-md transition-all">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium">{case_.victim_email}</h4>
                                  <Badge variant="outline">{case_.status}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">{case_.case_id}</p>
                                <Button size="sm" className="w-full" onClick={() => openCommunicationHub(case_)}>
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  Open Chat
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="analytics" className="mt-6">
                    <AgentAnalyticsDashboard agentId={agentData.id} agentName={agentData.name} />
                  </TabsContent>

                  <TabsContent value="tools" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <Card className="cursor-pointer hover:shadow-md transition-all">
                        <CardContent className="p-6 text-center">
                          <div className="p-3 bg-blue-500/10 rounded-full w-fit mx-auto mb-3">
                            <BarChart3 className="w-6 h-6 text-blue-600" />
                          </div>
                          <h3 className="font-semibold mb-2">Recovery Calculator</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Calculate recovery probability and estimated amounts
                          </p>
                          <Button variant="outline" className="w-full bg-transparent">
                            Launch Tool
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="cursor-pointer hover:shadow-md transition-all">
                        <CardContent className="p-6 text-center">
                          <div className="p-3 bg-green-500/10 rounded-full w-fit mx-auto mb-3">
                            <Shield className="w-6 h-6 text-green-600" />
                          </div>
                          <h3 className="font-semibold mb-2">Fraud Database</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Search known scammer databases and patterns
                          </p>
                          <Button variant="outline" className="w-full bg-transparent">
                            Search Database
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="cursor-pointer hover:shadow-md transition-all">
                        <CardContent className="p-6 text-center">
                          <div className="p-3 bg-orange-500/10 rounded-full w-fit mx-auto mb-3">
                            <Settings className="w-6 h-6 text-orange-600" />
                          </div>
                          <h3 className="font-semibold mb-2">Case Templates</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Access pre-built templates for common case types
                          </p>
                          <Button variant="outline" className="w-full bg-transparent">
                            View Templates
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="cursor-pointer hover:shadow-md transition-all">
                        <CardContent className="p-6 text-center">
                          <div className="p-3 bg-purple-500/10 rounded-full w-fit mx-auto mb-3">
                            <FileText className="w-6 h-6 text-purple-600" />
                          </div>
                          <h3 className="font-semibold mb-2">Legal Resources</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Access legal documents and compliance guides
                          </p>
                          <Button variant="outline" className="w-full bg-transparent">
                            View Resources
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="cursor-pointer hover:shadow-md transition-all">
                        <CardContent className="p-6 text-center">
                          <div className="p-3 bg-red-500/10 rounded-full w-fit mx-auto mb-3">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                          </div>
                          <h3 className="font-semibold mb-2">Escalation Center</h3>
                          <p className="text-sm text-muted-foreground mb-4">Escalate complex cases to supervisors</p>
                          <Button variant="outline" className="w-full bg-transparent">
                            Escalate Case
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="cursor-pointer hover:shadow-md transition-all">
                        <CardContent className="p-6 text-center">
                          <div className="p-3 bg-teal-500/10 rounded-full w-fit mx-auto mb-3">
                            <HelpCircle className="w-6 h-6 text-teal-600" />
                          </div>
                          <h3 className="font-semibold mb-2">Training Center</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Access training materials and best practices
                          </p>
                          <Button variant="outline" className="w-full bg-transparent">
                            Start Training
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </div>
      </div>
    </AgentProtectedRoute>
  )
}
