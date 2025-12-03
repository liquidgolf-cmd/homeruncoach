import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'
import ChatInterface from '../components/ChatInterface'
import { useAICoach } from '../hooks/useAICoach'
import { ModuleType, ModulePhase } from '../types/module'
import { getModuleRole, getModuleDescription } from '../utils/coachingQualities'

const ModuleChat: React.FC = () => {
  const { moduleType } = useParams<{ moduleType: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [phase, setPhase] = useState<ModulePhase>('warmup')

  // Validate module type
  const validModuleTypes: ModuleType[] = ['story', 'solution', 'success']
  const currentModule = validModuleTypes.includes(moduleType as ModuleType)
    ? (moduleType as ModuleType)
    : 'story'

  const {
    messages,
    currentPhase,
    isLoading,
    sendMessage,
    initializeConversation,
    completeModule,
  } = useAICoach({
    moduleType: currentModule,
    onPhaseChange: (newPhase) => {
      setPhase(newPhase)
    },
    onComplete: () => {
      // Handle module completion
      console.log('Module completed!')
    },
  })

  useEffect(() => {
    initializeConversation()
  }, [initializeConversation])

  const getPhaseLabel = (phase: ModulePhase): string => {
    const labels = {
      warmup: 'Getting Started',
      questions: 'Guided Questions',
      draft: 'Reviewing Draft',
      review: 'Complete',
    }
    return labels[phase]
  }

  const getProgressPercentage = (): number => {
    const phases: ModulePhase[] = ['warmup', 'questions', 'draft', 'review']
    const currentIndex = phases.indexOf(currentPhase)
    return ((currentIndex + 1) / phases.length) * 100
  }

  const role = getModuleRole(currentModule)
  const description = getModuleDescription(currentModule)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
        {/* Header */}
        <header className="border-b border-slate-800 bg-slate-900/60">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="text-slate-400 hover:text-lime-300 transition-colors"
                >
                  ← Dashboard
                </Link>
                <div>
                  <h1 className="text-lg font-semibold">{role}</h1>
                  <p className="text-xs text-slate-400">{description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-xs text-slate-400">
                  {getPhaseLabel(currentPhase)}
                </div>
                <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-lime-400 transition-all"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 flex">
          {/* Sidebar - Module Info */}
          <aside className="hidden md:block w-64 border-r border-slate-800 bg-slate-900/40 p-6">
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-slate-300 mb-2">Module: {currentModule.charAt(0).toUpperCase() + currentModule.slice(1)}</h2>
              <p className="text-xs text-slate-400">{description}</p>
            </div>

            <div className="space-y-2">
              <div className={`text-xs p-2 rounded ${currentPhase === 'warmup' ? 'bg-lime-400/20 text-lime-300' : 'text-slate-500'}`}>
                1. Warm-up & Framing
              </div>
              <div className={`text-xs p-2 rounded ${currentPhase === 'questions' ? 'bg-lime-400/20 text-lime-300' : 'text-slate-500'}`}>
                2. Guided Questions
              </div>
              <div className={`text-xs p-2 rounded ${currentPhase === 'draft' ? 'bg-lime-400/20 text-lime-300' : 'text-slate-500'}`}>
                3. AI-Generated Draft
              </div>
              <div className={`text-xs p-2 rounded ${currentPhase === 'review' ? 'bg-lime-400/20 text-lime-300' : 'text-slate-500'}`}>
                4. Review & Confirm
              </div>
            </div>

            {currentPhase === 'review' && (
              <div className="mt-6 p-4 rounded-lg bg-lime-400/10 border border-lime-400/30">
                <p className="text-xs text-lime-300 mb-2">Module Complete!</p>
                <Link
                  to="/dashboard"
                  className="text-xs text-lime-300 hover:text-lime-200 underline"
                >
                  Return to Dashboard
                </Link>
              </div>
            )}
          </aside>

          {/* Main Chat */}
          <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
            <ChatInterface
              messages={messages}
              onSendMessage={sendMessage}
              isLoading={isLoading}
              disabled={currentPhase === 'review'}
              placeholder={
                currentPhase === 'review'
                  ? 'Module complete! Return to dashboard to view your report.'
                  : 'Type your response...'
              }
            />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default ModuleChat

