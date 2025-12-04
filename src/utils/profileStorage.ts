import { getCurrentUser } from '../api/auth'

export interface UserDraft {
  id: string
  moduleType: 'story' | 'solution' | 'success'
  content: string
  savedAt: string
  projectId?: string
}

export interface UserProfile {
  userId: string
  drafts: UserDraft[]
  updatedAt: string
}

const PROFILE_STORAGE_PREFIX = 'homeruncoach_profile_'

/**
 * Get user profile from storage
 */
const getUserProfile = (userId: string): UserProfile | null => {
  const key = `${PROFILE_STORAGE_PREFIX}${userId}`
  const data = localStorage.getItem(key)
  if (!data) return null
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

/**
 * Save user profile to storage
 */
const saveUserProfile = (profile: UserProfile): void => {
  const key = `${PROFILE_STORAGE_PREFIX}${profile.userId}`
  localStorage.setItem(key, JSON.stringify(profile))
}

/**
 * Save a draft to the current user's profile
 */
export const saveDraftToProfile = (
  moduleType: 'story' | 'solution' | 'success',
  content: string,
  projectId?: string
): UserDraft | null => {
  const user = getCurrentUser()
  if (!user) {
    console.warn('No user logged in, cannot save draft to profile')
    return null
  }

  // Get or create user profile
  let profile = getUserProfile(user.id)
  if (!profile) {
    profile = {
      userId: user.id,
      drafts: [],
      updatedAt: new Date().toISOString(),
    }
  }

  // Create new draft
  const draft: UserDraft = {
    id: `draft_${Date.now()}`,
    moduleType,
    content,
    savedAt: new Date().toISOString(),
    projectId,
  }

  // Add draft to profile
  profile.drafts.push(draft)
  profile.updatedAt = new Date().toISOString()

  // Save profile
  saveUserProfile(profile)

  return draft
}

/**
 * Get all drafts for the current user
 */
export const getUserDrafts = (): UserDraft[] => {
  const user = getCurrentUser()
  if (!user) return []

  const profile = getUserProfile(user.id)
  if (!profile) return []

  return profile.drafts.sort((a, b) => 
    new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  )
}

/**
 * Get drafts for a specific module type
 */
export const getUserDraftsByModule = (
  moduleType: 'story' | 'solution' | 'success'
): UserDraft[] => {
  return getUserDrafts().filter(draft => draft.moduleType === moduleType)
}

/**
 * Get a specific draft by ID
 */
export const getUserDraft = (draftId: string): UserDraft | null => {
  const drafts = getUserDrafts()
  return drafts.find(draft => draft.id === draftId) || null
}

/**
 * Delete a draft from user profile
 */
export const deleteUserDraft = (draftId: string): boolean => {
  const user = getCurrentUser()
  if (!user) return false

  const profile = getUserProfile(user.id)
  if (!profile) return false

  const initialLength = profile.drafts.length
  profile.drafts = profile.drafts.filter(draft => draft.id !== draftId)
  profile.updatedAt = new Date().toISOString()

  if (profile.drafts.length < initialLength) {
    saveUserProfile(profile)
    return true
  }

  return false
}

