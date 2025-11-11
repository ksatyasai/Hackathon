import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const loc = useLocation() as any

  const [email, setEmail] = useState('admin@demo.local')
  const [password, setPassword] = useState('Admin@123')
  const [error, setError] = useState('')

  async function submit(e: any) {
    e.preventDefault()
    try {
      await login(email, password)
      nav(loc.state?.from?.pathname || '/')
    } catch (err: any) {
      setError('Login failed')
    }
  }

  return (
    <div className="container" style={{ maxWidth: 400 }}>
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={submit} className="row" style={{ flexDirection: 'column' }}>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <div style={{ color:'red' }}>{error}</div>}
          <button className="btn">Login</button>
        </form>
      </div>
    </div>
  )
}
