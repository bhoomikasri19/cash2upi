import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast.jsx'

// Demo accounts — in real app this would be a backend API call
const DEMO_ACCOUNTS = [
  { phone: '9820000001', password: 'demo123', name: 'Rahul Sharma' },
  { phone: '9820000002', password: 'demo123', name: 'Priya Mehta' },
  { phone: '9820000003', password: 'demo123', name: 'Amit Patel' },
]

export default function Login() {
  const navigate = useNavigate()
  const toast = useToast()

  const [tab, setTab] = useState('login') // login | signup
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    setError('')
    if (phone.length !== 10) { setError('Enter valid 10-digit number'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }

    setLoading(true)
    setTimeout(() => {
      // Check demo accounts OR allow any account created via signup
      const saved = JSON.parse(localStorage.getItem('cash2upi_users') || '[]')
      const allAccounts = [...DEMO_ACCOUNTS, ...saved]
      const found = allAccounts.find(a => a.phone === phone && a.password === password)

      if (found) {
        sessionStorage.setItem('user', JSON.stringify({ name: found.name, phone, role: 'seeker', loggedIn: true }))
        toast(`Welcome back, ${found.name.split(' ')[0]}! 👋`, 'success')
        setTimeout(() => navigate('/home'), 600)
      } else {
        setError('Incorrect phone number or password')
        toast('Login failed. Check credentials.', 'error')
      }
      setLoading(false)
    }, 1000)
  }

  const handleSignup = () => {
    setError('')
    if (!name.trim()) { setError('Enter your full name'); return }
    if (phone.length !== 10) { setError('Enter valid 10-digit number'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (password !== confirmPassword) { setError('Passwords do not match'); return }

    setLoading(true)
    setTimeout(() => {
      const saved = JSON.parse(localStorage.getItem('cash2upi_users') || '[]')
      if ([...DEMO_ACCOUNTS, ...saved].find(a => a.phone === phone)) {
        setError('Phone number already registered')
        setLoading(false)
        return
      }
      const newUser = { phone, password, name: name.trim() }
      localStorage.setItem('cash2upi_users', JSON.stringify([...saved, newUser]))
      sessionStorage.setItem('user', JSON.stringify({ name: name.trim(), phone, role: 'seeker', loggedIn: true }))
      toast(`Account created! Welcome, ${name.split(' ')[0]}! 🎉`, 'success')
      setTimeout(() => navigate('/home'), 600)
      setLoading(false)
    }, 1000)
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Nunito, sans-serif'
    }}>
      <div style={{ width: '100%', maxWidth: 440, padding: '0 20px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>💸</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--text)', letterSpacing: -0.5 }}>
            Cash<span style={{ color: 'var(--primary)' }}>2UPI</span>
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500, marginTop: 4 }}>
            Cash ↔ UPI Exchange Platform
          </div>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 28 }}>

          {/* Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--surface2)', borderRadius: 10, padding: 4, marginBottom: 24, border: '1px solid var(--border)' }}>
            {['login', 'signup'].map(t => (
              <button key={t} onClick={() => { setTab(t); setError('') }} style={{
                padding: '10px', borderRadius: 8, border: 'none', fontFamily: 'Nunito, sans-serif',
                fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.18s',
                background: tab === t ? 'white' : 'transparent',
                color: tab === t ? 'var(--primary)' : 'var(--text-secondary)',
                boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
                textTransform: 'capitalize'
              }}>{t === 'login' ? 'Log In' : 'Sign Up'}</button>
            ))}
          </div>

          {/* Signup extra field */}
          {tab === 'signup' && (
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input className="input" placeholder="Your full name"
                value={name} onChange={e => { setName(e.target.value); setError('') }} />
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Mobile Number</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-secondary)', fontSize: 15 }}>+91</span>
              <input className="input" placeholder="10-digit number" type="tel"
                style={{ paddingLeft: 46 }}
                value={phone} onChange={e => { setPhone(e.target.value.replace(/\D/g,'').slice(0,10)); setError('') }} />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: tab === 'signup' ? 16 : 20 }}>
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input className="input" placeholder="Min 6 characters"
                type={showPass ? 'text' : 'password'}
                style={{ paddingRight: 48 }}
                value={password} onChange={e => { setPassword(e.target.value); setError('') }} />
              <button onClick={() => setShowPass(!showPass)} style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', fontSize: 16
              }}>{showPass ? '🙈' : '👁️'}</button>
            </div>
          </div>

          {tab === 'signup' && (
            <div className="input-group" style={{ marginBottom: 20 }}>
              <label className="input-label">Confirm Password</label>
              <input className="input" placeholder="Re-enter password"
                type={showPass ? 'text' : 'password'}
                value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setError('') }} />
            </div>
          )}

          {error && (
            <div className="note note-red" style={{ marginBottom: 16 }}>
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          <button className="btn btn-primary btn-full" onClick={tab === 'login' ? handleLogin : handleSignup} disabled={loading}>
            {loading
              ? <span className="spinner" />
              : tab === 'login' ? 'Log In →' : 'Create Account →'}
          </button>

          {/* Demo hint */}
          {tab === 'login' && (
            <div style={{ marginTop: 16, background: 'var(--surface2)', borderRadius: 10, padding: '12px 14px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Demo Account</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
                📱 <strong>9820000001</strong> &nbsp;·&nbsp; 🔑 <strong>demo123</strong>
              </div>
              <button onClick={() => { setPhone('9820000001'); setPassword('demo123') }}
                style={{ marginTop: 8, background: 'var(--primary-light)', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 12, fontWeight: 700, color: 'var(--primary)', cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
                Fill Demo Credentials
              </button>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-light)', marginTop: 16 }}>
          🛡 OTP secured · Max ₹1,000 per transaction
        </div>
      </div>
    </div>
  )
}
