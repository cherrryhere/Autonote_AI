import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authApi, setAuthToken } from '../api/client.js'

const TOKEN_KEY = 'autonote.token'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(true)

  // Keep the API client's in-memory token in sync with state.
  useEffect(() => {
    setAuthToken(token)
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  }, [token])

  // On first load, if we have a token, verify it and fetch the user.
  useEffect(() => {
    let cancelled = false

    if (!token) {
      setLoading(false)
      return
    }

    authApi.me()
      .then(({ user }) => { if (!cancelled) setUser(user) })
      .catch(() => { if (!cancelled) setToken(null) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [token])

  const login = useCallback(async (email, password) => {
    const { token, user } = await authApi.login({ email, password })
    setUser(user)
    setToken(token)
  }, [])

  const signup = useCallback(async (name, email, password) => {
    const { token, user } = await authApi.signup({ name, email, password })
    setUser(user)
    setToken(token)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
