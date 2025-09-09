"use client"

import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

export interface ChatMessage {
  id: string
  chat_room_id: string
  sender_type: "victim" | "agent"
  sender_id: string
  sender_name: string
  content: string
  message_type: "text" | "file" | "system"
  is_read: boolean
  created_at: string
}

export interface ChatRoom {
  id: string
  case_id: string
  victim_email: string
  assigned_agent_id: string | null
  is_active: boolean
  created_at: string
}

export class RealTimeChatService {
  private supabase = createClient()
  private channel: RealtimeChannel | null = null

  subscribeToMessages(
    chatRoomId: string,
    onMessage: (message: ChatMessage) => void,
    onTyping?: (data: { user: string; isTyping: boolean }) => void,
  ) {
    this.channel = this.supabase
      .channel(`chat_room_${chatRoomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_room_id=eq.${chatRoomId}`,
        },
        (payload) => {
          onMessage(payload.new as ChatMessage)
        },
      )
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        if (onTyping) {
          onTyping(payload)
        }
      })
      .subscribe()

    return this.channel
  }

  async sendMessage(
    chatRoomId: string,
    senderType: "victim" | "agent",
    senderId: string,
    senderName: string,
    content: string,
    messageType: "text" | "file" | "system" = "text",
  ) {
    const { data, error } = await this.supabase
      .from("messages")
      .insert({
        chat_room_id: chatRoomId,
        sender_type: senderType,
        sender_id: senderId,
        sender_name: senderName,
        content,
        message_type: messageType,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getChatRoom(caseId: string) {
    const { data, error } = await this.supabase
      .from("chat_rooms")
      .select(`
        *,
        cases!inner(case_id, victim_email, status),
        agents(name, role, is_online)
      `)
      .eq("cases.case_id", caseId)
      .single()

    if (error) throw error
    return data
  }

  async createOrGetChatRoom(caseId: string, victimEmail: string) {
    // First try to get existing chat room
    const { data: existingRoom } = await this.supabase.from("chat_rooms").select("*").eq("case_id", caseId).single()

    if (existingRoom) {
      return existingRoom
    }

    // Create new chat room
    const { data, error } = await this.supabase
      .from("chat_rooms")
      .insert({
        case_id: caseId,
        victim_email: victimEmail,
        assigned_agent_id: "550e8400-e29b-41d4-a716-446655440001", // Default to Sarah Martinez
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getMessages(chatRoomId: string, limit = 50) {
    const { data, error } = await this.supabase
      .from("messages")
      .select("*")
      .eq("chat_room_id", chatRoomId)
      .order("created_at", { ascending: true })
      .limit(limit)

    if (error) throw error
    return data
  }

  sendTypingIndicator(chatRoomId: string, user: string, isTyping: boolean) {
    if (this.channel) {
      this.channel.send({
        type: "broadcast",
        event: "typing",
        payload: { user, isTyping },
      })
    }
  }

  async markMessagesAsRead(chatRoomId: string, senderId: string) {
    const { error } = await this.supabase
      .from("messages")
      .update({ is_read: true })
      .eq("chat_room_id", chatRoomId)
      .neq("sender_id", senderId)

    if (error) throw error
  }

  unsubscribe() {
    if (this.channel) {
      this.supabase.removeChannel(this.channel)
      this.channel = null
    }
  }
}
