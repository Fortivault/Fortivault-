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
  isRead?: boolean
}

interface AgentChatSystemProps {
  caseId: string
  victimName: string
  isVictimOnline?: boolean
}

export function AgentChatSystem({ caseId, victimName, isVictimOnline = false }: AgentChatSystemProps) {
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
      isRead: true,
    },
    {
      id: "2",
      content:
        "I've been assigned to your case and have extensive experience with cryptocurrency fraud recovery. Let's start by discussing the immediate steps we can take to secure your accounts and begin the recovery process.",
      sender: "agent",
      timestamp: new Date(Date.now() - 240000),
      type: "text",
      isRead: true,
    },
    {
      id: "3",
      content:
        "Hi Sarah, thank you for taking my case. I have some additional WhatsApp messages that I didn't include in my original report. Should I upload them through the evidence section?",
      sender: "user",
      timestamp: new Date(Date.now() - 180000),
      type: "text",
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
      sender: "agent",
      timestamp: new Date(),
      type: "text",
      isRead: false,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate message delivery
    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === message.id ? { ...msg, isRead: true } : msg)))
    }, 1000)
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
              <AvatarImage src="/placeholder.svg?key=victim" />
              <AvatarFallback>
                {victimName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{victimName}</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant={isVictimOnline ? "default" : "secondary"} className="text-xs">
                  {isVictimOnline ? "Online" : "Offline"}
                </Badge>
                <span className="text-sm text-muted-foreground">Fraud Victim</span>
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
                  className={`flex ${message.sender === "agent" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] ${message.sender === "agent" ? "order-2" : "order-1"}`}>
                    {message.sender === "user" && (
                      <div className="flex items-center space-x-2 mb-1">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src="/placeholder.svg?key=victim2" />
                          <AvatarFallback className="text-xs">
                            {victimName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{victimName}</span>
                        <Badge variant="outline" className="text-xs">
                          Victim
                        </Badge>
                      </div>
                    )}
                    {message.sender === "agent" && (
                      <div className="flex items-center space-x-2 mb-1 justify-end">
                        <Badge variant="outline" className="text-xs">
                          You (Agent)
                        </Badge>
                        <span className="text-xs font-medium">Sarah Martinez</span>
                        <Avatar className="w-6 h-6">
                          <AvatarImage src="/placeholder.svg?key=agent" />
                          <AvatarFallback className="text-xs">SM</AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.sender === "agent" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                      {message.sender === "agent" && (
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
                    <AvatarImage src="/placeholder.svg?key=victim3" />
                    <AvatarFallback className="text-xs">
                      {victimName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
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
            placeholder="Type your message to the victim..."
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
            <span>Professional communication with victim</span>
          </div>
          <span>Press Enter to send</span>
        </div>
      </div>
    </Card>
  )
}
