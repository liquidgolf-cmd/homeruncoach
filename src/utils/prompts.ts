import { ModuleType } from '../types/module'
import { getModuleRole, getModuleDescription } from './coachingQualities'

/**
 * Module-specific prompts and question flows
 */

export const getWarmupPrompt = (moduleType: ModuleType): string => {
  const role = getModuleRole(moduleType)
  const description = getModuleDescription(moduleType)

  const warmups = {
    story: `Hi! I'm your ${role}. In this module, we'll clarify your story: why you're doing this and who it's for. We'll end with a clear brand story and a simple description of your ideal customer.

${description}

Ready to get started? Let's begin with understanding your WHY.`,
    solution: `Hi! I'm your ${role}. In this module, we'll define the solution you bring: what your audience wants, what you provide, and how they get it. We'll end with a clear value proposition, a draft offer, and a simple customer journey.

${description}

Ready to design your solution?`,
    success: `Hi! I'm your ${role}. In this module, we'll define what success looks like for your clients and for your business—and turn that into a practical action plan.

${description}

Let's start by imagining what a home run looks like for your ideal client.`,
  }

  return warmups[moduleType]
}

export const getModuleQuestions = (moduleType: ModuleType): string[] => {
  const questions = {
    story: [
      "Why are you doing this business or project? What's the deeper reason behind it?",
      "What personal experiences, frustrations, or wins led you here?",
      "If this business fully worked, what would it change for you and your family?",
      "Who is your primary audience? Describe one person in as much detail as you can.",
      "What are they dealing with day to day? What's hard for them?",
      "What do they secretly wish were true 6-12 months from now?",
      "Where do they usually hang out (online/offline)? Who do they already trust?",
    ],
    solution: [
      "In your own words, what does your audience say they want?",
      "What do they really need, even if they don't have language for it yet?",
      "What do you do or know that could help them get that?",
      "If you had to help one ideal client from A → B in 4-6 steps, what would those steps be?",
      "What format do you see this solution taking right now? (1:1, group, course, service, product)",
      "Realistically, how much time/energy can you invest each week to deliver this?",
      "How do people typically find you (or how do you want them to)?",
      "What happens between 'I saw you' and 'I'm in'?",
      "What's the first quick win you want them to experience?",
    ],
    success: [
      "Imagine your ideal client 6-12 months after working with you or using your solution. What's different in their life or work?",
      "How would they describe that result in their own words?",
      "What would make them say, 'This was an absolute home run'?",
      "What are 3-5 signs you could point to that show this is working?",
      "What could you track monthly that would tell you things are getting better?",
      "What could you ask your clients at the end to capture their story?",
      "In the next 90 days, what would make the biggest difference?",
      "What feels realistic, given your time and energy?",
    ],
  }

  return questions[moduleType]
}

export const getDraftPrompt = (moduleType: ModuleType, answers: Record<string, string>): string => {
  const draftPrompts = {
    story: `Based on our conversation, I'm going to draft your Brand Story and Ideal Client Profile. Let me synthesize what you've shared:

${Object.entries(answers).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

Here's my draft...`,
    solution: `Based on our conversation, I'm going to draft your Value Proposition, Offer Outline, and Customer Journey Map. Let me synthesize what you've shared:

${Object.entries(answers).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

Here's my draft...`,
    success: `Based on our conversation, I'm going to draft your HomeRun Outcome Statement, Success Metrics, and 90-Day Action Plan. Let me synthesize what you've shared:

${Object.entries(answers).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

Here's my draft...`,
  }

  return draftPrompts[moduleType]
}

export const getReflectionPrompt = (moduleType: ModuleType): string => {
  const reflections = {
    story: `Let me reflect back what I'm hearing: [AI will paraphrase key points]. Does this feel true? What would you tweak?`,
    solution: `Here's how I'd summarize your solution: [AI will synthesize]. Does this capture what you're building?`,
    success: `Here's what I hear success looking like for you: [AI will summarize outcomes]. Does this align with what you want?`,
  }

  return reflections[moduleType]
}

