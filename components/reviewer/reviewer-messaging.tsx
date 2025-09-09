"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Paperclip, Shield } from "lucide-react"

interface ReviewerMessagingProps {
  caseId: string
  victimName: string
}

// Mock messages for reviewer view
const mockReviewerMessages = [
  {
    id: "1",
    sender: "Sarah Johnson",
    senderType: "agent" as const,
    content:
      "Hello! I'm Sarah Johnson, your assigned fraud recovery specialist. I've reviewed your case and have some initial questions to help us move forward with your recovery.",
    timestamp: "2024-01-16T09:30:00Z",
  },
  {
    id: "2",
    sender: "Sarah Johnson",
    senderType: "agent" as const,
    content:
      "Could you please provide any additional communication records you may have with the fraudulent party? Even small details can be crucial for our investigation.",
    timestamp: "2024-01-16T09:32:00Z",
  },
  {
    id: "3",
    sender: "John Smith",
    senderType: "victim" as const,
    content:
      "Hi Sarah, thank you for taking my case. I have some additional WhatsApp messages that I didn't include in my original report. Should I upload them through the evidence section?",
    timestamp: "2024-01-16T14:15:00Z",
  },
  {
    id: "4",
    sender: "Sarah Johnson",
    senderType: "agent" as const,
    content:
      "Yes, please upload them to the evidence section. Also, I've initiated a blockchain analysis for the transaction hashes you provided. We should have preliminary results within 48 hours.",
    timestamp: "2024-01-17T10:20:00Z",
  },
]

export function ReviewerMessaging({ caseId, victimName }: ReviewerMessagingProps) {
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message to victim:", newMessage)
      setNewMessage("")
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Secure messaging with {victimName} for case {caseId}
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          <Shield className="w-3 h-3 mr-1" />
          Encrypted
        </Badge>
      </div>

      {/* Messages List */}
      <Card className="h-96 overflow-hidden">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockReviewerMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderType === "agent" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.senderType === "agent" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback
                      className={
                        message.senderType === "agent"
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent text-accent-foreground"
                      }
                    >
                      {message.senderType === "agent" ? "SJ" : victimName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${
                      message.senderType === "agent"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">
                        {message.senderType === "agent" ? "You (Agent)" : victimName}
                      </span>
                      {message.senderType === "victim" && (
                        <Badge variant="secondary" className="text-xs ml-2">
                          Victim
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-2">{formatTimestamp(message.timestamp)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Textarea
                placeholder={`Send a message to ${victimName}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 min-h-[60px] resize-none"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <div className="flex flex-col space-y-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              All messages are encrypted and logged for security. Professional communication guidelines apply.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
