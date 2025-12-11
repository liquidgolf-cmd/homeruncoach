import { User, LoginCredentials, SignupCredentials } from '../types/auth'
import { GoogleUser } from '../utils/googleAuth'

// For now, using localStorage to simulate backend
// This will be replaced with actual API calls later

const STORAGE_KEY = 'homeruncoach_user'
const USERS_KEY = 'homeruncoach_users'

// Initialize users storage if it doesn't exist
if (!localStorage.getItem(USERS_KEY)) {
  localStorage.setItem(USERS_KEY, JSON.stringify([]))
}

export const login = async (credentials: LoginCredentials): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  const user = users.find(
    (u: any) => u.email === credentials.email && u.password === credentials.password
  )

  if (!user) {
    throw new Error('Invalid email or password')
  }

  // Store current user (without password)
  const { password, ...userWithoutPassword } = user
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword))

  return userWithoutPassword
}

export const signup = async (credentials: SignupCredentials): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')

  // Check if user already exists
  if (users.some((u: any) => u.email === credentials.email)) {
    throw new Error('User with this email already exists')
  }

  // Create new user
  const newUser: User = {
    id: `user_${Date.now()}`,
    email: credentials.email,
    name: credentials.name || credentials.email.split('@')[0],
    createdAt: new Date().toISOString(),
  }

  // Store user with password (in real app, password would be hashed on backend)
  users.push({
    ...newUser,
    password: credentials.password, // In production, this would never be stored
  })
  localStorage.setItem(USERS_KEY, JSON.stringify(users))

  // Store current user (without password)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))

  return newUser
}

export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(STORAGE_KEY)
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export const signInWithGoogle = async (googleUser: GoogleUser): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  
  // Check if user already exists
  let user = users.find((u: any) => u.email === googleUser.email)
  
  if (user) {
    // User exists, return without password
    const { password, ...userWithoutPassword } = user
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword))
    return userWithoutPassword
  } else {
    // New user, create account
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: googleUser.email,
      name: googleUser.name,
      createdAt: new Date().toISOString(),
    }

    // Store user (no password for Google users)
    users.push({
      ...newUser,
      googleId: googleUser.sub, // Store Google ID for reference
    })
    localStorage.setItem(USERS_KEY, JSON.stringify(users))

    // Store current user
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))

    return newUser
  }
}

