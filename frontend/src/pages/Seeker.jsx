import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import { useToast } from '../components/Toast.jsx'
import { useLang } from '../components/Lang.jsx'
import { getMatchedProviders, formatDistance, getCommission } from '../data/demoUsers.js'
import Chat from '../components/Chat.jsx'

const API = ''

const SEARCHING_MESSAGES = [
  'Scanning nearby users...',
  'Checking trust scores...',
  'Calculating distances...',
  'Almost there...',
  'Found some matches!',
]

const SEARCHING_MESSAGES_HI = [
  'पास के उपयोगकर्ता खोज रहे हैं...',
  'ट्रस्ट स्कोर जांच रहे हैं...',
  'दूरी कैलकुलेट हो रही है...',
  'बस थोड़ा सा...',
  'कुछ मिल गया!',
]

export default function Seeker() {
  const navigate = useNavigate()
  const toast = useToast()
  const { t, lang } = useLang()
  const user = JSON.parse(sessionStorage.getItem('user') || '{}')

  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState('')
  const [emergency, setEmergency] = useState(false)
  const [providers, setProviders] = useState([])
  const [selected, setSelected] = useState(null)
  const [txnId, setTxnId] = useState(null)
  const [otp, setOtp] = useState('')
  const [enteredOtp, setEnteredOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [chatOpen, setChatOpen] = useState(false)

  // Searching animation state
  const [searching, setSearching] = useState(false)
  const [searchMsg, setSearchMsg] = useState(0)
  const [searchProgress, setSearchProgress] = useState(0)


  useEffect(() => { if (!user.name) navigate('/') }, [])

  // Searching animation — runs for 2.5 seconds then shows results
  const runSearchAnimation = (amt, isEmergency) => {
    setSearching(true)
    setSearchMsg(0)
    setSearchProgress(0)

    const messages = lang === 'hi' ? SEARCHING_MESSAGES_HI : SEARCHING_MESSAGES
    let msgIndex = 0
    let progress = 0

    const msgInterval = setInterval(() => {
      msgIndex++
      if (msgIndex < messages.length) setSearchMsg(msgIndex)
    }, 450)

    const progressInterval = setInterval(() => {
      progress += 4
      setSearchProgress(Math.min(progress, 98))
    }, 80)

    setTimeout(() => {
      clearInterval(msgInterval)
      clearInterval(progressInterval)
      setSearchProgress(100)

      setTimeout(() => {
        const matched = getMatchedProviders(parseInt(amt), isEmergency)
        setProviders(matched)
        setSearching(false)
        setStep(2)
        if (matched.length > 0) {
          toast(`🎯 ${matched.length} providers found nearby!`, 'match')
        } else {
          toast('No providers available right now. Try again shortly.', 'warning')
          setStep(1)
        }
      }, 300)
    }, 2400)
  }


  // Poll for provider acceptance
  useEffect(() => {
    if (step !== 3 || !txnId) return
    const iv = setInterval(async () => {
      try {
        const res = await fetch(`${API}/api/status/${txnId}`)
        const data = await res.json()
        if (data.status === 'accepted') {
          setOtp(data.otp)
          setStep(4)
          clearInterval(iv)
          toast('✅ Provider accepted! Send UPI now.', 'success')
        }
      } catch {}
    }, 2000)
    return () => clearInterval(iv)
  }, [step, txnId])

  const findProviders = () => {
    const amt = parseInt(amount)
    if (!amt || amt <= 0 || amt > 1000) {
      setError(lang === 'hi' ? 'कृपया ₹1 से ₹1000 के बीच राशि दर्ज करें' : 'Enter a valid amount (₹1 – ₹1000)')
      return
    }
    setError('')
    runSearchAnimation(amount, emergency)
  }

  const requestMatch = async () => {
    if (!selected) { setError('Please select a provider'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/api/request`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseInt(amount), seeker_name: user.name, seeker_phone: user.phone })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.detail); setLoading(false); return }
      setTxnId(data.transaction_id)
      await fetch(`${API}/api/accept`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction_id: data.transaction_id, provider_id: selected.id })
      })
      setStep(3)
      toast(`Request sent to ${selected.name.split(' ')[0]}!`, 'info')
    } catch { setError('Connection error. Is backend running?') }
    setLoading(false)
  }

  const confirmOtp = async () => {
    if (enteredOtp.length !== 6) { setError('Enter 6-digit OTP'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/api/confirm`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction_id: txnId, otp: enteredOtp })
      })
      const data = await res.json()
      if (res.ok) {
        toast('🎉 Cash exchange confirmed!', 'success', 4000)
        sessionStorage.setItem('completedTxn', JSON.stringify({ amount, provider: selected, txnId }))
        setTimeout(() => navigate('/success'), 800)
      } else {
        setError(data.detail)
        toast('Wrong OTP. Try again.', 'error')
      }
    } catch { setError('Connection error') }
    setLoading(false)
  }

  const STEPS = [t('howMuch').slice(0,12), t('nearbyProviders'), 'Waiting', t('confirmExchange')]

  return (
    <Layout>
      {/* Chat modal */}
      {chatOpen && selected && (
        <Chat provider={selected} amount={amount} onClose={() => setChatOpen(false)} />
      )}
      <div className="steps-row" style={{ marginBottom: 24 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div className={`step-pill ${i+1===step?'active':i+1<step?'done':''}`}>
              <span style={{
                width: 20, height: 20, borderRadius: '50%',
                background: i+1===step ? 'var(--primary)' : i+1<step ? '#15803d' : 'var(--text-light)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 900, flexShrink: 0
              }}>{i+1<step ? '✓' : i+1}</span>
              {s}
            </div>
            {i < STEPS.length - 1 && <span style={{ color: 'var(--text-light)', fontSize: 16 }}>›</span>}
          </div>
        ))}
      </div>

      {/* SEARCHING ANIMATION */}
      {searching && (
        <div style={{ maxWidth: 500, margin: '60px auto', textAlign: 'center' }}>
          <div style={{ fontSize: 72, marginBottom: 24, animation: 'spin 2s linear infinite', display: 'inline-block' }}>🔍</div>
          <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 8 }}>
            {lang === 'hi' ? 'प्रदाता खोज रहे हैं...' : 'Finding providers...'}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 15, fontWeight: 600, marginBottom: 28, minHeight: 24 }}>
            {(lang === 'hi' ? SEARCHING_MESSAGES_HI : SEARCHING_MESSAGES)[searchMsg]}
          </div>
          {/* Progress bar */}
          <div style={{ background: 'var(--border)', borderRadius: 8, height: 8, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{
              height: '100%', borderRadius: 8,
              background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
              width: `${searchProgress}%`, transition: 'width 0.1s ease'
            }} />
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-light)', fontWeight: 600 }}>
            {searchProgress}% complete
          </div>
          {emergency && (
            <div className="note note-red" style={{ marginTop: 20, textAlign: 'left' }}>
              <span>🚨</span><span>{t('emergencyActive')}</span>
            </div>
          )}
        </div>
      )}

      {/* STEP 1 — Amount */}
      {step === 1 && !searching && (
        <div className="grid-2">
          <div className="card">
            <div className="card-title">{t('howMuch')}</div>

            <input className="input input-lg" type="number" placeholder="₹0"
              value={amount} min={1} max={1000}
              onChange={e => { setAmount(e.target.value); setError('') }} />

            <div style={{ margin: '14px 0 6px' }}>
              <label className="input-label">{t('quickSelect')}</label>
            </div>
            <div className="chips" style={{ marginBottom: 20 }}>
              {[50, 100, 200, 500, 1000].map(a => (
                <div key={a} className={`chip ${amount==a?'active':''}`}
                  onClick={() => setAmount(String(a))}>₹{a}</div>
              ))}
            </div>

            {/* Emergency toggle */}
            <div
              onClick={() => { setEmergency(!emergency); toast(emergency ? 'Emergency mode off' : '🚨 Emergency mode ON — priority matching!', emergency ? 'info' : 'warning') }}
              style={{
                border: `2px solid ${emergency ? '#dc2626' : 'var(--border)'}`,
                background: emergency ? '#fef2f2' : 'var(--surface2)',
                borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20,
                transition: 'all 0.2s'
              }}>
              <span style={{ fontSize: 28 }}>🚨</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: emergency ? '#dc2626' : 'var(--text)' }}>
                  {t('emergency')}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, marginTop: 2 }}>
                  {t('emergencyDesc')}
                </div>
              </div>
              <div style={{
                marginLeft: 'auto', width: 44, height: 24, borderRadius: 12,
                background: emergency ? '#dc2626' : 'var(--border)',
                position: 'relative', transition: 'background 0.2s', flexShrink: 0
              }}>
                <div style={{
                  position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%',
                  background: 'white', transition: 'left 0.2s',
                  left: emergency ? 23 : 3, boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
                }} />
              </div>
            </div>

            {error && <div className="note note-red" style={{ marginBottom: 14 }}><span>⚠️</span><span>{error}</span></div>}

            <button className="btn btn-primary btn-full" onClick={findProviders} disabled={!amount}
              style={{ background: emergency ? '#dc2626' : 'var(--primary)', boxShadow: emergency ? '0 4px 14px rgba(220,38,38,0.35)' : undefined }}>
              {emergency ? '🚨 Find Emergency Provider →' : t('findProviders')}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="note note-blue"><span>ℹ️</span><span>{t('maxLimit')}</span></div>
            <div className="note note-green"><span>🔐</span><span>All providers are phone-verified. OTP ensures safe exchange every time.</span></div>
            <div className="note note-yellow"><span>⚡</span><span>Average match time: 45 seconds. Emergency mode: under 15 seconds.</span></div>
            <div className="card" style={{ padding: 16 }}>
              <div className="card-title">Common Use Cases</div>
              {['🚗 Auto driver no UPI', '🏪 Small shop no QR', '🅿️ Parking fee cash only', '🎁 Cash gift emergency', '🍱 Food stall no digital'].map(u => (
                <div key={u} style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>{u}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 — Pick provider */}
      {step === 2 && (
        <div className="grid-2">
          <div>
            <div className="page-header" style={{ marginBottom: 16 }}>
              <div className="page-title">{t('nearbyProviders')}</div>
              <div className="page-subtitle">
                <span className="live-dot" />
                {providers.length} people can give you ₹{amount}
                {emergency && <span style={{ marginLeft: 8, color: '#dc2626', fontWeight: 700 }}>🚨 Emergency Priority</span>}
              </div>
            </div>

            {/* Mini map */}
            <div className="map-area" style={{ marginBottom: 16 }}>
              <div className="map-lines" />
              <div className="map-road-h" style={{ top: '42%' }} />
              <div className="map-road-h" style={{ top: '68%' }} />
              <div className="map-road-v" style={{ left: '28%' }} />
              <div className="map-road-v" style={{ left: '62%' }} />
              <div className="pin pin-you" style={{ bottom: '36%', left: '40%' }} />
              {providers.slice(0, 5).map((p, i) => (
                <div key={p.id} className={`pin ${selected?.id===p.id?'pin-you':'pin-provider'}`}
                  style={{ top: `${15+i*15}%`, left: `${12+i*18}%` }} />
              ))}
              <div style={{ position: 'absolute', bottom: 10, left: 12, display: 'flex', gap: 12, fontSize: 12, fontWeight: 700 }}>
                <span>🔵 You</span><span>🟢 Providers</span>
              </div>
            </div>

            {error && <div className="note note-red" style={{ marginBottom: 12 }}><span>⚠️</span><span>{error}</span></div>}

            <button className="btn btn-primary btn-full"
              style={{ background: emergency ? '#dc2626' : 'var(--primary)' }}
              onClick={requestMatch} disabled={loading || !selected}>
              {loading ? <span className="spinner" /> : selected ? t('requestCash').replace('{amount}', amount) : t('selectProvider')}
            </button>
          </div>

          <div>
            <div className="card-title" style={{ marginBottom: 10 }}>{t('selectProvider')}</div>
            <div style={{ maxHeight: 480, overflowY: 'auto', paddingRight: 4 }}>
              {providers.map((p, idx) => (
                <div key={p.id}
                  className={`provider-item ${selected?.id===p.id?'selected':''}`}
                  onClick={() => {
                    setSelected(p)
                    toast(`Selected ${p.name} — ${formatDistance(p.distance_m)} away`, 'info', 2000)
                  }}>
                  {/* Rank badge for emergency */}
                  {emergency && idx < 3 && (
                    <div style={{ position: 'absolute', /* relative positioned inside */ }}>
                    </div>
                  )}
                  <div className={`avatar ${p.avatarClass}`}>{p.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, fontSize: 15 }}>{p.name}</span>
                      {p.verified && <span style={{ fontSize: 11, color: 'var(--secondary)', fontWeight: 700 }}>✓ KYC</span>}
                      {emergency && idx === 0 && <span style={{ fontSize: 10, background: '#fef2f2', color: '#dc2626', padding: '2px 6px', borderRadius: 6, fontWeight: 800 }}>🏆 BEST MATCH</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 4 }}>
                      <span className={`badge ${p.badge}`}>✦ {p.trust_label}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 700 }}>⭐ {p.rating}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>📍 {formatDistance(p.distance_m)} {t('away')}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>{p.total_transactions} txns</span>
                    </div>
                    <div className="trust-bar" style={{ width: 80 }}>
                      <div className="trust-fill" style={{ width: `${p.trust_score}%` }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 900, fontSize: 17, color: 'var(--primary)' }}>₹{p.cash_available}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-light)', fontWeight: 600 }}>{t('available')}</div>
                    <div style={{ fontSize: 11, color: 'var(--secondary)', fontWeight: 700, marginTop: 2 }}>
                      Score: {p.trust_score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 — Waiting */}
      {step === 3 && (
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: 80, marginBottom: 20, animation: 'pulse 1.5s ease infinite', display: 'inline-block' }}>⏳</div>
          <div className="page-title" style={{ marginBottom: 8 }}>Waiting for {selected?.name?.split(' ')[0]}...</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 28, fontWeight: 500 }}>
            They're confirming your ₹{amount} request. Usually under 60 seconds.
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)', animation: `pulse 1.4s ease ${i*0.2}s infinite` }} />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <span className="live-dot" />
            <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600 }}>Live matching in progress</span>
          </div>

          <div className="note note-yellow" style={{ textAlign: 'left' }}>
            <span>⚡</span><span>Do NOT send UPI yet. Wait for provider to accept first.</span>
          </div>

          {selected && (
            <div className="card" style={{ marginTop: 16, textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className={`avatar ${selected.avatarClass}`}>{selected.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800 }}>{selected.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>📍 {formatDistance(selected.distance_m)} · ⭐ {selected.rating}</div>
                </div>
                <div style={{ fontWeight: 900, color: 'var(--primary)', fontSize: 18, marginRight: 12 }}>₹{amount}</div>
                <button onClick={() => setChatOpen(true)} style={{
                  background: 'var(--primary)', color: 'white', border: 'none',
                  borderRadius: 10, padding: '8px 14px', cursor: 'pointer',
                  fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 13,
                  display: 'flex', alignItems: 'center', gap: 6
                }}>💬 Chat</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 4 — OTP Confirm */}
      {step === 4 && (
        <div className="grid-2">
          <div className="card">
            <div className="card-title">Payment Details</div>
            <div className="info-row">
              <span className="label">{t('sendUpiTo')}</span>
              <span className="value" style={{ color: 'var(--primary)' }}>+91 {selected?.phone || user.phone}</span>
            </div>            <div className="info-row">
              <span className="label">{t('amount')}</span>
              <span className="value" style={{ fontSize: 22, color: 'var(--primary)' }}>₹{amount}</span>
            </div>
            <div className="info-row">
              <span className="label">Provider</span>
              <span className="value">{selected?.name}</span>
            </div>
            <div className="info-row">
              <span className="label">Transaction ID</span>
              <span className="value" style={{ fontSize: 12, fontFamily: 'monospace' }}>{txnId}</span>
            </div>

            <div className="divider" />

            <input className="input" style={{ fontSize: 28, fontWeight: 900, textAlign: 'center', letterSpacing: 10, color: 'var(--primary)' }}
              placeholder="• • • • • •" value={enteredOtp} maxLength={6}
              onChange={e => setEnteredOtp(e.target.value.replace(/\D/g,'').slice(0,6))} />

            {error && <div className="note note-red" style={{ marginTop: 10 }}><span>⚠️</span><span>{error}</span></div>}

            <button className="btn btn-primary btn-full" style={{ marginTop: 16 }}
              onClick={confirmOtp} disabled={loading || enteredOtp.length !== 6}>
              {loading ? <span className="spinner" /> : t('confirmCash')}
            </button>

            <div className="divider" />

            {/* Contact provider */}
            <div style={{ display: 'flex', gap: 10 }}>
              <a href={`tel:+91${selected?.phone || '9820001001'}`}
                style={{ flex: 1, background: '#e8f0fe', color: 'var(--primary)', border: '1.5px solid var(--primary)', borderRadius: 10, padding: '11px', textDecoration: 'none', fontWeight: 700, fontSize: 14, textAlign: 'center', fontFamily: 'Nunito, sans-serif' }}>
                📞 Call {selected?.name?.split(' ')[0]}
              </a>
              <button onClick={() => setChatOpen(true)}
                style={{ flex: 1, background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 10, padding: '11px', cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'Nunito, sans-serif' }}>
                💬 Chat
              </button>
            </div>
            <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-light)', marginTop: 6, fontWeight: 600 }}>
              +91 {(selected?.phone || '9820001001').replace(/(\d{5})(\d{5})/, '$1 $2')}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="note note-yellow"><span>⚡</span><span>First send the UPI payment. Then ask provider for OTP. Then enter here.</span></div>
            <div className="note note-blue"><span>💡</span><span>{t('demoOtp')} <strong style={{ fontSize: 18, letterSpacing: 3 }}>{otp}</strong></span></div>
            <div className="card" style={{ padding: 16 }}>
              <div className="card-title">Exchange Steps</div>
              {[`1. Open GPay / PhonePe`, `2. Send ₹${amount} to provider`, '3. Show payment screenshot', '4. Provider shows you OTP', '5. Enter OTP above ✓'].map(s => (
                <div key={s} style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>{s}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
