"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Shield,
  Clock,
  FileText,
  User,
  History,
  BookTemplate as Template,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { RealTimeChatService, type ChatMessage } from "@/lib/chat/real-time-chat"

interface AgentVictimCommunicationHubProps {
  caseId: string
  victimEmail: string
  victimName?: string
  agentId: string
  agentName: string
  isVictimOnline?: boolean
}

interface QuickResponse {
  id: string
  title: string
  content: string
  category: string
}

const quickResponses: QuickResponse[] = [
  {
    id: "1",
    title: "Initial Contact",
    content:
      "Hello! I'm your assigned Recovery Specialist. I've reviewed your case and I'm here to help you through the recovery process. How are you feeling right now?",
    category: "greeting",
  },
  {
    id: "2",
    title: "Evidence Request",
    content:
      "To proceed with your case, I'll need you to provide additional evidence. Could you please upload any screenshots, transaction records, or communication logs you have?",
    category: "evidence",
  },
  {
    id: "3",
    title: "Security Advice",
    content:
      "For your security, please ensure you've changed all passwords related to your compromised accounts and enabled two-factor authentication where possible.",
    category: "security",
  },
  {
    id: "4",
    title: "Progress Update",
    content:
      "I wanted to update you on the progress of your case. We've made significant headway and I'll keep you informed of any developments.",
    category: "update",
  },
  {
    id: "5",
    title: "Next Steps",
    content:
      "Based on our investigation, here are the next steps we'll be taking to recover your funds. I'll guide you through each step of the process.",
    category: "guidance",
  },
]

export function AgentVictimCommunicationHub({
  caseId,
  victimEmail,
  victimName = victimEmail,
  agentId,
  agentName,
  isVictimOnline = false,
}: AgentVictimCommunicationHubProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [chatRoom, setChatRoom] = useState<any>(null)
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [chatService] = useState(() => new RealTimeChatService())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize chat room and load messages
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true)

        // Create or get existing chat room
        const room = await chatService.createOrGetChatRoom(caseId, victimEmail)
        setChatRoom(room)

        // Load existing messages
        const existingMessages = await chatService.getMessages(room.id)
        setMessages(existingMessages)

        // Subscribe to real-time messages
        chatService.subscribeToMessages(
          room.id,
          (message: ChatMessage) => {
            setMessages((prev) => [...prev, message])
          },
          (data: { user: string; isTyping: boolean }) => {
            if (data.user !== agentId) {
              setIsTyping(data.isTyping)
            }
          },
        )
      } catch (error) {
        console.error("Failed to initialize chat:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (caseId && victimEmail && agentId) {
      initializeChat()
    }

    return () => {
      chatService.unsubscribe()
    }
  }, [caseId, victimEmail, agentId, chatService])

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatRoom) return

    try {
      await chatService.sendMessage(chatRoom.id, "agent", agentId, agentName, newMessage)
      setNewMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const useQuickResponse = (response: QuickResponse) => {
    setNewMessage(response.content)
    setSelectedTemplate("")
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !chatRoom) return

    try {
      // In a real implementation, you'd upload the file to storage first
      await chatService.sendMessage(chatRoom.id, "agent", agentId, agentName, `Shared file: ${file.name}`, "file")
    } catch (error) {
      console.error("Failed to send file:", error)
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
      {/* Main Chat Interface */}
      <div className="lg:col-span-3">
        <Card className="h-full flex flex-col">
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
                      className={`flex ${message.sender_type === "agent" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[80%] ${message.sender_type === "agent" ? "order-2" : "order-1"}`}>
                        {message.sender_type === "victim" && (
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
                        {message.sender_type === "agent" && (
                          <div className="flex items-center space-x-2 mb-1 justify-end">
                            <Badge variant="outline" className="text-xs">
                              You (Agent)
                            </Badge>
                            <span className="text-xs font-medium">{message.sender_name}</span>
                            <Avatar className="w-6 h-6">
                              <AvatarImage src="/placeholder.svg?key=agent" />
                              <AvatarFallback className="text-xs">
                                {message.sender_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        )}
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            message.sender_type === "agent" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          {message.message_type === "file" && (
                            <div className="flex items-center gap-2 mt-2">
                              <FileText className="w-4 h-4" />
                              <span className="text-xs">File attachment</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-muted-foreground">{formatTime(message.created_at)}</span>
                          {message.sender_type === "agent" && (
                            <span className="text-xs text-muted-foreground">
                              {message.is_read ? "Read" : "Delivered"}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
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
            <div className="flex items-center space-x-2 mb-2">
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Quick responses" />
                </SelectTrigger>
                <SelectContent>
                  {quickResponses.map((response) => (
                    <SelectItem key={response.id} value={response.id}>
                      {response.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTemplate && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const response = quickResponses.find((r) => r.id === selectedTemplate)
                    if (response) {
                      setNewMessage(response.content)
                      setSelectedTemplate("")
                    }
                  }}
                >
                  Use Template
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={handleFileUpload}>
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
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
          </div>
        </Card>
      </div>

      {/* Sidebar - Case Context & Tools */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg">Case Context</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="victim" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="victim">
                  <User className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="history">
                  <History className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="templates">
                  <Template className="w-4 h-4" />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="victim" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Victim Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <p>{victimEmail}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Case ID:</span>
                      <p>{caseId}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Communication Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Messages sent:</span>
                      <span>{messages.filter((m) => m.sender_type === "agent").length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Messages received:</span>
                      <span>{messages.filter((m) => m.sender_type === "victim").length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Response rate:</span>
                      <span>85%</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Recent Activity</h4>
                  <div className="space-y-2">
                    {messages.slice(-5).map((message) => (
                      <div key={message.id} className="text-xs p-2 bg-muted rounded">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{message.sender_type === "agent" ? "You" : victimName}</span>
                          <span className="text-muted-foreground">{formatTime(message.created_at)}</span>
                        </div>
                        <p className="text-muted-foreground truncate">{message.content.substring(0, 50)}...</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="templates" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Quick Responses</h4>
                  <div className="space-y-2">
                    {quickResponses.slice(0, 3).map((response) => (
                      <Button
                        key={response.id}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left h-auto p-2 bg-transparent"
                        onClick={() => {
                          setNewMessage(response.content)
                          setSelectedTemplate("")
                        }}
                      >
                        <div>
                          <p className="font-medium text-xs">{response.title}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {response.content.substring(0, 40)}...
                          </p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
