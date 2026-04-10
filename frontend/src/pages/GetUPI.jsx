import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import { useToast } from '../components/Toast.jsx'
import { DEMO_USERS, formatDistance, getCommission } from '../data/demoUsers.js'
import Chat from '../components/Chat.jsx'

// Get UPI = you have physical cash → someone sends you UPI
// Use case: you have cash but need digital money (phone recharge, online payment)

export default function GetUPI() {
  const navigate = useNavigate()
  const toast = useToast()
  const user = JSON.parse(sessionStorage.getItem('user') || '{}')

  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState('')
  const [selected, setSelected] = useState(null)
  const [otp] = useState('392817')
  const [enteredOtp, setEnteredOtp] = useState('')
  const [error, setError] = useState('')
  const [chatOpen, setChatOpen] = useState(false)

  if (!user.loggedIn) { navigate('/'); return null }

  // Providers here = people who have UPI and will accept cash from you
  const upiProviders = DEMO_USERS.filter(u => u.online).slice(0, 6)

  const findProviders = () => {
    const amt = parseInt(amount)
    if (!amt || amt <= 0 || amt > 1000) { setError('Enter valid amount (₹1–₹1000)'); return }
    setError('')
    toast('🔍 Finding UPI senders nearby...', 'info', 2000)
    setTimeout(() => { setStep(2); toast(`✅ ${upiProviders.length} people found!`, 'match') }, 1500)
  }

  const requestMatch = () => {
    if (!selected) { setError('Select a person first'); return }
    toast(`Request sent to ${selected.name.split(' ')[0]}!`, 'info')
    setStep(3)
    setTimeout(() => { setStep(4); toast('✅ Accepted! Hand over cash now.', 'success') }, 2000)
  }

  const confirm = () => {
    if (enteredOtp.length !== 6) { setError('Enter 6-digit OTP'); return }
    if (enteredOtp !== otp) { setError('Wrong OTP'); toast('Wrong OTP!', 'error'); return }
    toast('🎉 UPI received successfully!', 'success', 4000)
    sessionStorage.setItem('completedTxn', JSON.stringify({ amount, txnId: 'TXN' + Date.now(), type: 'getUPI' }))
    setTimeout(() => navigate('/success'), 800)
  }

  return (
    <Layout title="Get UPI" subtitle="Give physical cash → Receive UPI transfer">
      {chatOpen && selected && (
        <Chat provider={selected} amount={amount} onClose={() => setChatOpen(false)} />
      )}
      {/* Steps */}
      <div className="steps-row" style={{ marginBottom: 24 }}>
        {['Enter Amount', 'Pick Sender', 'Hand Cash', 'Confirm OTP'].map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div className={`step-pill ${i+1===step?'active':i+1<step?'done':''}`}>
              <span style={{ width:20, height:20, borderRadius:'50%', background: i+1===step?'#7c3aed':i+1<step?'#15803d':'var(--text-light)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, flexShrink:0 }}>
                {i+1<step?'✓':i+1}
              </span>
              {s}
            </div>
            {i < 3 && <span style={{ color:'var(--text-light)', fontSize:16 }}>›</span>}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="grid-2">
          <div className="card">
            <div className="card-title">How much UPI do you need?</div>
            <input className="input input-lg" type="number" placeholder="₹0"
              value={amount} min={1} max={1000}
              onChange={e => { setAmount(e.target.value); setError('') }} />
            <div className="chips" style={{ margin: '14px 0 20px' }}>
              {[50, 100, 200, 500].map(a => (
                <div key={a} className={`chip ${amount==a?'active':''}`} onClick={() => setAmount(String(a))}>₹{a}</div>
              ))}
            </div>
            {error && <div className="note note-red" style={{ marginBottom: 14 }}><span>⚠️</span><span>{error}</span></div>}
            <button className="btn btn-full" style={{ background:'#7c3aed', color:'white', padding:'13px', borderRadius:10, border:'none', fontFamily:'Nunito,sans-serif', fontSize:15, fontWeight:700, cursor:'pointer' }}
              onClick={findProviders} disabled={!amount}>
              Find UPI Senders →
            </button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div className="note note-blue"><span>ℹ️</span><span>You physically hand cash to a nearby person. They send you equivalent UPI instantly.</span></div>
            <div className="note note-green"><span>💡</span><span>Useful when you have cash but need digital money — recharge, online payment etc.</span></div>
            <div className="note note-yellow"><span>⚡</span><span>Flat ₹2 fee. Max ₹1,000 per transaction.</span></div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid-2">
          <div>
            <div className="page-header" style={{ marginBottom: 14 }}>
              <div className="page-title">Nearby UPI Senders</div>
              <div className="page-subtitle"><span className="live-dot" />{upiProviders.length} people can send you ₹{amount} via UPI</div>
            </div>
            {error && <div className="note note-red" style={{ marginBottom: 12 }}><span>⚠️</span><span>{error}</span></div>}
            <button className="btn btn-full" style={{ background:'#7c3aed', color:'white', padding:'13px', borderRadius:10, border:'none', fontFamily:'Nunito,sans-serif', fontSize:15, fontWeight:700, cursor: selected?'pointer':'not-allowed', opacity: selected?1:0.5 }}
              onClick={requestMatch}>
              {selected ? `Request ₹${amount} UPI from ${selected.name.split(' ')[0]} →` : 'Select someone first'}
            </button>
          </div>
          <div>
            {upiProviders.map(p => (
              <div key={p.id} className={`provider-item ${selected?.id===p.id?'selected':''}`}
                onClick={() => { setSelected(p); toast(`Selected ${p.name}`, 'info', 1500) }}>
                <div className={`avatar ${p.avatarClass}`}>{p.avatar}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, fontSize:14, marginBottom:4 }}>{p.name}</div>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    <span className={`badge ${p.badge}`}>✦ {p.trust_label}</span>
                    <span style={{ fontSize:12, color:'var(--text-secondary)', fontWeight:600 }}>📍 {formatDistance(p.distance_m)}</span>
                    <span style={{ fontSize:12, color:'var(--text-secondary)', fontWeight:600 }}>⭐ {p.rating}</span>
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontWeight:900, color:'#7c3aed', fontSize:16 }}>₹{p.cash_available}</div>
                  <div style={{ fontSize:11, color:'var(--text-light)' }}>UPI available</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ maxWidth:500, margin:'60px auto', textAlign:'center' }}>
          <div style={{ fontSize:72, marginBottom:16 }}>⏳</div>
          <div className="page-title" style={{ marginBottom:8 }}>Waiting for {selected?.name?.split(' ')[0]}...</div>
          <div style={{ color:'var(--text-secondary)', fontSize:14, fontWeight:500 }}>They're confirming they'll accept your cash</div>
        </div>
      )}

      {step === 4 && (
        <div className="grid-2">
          <div className="card">
            <div className="card-title">Hand Over Cash</div>
            <div className="info-row"><span className="label">Give cash to</span><span className="value">{selected?.name}</span></div>
            <div className="info-row"><span className="label">Amount</span><span className="value" style={{ fontSize:22, color:'#7c3aed' }}>₹{amount}</span></div>
            <div className="info-row"><span className="label">Distance</span><span className="value">📍 {formatDistance(selected?.distance_m || 0)}</span></div>
            <div className="divider" />
            <div className="card-title">Enter OTP from Sender</div>
            <input className="input" style={{ fontSize:28, fontWeight:900, textAlign:'center', letterSpacing:10, color:'#7c3aed' }}
              placeholder="• • • • • •" value={enteredOtp} maxLength={6}
              onChange={e => setEnteredOtp(e.target.value.replace(/\D/g,'').slice(0,6))} />
            {error && <div className="note note-red" style={{ marginTop:10 }}><span>⚠️</span><span>{error}</span></div>}
            <button className="btn btn-full" style={{ background:'#7c3aed', color:'white', padding:'13px', borderRadius:10, border:'none', fontFamily:'Nunito,sans-serif', fontSize:15, fontWeight:700, cursor:'pointer', marginTop:16 }}
              onClick={confirm} disabled={enteredOtp.length !== 6}>
              Confirm UPI Received ✓
            </button>

            <div className="divider" />
            <div style={{ display: 'flex', gap: 10 }}>
              <a href={`tel:+91${selected?.phone || '9820001001'}`}
                style={{ flex:1, background:'#f3e8ff', color:'#7c3aed', border:'1.5px solid #7c3aed', borderRadius:10, padding:'11px', textDecoration:'none', fontWeight:700, fontSize:14, textAlign:'center', fontFamily:'Nunito,sans-serif' }}>
                📞 Call {selected?.name?.split(' ')[0]}
              </a>
              <button onClick={() => setChatOpen(true)}
                style={{ flex:1, background:'#7c3aed', color:'white', border:'none', borderRadius:10, padding:'11px', cursor:'pointer', fontWeight:700, fontSize:14, fontFamily:'Nunito,sans-serif' }}>
                💬 Chat
              </button>
            </div>
            <div style={{ textAlign:'center', fontSize:12, color:'var(--text-light)', marginTop:6, fontWeight:600 }}>
              +91 {(selected?.phone || '9820001001').replace(/(\d{5})(\d{5})/, '$1 $2')}
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div className="note note-yellow"><span>⚡</span><span>Hand over cash first. Then ask for OTP. Then enter it here.</span></div>
            <div className="note note-blue"><span>💡</span><span>Demo OTP: <strong style={{ fontSize:18, letterSpacing:3 }}>{otp}</strong></span></div>
          </div>
        </div>
      )}
    </Layout>
  )
}
