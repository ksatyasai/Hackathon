import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { Role } from '../types'

export default function ProtectedRoute({
  children,
  roles
}: any) {
  const { user, loading, hasRole } = useAuth()
  const loc = useLocation()

  if (loading) return <div className="container"><div className="card">Loading…</div></div>

  if (!user) return <Navigate to="/login" replace state={{ from: loc }} />

  if (roles && !hasRole(...roles))
    return <div className="container"><div className="card">No permission.</div></div>

  return children
}
