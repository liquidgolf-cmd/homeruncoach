import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthForm from '../components/AuthForm'
import { SignupCredentials } from '../types/auth'

const Signup: React.FC = () => {
  const { signup, signInWithGoogle, isLoading } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const handleSignup = async (credentials: SignupCredentials) => {
    setError(null)
    try {
      await signup(credentials)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.')
    }
  }

  const handleGoogleSignIn = async (googleUser: any) => {
    setError(null)
    try {
      await signInWithGoogle(googleUser)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-50 mb-2">Get started</h1>
          <p className="text-slate-400">Create your account to start building your business plan</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
          <AuthForm 
            mode="signup" 
            onSubmit={handleSignup} 
            onGoogleSignIn={handleGoogleSignIn}
            isLoading={isLoading} 
            error={error} 
          />

          <div className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-lime-300 hover:text-lime-200 font-semibold">
              Sign in
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-slate-400 hover:text-lime-300">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signup

