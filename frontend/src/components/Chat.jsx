import { useState, useEffect, useRef } from 'react'

const QUICK_MSGS = [
  '📍 I am here, where are you?',
  '🚶 On my way, 2 minutes',
  '✅ I have reached the spot',
  '👀 I can see you',
  '💸 Please send UPI first',
  '🔐 Ready with OTP',
  '⏳ Please wait, coming shortly',
  '📞 Calling you now',
]

// Simulated auto-replies from the other person
const AUTO_REPLIES = [
  '👍 Ok, I am nearby',
  '🚶 Coming in 1 minute',
  '📍 I am at the corner',
  '✅ Reached! Look for blue shirt',
  '💵 Ready with cash',
  '👀 I can see you too!',
]

export default function Chat({ provider, amount, onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, from: 'them', text: `Hi! I'm ${provider.name.split(' ')[0]}. I'm ${provider.distance_m}m away. Coming to you.`, time: 'just now' }
  ])
  const [input, setInput] = useState('')
  const [showQuick, setShowQuick] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMsg = (text) => {
    if (!text.trim()) return
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    const newMsg = { id: Date.now(), from: 'me', text, time: now }
    setMessages(prev => [...prev, newMsg])
    setInput('')
    setShowQuick(false)

    // Simulate auto-reply after 1.5–3 seconds
    const delay = 1500 + Math.random() * 1500
    const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)]
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, from: 'them', text: reply,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      }])
    }, delay)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: 'white', borderRadius: 20, width: '100%', maxWidth: 440,
        display: 'flex', flexDirection: 'column', maxHeight: '85vh',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary), #4f8ef7)',
          padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14
        }}>
          <div className={`avatar ${provider.avatarClass}`} style={{ width: 44, height: 44, fontSize: 15, flexShrink: 0 }}>
            {provider.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, color: 'white', fontSize: 16 }}>{provider.name}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
              📍 {provider.distance_m}m away · ₹{amount} exchange
            </div>
          </div>

          {/* Phone number */}
          <a href={`tel:+91${provider.phone || '9820000001'}`}
            style={{
              background: 'rgba(255,255,255,0.2)', color: 'white',
              borderRadius: 10, padding: '8px 12px', textDecoration: 'none',
              fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6,
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
            📞 Call
          </a>

          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', background: 'rgba(0,0,0,0.15)', padding: '6px 10px', borderRadius: 8 }}>
            +91 {(provider.phone || '9820000001').replace(/(\d{5})(\d{5})/, '$1 $2')}
          </div>

          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
            borderRadius: '50%', width: 32, height: 32, cursor: 'pointer',
            fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>✕</button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10, background: '#f8faff' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{
              display: 'flex', flexDirection: 'column',
              alignItems: msg.from === 'me' ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                background: msg.from === 'me' ? 'var(--primary)' : 'white',
                color: msg.from === 'me' ? 'white' : 'var(--text)',
                borderRadius: msg.from === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                padding: '10px 14px', maxWidth: '78%',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                border: msg.from === 'them' ? '1px solid var(--border)' : 'none',
                fontSize: 14, fontWeight: 600, lineHeight: 1.4
              }}>
                {msg.text}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 3, fontWeight: 500 }}>
                {msg.from === 'me' ? 'You' : provider.name.split(' ')[0]} · {msg.time}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Quick messages */}
        {showQuick && (
          <div style={{ padding: '8px 14px', background: '#f0f4ff', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {QUICK_MSGS.map(q => (
              <button key={q} onClick={() => sendMsg(q)} style={{
                background: 'white', border: '1px solid var(--border)', borderRadius: 20,
                padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                color: 'var(--text)', fontFamily: 'Nunito, sans-serif',
                transition: 'all 0.15s'
              }}>{q}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', background: 'white', display: 'flex', gap: 8 }}>
          <button onClick={() => setShowQuick(!showQuick)} style={{
            background: showQuick ? 'var(--primary-light)' : 'var(--surface2)',
            border: '1.5px solid var(--border)', borderRadius: 10,
            width: 40, height: 40, cursor: 'pointer', fontSize: 16,
            flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }} title="Quick messages">⚡</button>

          <input
            style={{
              flex: 1, background: 'var(--surface2)', border: '1.5px solid var(--border)',
              borderRadius: 10, padding: '10px 14px', fontSize: 14, fontFamily: 'Nunito, sans-serif',
              fontWeight: 600, outline: 'none', color: 'var(--text)'
            }}
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMsg(input)}
          />

          <button onClick={() => sendMsg(input)} disabled={!input.trim()} style={{
            background: 'var(--primary)', border: 'none', borderRadius: 10,
            width: 40, height: 40, cursor: input.trim() ? 'pointer' : 'not-allowed',
            opacity: input.trim() ? 1 : 0.4, fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>➤</button>
        </div>
      </div>
    </div>
  )
}
