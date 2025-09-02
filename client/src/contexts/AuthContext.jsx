import { useEffect, useMemo, useState, useCallback } from 'react'
import { AuthContext } from './auth'
import { adminLogin as apiLogin, adminRefresh, setAuthToken } from '../utils/api'

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''))
  const [user, setUser] = useState(() => (token ? { role: 'admin' } : null))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setAuthToken(token || '')
  }, [token])

  const login = useCallback(async (username, password) => {
    setLoading(true)
    setError('')
    try {
      const { accessToken, refreshToken } = await apiLogin({ username, password })
      setToken(accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      setUser({ role: 'admin' })
      return true
    } catch (e) {
      setError(e.message || 'Login failed')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setToken('')
    setUser(null)
    localStorage.removeItem('refreshToken')
    setAuthToken('')
  }, [])

  const refresh = useCallback(async () => {
    const rt = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : ''
    if (!rt) return false
    try {
      const { accessToken } = await adminRefresh({ refreshToken: rt })
      setToken(accessToken)
      return true
    } catch {
      logout()
      return false
    }
  }, [logout])

  const value = useMemo(() => ({ token, user, loading, error, login, logout, refresh }), [token, user, loading, error, login, logout, refresh])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export default AuthProvider
