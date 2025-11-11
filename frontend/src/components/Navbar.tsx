import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout, hasRole } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()

  const active = (path: string) =>
    loc.pathname === path ? { textDecoration: 'underline' } : {}

  return (
    <div className="nav">
      <Link to="/" style={{ fontWeight: 800 }}>Secure AI Docs</Link>
      <div className="spacer" />

      {user ? (
        <>
          <Link to="/" style={active('/')}>Dashboard</Link>
          <Link to="/documents" style={active('/documents')}>Documents</Link>

          {hasRole('Contributor','Manager','Admin') && (
            <Link to="/upload" style={active('/upload')}>Upload</Link>
          )}

          <span className="badge" style={{ marginLeft: 12 }}>{user.email}</span>

          <button
            className="btn secondary"
            onClick={() => { logout(); nav('/login') }}
          >
            Logout
          </button>
        </>
      ) : (
        <Link to="/login" style={active('/login')}>Login</Link>
      )}
    </div>
  )
}
