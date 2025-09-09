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
import { RealTimeChatService, type ChatMessage } from "@/lib/chat/real-time-chat"

interface RealTimeChatSystemProps {
  caseId: string
  userType: "victim" | "agent"
  userId: string
  userName: string
  otherPartyName?: string
  isOtherPartyOnline?: boolean
}

export function RealTimeChatSystem({
  caseId,
  userType,
  userId,
  userName,
  otherPartyName = "Support Agent",
  isOtherPartyOnline = false,
}: RealTimeChatSystemProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const [chatRoomId, setChatRoomId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatService = useRef(new RealTimeChatService())
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Create or get chat room
        const room = await chatService.current.createOrGetChatRoom(caseId, userId)
        setChatRoomId(room.id)

        // Load existing messages
        const existingMessages = await chatService.current.getMessages(room.id)
        setMessages(existingMessages)

        // Subscribe to real-time updates
        chatService.current.subscribeToMessages(
          room.id,
          (newMessage) => {
            setMessages((prev) => [...prev, newMessage])
            // Mark as read if not from current user
            if (newMessage.sender_id !== userId) {
              chatService.current.markMessagesAsRead(room.id, userId)
            }
          },
          (typingData) => {
            if (typingData.user !== userName) {
              setOtherUserTyping(typingData.isTyping)
            }
          },
        )
      } catch (error) {
        console.error("[v0] Error initializing chat:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeChat()

    return () => {
      chatService.current.unsubscribe()
    }
  }, [caseId, userId, userName])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleTyping = (value: string) => {
    setNewMessage(value)

    if (!isTyping && chatRoomId) {
      setIsTyping(true)
      chatService.current.sendTypingIndicator(chatRoomId, userName, true)
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      if (chatRoomId) {
        chatService.current.sendTypingIndicator(chatRoomId, userName, false)
      }
    }, 1000)
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatRoomId) return

    try {
      await chatService.current.sendMessage(chatRoomId, userType, userId, userName, newMessage)
      setNewMessage("")
      setIsTyping(false)
      if (chatRoomId) {
        chatService.current.sendTypingIndicator(chatRoomId, userName, false)
      }
    } catch (error) {
      console.error("[v0] Error sending message:", error)
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (isLoading) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?key=chat-avatar" />
              <AvatarFallback>
                {otherPartyName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{otherPartyName}</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant={isOtherPartyOnline ? "default" : "secondary"} className="text-xs">
                  {isOtherPartyOnline ? "Online" : "Offline"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {userType === "victim" ? "Recovery Specialist" : "Fraud Victim"}
                </span>
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
                  className={`flex ${message.sender_type === userType ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] ${message.sender_type === userType ? "order-2" : "order-1"}`}>
                    {message.sender_type !== userType && (
                      <div className="flex items-center space-x-2 mb-1">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src="/placeholder.svg?key=sender" />
                          <AvatarFallback className="text-xs">
                            {message.sender_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{message.sender_name}</span>
                        <Badge variant="outline" className="text-xs">
                          {message.sender_type === "agent" ? "Verified Agent" : "Victim"}
                        </Badge>
                      </div>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.sender_type === userType ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-muted-foreground">{formatTime(message.created_at)}</span>
                      {message.sender_type === userType && (
                        <span className="text-xs text-muted-foreground">{message.is_read ? "Read" : "Delivered"}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {otherUserTyping && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src="/placeholder.svg?key=typing" />
                    <AvatarFallback className="text-xs">
                      {otherPartyName
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
            placeholder={`Type your message to ${otherPartyName}...`}
            value={newMessage}
            onChange={(e) => handleTyping(e.target.value)}
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
            <span>Real-time secure messaging</span>
          </div>
          <span>Press Enter to send</span>
        </div>
      </div>
    </Card>
  )
}
