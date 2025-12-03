import { useState, useCallback } from 'react'
import { Message, ModuleType, ModulePhase, Conversation } from '../types/module'
import { getModuleQuestions } from '../utils/prompts'
import { generateReport } from '../utils/reportGenerator'
import { saveReport } from '../utils/reportStorage'
import { generateClaudeResponse, isAPIKeyConfigured } from '../api/claude'
import { saveConversation } from '../utils/conversationStorage'

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
  
  // Mock project ID - in production, get from route or context
  const projectId = 'project_1'

  // Generate draft using Claude API
  const generateDraft = async (allMessages: Message[]): Promise<string> => {
    const hasAPIKey = isAPIKeyConfigured()
    
    // Create a comprehensive draft request based on module type
    const draftInstructions = {
      story: `Based on our entire conversation, please create a comprehensive draft that includes:

1. **Brand Story**: A clear, compelling narrative that explains why you're doing this business and what drives you
2. **Ideal Client Profile**: A detailed description of your primary audience, including:
   - Who they are (demographics, situation)
   - What challenges they face daily
   - What they secretly wish were true
   - Where they hang out and who they trust

Please synthesize all the information from our conversation into a well-structured, actionable draft. Make it specific and personal, not generic.`,
      
      solution: `Based on our entire conversation, please create a comprehensive draft that includes:

1. **Value Proposition**: A clear statement of what you offer and why it matters
2. **Offer Overview**: Details about your main offer including format, who it's for, and the main promise
3. **Customer Journey Map**: The steps from "I saw you" to "I'm in" and beyond
4. **Delivery Framework**: The 4-6 key steps that help a client go from A → B

Please synthesize all the information from our conversation into a well-structured, actionable draft. Make it specific and practical.`,
      
      success: `Based on our entire conversation, please create a comprehensive draft that includes:

1. **HomeRun Outcome Statement**: What success looks like for your ideal client 6-12 months after working with you
2. **Success Metrics**: 3-5 tangible signs that show things are working, plus monthly tracking suggestions
3. **90-Day Action Plan**: Realistic, actionable projects and tasks for the next 90 days

Please synthesize all the information from our conversation into a well-structured, actionable draft. Make it specific and measurable.`
    }
    
    if (hasAPIKey) {
      try {
        // Create a draft request message that uses the full conversation context
        const draftRequestMessage: Message = {
          id: `msg_draft_request_${Date.now()}`,
          role: 'user',
          content: `${draftInstructions[moduleType]}\n\nPlease review our entire conversation above and create this draft based on all the information shared.`,
          timestamp: new Date().toISOString(),
          phase: 'draft',
        }
        
        const draftMessages = [...allMessages, draftRequestMessage]
        const model = import.meta.env.VITE_CLAUDE_MODEL || 'claude-sonnet-4-5'
        
        return await generateClaudeResponse(draftMessages, moduleType, model)
      } catch (error) {
        console.error('Error generating draft:', error)
        // Fall through to fallback draft
      }
    }
    
    // Fallback: Generate a basic draft from answers
    const answerSummary = Object.entries(answers)
      .map(([key, value]) => `Question ${key.replace('q', '')}: ${value}`)
      .join('\n\n')
    
    return `Here's a draft based on our conversation. Please review it and let me know what you'd like to adjust:

---

**Draft Summary:**

${answerSummary}

---

This is a basic summary of your answers. For a more comprehensive draft, please configure your Claude API key in the .env file.

What would you like to change or refine?`
  }

  // Generate AI response using Claude API or fallback to mock
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    const hasAPIKey = isAPIKeyConfigured()
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
    
    console.log('🔑 API Key Check:', {
      configured: hasAPIKey,
      keyPresent: !!apiKey,
      keyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'none',
      model: import.meta.env.VITE_CLAUDE_MODEL || 'not set'
    })
    
    // If API key is configured, use Claude API
    if (hasAPIKey) {
      try {
        // Get all messages including the new user message for context
        const allMessages = [...messages, {
          id: `msg_${Date.now()}`,
          role: 'user' as const,
          content: userMessage,
          timestamp: new Date().toISOString(),
          phase: currentPhase,
        }]
        
        // Use model from environment variable or default to Sonnet 4.5
        const model = import.meta.env.VITE_CLAUDE_MODEL || 'claude-sonnet-4-5'
        
        console.log('🤖 Calling Claude API with model:', model)
        const response = await generateClaudeResponse(allMessages, moduleType, model)
        console.log('✅ Claude API response received')
        return response
      } catch (error) {
        console.error('❌ Claude API error:', error)
        if (error instanceof Error) {
          console.error('Error message:', error.message)
        }
        // Fall through to mock response if API fails
      }
    } else {
      console.warn('⚠️ API key not configured - using mock responses')
    }
    
    // Fallback to mock responses if API key not configured or API fails
    const questions = getModuleQuestions(moduleType)

    if (currentPhase === 'questions') {
      const nextQ = questions[questionIndex + 1]

      // Natural, conversational transitions
      const transitions = [
        'Got it.',
        'That makes sense.',
        'I see.',
        'Helpful context.',
        'Thanks for sharing that.',
        'Understood.',
      ]
      const transition = transitions[Math.floor(Math.random() * transitions.length)]

      if (nextQ) {
        return `${transition}\n\n${nextQ}`
      } else {
        // Move to draft phase
        return `${transition}\n\nPerfect! I have everything I need. Let me pull together a draft based on what you've shared...`
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
      const questionKey = `q${questionIndex}`
      setAnswers(prev => ({ ...prev, [questionKey]: content }))
    }

    try {
      // Generate AI response
      const aiResponse = await generateAIResponse(content)

      const aiMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
        phase: currentPhase,
      }

      setMessages(prev => [...prev, aiMessage])

      // Save conversation after each message
      const updatedMessages = [...messages, userMessage, aiMessage]
      if (conversationId) {
        const conversation: Conversation = {
          id: conversationId,
          moduleType,
          projectId,
          messages: updatedMessages,
          currentPhase,
          phaseData: {
            questions: currentPhase === 'questions' ? {
              currentQuestionIndex: questionIndex,
              answers,
              completed: false,
            } : undefined,
          },
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        saveConversation(conversation)
      }

      // Handle phase transitions
      if (currentPhase === 'questions') {
        const questions = getModuleQuestions(moduleType)
        if (questionIndex < questions.length - 1) {
          setQuestionIndex(prev => prev + 1)
        } else {
          // All questions answered - generate draft
          setCurrentPhase('draft')
          onPhaseChange?.('draft')
          
          // Generate draft
          setIsLoading(true)
          try {
            const draftContent = await generateDraft(updatedMessages)
            const draftMessage: Message = {
              id: `msg_draft_${Date.now()}`,
              role: 'assistant',
              content: draftContent,
              timestamp: new Date().toISOString(),
              phase: 'draft',
            }
            setMessages(prev => [...prev, draftMessage])
            
            // Save conversation with draft
            if (conversationId) {
              const conversation: Conversation = {
                id: conversationId,
                moduleType,
                projectId,
                messages: [...updatedMessages, draftMessage],
                currentPhase: 'draft',
                phaseData: {
                  questions: {
                    currentQuestionIndex: questionIndex,
                    answers,
                    completed: true,
                  },
                },
                completed: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
              saveConversation(conversation)
            }
          } catch (error) {
            console.error('Error generating draft:', error)
          } finally {
            setIsLoading(false)
          }
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
    }, [moduleType, currentPhase, questionIndex, messages, isLoading, onPhaseChange, conversationId, projectId, answers])

  const initializeConversation = useCallback(() => {
    const questions = getModuleQuestions(moduleType)
    const firstQuestion = questions[0]
    
    const systemMessage: Message = {
      id: 'msg_system',
      role: 'system',
      content: `Starting ${moduleType} module...`,
      timestamp: new Date().toISOString(),
    }

    const firstQuestionMessage: Message = {
      id: 'msg_first_question',
      role: 'assistant',
      content: firstQuestion,
      timestamp: new Date().toISOString(),
      phase: 'questions',
    }

    setMessages([systemMessage, firstQuestionMessage])
    setCurrentPhase('questions')
    setQuestionIndex(0)
    setAnswers({})
  }, [moduleType])

  const completeModule = useCallback((projectId: string) => {
    setCurrentPhase('review')
    onPhaseChange?.('review')
    
    // Generate and save report
    const conversation: Conversation = {
      id: conversationId || `conv_${Date.now()}`,
      moduleType,
      projectId,
      messages,
      currentPhase: 'review',
      phaseData: {
        questions: {
          currentQuestionIndex: questionIndex,
          answers,
          completed: true,
        },
      },
      completed: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    const report = generateReport(conversation, projectId)
    saveReport(report)
    
    onComplete?.()
  }, [conversationId, moduleType, messages, questionIndex, answers, onPhaseChange, onComplete])

  return {
    messages,
    currentPhase,
    isLoading,
    sendMessage,
    initializeConversation,
    completeModule,
  }
}

