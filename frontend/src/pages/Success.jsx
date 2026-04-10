import { useState } from 'react'
import Layout from '../components/Layout'
import { useNavigate } from 'react-router-dom'

export default function Success() {
  const navigate = useNavigate()
  const txn = JSON.parse(sessionStorage.getItem('completedTxn') || '{}')
  const user = JSON.parse(sessionStorage.getItem('user') || '{}')
  const [rating, setRating] = useState(0)
  const [rated, setRated] = useState(false)
  const isProvider = txn.isProvider

  return (
    <div className="layout">
      <div className="topbar" style={{ background: isProvider ? 'linear-gradient(135deg, #00b899, #007a66)' : 'var(--primary)' }}>
        <div className="topbar-logo">Cash<span>Bridge</span></div>
        <div className="topbar-tagline">Transaction Complete</div>
        <div className="topbar-right">
          <div className="topbar-badge">✓ Verified Exchange</div>
        </div>
      </div>

      <div className="sidebar">
        <div className="sidebar-section">Navigation</div>
        {[
          { icon: '🏠', label: 'Home' },
          { icon: '📋', label: 'Transactions' },
          { icon: '⭐', label: 'My Rating' },
        ].map(item => (
          <div key={item.label} className="sidebar-item" onClick={() => item.label === 'Home' && navigate('/')}>
            <span className="sidebar-icon">{item.icon}</span>{item.label}
          </div>
        ))}
        <div className="sidebar-limit" style={{ background: isProvider ? 'linear-gradient(135deg,#00b899,#007a66)' : 'linear-gradient(135deg,#1a73e8,#4f8ef7)' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            {isProvider ? 'You Earned' : 'Cash Received'}
          </div>
          <div style={{ fontSize: 30, fontWeight: 900, color: 'white' }}>
            {isProvider ? `+₹${txn.earned}` : `₹${txn.amount}`}
          </div>
        </div>
      </div>

      <div className="main">
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span className="success-icon">{isProvider ? '💰' : '✅'}</span>
            <div className="page-title" style={{ fontSize: 32, marginBottom: 8 }}>
              {isProvider ? 'You Earned!' : 'Cash Received Successfully!'}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 16, fontWeight: 500 }}>
              {isProvider ? 'Commission added to your CashBridge wallet.' : 'Your UPI payment was safely exchanged for physical cash.'}
            </div>
          </div>

          <div className="grid-2">
            {/* Summary */}
            <div className="card">
              <div className="card-title">Transaction Summary</div>
              <div style={{
                background: isProvider ? 'var(--secondary-light)' : 'var(--primary-light)',
                borderRadius: 12, padding: '20px', textAlign: 'center', marginBottom: 16
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {isProvider ? 'Commission Earned' : 'Amount Exchanged'}
                </div>
                <div style={{ fontSize: 52, fontWeight: 900, color: isProvider ? 'var(--secondary)' : 'var(--primary)', lineHeight: 1 }}>
                  {isProvider ? `+₹${txn.earned}` : `₹${txn.amount}`}
                </div>
              </div>

              <div className="info-row">
                <span className="label">Transaction ID</span>
                <span className="value" style={{ fontSize: 12 }}>{txn.txnId}</span>
              </div>
              <div className="info-row">
                <span className="label">Status</span>
                <span className="badge badge-green">✦ Complete</span>
              </div>
              <div className="info-row">
                <span className="label">Method</span>
                <span className="value">UPI ↔ Cash</span>
              </div>
              <div className="info-row">
                <span className="label">Time</span>
                <span className="value">{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <button className="btn btn-primary btn-full" style={{ marginTop: 16 }} onClick={() => navigate('/')}>
                ← Back to Home
              </button>
            </div>

            {/* Rating */}
            <div className="card">
              <div className="card-title">Rate Your Experience</div>
              {!rated ? (
                <>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.5 }}>
                    Your feedback helps build trust for everyone on CashBridge. How was your experience?
                  </div>
                  <div className="stars">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={`star ${s<=rating?'active':''}`}
                        onClick={() => { setRating(s); setTimeout(()=>setRated(true), 500) }}>⭐</span>
                    ))}
                  </div>
                  <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-light)', marginTop: 8, fontWeight: 500 }}>
                    Tap a star to rate
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: 56, marginBottom: 12 }}>🙏</div>
                  <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 6 }}>Thank you!</div>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>
                    You rated {rating}/5 stars. This helps grow trust in the platform.
                  </div>
                </div>
              )}

              <div className="divider" />

              <div className="card-title">What's Next?</div>
              {[
                isProvider ? '💰 Commission credited to wallet' : '✅ Cash in your hands',
                '⭐ Your trust score updated',
                isProvider ? '📲 Stay online to earn more' : '🔄 Need more cash? Start again',
              ].map(s => (
                <div key={s} style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>{s}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
