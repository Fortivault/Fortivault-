"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, ImageIcon, Download, Eye, CheckCircle, X } from "lucide-react"

interface CaseEvidenceProps {
  caseId: string
}

// Mock evidence data for reviewer
const mockReviewerEvidence = [
  {
    id: "1",
    name: "transaction_screenshot.png",
    type: "image",
    size: "2.4 MB",
    uploadDate: "2024-01-15",
    hash: "sha256:a1b2c3d4e5f6...",
    status: "verified",
    category: "Transaction Records",
    reviewedBy: "Sarah Johnson",
    reviewDate: "2024-01-16",
  },
  {
    id: "2",
    name: "email_correspondence.pdf",
    type: "document",
    size: "1.8 MB",
    uploadDate: "2024-01-15",
    hash: "sha256:f6e5d4c3b2a1...",
    status: "verified",
    category: "Communications",
    reviewedBy: "Sarah Johnson",
    reviewDate: "2024-01-16",
  },
  {
    id: "3",
    name: "wallet_address_proof.jpg",
    type: "image",
    size: "3.1 MB",
    uploadDate: "2024-01-16",
    hash: "sha256:9z8y7x6w5v4u...",
    status: "pending",
    category: "Wallet Information",
    reviewedBy: null,
    reviewDate: null,
  },
]

export function CaseEvidence({ caseId }: CaseEvidenceProps) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-4 h-4" />
      case "document":
        return <FileText className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Verified
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Pending Review
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  const handleVerifyEvidence = (evidenceId: string) => {
    console.log("Verifying evidence:", evidenceId)
  }

  const handleRejectEvidence = (evidenceId: string) => {
    console.log("Rejecting evidence:", evidenceId)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Evidence Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockReviewerEvidence.map((evidence) => (
            <Card key={evidence.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      {getFileIcon(evidence.type)}
                    </div>
                    <div>
                      <p className="font-medium">{evidence.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{evidence.size}</span>
                        <span>•</span>
                        <span>{evidence.category}</span>
                        <span>•</span>
                        <span>Uploaded {new Date(evidence.uploadDate).toLocaleDateString()}</span>
                      </div>
                      {evidence.reviewedBy && (
                        <p className="text-xs text-muted-foreground">
                          Reviewed by {evidence.reviewedBy} on{" "}
                          {evidence.reviewDate && new Date(evidence.reviewDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(evidence.status)}
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    {evidence.status === "pending" && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVerifyEvidence(evidence.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRejectEvidence(evidence.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-3 p-2 bg-muted/50 rounded text-xs font-mono text-muted-foreground">
                  Hash: {evidence.hash}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
