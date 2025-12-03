import Anthropic from '@anthropic-ai/sdk'
import { Message } from '../types/module'
import { COACHING_SYSTEM_PROMPT } from '../utils/coachingQualities'
import { getModuleRole, getModuleDescription } from '../utils/coachingQualities'
import { ModuleType } from '../types/module'

// Initialize Anthropic client
const getAnthropicClient = (): Anthropic => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  
  if (!apiKey) {
    throw new Error('VITE_ANTHROPIC_API_KEY is not set. Please add it to your .env file.')
  }
  
  return new Anthropic({
    apiKey,
  })
}

/**
 * Convert our Message format to Anthropic's message format
 */
const convertMessages = (messages: Message[]): Anthropic.MessageParam[] => {
  return messages
    .filter(msg => msg.role !== 'system') // System messages go in system prompt
    .map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }))
}

/**
 * Get the system prompt for a specific module
 */
const getModuleSystemPrompt = (moduleType: ModuleType): string => {
  const role = getModuleRole(moduleType)
  const description = getModuleDescription(moduleType)
  
  return `${COACHING_SYSTEM_PROMPT}

## Current Module Context:
- Module: ${moduleType}
- Your Role: ${role}
- Module Focus: ${description}

Remember to stay in character as a ${role} and guide the user through the ${moduleType} module using the Story / Solution / Success framework.`
}

/**
 * Generate AI response using Claude API
 * 
 * Official Anthropic Claude API Model Identifiers:
 * 
 * Sonnet 4.5 (Recommended):
 *   - claude-sonnet-4-5 (alias, recommended)
 *   - claude-sonnet-4-5-20250929 (full ID with date)
 * 
 * Haiku 4.5:
 *   - claude-haiku-4-5 (alias)
 *   - claude-haiku-4-5-20251001 (full ID)
 * 
 * Opus 4.5:
 *   - claude-opus-4-5 (alias)
 *   - claude-opus-4-5-20251101 (full ID)
 * 
 * Documentation: https://docs.anthropic.com/claude/docs/models-overview
 */
export const generateClaudeResponse = async (
  messages: Message[],
  moduleType: ModuleType,
  model: string = 'claude-3-5-sonnet-20241022'
): Promise<string> => {
  try {
    const client = getAnthropicClient()
    const systemPrompt = getModuleSystemPrompt(moduleType)
    const conversationMessages = convertMessages(messages)
    
    const response = await client.messages.create({
      model,
      max_tokens: 2048,
      system: systemPrompt,
      messages: conversationMessages,
    })
    
    // Extract text content from response
    const textContent = response.content.find(
      (block): block is Anthropic.TextBlock => block.type === 'text'
    )
    
    if (!textContent) {
      throw new Error('No text content in Claude response')
    }
    
    return textContent.text
  } catch (error) {
    console.error('Error calling Claude API:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('VITE_ANTHROPIC_API_KEY')) {
        throw new Error('API key not configured. Please set VITE_ANTHROPIC_API_KEY in your .env file.')
      }
      if (error.message.includes('401') || error.message.includes('authentication')) {
        throw new Error('Invalid API key. Please check your VITE_ANTHROPIC_API_KEY.')
      }
      if (error.message.includes('429')) {
        throw new Error('Rate limit exceeded. Please try again in a moment.')
      }
    }
    
    throw new Error('Failed to generate response. Please try again.')
  }
}

/**
 * Check if API key is configured
 */
export const isAPIKeyConfigured = (): boolean => {
  return !!import.meta.env.VITE_ANTHROPIC_API_KEY
}

