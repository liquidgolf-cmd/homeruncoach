import { useState, useCallback } from 'react'
import { Message, ModuleType, ModulePhase, Conversation } from '../types/module'
import { getWarmupPrompt, getModuleQuestions, getDraftPrompt, getReflectionPrompt } from '../utils/prompts'
import { COACHING_SYSTEM_PROMPT, getModuleRole } from '../utils/coachingQualities'

interface UseAICoachProps {
  moduleType: ModuleType
  conversationId?: string
  onPhaseChange?: (phase: ModulePhase) => void
  onComplete?: () => void
}

export const useAICoach = ({ moduleType, conversationId, onPhaseChange, onComplete }: UseAICoachProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentPhase, setCurrentPhase] = useState<ModulePhase>('warmup')
  const [isLoading, setIsLoading] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [conversation, setConversation] = useState<Conversation | null>(null)

  // Mock AI response - in production, this would call an actual API
  const generateAIResponse = async (userMessage: string, context: Message[]): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

    const role = getModuleRole(moduleType)
    const questions = getModuleQuestions(moduleType)

    // Simple rule-based responses for demo
    // In production, this would use OpenAI/Anthropic API with the system prompt
    if (currentPhase === 'warmup') {
      return `Great! I'm your ${role}, and I'm here to help you through this module. Let's start with our first question:

${questions[0]}

Take your time with this—there's no rush.`
    }

    if (currentPhase === 'questions') {
      const currentQ = questions[questionIndex]
      const nextQ = questions[questionIndex + 1]

      // Paraphrase user's answer
      const paraphrase = `What I hear you saying is: "${userMessage}". That's helpful context.`

      if (nextQ) {
        return `${paraphrase}\n\nNow, let's dig a bit deeper:\n\n${nextQ}`
      } else {
        // Move to draft phase
        return `${paraphrase}\n\nExcellent! I have enough information to create a draft for you. Let me synthesize everything we've discussed...`
      }
    }

    if (currentPhase === 'draft') {
      return `Here's a draft based on our conversation. Please review it and let me know what you'd like to adjust:

[This is where the AI-generated draft would appear. In production, this would be generated using the answers collected during the questions phase.]

What would you like to change or refine?`
    }

    if (currentPhase === 'review') {
      return `Perfect! Your ${moduleType} module is complete. You can now download your report or continue to the next module.`
    }

    return `I'm here to help you through the ${moduleType} module. How can I assist you?`
  }

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      phase: currentPhase,
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Update answers if in questions phase
    if (currentPhase === 'questions') {
      const questions = getModuleQuestions(moduleType)
      const questionKey = `q${questionIndex}`
      setAnswers(prev => ({ ...prev, [questionKey]: content }))
    }

    try {
      // Generate AI response
      const aiResponse = await generateAIResponse(content, [...messages, userMessage])

      const aiMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
        phase: currentPhase,
      }

      setMessages(prev => [...prev, aiMessage])

      // Handle phase transitions
      if (currentPhase === 'warmup') {
        setCurrentPhase('questions')
        setQuestionIndex(0)
        onPhaseChange?.('questions')
      } else if (currentPhase === 'questions') {
        const questions = getModuleQuestions(moduleType)
        if (questionIndex < questions.length - 1) {
          setQuestionIndex(prev => prev + 1)
        } else {
          setCurrentPhase('draft')
          onPhaseChange?.('draft')
        }
      }
    } catch (error) {
      console.error('Error generating AI response:', error)
      const errorMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        phase: currentPhase,
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [moduleType, currentPhase, questionIndex, messages, isLoading, onPhaseChange])

  const initializeConversation = useCallback(() => {
    const warmupPrompt = getWarmupPrompt(moduleType)
    
    const systemMessage: Message = {
      id: 'msg_system',
      role: 'system',
      content: `Starting ${moduleType} module...`,
      timestamp: new Date().toISOString(),
    }

    const welcomeMessage: Message = {
      id: 'msg_welcome',
      role: 'assistant',
      content: warmupPrompt,
      timestamp: new Date().toISOString(),
      phase: 'warmup',
    }

    setMessages([systemMessage, welcomeMessage])
    setCurrentPhase('warmup')
    setQuestionIndex(0)
    setAnswers({})
  }, [moduleType])

  const completeModule = useCallback(() => {
    setCurrentPhase('review')
    onPhaseChange?.('review')
    onComplete?.()
  }, [onPhaseChange, onComplete])

  return {
    messages,
    currentPhase,
    isLoading,
    sendMessage,
    initializeConversation,
    completeModule,
    conversation,
  }
}

