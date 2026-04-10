import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout.jsx'

const ALL_TXN = [
  { id: 'TXN8X2K', type: 'Get Cash', amount: 200, with: 'Rahul Sharma', location: 'Andheri West', date: 'Today, 10:42 AM', status: 'Complete', rating: 5, earned: 0 },
  { id: 'TXN7M1P', type: 'Give Cash', amount: 500, with: 'Priya Mehta', location: 'Bandra', date: 'Yesterday, 3:15 PM', status: 'Complete', rating: 4, earned: 2 },
  { id: 'TXN6K9R', type: 'Get UPI', amount: 100, with: 'Amit Patel', location: 'Dadar', date: 'Apr 8, 11:20 AM', status: 'Complete', rating: 5, earned: 0 },
  { id: 'TXN5J3Q', type: 'Give UPI', amount: 300, with: 'Sneha Joshi', location: 'Kurla', date: 'Apr 7, 2:30 PM', status: 'Complete', rating: 4, earned: 2 },
  { id: 'TXN4H2N', type: 'Get Cash', amount: 50, with: 'Vikram Singh', location: 'Juhu', date: 'Apr 6, 9:10 AM', status: 'Complete', rating: 5, earned: 0 },
  { id: 'TXN3G1M', type: 'Give Cash', amount: 200, with: 'Anjali Desai', location: 'Malad', date: 'Apr 5, 4:45 PM', status: 'Complete', rating: 3, earned: 2 },
]

const TYPE_COLOR = {
  'Get Cash': '#1a73e8',
  'Give Cash': '#00b899',
  'Get UPI': '#7c3aed',
  'Give UPI': '#f59e0b',
}

const FILTERS = ['All', 'Get Cash', 'Give Cash', 'Get UPI', 'Give UPI']

export default function Transactions() {
  const navigate = useNavigate()
  const user = JSON.parse(sessionStorage.getItem('user') || '{}')
  if (!user.loggedIn) { navigate('/'); return null }

  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  // Merge with any completed txn from session
  const sessionTxn = JSON.parse(sessionStorage.getItem('completedTxn') || 'null')
  const txns = sessionTxn
    ? [{ id: sessionTxn.txnId, type: sessionTxn.isProvider ? 'Give Cash' : 'Get Cash', amount: sessionTxn.amount, with: 'Recent User', location: 'Nearby', date: 'Just now', status: 'Complete', rating: 5, earned: sessionTxn.earned || 0 }, ...ALL_TXN]
    : ALL_TXN

  const filtered = filter === 'All' ? txns : txns.filter(t => t.type === filter)

  const totalEarned = txns.filter(t => t.earned > 0).reduce((s, t) => s + t.earned, 0)

  return (
    <Layout title="Transaction History" subtitle={`${txns.length} total transactions`}>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total', value: txns.length, icon: '📋', color: '#e8f0fe', text: '#1a73e8' },
          { label: 'Get Cash', value: txns.filter(t=>t.type==='Get Cash').length, icon: '💵', color: '#e8f0fe', text: '#1a73e8' },
          { label: 'Give Cash/UPI', value: txns.filter(t=>t.type.includes('Give')).length, icon: '📲', color: '#e6f7f5', text: '#00b899' },
          { label: 'Total Earned', value: `₹${totalEarned}`, icon: '💰', color: '#fef3c7', text: '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{ background: s.color, borderRadius: 14, padding: '16px 18px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.text }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 700 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter chips */}
      <div className="chips" style={{ marginBottom: 20 }}>
        {FILTERS.map(f => (
          <div key={f} className={`chip ${filter===f?'active':''}`} onClick={() => setFilter(f)}>{f}</div>
        ))}
      </div>

      <div className="grid-2">
        {/* List */}
        <div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-light)' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
              <div style={{ fontWeight: 700 }}>No {filter} transactions yet</div>
            </div>
          ) : filtered.map(t => (
            <div key={t.id} onClick={() => setSelected(t)}
              style={{
                background: 'white', borderRadius: 'var(--radius)',
                border: `1.5px solid ${selected?.id===t.id ? TYPE_COLOR[t.type] : 'var(--border)'}`,
                padding: '14px 18px', marginBottom: 10, cursor: 'pointer',
                boxShadow: selected?.id===t.id ? `0 0 0 3px ${TYPE_COLOR[t.type]}18` : 'var(--shadow-sm)',
                transition: 'all 0.15s'
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, background: `${TYPE_COLOR[t.type]}18`, color: TYPE_COLOR[t.type], padding: '2px 8px', borderRadius: 6 }}>{t.type}</span>
                    <span className="badge badge-green" style={{ fontSize: 10 }}>✦ {t.status}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{t.with}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 2 }}>📍 {t.location} · {t.date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 900, fontSize: 18, color: TYPE_COLOR[t.type] }}>₹{t.amount}</div>
                  {t.earned > 0 && <div style={{ fontSize: 12, color: 'var(--secondary)', fontWeight: 700 }}>+₹{t.earned} earned</div>}
                  <div style={{ fontSize: 13, marginTop: 3 }}>{'⭐'.repeat(t.rating)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div>
          {selected ? (
            <div className="card" style={{ position: 'sticky', top: 24 }}>
              <div className="card-title">Transaction Detail</div>
              <div style={{ textAlign: 'center', padding: '16px 0', borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>
                  {selected.type==='Get Cash'?'💵':selected.type==='Give Cash'?'📲':selected.type==='Get UPI'?'📱':'💳'}
                </div>
                <div style={{ fontSize: 36, fontWeight: 900, color: TYPE_COLOR[selected.type] }}>₹{selected.amount}</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600, marginTop: 4 }}>{selected.type}</div>
              </div>
              {[
                { label: 'Transaction ID', value: selected.id },
                { label: 'With', value: selected.with },
                { label: 'Location', value: selected.location },
                { label: 'Date & Time', value: selected.date },
                { label: 'Status', value: '✦ Complete' },
                { label: 'Rating', value: '⭐'.repeat(selected.rating) },
                ...(selected.earned > 0 ? [{ label: 'Commission Earned', value: `+₹${selected.earned}` }] : []),
              ].map(s => (
                <div key={s.label} className="info-row">
                  <span className="label">{s.label}</span>
                  <span className="value" style={{
                    fontSize: s.label==='Transaction ID' ? 12 : 14,
                    fontFamily: s.label==='Transaction ID' ? 'monospace' : 'inherit',
                    color: s.label==='Commission Earned' ? 'var(--secondary)' : 'var(--text)'
                  }}>{s.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: 'white', borderRadius: 'var(--radius)', border: '1.5px dashed var(--border)', padding: 40, textAlign: 'center', color: 'var(--text-light)' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>👆</div>
              <div style={{ fontWeight: 700 }}>Select a transaction</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>Click any row to see full details</div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
