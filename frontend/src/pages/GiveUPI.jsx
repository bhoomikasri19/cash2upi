import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import { useToast } from '../components/Toast.jsx'
import { formatDistance, getCommission } from '../data/demoUsers.js'
import Chat from '../components/Chat.jsx'

export default function GiveUPI() {
  const navigate = useNavigate()
  const toast = useToast()
  const user = JSON.parse(sessionStorage.getItem('user') || '{}')

  const [step, setStep] = useState(1)
  const [requests, setRequests] = useState([
    { id: 'R1', name: 'Anjali Desai', avatar: 'AD', avatarClass: 'av-green', amount: 300, distance_m: 140, time: '30 sec ago', rating: 4.6, phone: '9820003001' },
    { id: 'R2', name: 'Rohan Verma', avatar: 'RV', avatarClass: 'av-blue', amount: 150, distance_m: 280, time: '1 min ago', rating: 4.8, phone: '9820003002' },
    { id: 'R3', name: 'Meera Nair', avatar: 'MN', avatarClass: 'av-orange', amount: 500, distance_m: 420, time: '2 min ago', rating: 4.2, phone: '9820003003' },
  ])
  const [accepted, setAccepted] = useState(null)
  const [otp] = useState('574829')
  const [chatOpen, setChatOpen] = useState(false)

  if (!user.loggedIn) { navigate('/'); return null }

  const handleAccept = (req) => {
    setAccepted(req)
    setStep(2)
    toast(`✅ Accepted! Send ₹${req.amount} UPI to ${req.name.split(' ')[0]}`, 'success')
  }

  const handleDecline = (id) => {
    setRequests(prev => prev.filter(r => r.id !== id))
    toast('Request declined.', 'info', 2000)
  }

  const handleComplete = () => {
    const commission = getCommission(accepted.amount)
    toast(`💰 ₹${commission} commission earned!`, 'cash', 4000)
    sessionStorage.setItem('completedTxn', JSON.stringify({
      amount: accepted.amount, earned: commission,
      txnId: 'TXN' + Date.now(), isProvider: true, type: 'giveUPI'
    }))
    setTimeout(() => navigate('/success'), 600)
  }

  return (
    <Layout title="Give UPI" subtitle="Receive cash from someone → Send them UPI transfer">

      {/* Chat modal */}
      {chatOpen && accepted && (
        <Chat
          provider={{ name: accepted.name, avatar: accepted.avatar, avatarClass: accepted.avatarClass, distance_m: accepted.distance_m, phone: accepted.phone }}
          amount={accepted.amount}
          onClose={() => setChatOpen(false)}
        />
      )}

      {step === 1 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span className="live-dot" />
            <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600 }}>
              {requests.length} people nearby need UPI transfer
            </span>
          </div>

          <div className="note note-green" style={{ marginBottom: 20 }}>
            <span>💡</span>
            <span>Accept → Receive physical cash → Send UPI → Earn ₹{getCommission(300)} commission.</span>
          </div>

          {requests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-light)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>No requests right now</div>
            </div>
          ) : (
            <div className="grid-2">
              {requests.map(req => (
                <div key={req.id} className="request-card">
                  <div className="request-card-header" style={{ background: 'linear-gradient(135deg,#f59e0b,#fbbf24)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className={`avatar ${req.avatarClass}`} style={{ width: 40, height: 40, fontSize: 14 }}>{req.avatar}</div>
                      <div>
                        <div style={{ fontWeight: 800, color: 'white', fontSize: 15 }}>{req.name}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                          📍 {formatDistance(req.distance_m)} · {req.time}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 900, fontSize: 26, color: 'white' }}>₹{req.amount}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>needs UPI</div>
                    </div>
                  </div>

                  <div className="request-card-body">
                    <div style={{ background: '#fef3c7', borderRadius: 8, padding: '8px 12px', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>Your commission</span>
                      <span style={{ fontSize: 18, fontWeight: 900, color: '#f59e0b' }}>+₹{getCommission(req.amount)}</span>
                    </div>
                    <div className="request-actions">
                      <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => handleDecline(req.id)}>✗ Decline</button>
                      <button style={{ flex: 1, background: '#f59e0b', color: 'white', padding: '10px', borderRadius: 10, border: 'none', fontFamily: 'Nunito,sans-serif', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
                        onClick={() => handleAccept(req)}>✓ Accept</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {step === 2 && accepted && (
        <div className="grid-2">
          <div>
            <div className="note note-yellow" style={{ marginBottom: 16 }}>
              <span>⚡</span>
              <span>First receive physical cash from {accepted.name.split(' ')[0]}. Then send UPI. Then mark complete.</span>
            </div>

            <div className="card">
              <div className="card-title">Transaction Details</div>
              <div className="info-row">
                <span className="label">Receive cash from</span>
                <span className="value">{accepted.name}</span>
              </div>
              <div className="info-row">
                <span className="label">Cash amount</span>
                <span className="value" style={{ fontSize: 22, color: '#f59e0b' }}>₹{accepted.amount}</span>
              </div>
              <div className="info-row">
                <span className="label">Distance</span>
                <span className="value">📍 {formatDistance(accepted.distance_m)}</span>
              </div>
              <div className="info-row">
                <span className="label">Your commission</span>
                <span className="value" style={{ color: 'var(--secondary)', fontSize: 18 }}>+₹{getCommission(accepted.amount)}</span>
              </div>
            </div>

            <button className="btn btn-success btn-full" onClick={handleComplete} style={{ marginTop: 8 }}>
              ✓ UPI Sent — Mark Complete
            </button>

            {/* Call + Chat */}
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <a href={`tel:+91${accepted.phone}`}
                style={{ flex: 1, background: '#fef3c7', color: '#f59e0b', border: '1.5px solid #f59e0b', borderRadius: 10, padding: '11px', textDecoration: 'none', fontWeight: 700, fontSize: 14, textAlign: 'center', fontFamily: 'Nunito, sans-serif' }}>
                📞 Call {accepted.name.split(' ')[0]}
              </a>
              <button onClick={() => setChatOpen(true)}
                style={{ flex: 1, background: '#f59e0b', color: 'white', border: 'none', borderRadius: 10, padding: '11px', cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'Nunito, sans-serif' }}>
                💬 Chat
              </button>
            </div>
            <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-light)', marginTop: 6, fontWeight: 600 }}>
              +91 {accepted.phone.replace(/(\d{5})(\d{5})/, '$1 $2')}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Show OTP to Requester</div>
            <div className="otp-display">
              <div style={{ fontSize: 12, color: 'var(--primary-dark)', fontWeight: 800, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                Verification OTP — Valid 2 min
              </div>
              <div className="otp-number" style={{ color: '#f59e0b' }}>{otp}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 14, fontWeight: 600 }}>
                Requester enters this to confirm they received UPI
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
