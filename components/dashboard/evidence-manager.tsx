"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileText, ImageIcon, Download, Upload, Search, Eye } from "lucide-react"

interface EvidenceFile {
  id: string
  name: string
  type: string
  size: string
  uploadDate: string
  hash: string
  status: "verified" | "pending" | "rejected"
  category: string
}

interface EvidenceManagerProps {
  caseId: string
}

// Mock evidence data
const mockEvidence: EvidenceFile[] = [
  {
    id: "1",
    name: "transaction_screenshot.png",
    type: "image",
    size: "2.4 MB",
    uploadDate: "2024-01-15",
    hash: "sha256:a1b2c3d4e5f6...",
    status: "verified",
    category: "Transaction Records",
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
  },
  {
    id: "4",
    name: "chat_logs.txt",
    type: "document",
    size: "156 KB",
    uploadDate: "2024-01-16",
    hash: "sha256:u4v5w6x7y8z9...",
    status: "verified",
    category: "Communications",
  },
]

export function EvidenceManager({ caseId }: EvidenceManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = ["all", "Transaction Records", "Communications", "Wallet Information", "Legal Documents"]

  const filteredEvidence = mockEvidence.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || file.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
            Pending
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

  return (
    <div className="space-y-6">
      {/* Evidence Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">{mockEvidence.length}</div>
            <div className="text-sm text-muted-foreground">Total Files</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {mockEvidence.filter((f) => f.status === "verified").length}
            </div>
            <div className="text-sm text-muted-foreground">Verified</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {mockEvidence.filter((f) => f.status === "pending").length}
            </div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {mockEvidence
                .reduce((acc, file) => acc + Number.parseFloat(file.size.replace(/[^\d.]/g, "")), 0)
                .toFixed(1)}{" "}
              MB
            </div>
            <div className="text-sm text-muted-foreground">Total Size</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Evidence Files</span>
            <Button size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload New
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>

          {/* Evidence List */}
          <div className="space-y-3">
            {filteredEvidence.map((file) => (
              <Card key={file.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        {getFileIcon(file.type)}
                      </div>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{file.size}</span>
                          <span>•</span>
                          <span>{file.category}</span>
                          <span>•</span>
                          <span>Uploaded {new Date(file.uploadDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(file.status)}
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-muted/50 rounded text-xs font-mono text-muted-foreground">
                    Hash: {file.hash}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
