import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import { useToast } from '../components/Toast.jsx'

const FLOWS = [
  { icon: '💵', title: 'Get Cash', desc: 'Send UPI → Receive cash', path: '/seeker', color: '#1a73e8', bg: '#e8f0fe' },
  { icon: '📲', title: 'Give Cash', desc: 'Receive UPI → Give cash', path: '/provider', color: '#00b899', bg: '#e6f7f5' },
  { icon: '📱', title: 'Get UPI', desc: 'Give cash → Receive UPI', path: '/get-upi', color: '#7c3aed', bg: '#f3e8ff' },
  { icon: '💳', title: 'Give UPI', desc: 'Receive cash → Send UPI', path: '/give-upi', color: '#f59e0b', bg: '#fef3c7' },
]

const RECENT_TXN = [
  { id: 'TXN8X2K', type: 'Get Cash', amount: 200, with: 'Rahul S.', date: 'Today, 10:42 AM', status: 'Complete' },
  { id: 'TXN7M1P', type: 'Give Cash', amount: 500, with: 'Priya M.', date: 'Yesterday, 3:15 PM', status: 'Complete' },
  { id: 'TXN6K9R', type: 'Get UPI', amount: 100, with: 'Amit P.', date: 'Apr 8, 11:20 AM', status: 'Complete' },
]

export default function Home() {
  const navigate = useNavigate()
  const toast = useToast()
  const user = JSON.parse(sessionStorage.getItem('user') || '{}')

  if (!user.loggedIn) { navigate('/'); return null }

  const handleLogout = () => {
    sessionStorage.clear()
    toast('Logged out successfully', 'info')
    navigate('/')
  }

  return (
    <Layout>
      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary), #4f8ef7)',
        borderRadius: 'var(--radius)', padding: '24px 28px',
        marginBottom: 24, color: 'white', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: 600, marginBottom: 4 }}>Welcome back 👋</div>
          <div style={{ fontSize: 26, fontWeight: 900 }}>{user.name}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>+91 {user.phone}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>Trust Score</div>
          <div style={{ fontSize: 36, fontWeight: 900 }}>72</div>
          <button onClick={handleLogout} style={{ marginTop: 8, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'Nunito, sans-serif' }}>
            Log Out
          </button>
        </div>
      </div>

      {/* 4 flow cards */}
      <div style={{ marginBottom: 8 }}>
        <div className="card-title" style={{ marginBottom: 14 }}>What do you want to do?</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {FLOWS.map(f => (
            <div key={f.title} onClick={() => navigate(f.path)}
              style={{
                background: f.bg, border: `1.5px solid ${f.color}22`,
                borderRadius: 'var(--radius)', padding: '20px 16px',
                textAlign: 'center', cursor: 'pointer',
                transition: 'all 0.18s', boxShadow: 'var(--shadow-sm)'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 15, color: f.color, marginBottom: 4 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div className="card-title" style={{ marginBottom: 0 }}>Recent Transactions</div>
          <button onClick={() => navigate('/transactions')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
            View All →
          </button>
        </div>
        <table className="txn-table">
          <thead>
            <tr><th>ID</th><th>Type</th><th>Amount</th><th>With</th><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {RECENT_TXN.map(t => (
              <tr key={t.id}>
                <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{t.id}</td>
                <td style={{ fontWeight: 700 }}>{t.type}</td>
                <td style={{ fontWeight: 900, color: 'var(--primary)' }}>₹{t.amount}</td>
                <td style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{t.with}</td>
                <td style={{ color: 'var(--text-light)', fontSize: 13 }}>{t.date}</td>
                <td><span className="badge badge-green">✦ {t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
