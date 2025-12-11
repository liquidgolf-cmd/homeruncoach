// Google Sign-In utility using Google Identity Services

interface GoogleCredentialResponse {
  credential: string
  select_by: string
}

interface GoogleUser {
  sub: string
  email: string
  name: string
  picture?: string
}

// Decode JWT token to get user info
const decodeJWT = (token: string): GoogleUser | null => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

// Initialize Google Sign-In
export const initializeGoogleSignIn = (
  callback: (user: GoogleUser) => void,
  onError?: (error: string) => void
): (() => void) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  
  if (!clientId) {
    console.warn('Google Client ID not configured. Google Sign-In will not be available.')
    onError?.('Google Sign-In is not configured. Please set VITE_GOOGLE_CLIENT_ID environment variable.')
    return () => {}
  }

  // Wait for Google Identity Services to load
  const checkGoogleLoaded = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: GoogleCredentialResponse) => {
          const user = decodeJWT(response.credential)
          if (user) {
            callback(user)
          } else {
            onError?.('Failed to decode Google credentials')
          }
        },
      })
    } else {
      setTimeout(checkGoogleLoaded, 100)
    }
  }

  checkGoogleLoaded()

  // Return cleanup function
  return () => {
    // Cleanup if needed
  }
}

// Trigger Google Sign-In
export const triggerGoogleSignIn = () => {
  if (window.google?.accounts?.id) {
    const googleAccounts = window.google.accounts.id
    googleAccounts.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Fallback to one-tap sign-in button
        googleAccounts.renderButton(
          document.getElementById('google-signin-button') as HTMLElement,
          {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            width: '100%',
          }
        )
      }
    })
  }
}

// Render Google Sign-In button
export const renderGoogleButton = (elementId: string) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  
  if (!clientId) {
    console.warn('Google Client ID not configured. Google Sign-In button will not be rendered.')
    return
  }

  if (window.google?.accounts?.id) {
    const element = document.getElementById(elementId)
    if (element) {
      window.google.accounts.id.renderButton(element, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        width: '100%',
      })
    }
  } else {
    // Retry after a short delay
    setTimeout(() => renderGoogleButton(elementId), 100)
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: GoogleCredentialResponse) => void
          }) => void
          prompt: (callback: (notification: any) => void) => void
          renderButton: (
            element: HTMLElement,
            config: {
              theme: string
              size: string
              text: string
              width: string
            }
          ) => void
        }
      }
    }
  }
}

export type { GoogleUser }

