import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

const TXN_HISTORY = [
  { id: 'TXN8X2K', type: 'Cash Received', amount: 200, fee: 0, date: 'Today, 10:42 AM', status: 'Complete', with: 'Rahul S.' },
  { id: 'TXN7M1P', type: 'Cash Received', amount: 500, fee: 0, date: 'Yesterday, 3:15 PM', status: 'Complete', with: 'Priya M.' },
  { id: 'TXN6K9R', type: 'Cash Received', amount: 100, fee: 0, date: 'Apr 4, 11:20 AM', status: 'Complete', with: 'Amit P.' },
]

const PROVIDER_TXN = [
  { id: 'TXN5J3Q', type: 'Commission Earned', amount: 4, fee: 0, date: 'Today, 10:42 AM', status: 'Complete', with: 'Anjali D.' },
  { id: 'TXN4H2N', type: 'Commission Earned', amount: 10, fee: 0, date: 'Yesterday, 2:30 PM', status: 'Complete', with: 'Rohan V.' },
  { id: 'TXN3G1M', type: 'Commission Earned', amount: 4, fee: 0, date: 'Apr 4, 9:15 AM', status: 'Complete', with: 'Dev P.' },
]

export default function Wallet() {
  const navigate = useNavigate()
  const user = JSON.parse(sessionStorage.getItem('user') || '{}')
  if (!user.loggedIn) { navigate('/'); return null }

  const isProvider = user.role === 'provider'
  const txns = isProvider ? PROVIDER_TXN : TXN_HISTORY
  const balance = isProvider ? 47 : 0
  const totalExchanged = isProvider ? 47 : 800

  return (
    <Layout title="My Wallet" subtitle="Your CashBridge balance and transaction history">

      {/* Balance cards */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--primary), #4f8ef7)',
          borderRadius: 'var(--radius)', padding: '20px 24px', color: 'white'
        }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            {isProvider ? 'Commission Balance' : 'Wallet Balance'}
          </div>
          <div style={{ fontSize: 36, fontWeight: 900 }}>₹{balance}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 6 }}>
            {isProvider ? 'From commissions this week' : 'No balance — direct UPI'}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e6f7f5' }}>💸</div>
          <div>
            <div className="stat-value">₹{totalExchanged}</div>
            <div className="stat-label">{isProvider ? 'Total Earned' : 'Total Exchanged'}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef9e7' }}>📋</div>
          <div>
            <div className="stat-value">{txns.length}</div>
            <div className="stat-label">Transactions Done</div>
          </div>
        </div>
      </div>

      {/* Transaction history */}
      <div className="card">
        <div className="card-title">Transaction History</div>

        {txns.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-light)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>No transactions yet</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Your transactions will appear here</div>
          </div>
        ) : (
          <table className="txn-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Type</th>
                <th>{isProvider ? 'Commission' : 'Amount'}</th>
                <th>With</th>
                <th>Date & Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {txns.map(t => (
                <tr key={t.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--text-secondary)' }}>{t.id}</td>
                  <td style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{t.type}</td>
                  <td style={{ fontWeight: 900, color: isProvider ? 'var(--secondary)' : 'var(--primary)', fontSize: 16 }}>
                    {isProvider ? '+' : ''}₹{t.amount}
                  </td>
                  <td style={{ fontWeight: 700 }}>{t.with}</td>
                  <td style={{ color: 'var(--text-light)', fontSize: 13 }}>{t.date}</td>
                  <td><span className="badge badge-green">✦ {t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isProvider && (
        <div className="note note-green" style={{ marginTop: 8 }}>
          <span>💰</span>
          <span>Commission is earned automatically on every successful exchange. Withdraw to bank coming soon.</span>
        </div>
      )}

      {!isProvider && (
        <div className="note note-blue" style={{ marginTop: 8 }}>
          <span>ℹ️</span>
          <span>As a seeker, UPI payments go directly to providers. CashBridge only facilitates the connection.</span>
        </div>
      )}
    </Layout>
  )
}
