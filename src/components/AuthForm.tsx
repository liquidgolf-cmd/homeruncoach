import React, { useState, FormEvent } from 'react'
import { LoginCredentials, SignupCredentials } from '../types/auth'

interface AuthFormProps {
  mode: 'login' | 'signup'
  onSubmit: (credentials: LoginCredentials | SignupCredentials) => Promise<void>
  isLoading?: boolean
  error?: string | null
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onSubmit, isLoading = false, error }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (!email || !password) {
      setLocalError('Please fill in all required fields')
      return
    }

    if (mode === 'signup' && password.length < 6) {
      setLocalError('Password must be at least 6 characters')
      return
    }

    try {
      if (mode === 'login') {
        await onSubmit({ email, password })
      } else {
        await onSubmit({ email, password, name: name || undefined })
      }
    } catch (err: any) {
      setLocalError(err.message || 'An error occurred. Please try again.')
    }
  }

  const displayError = error || localError

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === 'signup' && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
            Name (optional)
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-slate-50 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/20"
            placeholder="Your name"
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-slate-50 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/20"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-slate-50 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/20"
          placeholder="••••••••"
          minLength={mode === 'signup' ? 6 : undefined}
        />
      </div>

      {displayError && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-300">
          {displayError}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-full bg-lime-400 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-lime-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
      </button>
    </form>
  )
}

export default AuthForm

