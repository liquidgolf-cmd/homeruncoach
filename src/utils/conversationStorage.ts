import { Conversation, Message, ModuleType } from '../types/module'

const STORAGE_PREFIX = 'homeruncoach_conversation_'

export const saveConversation = (conversation: Conversation): void => {
  const key = `${STORAGE_PREFIX}${conversation.id}`
  localStorage.setItem(key, JSON.stringify(conversation))
}

export const getConversation = (conversationId: string): Conversation | null => {
  const key = `${STORAGE_PREFIX}${conversationId}`
  const data = localStorage.getItem(key)
  if (!data) return null
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

export const getConversationsByModule = (
  projectId: string,
  moduleType: ModuleType
): Conversation[] => {
  const conversations: Conversation[] = []
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(STORAGE_PREFIX)) {
      try {
        const conversation = JSON.parse(localStorage.getItem(key) || '{}') as Conversation
        if (conversation.projectId === projectId && conversation.moduleType === moduleType) {
          conversations.push(conversation)
        }
      } catch {
        // Skip invalid entries
      }
    }
  }
  
  return conversations.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

export const createConversation = (
  projectId: string,
  moduleType: ModuleType
): Conversation => {
  const conversation: Conversation = {
    id: `conv_${Date.now()}`,
    moduleType,
    projectId,
    messages: [],
    currentPhase: 'warmup',
    phaseData: {},
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  saveConversation(conversation)
  return conversation
}

export const updateConversation = (
  conversationId: string,
  updates: Partial<Conversation>
): Conversation | null => {
  const conversation = getConversation(conversationId)
  if (!conversation) return null
  
  const updated: Conversation = {
    ...conversation,
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  
  saveConversation(updated)
  return updated
}

export const addMessageToConversation = (
  conversationId: string,
  message: Message
): Conversation | null => {
  const conversation = getConversation(conversationId)
  if (!conversation) return null
  
  const updated: Conversation = {
    ...conversation,
    messages: [...conversation.messages, message],
    updatedAt: new Date().toISOString(),
  }
  
  saveConversation(updated)
  return updated
}

export const getAllConversations = (projectId?: string): Conversation[] => {
  const conversations: Conversation[] = []
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(STORAGE_PREFIX)) {
      try {
        const conversation = JSON.parse(localStorage.getItem(key) || '{}') as Conversation
        if (!projectId || conversation.projectId === projectId) {
          conversations.push(conversation)
        }
      } catch {
        // Skip invalid entries
      }
    }
  }
  
  return conversations.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

