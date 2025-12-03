export type ModuleType = 'story' | 'solution' | 'success'

export type ModulePhase = 'warmup' | 'questions' | 'draft' | 'review'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  phase?: ModulePhase
}

export interface Conversation {
  id: string
  moduleType: ModuleType
  projectId: string
  messages: Message[]
  currentPhase: ModulePhase
  phaseData: {
    warmup?: any
    questions?: QuestionState
    draft?: DraftState
    review?: ReviewState
  }
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface QuestionState {
  currentQuestionIndex: number
  answers: Record<string, string>
  completed: boolean
}

export interface DraftState {
  content: string
  userEdits?: string
  confirmed: boolean
}

export interface ReviewState {
  confirmed: boolean
  finalContent: string
}

export interface ModuleProgress {
  moduleType: ModuleType
  phase: ModulePhase
  progress: number // 0-100
  completed: boolean
}

