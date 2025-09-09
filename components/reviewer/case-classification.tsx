"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, AlertTriangle } from "lucide-react"

interface CaseClassificationProps {
  caseId: string
}

export function CaseClassification({ caseId }: CaseClassificationProps) {
  const [riskLevel, setRiskLevel] = useState("medium")
  const [fraudCategory, setFraudCategory] = useState("investment")
  const [recoveryProbability, setRecoveryProbability] = useState("moderate")
  const [classification, setClassification] = useState("")

  const handleSaveClassification = () => {
    console.log("Saving classification:", { riskLevel, fraudCategory, recoveryProbability, classification })
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getRecoveryColor = (probability: string) => {
    switch (probability) {
      case "high":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "moderate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Case Classification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Risk Level</label>
              <Select value={riskLevel} onValueChange={setRiskLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
              <Badge className={getRiskColor(riskLevel)} variant="secondary">
                {riskLevel} risk
              </Badge>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fraud Category</label>
              <Select value={fraudCategory} onValueChange={setFraudCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="investment">Investment Fraud</SelectItem>
                  <SelectItem value="romance">Romance Scam</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency Fraud</SelectItem>
                  <SelectItem value="phishing">Phishing</SelectItem>
                  <SelectItem value="identity">Identity Theft</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Recovery Probability</label>
              <Select value={recoveryProbability} onValueChange={setRecoveryProbability}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High (70%+)</SelectItem>
                  <SelectItem value="moderate">Moderate (30-70%)</SelectItem>
                  <SelectItem value="low">Low (&lt;30%)</SelectItem>
                </SelectContent>
              </Select>
              <Badge className={getRecoveryColor(recoveryProbability)} variant="secondary">
                {recoveryProbability} probability
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Classification Notes</label>
            <Textarea
              placeholder="Detailed classification analysis and reasoning..."
              value={classification}
              onChange={(e) => setClassification(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <Button onClick={handleSaveClassification} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Save Classification
          </Button>
        </CardContent>
      </Card>

      {/* Classification Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Classification Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm mb-2">Risk Level Assessment:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>
                  • <strong>High:</strong> Large amounts, organized crime, international transfers
                </li>
                <li>
                  • <strong>Medium:</strong> Moderate amounts, some complexity, traceable elements
                </li>
                <li>
                  • <strong>Low:</strong> Small amounts, simple fraud, clear evidence trail
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Recovery Probability Factors:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Time elapsed since fraud occurred</li>
                <li>• Quality and completeness of evidence</li>
                <li>• Cooperation of financial institutions</li>
                <li>• Jurisdiction and legal framework</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
