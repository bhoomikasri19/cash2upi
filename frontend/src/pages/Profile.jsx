import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

export default function Profile() {
  const navigate = useNavigate()
  const user = JSON.parse(sessionStorage.getItem('user') || '{}')
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user.name || '')
  const [phone] = useState(user.phone || '')
  const [saved, setSaved] = useState(false)

  if (!user.loggedIn) { navigate('/'); return null }

  const save = () => {
    sessionStorage.setItem('user', JSON.stringify({ ...user, name }))
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 2000)
  }

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
  const isProvider = user.role === 'provider'

  return (
    <Layout title="My Profile" subtitle="Manage your CashBridge account">
      <div className="grid-2">
        {/* Profile card */}
        <div className="card">
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), #60a5fa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 900, color: 'white', flexShrink: 0
            }}>{initials}</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 20 }}>{name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, marginTop: 3 }}>
                {isProvider ? '📲 Cash Provider' : '💵 Cash Seeker'}
              </div>
              <span className="badge badge-green" style={{ marginTop: 6, display: 'inline-flex' }}>✦ Verified User</span>
            </div>
          </div>

          {/* Editable fields */}
          <div className="card-title">Personal Details</div>

          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input className="input" value={name}
              onChange={e => setName(e.target.value)}
              disabled={!editing}
              style={{ opacity: editing ? 1 : 0.7 }} />
          </div>

          <div className="input-group">
            <label className="input-label">Phone Number</label>
            <input className="input" value={`+91 ${phone.slice(0,5)} ${phone.slice(5)}`} disabled style={{ opacity: 0.6 }} />
            <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4, fontWeight: 600 }}>Phone number cannot be changed</div>
          </div>

          <div className="input-group" style={{ marginBottom: 20 }}>
            <label className="input-label">Role</label>
            <input className="input" value={isProvider ? 'Cash Provider' : 'Cash Seeker'} disabled style={{ opacity: 0.6 }} />
          </div>

          {saved && (
            <div className="note note-green" style={{ marginBottom: 12 }}>
              <span>✓</span><span>Profile saved successfully!</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            {!editing
              ? <button className="btn btn-primary btn-full" onClick={() => setEditing(true)}>Edit Profile</button>
              : <>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => { setEditing(false); setName(user.name) }}>Cancel</button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={save}>Save Changes</button>
                </>
            }
          </div>
        </div>

        {/* Trust + Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-title">Trust Score</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
              <div style={{ fontSize: 42, fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>72</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600 }}>out of 100</div>
            </div>
            <div className="trust-bar" style={{ height: 10, marginBottom: 12 }}>
              <div className="trust-fill" style={{ width: '72%' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Current Limit', value: '₹500' },
                { label: 'Next Level', value: '₹1,000' },
                { label: 'Txns to Upgrade', value: '14 more' },
                { label: 'Rating', value: '4.5 ⭐' },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--surface2)', borderRadius: 10, padding: '10px 12px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 }}>{s.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--text)' }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Activity Summary</div>
            {[
              { label: 'Total Transactions', value: isProvider ? '6' : '3' },
              { label: isProvider ? 'Total Earned' : 'Total Cash Received', value: isProvider ? '₹47' : '₹800' },
              { label: 'Member Since', value: 'April 2026' },
              { label: 'Account Status', value: '🟢 Active' },
            ].map(s => (
              <div key={s.label} className="info-row">
                <span className="label">{s.label}</span>
                <span className="value">{s.value}</span>
              </div>
            ))}
          </div>

          <div className="note note-blue">
            <span>💡</span>
            <span>Complete more transactions to increase your trust score and unlock higher cash limits.</span>
          </div>
        </div>
      </div>
    </Layout>
  )
}
