import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import MessageBubble from '../components/MessageBubble'
import { getConversation } from '../utils/conversationStorage'
import { Conversation } from '../types/module'

const ConversationViewer: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>()
  const [conversation, setConversation] = useState<Conversation | null>(null)

  useEffect(() => {
    if (conversationId) {
      const conv = getConversation(conversationId)
      setConversation(conv)
    }
  }, [conversationId])

  if (!conversation) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-400 mb-4">Conversation not found</p>
            <Link
              to="/dashboard"
              className="text-lime-300 hover:text-lime-200 underline"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const moduleName = conversation.moduleType.charAt(0).toUpperCase() + conversation.moduleType.slice(1)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950 text-slate-50">
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
                  <h1 className="text-lg font-semibold">{moduleName} Module Conversation</h1>
                  <p className="text-xs text-slate-400">
                    {conversation.messages.length} messages • {new Date(conversation.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {conversation.completed && (
                  <span className="rounded-full bg-lime-400/20 px-3 py-1 text-xs font-semibold text-lime-300">
                    Complete
                  </span>
                )}
                <span className="text-xs text-slate-400">
                  Phase: {conversation.currentPhase}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Messages */}
        <main className="mx-auto max-w-4xl px-4 py-8">
          <div className="space-y-4">
            {conversation.messages
              .filter(msg => msg.role !== 'system')
              .map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
          </div>

          {conversation.messages.length === 0 && (
            <div className="text-center text-slate-500 mt-8">
              <p>No messages in this conversation yet.</p>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default ConversationViewer

