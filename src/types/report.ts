export interface Report {
  id: string
  moduleType: 'story' | 'solution' | 'success'
  projectId: string
  content: ReportContent
  generatedAt: string
  pdfUrl?: string
}

export interface StoryReportContent {
  founderWhy: string
  brandStory: string
  idealClientProfile: {
    name?: string
    demographics?: string
    situation?: string
    pains?: string[]
    desires?: string[]
  }
  storyKeywords: string[]
}

export interface SolutionReportContent {
  valueProposition: string
  offerOverview: {
    name: string
    format: string
    whoItsFor: string
    mainPromise: string
  }
  deliveryFramework: {
    steps: Array<{
      name: string
      description: string
    }>
  }
  customerJourney: {
    stages: Array<{
      stage: string
      description: string
    }>
  }
  suggestedNextMoves: string[]
}

export interface SuccessReportContent {
  homeRunOutcome: string
  tangibleOutcomes: string[]
  intangibleOutcomes: string[]
  successMetrics: Array<{
    metric: string
    description: string
  }>
  proofPlan: {
    testimonialQuestions: string[]
    caseStudyTemplate: string
  }
  actionPlan: {
    projects: Array<{
      name: string
      whyItMatters: string
      tasks: string[]
      targetDate: string
    }>
  }
}

export type ReportContent = StoryReportContent | SolutionReportContent | SuccessReportContent

export interface BusinessActionPlan {
  id: string
  projectId: string
  cover: {
    businessName: string
    tagline: string
    overview: string
  }
  story: StoryReportContent
  solution: SolutionReportContent
  success: SuccessReportContent
  actionPlan: {
    projects: Array<{
      name: string
      whyItMatters: string
      tasks: string[]
      targetDate: string
    }>
    immediateNextSteps: string[]
  }
  generatedAt: string
  pdfUrl?: string
}

