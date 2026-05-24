import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.left}>
        <div style={styles.brand}>
          <div style={styles.logo}>T</div>
          <span style={styles.logoText}>TaskFlow</span>
        </div>
        <h1 style={styles.tagline}>Start building<br />better together.</h1>
        <p style={styles.sub}>Organize tasks, track progress, and collaborate with your team in one clean workspace.</p>
      </div>

      <div style={styles.right}>
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Create account</h2>
          <p style={styles.formSub}>Get started with TaskFlow for free</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full name</label>
              <input
                className="input"
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email address</label>
              <input
                className="input"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                className="input"
                type="password"
                name="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '11px', marginTop: '8px' }}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p style={styles.switchText}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#6366f1', fontWeight: 500 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '100vh', display: 'flex' },
  left: {
    flex: 1,
    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    padding: '48px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    color: '#fff'
  },
  brand: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 },
  logo: {
    width: 36, height: 36, background: 'rgba(255,255,255,0.2)',
    borderRadius: 10, display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontWeight: 700, fontSize: 18
  },
  logoText: { fontSize: 20, fontWeight: 600 },
  tagline: { fontSize: 40, fontWeight: 700, lineHeight: 1.2, marginBottom: 16 },
  sub: { fontSize: 16, opacity: 0.8, maxWidth: 360, lineHeight: 1.7 },
  right: {
    flex: 1, display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '48px 32px', background: '#f8fafc'
  },
  formCard: {
    width: '100%', maxWidth: 400, background: '#fff',
    borderRadius: 16, padding: '36px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid #e2e8f0'
  },
  formTitle: { fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 6 },
  formSub: { fontSize: 14, color: '#64748b', marginBottom: 28 },
  switchText: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#64748b' }
}
