"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  Target,
  Award,
  FileText,
  Download,
  Calendar,
  BarChart3,
} from "lucide-react"

interface AnalyticsData {
  caseStats: {
    total: number
    resolved: number
    active: number
    escalated: number
    successRate: number
    avgResolutionTime: number
    totalRecovered: number
  }
  monthlyData: Array<{
    month: string
    cases: number
    resolved: number
    recovered: number
  }>
  caseTypeData: Array<{
    type: string
    count: number
    successRate: number
    avgAmount: number
  }>
  performanceMetrics: {
    responseTime: number
    satisfactionScore: number
    recoveryRate: number
    caseLoad: number
  }
  weeklyActivity: Array<{
    day: string
    messages: number
    cases: number
    calls: number
  }>
}

interface AgentAnalyticsDashboardProps {
  agentId: string
  agentName: string
}

export function AgentAnalyticsDashboard({ agentId, agentName }: AgentAnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState("30d")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading analytics data
    const loadAnalyticsData = async () => {
      setIsLoading(true)

      // Mock data - in real implementation, this would come from Supabase
      const mockData: AnalyticsData = {
        caseStats: {
          total: 156,
          resolved: 127,
          active: 23,
          escalated: 6,
          successRate: 81.4,
          avgResolutionTime: 4.2,
          totalRecovered: 2847500,
        },
        monthlyData: [
          { month: "Jan", cases: 18, resolved: 15, recovered: 245000 },
          { month: "Feb", cases: 22, resolved: 19, recovered: 312000 },
          { month: "Mar", cases: 25, resolved: 21, recovered: 398000 },
          { month: "Apr", cases: 19, resolved: 16, recovered: 287000 },
          { month: "May", cases: 28, resolved: 23, recovered: 445000 },
          { month: "Jun", cases: 24, resolved: 20, recovered: 356000 },
          { month: "Jul", cases: 20, resolved: 13, recovered: 234000 },
        ],
        caseTypeData: [
          { type: "Cryptocurrency", count: 67, successRate: 78.5, avgAmount: 45000 },
          { type: "Wire Transfer", count: 43, successRate: 85.2, avgAmount: 28000 },
          { type: "Investment Scam", count: 32, successRate: 72.1, avgAmount: 67000 },
          { type: "Romance Scam", count: 14, successRate: 64.3, avgAmount: 23000 },
        ],
        performanceMetrics: {
          responseTime: 15,
          satisfactionScore: 4.7,
          recoveryRate: 78.5,
          caseLoad: 23,
        },
        weeklyActivity: [
          { day: "Mon", messages: 45, cases: 8, calls: 12 },
          { day: "Tue", messages: 52, cases: 6, calls: 15 },
          { day: "Wed", messages: 38, cases: 9, calls: 10 },
          { day: "Thu", messages: 61, cases: 7, calls: 18 },
          { day: "Fri", messages: 43, cases: 5, calls: 14 },
          { day: "Sat", messages: 28, cases: 3, calls: 6 },
          { day: "Sun", messages: 19, cases: 2, calls: 4 },
        ],
      }

      setTimeout(() => {
        setAnalyticsData(mockData)
        setIsLoading(false)
      }, 1000)
    }

    loadAnalyticsData()
  }, [agentId, timeRange])

  const exportReport = () => {
    // In real implementation, this would generate and download a PDF/Excel report
    console.log("Exporting report for agent:", agentName)
  }

  if (isLoading || !analyticsData) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Analytics</h2>
          <p className="text-muted-foreground">Comprehensive performance insights for {agentName}</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Cases</p>
                <p className="text-3xl font-bold">{analyticsData.caseStats.total}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12% from last month
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-full">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-3xl font-bold">{analyticsData.caseStats.successRate}%</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +3.2% from last month
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-full">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Recovered</p>
                <p className="text-3xl font-bold">${(analyticsData.caseStats.totalRecovered / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +18% from last month
                </p>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-full">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="text-3xl font-bold">{analyticsData.performanceMetrics.responseTime}m</p>
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  -2m from last month
                </p>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-full">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="cases">Case Analysis</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Cases Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Case Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="cases" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="resolved" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Case Types Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Case Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.caseTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analyticsData.caseTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recovery Amounts Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Recovery Amounts</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Recovered"]} />
                  <Legend />
                  <Bar dataKey="recovered" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Response Time</span>
                    <span className="font-medium">{analyticsData.performanceMetrics.responseTime} minutes</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-muted-foreground">Target: &lt;20 minutes</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Satisfaction Score</span>
                    <span className="font-medium">{analyticsData.performanceMetrics.satisfactionScore}/5.0</span>
                  </div>
                  <Progress value={94} className="h-2" />
                  <p className="text-xs text-muted-foreground">Target: &gt;4.5</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Recovery Rate</span>
                    <span className="font-medium">{analyticsData.performanceMetrics.recoveryRate}%</span>
                  </div>
                  <Progress value={analyticsData.performanceMetrics.recoveryRate} className="h-2" />
                  <p className="text-xs text-muted-foreground">Target: &gt;75%</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Case Load</span>
                    <span className="font-medium">{analyticsData.performanceMetrics.caseLoad} cases</span>
                  </div>
                  <Progress value={76} className="h-2" />
                  <p className="text-xs text-muted-foreground">Capacity: 30 cases</p>
                </div>
              </CardContent>
            </Card>

            {/* Performance Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Team Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium">Top Performer</p>
                        <p className="text-sm text-muted-foreground">Success Rate</p>
                      </div>
                    </div>
                    <Badge variant="secondary">1st Place</Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">vs Team Average</span>
                      <span className="text-sm font-medium text-green-600">+12.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">vs Department Average</span>
                      <span className="text-sm font-medium text-green-600">+8.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Recovery Efficiency</span>
                      <span className="text-sm font-medium text-blue-600">Excellent</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cases" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Case Type Success Rates */}
            <Card>
              <CardHeader>
                <CardTitle>Success Rate by Case Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.caseTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, "Success Rate"]} />
                    <Bar dataKey="successRate" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Case Type Details */}
            <Card>
              <CardHeader>
                <CardTitle>Case Type Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.caseTypeData.map((caseType, index) => (
                    <div key={caseType.type} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{caseType.type}</p>
                        <p className="text-sm text-muted-foreground">{caseType.count} cases</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{caseType.successRate}%</p>
                        <p className="text-sm text-muted-foreground">Avg: ${caseType.avgAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="messages" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="cases" stroke="#82ca9d" strokeWidth={2} />
                  <Line type="monotone" dataKey="calls" stroke="#ffc658" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-blue-500/10 rounded-full w-fit mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold">286</p>
                <p className="text-sm text-muted-foreground">Messages Sent</p>
                <p className="text-xs text-green-600 mt-1">+15% this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-green-500/10 rounded-full w-fit mx-auto mb-3">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold">40</p>
                <p className="text-sm text-muted-foreground">Cases Handled</p>
                <p className="text-xs text-green-600 mt-1">+8% this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-orange-500/10 rounded-full w-fit mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-2xl font-bold">79</p>
                <p className="text-sm text-muted-foreground">Calls Made</p>
                <p className="text-xs text-red-600 mt-1">-3% this week</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
