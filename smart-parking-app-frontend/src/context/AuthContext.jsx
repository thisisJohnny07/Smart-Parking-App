import { createContext, useState, useEffect } from 'react'
import { login as loginService, logout as logoutService, register as registerService } from '../services/authService'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [tokens, setTokens] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('auth')
    if (stored) {
      try {
        const { user, access, refresh } = JSON.parse(stored)
        setUser(user)
        setTokens({ access, refresh })
      } catch (err) {
        console.error('Failed to restore auth:', err)
        logout() // clear corrupted storage
      }
    }
    setLoading(false)
  }, [])

  const login = async (username, password, options = {}) => {
    const data = await loginService(username, password)

    // Block superuser login if this is a public user login page
    if (data.user?.is_superuser && options.restrictSuperuser) {
      throw new Error('Admins are not allowed to sign in here.')
    }

    localStorage.setItem('auth', JSON.stringify({ access: data.access, refresh: data.refresh, user: data.user }))
    setUser(data.user)
    setTokens({ access: data.access, refresh: data.refresh })

    return data.user
  }

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