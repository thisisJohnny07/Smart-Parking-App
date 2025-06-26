import { createContext, useState, useEffect } from 'react'
import { login as loginService, logout as logoutService, register as registerService } from '../services/authService'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)       // Current logged-in user
  const [tokens, setTokens] = useState(null)   // JWT access and refresh tokens
  const [loading, setLoading] = useState(true) // Loading state during initial auth check

  useEffect(() => {
    const stored = localStorage.getItem('auth')
    if (stored) {
      try {
        const { user, access, refresh } = JSON.parse(stored)
        setUser(user)
        setTokens({ access, refresh })
      } catch (err) {
        console.error('Failed to restore auth:', err)
        logout() // Clear corrupted auth data
      }
    }
    setLoading(false)
  }, [])

  // Login handler
  const login = async (username, password, options = {}) => {
    const data = await loginService(username, password)

    // Prevent superuser login if restricted
    if (data.user?.is_superuser && options.restrictSuperuser) {
      throw new Error('Admins are not allowed to sign in here.')
    }

    localStorage.setItem('auth', JSON.stringify({
      access: data.access,
      refresh: data.refresh,
      user: data.user
    }))

    setUser(data.user)
    setTokens({ access: data.access, refresh: data.refresh })

    return data.user
  }

  // Logout handler
  const logout = async () => {
    try {
      const stored = localStorage.getItem('auth')
      if (stored) {
        const { refresh, access } = JSON.parse(stored)
        await logoutService(refresh, access)
      }
    } catch (err) {
      console.error('Logout failed:', err.response?.data || err.message)
    }

    setUser(null)
    setTokens(null)
    localStorage.removeItem('auth')
  }

  // Register handler
  const register = async (userData) => {
    const user = await registerService(userData)
    return user
  }

  return (
    <AuthContext.Provider value={{ user, tokens, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  )
}