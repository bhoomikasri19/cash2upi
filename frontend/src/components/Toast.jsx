import { useState, useEffect, createContext, useContext, useCallback } from 'react'

const ToastContext = createContext(null)

export function useToast() {
  return useContext(ToastContext)
}

const ICONS = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️',
  match: '🎯',
  otp: '🔐',
  cash: '💵',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={{
        position: 'fixed', top: 80, right: 24, zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: 10,
        pointerEvents: 'none'
      }}>
        {toasts.map(t => (
          <div key={t.id} onClick={() => remove(t.id)}
            style={{
              background: 'white',
              border: `1.5px solid ${
                t.type === 'success' || t.type === 'match' || t.type === 'cash' ? '#86efac' :
                t.type === 'error' ? '#fca5a5' :
                t.type === 'warning' ? '#fde68a' : '#bfdbfe'
              }`,
              borderRadius: 12,
              padding: '14px 18px',
              display: 'flex', alignItems: 'center', gap: 12,
              minWidth: 280, maxWidth: 360,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              pointerEvents: 'all', cursor: 'pointer',
              animation: 'slideIn 0.3s ease',
            }}>
            <span style={{ fontSize: 20 }}>{ICONS[t.type] || ICONS.info}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>{t.message}</div>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  )
}
