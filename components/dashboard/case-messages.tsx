"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Paperclip } from "lucide-react"

interface Message {
  id: string
  sender: string
  senderType: "agent" | "user"
  content: string
  timestamp: string
  attachments?: string[]
}

interface CaseMessagesProps {
  caseId: string
}

// Mock messages data
const mockMessages: Message[] = [
  {
    id: "1",
    sender: "Sarah Johnson",
    senderType: "agent",
    content:
      "Hello! I'm Sarah Johnson, your assigned fraud recovery specialist. I've reviewed your case and have some initial questions to help us move forward with your recovery.",
    timestamp: "2024-01-16T09:30:00Z",
  },
  {
    id: "2",
    sender: "Sarah Johnson",
    senderType: "agent",
    content:
      "Could you please provide any additional communication records you may have with the fraudulent party? Even small details can be crucial for our investigation.",
    timestamp: "2024-01-16T09:32:00Z",
  },
  {
    id: "3",
    sender: "You",
    senderType: "user",
    content:
      "Hi Sarah, thank you for taking my case. I have some additional WhatsApp messages that I didn't include in my original report. Should I upload them through the evidence section?",
    timestamp: "2024-01-16T14:15:00Z",
  },
  {
    id: "4",
    sender: "Sarah Johnson",
    senderType: "agent",
    content:
      "Yes, please upload them to the evidence section. Also, I've initiated a blockchain analysis for the transaction hashes you provided. We should have preliminary results within 48 hours.",
    timestamp: "2024-01-17T10:20:00Z",
  },
  {
    id: "5",
    sender: "Sarah Johnson",
    senderType: "agent",
    content:
      "Good news! Our blockchain analysis has identified the destination wallets. We're now coordinating with our legal team to explore recovery options. I'll update you as soon as we have more information.",
    timestamp: "2024-01-18T16:45:00Z",
  },
]

export function CaseMessages({ caseId }: CaseMessagesProps) {
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the API
      console.log("Sending message:", newMessage)
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
      <div className="text-sm text-muted-foreground mb-4">
        Secure messaging with your assigned recovery specialist for case {caseId}
      </div>

      {/* Messages List */}
      <Card className="h-96 overflow-hidden">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderType === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.senderType === "user" ? "flex-row-reverse space-x-reverse" : ""
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
                      {message.senderType === "agent" ? "SJ" : "You"[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${
                      message.senderType === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">
                        {message.senderType === "user" ? "You" : message.sender}
                      </span>
                      {message.senderType === "agent" && (
                        <Badge variant="secondary" className="text-xs ml-2">
                          Agent
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
                placeholder="Type your message..."
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
              Messages are encrypted and monitored for security. Response time: 2-4 hours during business hours.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
