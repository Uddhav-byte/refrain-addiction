import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, TokenResponse } from '../types'
import { auth as authApi } from './api'
import { localRepo } from './supabase'
import { toast } from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (tokenData: TokenResponse) => Promise<void>
  register: (tokenData: TokenResponse) => Promise<void>
  loginDemo: () => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<User>
  resetStreak: () => Promise<User>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProfile = async () => {
    try {
      const response = await authApi.getProfile()
      setUser(response)
      return response
    } catch (error) {
      console.warn('Failed to fetch profile', error)
      return null
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token')
      if (token) {
        const prof = await fetchProfile()
        if (!prof) {
          localStorage.removeItem('access_token')
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (tokenData: TokenResponse) => {
    localStorage.setItem('access_token', tokenData.access_token)
    try {
      const prof = await fetchProfile()
      if (prof) {
        toast.success(`Welcome back, ${prof.full_name || prof.username}!`)
      }
    } catch (error) {
      localStorage.removeItem('access_token')
      toast.error('Failed to load profile.')
      throw error
    }
  }

  const register = async (tokenData: TokenResponse) => {
    await login(tokenData)
  }

  const loginDemo = async () => {
    setIsLoading(true)
    try {
      const demoUser = localRepo.ensureDemoUser()
      localStorage.setItem('access_token', `demo-token-${demoUser.id}`)
      setUser(demoUser)
      toast.success('Logged in with Demo Account!')
    } catch (error) {
      toast.error('Failed to start demo session')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authApi.logout().catch(() => {})
    localStorage.removeItem('access_token')
    setUser(null)
    toast.success('Logged out safely. Take care!')
  }

  const refreshUser = async () => {
    await fetchProfile()
  }

  const updateProfile = async (updates: Partial<User>): Promise<User> => {
    const updated = await authApi.updateProfile(updates)
    setUser(updated)
    toast.success('Profile updated successfully!')
    return updated
  }

  const resetStreak = async (): Promise<User> => {
    const updated = await authApi.resetStreak()
    setUser(updated)
    toast('Streak reset. Remember, every day is a fresh beginning.', {
      icon: '🌱',
      duration: 4000,
    })
    return updated
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginDemo,
        logout,
        refreshUser,
        updateProfile,
        resetStreak,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
