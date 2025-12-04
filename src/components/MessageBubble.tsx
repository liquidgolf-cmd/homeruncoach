import React from 'react'
import { Message, ModuleType } from '../types/module'
import DraftActions from './DraftActions'

interface MessageBubbleProps {
  message: Message
  moduleType?: ModuleType
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, moduleType }) => {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'
  const isDraft = message.phase === 'draft' && !isUser

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="text-xs text-slate-500 bg-slate-900/50 px-3 py-1 rounded-full">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {!isUser && (
          <div className="text-xs text-slate-400 mb-1 px-2">
            {message.phase ? `${message.phase.charAt(0).toUpperCase() + message.phase.slice(1)} Phase` : 'Coach'}
          </div>
        )}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-lime-400 text-slate-950'
              : 'bg-slate-800/80 text-slate-50'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          {isDraft && moduleType && (
            <DraftActions 
              draftContent={message.content} 
              moduleType={moduleType}
            />
          )}
        </div>
        <div className={`text-xs text-slate-500 mt-1 px-2 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}

export default MessageBubble

