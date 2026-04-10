import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import { useToast } from '../components/Toast.jsx'
import { useLang } from '../components/Lang.jsx'
import { DEMO_USERS, formatDistance, getCommission } from '../data/demoUsers.js'
import Chat from '../components/Chat.jsx'

const INCOMING = [
  { id: 'TXN001', seeker_name: 'Anjali Desai', seeker_avatar: 'AD', seeker_class: 'av-green', amount: 200, distance_m: 180, time: '12 sec ago', emergency: false },
  { id: 'TXN002', seeker_name: 'Rohan Verma', seeker_avatar: 'RV', seeker_class: 'av-blue', amount: 500, distance_m: 420, time: '45 sec ago', emergency: true },
  { id: 'TXN003', seeker_name: 'Priya Kapoor', seeker_avatar: 'PK', seeker_class: 'av-purple', amount: 100, distance_m: 95, time: '1 min ago', emergency: false },
]
const OTP = '847293'

export default function Provider() {
  const navigate = useNavigate()
  const toast = useToast()
  const { t, lang } = useLang()
  const user = JSON.parse(sessionStorage.getItem('user') || '{}')
  const [accepted, setAccepted] = useState(null)
  const [declined, setDeclined] = useState([])
  const [chatOpen, setChatOpen] = useState(false)

  const handleAccept = (req) => {
    setAccepted(req)
    toast(`✅ Accepted request from ${req.seeker_name.split(' ')[0]}!`, 'success')
  }

  const handleDecline = (id) => {
    setDeclined(prev => [...prev, id])
    toast('Request declined.', 'info', 2000)
  }

  const handleComplete = () => {
    const earned = getCommission(accepted.amount)
    toast(`💰 ₹${earned} commission earned!`, 'cash', 4000)
    sessionStorage.setItem('completedTxn', JSON.stringify({
      amount: accepted.amount, earned,
      txnId: accepted.id, isProvider: true
    }))
    setTimeout(() => navigate('/success'), 600)
  }

  const visible = INCOMING.filter(r => !declined.includes(r.id))

  return (
    <Layout>
      {chatOpen && accepted && (
        <Chat
          provider={{ name: accepted.seeker_name, avatar: accepted.seeker_avatar, avatarClass: accepted.seeker_class, distance_m: accepted.distance_m, phone: '9820002001' }}
          amount={accepted.amount}
          onClose={() => setChatOpen(false)}
        />
      )}
      {!accepted ? (
        <>
          <div className="page-header">
            <div className="page-title">{t('incomingRequests')}</div>
            <div className="page-subtitle">
              <span className="live-dot" />
              {visible.length} people nearby need cash
            </div>
          </div>

          {/* Earnings summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
            {[
              { icon: '💰', label: "Today's Earnings", value: '₹47', bg: '#e6f7f5', color: 'var(--secondary)' },
              { icon: '📋', label: 'Transactions', value: '6', bg: 'var(--primary-light)', color: 'var(--primary)' },
              { icon: '⭐', label: 'Your Rating', value: '4.8', bg: '#fef9e7', color: '#92400e' },
            ].map(s => (
              <div key={s.label} style={{ background: s.bg, borderRadius: 14, padding: '16px 18px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 700, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="note note-green" style={{ marginBottom: 20 }}>
            <span>💡</span>
            <span>Accept requests to earn commission. Higher trust score = more requests shown to you.</span>
          </div>

          <div className="grid-2">
            {visible.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px 0', color: 'var(--text-light)' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                <div style={{ fontWeight: 700, fontSize: 17 }}>No requests right now</div>
                <div style={{ fontSize: 14, marginTop: 6 }}>New requests will appear here automatically</div>
              </div>
            ) : visible.map(req => (
              <div key={req.id} className="request-card">
                <div className="request-card-header" style={{ background: req.emergency ? 'linear-gradient(135deg,#dc2626,#ef4444)' : 'linear-gradient(135deg, var(--primary), #4f8ef7)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className={`avatar ${req.seeker_class}`} style={{ width: 42, height: 42, fontSize: 14 }}>{req.seeker_avatar}</div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 800, color: 'white', fontSize: 16 }}>{req.seeker_name}</span>
                        {req.emergency && <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.2)', color: 'white', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>🚨 URGENT</span>}
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>
                        📍 {formatDistance(req.distance_m)} away · {req.time}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900, fontSize: 28, color: 'white' }}>₹{req.amount}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>requested</div>
                  </div>
                </div>

                <div className="request-card-body">
                  {/* Commission preview — shown before accepting */}
                  <div style={{ background: '#e6f7f5', borderRadius: 10, padding: '10px 14px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#065f46' }}>{t('youEarn')}</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--secondary)' }}>+₹{getCommission(req.amount)}</div>
                  </div>

                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14, fontWeight: 500 }}>
                    They'll send ₹{req.amount} via UPI → You give cash → You earn ₹{getCommission(req.amount)} commission instantly
                  </div>

                  <div className="request-actions">
                    <button className="btn btn-secondary" style={{ width: '100%' }}
                      onClick={() => handleDecline(req.id)}>{t('decline')}</button>
                    <button className="btn btn-primary" style={{ width: '100%', background: req.emergency ? '#dc2626' : 'var(--primary)' }}
                      onClick={() => handleAccept(req)}>{t('accept')}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Earnings history */}
          <div className="card" style={{ marginTop: 24 }}>
            <div className="card-title">Today's Earnings History</div>
            <table className="txn-table">
              <thead><tr><th>Seeker</th><th>Amount Given</th><th>Commission</th><th>Time</th><th>Status</th></tr></thead>
              <tbody>
                {[
                  { name: 'Arjun K.', amount: '₹200', commission: '+₹4', time: '1 hr ago' },
                  { name: 'Meera S.', amount: '₹500', commission: '+₹10', time: '2 hr ago' },
                  { name: 'Dev P.', amount: '₹100', commission: '+₹2', time: '3 hr ago' },
                ].map((tx, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700 }}>{tx.name}</td>
                    <td style={{ fontWeight: 800, color: 'var(--primary)' }}>{tx.amount}</td>
                    <td style={{ fontWeight: 800, color: 'var(--secondary)' }}>{tx.commission}</td>
                    <td style={{ color: 'var(--text-light)' }}>{tx.time}</td>
                    <td><span className="badge badge-green">✦ Complete</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        // Accepted state
        <div className="grid-2">
          <div>
            <div className="page-header">
              <div className="page-title">Request Accepted ✓</div>
              <div className="page-subtitle">Show OTP to {accepted.seeker_name.split(' ')[0]} after UPI payment</div>
            </div>

            <div className="note note-yellow">
              <span>⚡</span><span>Wait for UPI payment in your GPay/PhonePe first. Then hand over cash.</span>
            </div>

            <div className="card">
              <div className="card-title">Transaction Details</div>
              <div className="info-row"><span className="label">Seeker</span><span className="value">{accepted.seeker_name}</span></div>
              <div className="info-row"><span className="label">Cash to give</span><span className="value" style={{ fontSize: 22, color: 'var(--primary)' }}>₹{accepted.amount}</span></div>
              <div className="info-row"><span className="label">Distance</span><span className="value">📍 {formatDistance(accepted.distance_m)}</span></div>
              <div className="info-row">
                <span className="label">Your Commission</span>
                <span className="value" style={{ color: 'var(--secondary)', fontSize: 18 }}>+₹{getCommission(accepted.amount)}</span>
              </div>
              <div className="info-row"><span className="label">Transaction ID</span><span className="value" style={{ fontSize: 12, fontFamily: 'monospace' }}>{accepted.id}</span></div>
            </div>

            <button className="btn btn-success btn-full" onClick={handleComplete} style={{ marginTop: 8 }}>
              {t('cashHandedOver')}
            </button>
            <button onClick={() => setChatOpen(true)} style={{
              width: '100%', marginTop: 10, background: 'white', border: '1.5px solid var(--primary)',
              color: 'var(--primary)', borderRadius: 10, padding: '12px',
              fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 15, cursor: 'pointer'
            }}>💬 Chat with {accepted.seeker_name.split(' ')[0]}</button>
          </div>

          <div className="card">
            <div className="card-title">{t('showOtp')}</div>
            <div className="otp-display">
              <div style={{ fontSize: 12, color: 'var(--primary-dark)', fontWeight: 800, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                Verification OTP — Valid 2 minutes
              </div>
              <div className="otp-number">{OTP}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 14, fontWeight: 600 }}>
                Seeker enters this in their app to confirm cash received
              </div>
            </div>
            <div className="note note-blue" style={{ marginBottom: 0 }}>
              <span>📱</span><span>OTP expires in 2 minutes. If not entered, UPI payment will be auto-refunded.</span>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
