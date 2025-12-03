/**
 * PDF Generation Utilities
 * Note: In production, this would use a library like jsPDF, React-PDF, or Puppeteer
 * For now, we'll create a text-based export that can be easily converted to PDF
 */

import { Report, BusinessActionPlan } from '../types/report'

export const generatePDFText = (report: Report): string => {
  const { moduleType, content, generatedAt } = report

  let text = `\n${'='.repeat(60)}\n`
  text += `${getReportTitle(moduleType).toUpperCase()}\n`
  text += `${'='.repeat(60)}\n\n`
  text += `Generated: ${new Date(generatedAt).toLocaleDateString()}\n\n`

  switch (moduleType) {
    case 'story':
      text += generateStoryReportText(content as any)
      break
    case 'solution':
      text += generateSolutionReportText(content as any)
      break
    case 'success':
      text += generateSuccessReportText(content as any)
      break
  }

  return text
}

export const generateActionPlanPDFText = (plan: BusinessActionPlan): string => {
  let text = `\n${'='.repeat(60)}\n`
  text += `BUSINESS ACTION PLAN\n`
  text += `${'='.repeat(60)}\n\n`
  text += `Business: ${plan.cover.businessName}\n`
  text += `Tagline: ${plan.cover.tagline}\n`
  text += `Generated: ${new Date(plan.generatedAt).toLocaleDateString()}\n\n`
  text += `${plan.cover.overview}\n\n`

  text += `\n${'-'.repeat(60)}\n`
  text += `SECTION 1: STORY\n`
  text += `${'-'.repeat(60)}\n\n`
  text += generateStoryReportText(plan.story)

  text += `\n${'-'.repeat(60)}\n`
  text += `SECTION 2: SOLUTION\n`
  text += `${'-'.repeat(60)}\n\n`
  text += generateSolutionReportText(plan.solution)

  text += `\n${'-'.repeat(60)}\n`
  text += `SECTION 3: SUCCESS\n`
  text += `${'-'.repeat(60)}\n\n`
  text += generateSuccessReportText(plan.success)

  text += `\n${'-'.repeat(60)}\n`
  text += `SECTION 4: ACTION PLAN\n`
  text += `${'-'.repeat(60)}\n\n`
  text += generateActionPlanText(plan.actionPlan)

  return text
}

const getReportTitle = (moduleType: string): string => {
  const titles = {
    story: 'Story Report: Brand Story & Ideal Audience',
    solution: 'Solution Blueprint: Offer & Customer Journey',
    success: 'Success Playbook: Outcomes, Metrics & 90-Day Plan',
  }
  return titles[moduleType as keyof typeof titles] || 'Report'
}

const generateStoryReportText = (content: any): string => {
  let text = `FOUNDER WHY STATEMENT\n`
  text += `${content.founderWhy}\n\n`

  text += `BRAND STORY\n`
  text += `${content.brandStory}\n\n`

  text += `IDEAL CLIENT PROFILE\n`
  if (content.idealClientProfile.name) {
    text += `Name: ${content.idealClientProfile.name}\n`
  }
  if (content.idealClientProfile.demographics) {
    text += `Demographics: ${content.idealClientProfile.demographics}\n`
  }
  if (content.idealClientProfile.situation) {
    text += `Situation: ${content.idealClientProfile.situation}\n`
  }
  if (content.idealClientProfile.pains?.length) {
    text += `Pains:\n`
    content.idealClientProfile.pains.forEach((pain: string) => {
      text += `  • ${pain}\n`
    })
  }
  if (content.idealClientProfile.desires?.length) {
    text += `Desires:\n`
    content.idealClientProfile.desires.forEach((desire: string) => {
      text += `  • ${desire}\n`
    })
  }

  if (content.storyKeywords?.length) {
    text += `\nSTORY KEYWORDS\n`
    text += `${content.storyKeywords.join(', ')}\n`
  }

  return text
}

const generateSolutionReportText = (content: any): string => {
  let text = `CORE VALUE PROPOSITION\n`
  text += `${content.valueProposition}\n\n`

  text += `PRIMARY OFFER OVERVIEW\n`
  text += `Name: ${content.offerOverview.name}\n`
  text += `Format: ${content.offerOverview.format}\n`
  text += `Who It's For: ${content.offerOverview.whoItsFor}\n`
  text += `Main Promise: ${content.offerOverview.mainPromise}\n\n`

  text += `DELIVERY FRAMEWORK\n`
  content.deliveryFramework.steps.forEach((step: any, index: number) => {
    text += `${index + 1}. ${step.name}: ${step.description}\n`
  })

  text += `\nCUSTOMER JOURNEY MAP\n`
  content.customerJourney.stages.forEach((stage: any) => {
    text += `${stage.stage}: ${stage.description}\n`
  })

  if (content.suggestedNextMoves?.length) {
    text += `\nSUGGESTED NEXT MOVES\n`
    content.suggestedNextMoves.forEach((move: string) => {
      text += `  • ${move}\n`
    })
  }

  return text
}

const generateSuccessReportText = (content: any): string => {
  let text = `HOMERUN OUTCOME STATEMENT\n`
  text += `${content.homeRunOutcome}\n\n`

  if (content.tangibleOutcomes?.length) {
    text += `TANGIBLE OUTCOMES\n`
    content.tangibleOutcomes.forEach((outcome: string) => {
      text += `  • ${outcome}\n`
    })
    text += `\n`
  }

  if (content.intangibleOutcomes?.length) {
    text += `INTANGIBLE OUTCOMES\n`
    content.intangibleOutcomes.forEach((outcome: string) => {
      text += `  • ${outcome}\n`
    })
    text += `\n`
  }

  if (content.successMetrics?.length) {
    text += `SUCCESS METRICS\n`
    content.successMetrics.forEach((metric: any) => {
      text += `  • ${metric.metric}: ${metric.description}\n`
    })
    text += `\n`
  }

  if (content.proofPlan) {
    text += `PROOF PLAN\n`
    text += `Testimonial Questions:\n`
    content.proofPlan.testimonialQuestions.forEach((q: string) => {
      text += `  • ${q}\n`
    })
    text += `Case Study Template: ${content.proofPlan.caseStudyTemplate}\n\n`
  }

  if (content.actionPlan?.projects?.length) {
    text += `90-DAY ACTION PLAN\n`
    content.actionPlan.projects.forEach((project: any, index: number) => {
      text += `\nProject ${index + 1}: ${project.name}\n`
      text += `Why It Matters: ${project.whyItMatters}\n`
      text += `Tasks:\n`
      project.tasks.forEach((task: string) => {
        text += `  • ${task}\n`
      })
      text += `Target Date: ${project.targetDate}\n`
    })
  }

  return text
}

const generateActionPlanText = (actionPlan: any): string => {
  let text = `STRATEGIC PROJECTS\n\n`
  
  actionPlan.projects.forEach((project: any, index: number) => {
    text += `${index + 1}. ${project.name}\n`
    text += `   Why It Matters: ${project.whyItMatters}\n`
    text += `   Tasks:\n`
    project.tasks.forEach((task: string) => {
      text += `     • ${task}\n`
    })
    text += `   Target Date: ${project.targetDate}\n\n`
  })

  if (actionPlan.immediateNextSteps?.length) {
    text += `IMMEDIATE NEXT STEPS\n`
    actionPlan.immediateNextSteps.forEach((step: string, index: number) => {
      text += `${index + 1}. ${step}\n`
    })
  }

  return text
}

/**
 * Download text as file (can be converted to PDF by user or in production)
 */
export const downloadTextFile = (text: string, filename: string): void => {
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

