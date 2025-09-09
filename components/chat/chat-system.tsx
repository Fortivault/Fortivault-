"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, Phone, Video, MoreVertical, Shield, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  content: string
  sender: "user" | "agent"
  timestamp: Date
  type: "text" | "file" | "system"
  agentName?: string
  agentRole?: string
  isRead?: boolean
}

interface ChatSystemProps {
  caseId: string
  isAgentOnline?: boolean
}

export function ChatSystem({ caseId, isAgentOnline = true }: ChatSystemProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm Agent Sarah Martinez, your assigned Recovery Specialist for case " +
        caseId +
        ". I've reviewed your fraud report and I'm here to help you through the recovery process. How are you feeling right now?",
      sender: "agent",
      timestamp: new Date(Date.now() - 300000),
      type: "text",
      agentName: "Sarah Martinez",
      agentRole: "Senior Recovery Specialist",
      isRead: true,
    },
    {
      id: "2",
      content:
        "I've been assigned to your case and have extensive experience with cryptocurrency fraud recovery. Let's start by discussing the immediate steps we can take to secure your accounts and begin the recovery process.",
      sender: "agent",
      timestamp: new Date(Date.now() - 240000),
      type: "text",
      agentName: "Sarah Martinez",
      agentRole: "Senior Recovery Specialist",
      isRead: true,
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
      type: "text",
      isRead: false,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate agent typing
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      // Simulate agent response
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Thank you for that information. I'm reviewing the details now and will provide you with specific next steps shortly. In the meantime, please ensure you don't make any additional transactions to the addresses involved.",
        sender: "agent",
        timestamp: new Date(),
        type: "text",
        agentName: "Sarah Martinez",
        agentRole: "Senior Recovery Specialist",
        isRead: true,
      }
      setMessages((prev) => [...prev, agentResponse])
    }, 2000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="/professional-woman-agent.png" />
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">Sarah Martinez</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant={isAgentOnline ? "default" : "secondary"} className="text-xs">
                  {isAgentOnline ? "Online" : "Offline"}
                </Badge>
                <span className="text-sm text-muted-foreground">Senior Recovery Specialist</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Shield className="w-3 h-3" />
          <span>End-to-end encrypted • Case #{caseId}</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] ${message.sender === "user" ? "order-2" : "order-1"}`}>
                    {message.sender === "agent" && (
                      <div className="flex items-center space-x-2 mb-1">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src="/professional-woman-agent.png" />
                          <AvatarFallback className="text-xs">SM</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{message.agentName}</span>
                        <Badge variant="outline" className="text-xs">
                          Verified Agent
                        </Badge>
                      </div>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                      {message.sender === "user" && (
                        <span className="text-xs text-muted-foreground">{message.isRead ? "Read" : "Delivered"}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src="/professional-woman-agent.png" />
                    <AvatarFallback className="text-xs">SM</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Response time: ~2-5 minutes</span>
          </div>
          <span>Press Enter to send</span>
        </div>
      </div>
    </Card>
  )
}
