import { createContext, useState, useEffect, useContext } from 'react'
import client from '../api/client'
import type { User, Role } from '../types'

const AuthContext = createContext<any>(null)

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get('/auth/me')
        setUser(res.data)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  async function login(email: string, password: string) {
    await client.post('/auth/login', { email, password })
    const res = await client.get('/auth/me')
    setUser(res.data)
  }

  async function logout() {
    await client.post('/auth/logout')
    setUser(null)
  }

  function hasRole(...roles: Role[]) {
    if (!user) return false
    return user.roles.some(r => roles.includes(r))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
