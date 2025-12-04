import { useState, useCallback } from 'react'
import { Message, ModuleType, ModulePhase, Conversation } from '../types/module'
import { getModuleRole, getModuleDescription } from '../utils/coachingQualities'
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
  const [currentPhase, setCurrentPhase] = useState<ModulePhase>('questions')
  const [isLoading, setIsLoading] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  
  // Mock project ID - in production, get from route or context
  const projectId = 'project_1'

  // Generate draft using Claude API
  const generateDraft = async (allMessages: Message[]): Promise<string> => {
    const hasAPIKey = isAPIKeyConfigured()
    
    // Create a comprehensive draft request based on module type
    const draftInstructions = {
      story: `Based on our entire conversation, please create a comprehensive draft document that includes:

## BRAND STORY
A clear, compelling narrative (2-4 paragraphs) that explains:
- Why you're doing this business and what drives you
- Your personal story and what led you here
- What you believe and how that drives everything you do

## IDEAL CLIENT PROFILE
A detailed description of your primary audience, including:
- **Who they are**: Demographics, situation, and context
- **What challenges they face**: Daily struggles and frustrations
- **What they desire**: What they secretly wish were true 6-12 months from now
- **Where they are**: Where they hang out (online/offline) and who they already trust

## CORE MESSAGE
A clear, concise statement (1-2 sentences) that captures:
- What you do
- Who you serve
- The transformation you help them achieve

Format this as a professional document with clear section headers. Make it specific and personal, not generic. Do NOT include "next steps" or action items - focus only on the Brand Story, Ideal Client Profile, and Core Message.`,
      
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
    if (currentPhase === 'questions') {
      // In mock mode, just acknowledge and ask a follow-up
      const followUps = {
        story: "That's helpful. Can you tell me more about what drives you to do this work?",
        solution: "Got it. What do you think your ideal client really needs, even if they can't articulate it yet?",
        success: "I see. What would make your ideal client say this was an absolute home run?",
      }
      return followUps[moduleType]
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

    // Store user answers for report generation
    if (currentPhase === 'questions') {
      const answerKey = `answer_${Date.now()}`
      setAnswers(prev => ({ ...prev, [answerKey]: content }))
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
                    currentQuestionIndex: 0,
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

      // Check if AI response indicates transition to draft phase
      // The AI will say something like "I have enough information" or "Let me create a draft"
      const draftIndicators = [
        'i have enough information',
        'let me create a draft',
        'let me pull together',
        'let me synthesize',
        'i\'ll create a draft',
        'let me draft',
        'creating a draft',
      ]
      
      const shouldTransitionToDraft = draftIndicators.some(indicator => 
        aiResponse.toLowerCase().includes(indicator)
      )
      
      // Handle phase transitions
      if (currentPhase === 'questions' && shouldTransitionToDraft) {
        // AI has indicated it's ready to create the draft
        setCurrentPhase('draft')
        onPhaseChange?.('draft')
        
        // Generate draft (if not already included in response)
        if (!aiResponse.toLowerCase().includes('draft')) {
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
                    currentQuestionIndex: 0,
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
        } else {
          // Draft is already in the response, just save conversation
          if (conversationId) {
            const conversation: Conversation = {
              id: conversationId,
              moduleType,
              projectId,
              messages: updatedMessages,
              currentPhase: 'draft',
              phaseData: {
                questions: {
                  currentQuestionIndex: 0,
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
    }, [moduleType, currentPhase, messages, isLoading, onPhaseChange, conversationId, projectId, answers])

  const initializeConversation = useCallback(() => {
    const role = getModuleRole(moduleType)
    const description = getModuleDescription(moduleType)
    
    // Create an opening message that invites conversation
    const openingMessages = {
      story: `I'm your ${role}. Let's clarify your story: why you're doing this and who it's for. 

${description}

What's the deeper reason you're doing this business or project?`,
      
      solution: `I'm your ${role}. Let's design your solution: what you offer and how it helps your people win.

${description}

In your own words, what does your ideal client say they want?`,
      
      success: `I'm your ${role}. Let's define what success looks like—for your clients and for you.

${description}

Imagine your ideal client 6-12 months after working with you. What's different in their life or work?`,
    }
    
    const systemMessage: Message = {
      id: 'msg_system',
      role: 'system',
      content: `Starting ${moduleType} module...`,
      timestamp: new Date().toISOString(),
    }

    const openingMessage: Message = {
      id: 'msg_opening',
      role: 'assistant',
      content: openingMessages[moduleType],
      timestamp: new Date().toISOString(),
      phase: 'questions',
    }

    setMessages([systemMessage, openingMessage])
    setCurrentPhase('questions')
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
          currentQuestionIndex: 0,
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
  }, [conversationId, moduleType, messages, answers, onPhaseChange, onComplete])

  return {
    messages,
    currentPhase,
    isLoading,
    sendMessage,
    initializeConversation,
    completeModule,
  }
}

