import { Report, StoryReportContent, SolutionReportContent, SuccessReportContent, BusinessActionPlan } from '../types/report'
import { Conversation } from '../types/module'

/**
 * Generate a report from a completed conversation
 */
export const generateReport = (
  conversation: Conversation,
  projectId: string
): Report => {
  const { moduleType, messages, phaseData } = conversation

  // Extract answers from conversation
  const answers = phaseData.questions?.answers || {}

  let content: StoryReportContent | SolutionReportContent | SuccessReportContent

  switch (moduleType) {
    case 'story':
      content = generateStoryReport(answers, messages)
      break
    case 'solution':
      content = generateSolutionReport(answers, messages)
      break
    case 'success':
      content = generateSuccessReport(answers, messages)
      break
  }

  return {
    id: `report_${Date.now()}`,
    moduleType,
    projectId,
    content,
    generatedAt: new Date().toISOString(),
  }
}

const generateStoryReport = (
  answers: Record<string, string>,
  messages: any[]
): StoryReportContent => {
  // Extract key information from answers and messages
  const whyAnswer = answers.q0 || answers.q1 || answers.q2 || 'Not specified'
  const whoAnswer = answers.q3 || answers.q4 || answers.q5 || 'Not specified'
  const whereAnswer = answers.q6 || 'Not specified'

  return {
    founderWhy: whyAnswer,
    brandStory: `You started this business because ${whyAnswer}. You serve ${whoAnswer}. They're struggling with challenges and dreaming of transformation. You believe in making a real difference, and this drives everything you do.`,
    idealClientProfile: {
      name: 'Ideal Client',
      demographics: 'Based on your description',
      situation: whoAnswer,
      pains: ['Challenges they face', 'Frustrations in their current situation'],
      desires: ['What they wish were true', 'Their ideal future state'],
    },
    storyKeywords: extractKeywords([whyAnswer, whoAnswer, whereAnswer]),
  }
}

const generateSolutionReport = (
  answers: Record<string, string>,
  messages: any[]
): SolutionReportContent => {
  const whatAnswer = answers.q0 || answers.q1 || answers.q2 || 'Not specified'
  const howAnswer = answers.q3 || answers.q4 || answers.q5 || 'Not specified'
  const journeyAnswer = answers.q6 || answers.q7 || answers.q8 || 'Not specified'

  return {
    valueProposition: `We help [WHO] get [DESIRED RESULT] by [YOUR APPROACH], so they can [DEEPER BENEFIT].`,
    offerOverview: {
      name: 'Your Main Offer',
      format: 'Service/Program/Course',
      whoItsFor: 'Your ideal client',
      mainPromise: whatAnswer,
    },
    deliveryFramework: {
      steps: [
        { name: 'Step 1: Discover', description: 'Initial engagement and understanding' },
        { name: 'Step 2: Diagnose', description: 'Identify core needs and challenges' },
        { name: 'Step 3: Do the work', description: 'Main delivery and transformation' },
        { name: 'Step 4: Support', description: 'Ongoing support and follow-up' },
      ],
    },
    customerJourney: {
      stages: [
        { stage: 'AWARE', description: 'How they find you' },
        { stage: 'CURIOUS', description: 'Initial interest and engagement' },
        { stage: 'COMMITTED', description: 'Decision to work with you' },
        { stage: 'EXPERIENCING', description: 'Active participation' },
        { stage: 'ADVOCATING', description: 'Sharing results and referring others' },
      ],
    },
    suggestedNextMoves: [
      'Create a simple landing page',
      'Outline onboarding email sequence',
      'Define your first quick win',
    ],
  }
}

const generateSuccessReport = (
  answers: Record<string, string>,
  messages: any[]
): SuccessReportContent => {
  const outcomeAnswer = answers.q0 || answers.q1 || answers.q2 || 'Not specified'
  const metricsAnswer = answers.q3 || answers.q4 || answers.q5 || 'Not specified'
  const planAnswer = answers.q6 || answers.q7 || 'Not specified'

  return {
    homeRunOutcome: `For your ideal client, a home run looks like: ${outcomeAnswer}`,
    tangibleOutcomes: ['Revenue increase', 'Time saved', 'Growth metrics'],
    intangibleOutcomes: ['Increased confidence', 'Reduced stress', 'Greater clarity'],
    successMetrics: [
      { metric: 'Client satisfaction', description: 'Measured through feedback' },
      { metric: 'Business growth', description: 'Track monthly progress' },
      { metric: 'Personal fulfillment', description: 'Assess work-life balance' },
    ],
    proofPlan: {
      testimonialQuestions: [
        'What was your biggest challenge before working together?',
        'What changed after completing the program?',
        'What would you tell someone considering this?',
      ],
      caseStudyTemplate: 'Before → After → What changed → Why it mattered',
    },
    actionPlan: {
      projects: [
        {
          name: 'Launch beta offer',
          whyItMatters: 'Get real feedback and initial clients',
          tasks: ['Define offer details', 'Create landing page', 'Set launch date'],
          targetDate: '90 days from now',
        },
      ],
    },
  }
}

const extractKeywords = (texts: string[]): string[] => {
  // Simple keyword extraction - in production, use NLP
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were'])
  const words = texts
    .join(' ')
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word))
  
  return Array.from(new Set(words)).slice(0, 10)
}

/**
 * Compile all three module reports into a Business Action Plan
 */
export const compileBusinessActionPlan = (
  storyReport: Report,
  solutionReport: Report,
  successReport: Report,
  projectId: string
): BusinessActionPlan => {
  if (
    storyReport.moduleType !== 'story' ||
    solutionReport.moduleType !== 'solution' ||
    successReport.moduleType !== 'success'
  ) {
    throw new Error('All three module reports are required')
  }

  const storyContent = storyReport.content as StoryReportContent
  const solutionContent = solutionReport.content as SolutionReportContent
  const successContent = successReport.content as SuccessReportContent

  return {
    id: `plan_${Date.now()}`,
    projectId,
    cover: {
      businessName: 'Your Business',
      tagline: solutionContent.valueProposition,
      overview: `This Business Action Plan combines your Story, Solution, and Success modules into one comprehensive document you can use to guide your business forward.`,
    },
    story: storyContent,
    solution: solutionContent,
    success: successContent,
    actionPlan: {
      projects: successContent.actionPlan.projects,
      immediateNextSteps: [
        'Review your Brand Story and update your website',
        'Finalize your offer details and pricing',
        'Set up tracking for your success metrics',
        'Begin implementing your 90-day action plan',
      ],
    },
    generatedAt: new Date().toISOString(),
  }
}

