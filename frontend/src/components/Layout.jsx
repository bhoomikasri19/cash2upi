import { useNavigate, useLocation } from 'react-router-dom'

export default function Layout({ children, title, subtitle }) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(sessionStorage.getItem('user') || '{}')

  const nav = [
    { icon: '🏠', label: 'Home', path: '/home' },
    { icon: '💵', label: 'Get Cash', path: '/seeker' },
    { icon: '📲', label: 'Give Cash', path: '/provider' },
    { icon: '📱', label: 'Get UPI', path: '/get-upi' },
    { icon: '💳', label: 'Give UPI', path: '/give-upi' },
    { icon: '📋', label: 'Transactions', path: '/transactions' },
    { icon: '👤', label: 'Profile', path: '/profile' },
    { icon: '🏦', label: 'Wallet', path: '/wallet' },
  ]

  return (
    <div className="layout">
      <div className="topbar">
        <div className="topbar-logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>
          Cash<span>2UPI</span>
        </div>
        <div className="topbar-tagline">Cash ↔ UPI Exchange Platform</div>
        <div className="topbar-right">
          <div className="topbar-badge">🔐 OTP Secured</div>
          {user.name && (
            <div className="topbar-user" style={{ cursor: 'pointer' }} onClick={() => navigate('/profile')}>
              👤 {user.name.split(' ')[0]}
            </div>
          )}
        </div>
      </div>

      <div className="sidebar">
        <div className="sidebar-section">Menu</div>
        {nav.map(item => (
          <div key={item.path}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}>
            <span className="sidebar-icon">{item.icon}</span>
            {item.label}
          </div>
        ))}

        <div style={{ margin: '12px 0' }}>
          <div className="card" style={{ padding: 14 }}>
            <div className="card-title">Trust Score</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--primary)', marginBottom: 5 }}>
              72 <span style={{ fontSize: 13, color: 'var(--text-light)', fontWeight: 600 }}>/ 100</span>
            </div>
            <div className="trust-bar"><div className="trust-fill" style={{ width: '72%' }} /></div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6, fontWeight: 600 }}>
              Limit: <strong style={{ color: 'var(--primary)' }}>₹500</strong>
            </div>
          </div>
        </div>

        <div className="sidebar-limit">
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Max Limit</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: 'white' }}>₹500</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>Based on trust score</div>
        </div>
      </div>

      <div className="main">
        {(title || subtitle) && (
          <div className="page-header">
            {title && <div className="page-title">{title}</div>}
            {subtitle && <div className="page-subtitle">{subtitle}</div>}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
