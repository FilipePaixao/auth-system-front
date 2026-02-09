import { createContext, useState, useCallback, type ReactNode } from 'react'
import { getStoredToken, setStoredToken } from '@/shared/services/api'
import * as authService from './services/auth.service'
import type { UserPublic, LoginDTO } from './types'

const USER_STORAGE_KEY = 'auth_user'

function getStoredUser(): UserPublic | null {
  try {
    const raw = window.localStorage.getItem(USER_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as UserPublic
  } catch {
    return null
  }
}

function setStoredUser(user: UserPublic | null): void {
  if (user) window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  else window.localStorage.removeItem(USER_STORAGE_KEY)
}

function normalizeStoredUser(raw: UserPublic & { _id?: string } | null): UserPublic | null {
  if (!raw) return null
  return { ...raw, id: raw.id ?? raw._id ?? '' }
}

function getInitialAuth() {
  const token = getStoredToken()
  const rawUser = getStoredUser()
  const user = normalizeStoredUser(rawUser as UserPublic & { _id?: string } | null)
  return token && user ? { token, user } : { token: null as string | null, user: null as UserPublic | null }
}

interface AuthContextValue {
  user: UserPublic | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginDTO) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState(getInitialAuth)
  const user = auth.user
  const token = auth.token
  const isLoading = false

  const logout = useCallback(() => {
    setStoredToken(null)
    setStoredUser(null)
    setAuth({ token: null, user: null })
  }, [])

  const login = useCallback(async (data: LoginDTO) => {
    const result = await authService.login(data)
    const user = result.user as UserPublic & { _id?: string }
    const normalizedUser: UserPublic = {
      ...user,
      id: user.id ?? user._id ?? '',
    }
    setStoredToken(result.token)
    setStoredUser(normalizedUser)
    setAuth({ token: result.token, user: normalizedUser })
  }, [])

  const isAuthenticated = Boolean(token ?? user)
  const value: AuthContextValue = { user, token, isAuthenticated, isLoading, login, logout }
  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}
