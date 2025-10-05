"use client"

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
  subscribeToMessages(_chatRoomId: string, _onMessage: (message: ChatMessage) => void, _onTyping?: (data: { user: string; isTyping: boolean }) => void) {
    return null
  }

  async sendMessage(
    chatRoomId: string,
    senderType: "victim" | "agent",
    senderId: string,
    senderName: string,
    content: string,
    messageType: "text" | "file" | "system" = "text",
  ) {
    const now = new Date().toISOString()
    return {
      id: crypto.randomUUID(),
      chat_room_id: chatRoomId,
      sender_type: senderType,
      sender_id: senderId,
      sender_name: senderName,
      content,
      message_type: messageType,
      is_read: false,
      created_at: now,
    } as ChatMessage
  }

  async getChatRoom(_caseId: string) {
    return null
  }

  async createOrGetChatRoom(_caseId: string, _victimEmail: string) {
    return null
  }

  async getMessages(_chatRoomId: string, _limit = 50) {
    return [] as ChatMessage[]
  }

  sendTypingIndicator(_chatRoomId: string, _user: string, _isTyping: boolean) {}

  async markMessagesAsRead(_chatRoomId: string, _senderId: string) {}

  unsubscribe() {}
}
