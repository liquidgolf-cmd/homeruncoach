import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthForm from '../components/AuthForm'
import { LoginCredentials } from '../types/auth'

const Login: React.FC = () => {
  const { login, signInWithGoogle, isLoading } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (credentials: LoginCredentials) => {
    setError(null)
    try {
      await login(credentials)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please try again.')
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
          <h1 className="text-3xl font-bold text-slate-50 mb-2">Welcome back</h1>
          <p className="text-slate-400">Sign in to continue to HomeRun Coach AI</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
          <AuthForm 
            mode="login" 
            onSubmit={handleLogin} 
            onGoogleSignIn={handleGoogleSignIn}
            isLoading={isLoading} 
            error={error} 
          />

          <div className="mt-6 text-center text-sm text-slate-400">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-lime-300 hover:text-lime-200 font-semibold">
              Sign up
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

export default Login

