"use client"

import type React from "react"

import { useCallback } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, ImageIcon, X } from "lucide-react"
import type { WizardData } from "@/components/fraud-reporting-wizard"

interface EvidenceStepProps {
  data: WizardData
  updateData: (updates: Partial<WizardData>) => void
}

export function EvidenceStep({ data, updateData }: EvidenceStepProps) {
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || [])
      updateData({
        evidenceFiles: [...data.evidenceFiles, ...files],
      })
    },
    [data.evidenceFiles, updateData],
  )

  const removeFile = (index: number) => {
    updateData({
      evidenceFiles: data.evidenceFiles.filter((_, i) => i !== index),
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="w-4 h-4" />
    }
    return <ImageIcon className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Upload Evidence</h3>
        <p className="text-muted-foreground mb-4">
          Upload any supporting evidence such as screenshots, emails, chat logs, receipts, or other relevant documents.
        </p>
      </div>

      <Card className="border-dashed border-2 border-muted-foreground/25">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
            <div>
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span>Choose Files</span>
                </Button>
              </Label>
              <input
                id="file-upload"
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf,.txt,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Supported formats: JPG, PNG, PDF, TXT, DOC, DOCX (Max 10MB per file)
            </p>
          </div>
        </CardContent>
      </Card>

      {data.evidenceFiles.length > 0 && (
        <div className="space-y-4">
          <Label>Uploaded Files ({data.evidenceFiles.length}):</Label>
          <div className="space-y-2">
            {data.evidenceFiles.map((file, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file)}
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
