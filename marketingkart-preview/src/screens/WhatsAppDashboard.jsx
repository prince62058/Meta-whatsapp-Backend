import { C } from '../theme'

const quickActions = [
  { label: 'Contacts', icon: '👥', bg: ['#3B82F6','#2563EB'] },
  { label: 'Campaigns', icon: '📢', bg: ['#8B5CF6','#6D28D9'] },
  { label: 'Inbox', icon: '💬', bg: ['#F59E0B','#D97706'] },
  { label: 'Reports', icon: '📊', bg: ['#10B981','#059669'] },
  { label: 'Templates', icon: '📄', bg: ['#EC4899','#DB2777'] },
]

const recent = [
  { name: 'Diwali Festival Offer', status: 'COMPLETED', contacts: 500, sent: 498 },
  { name: 'New Year Sale Blast', status: 'RUNNING', contacts: 800, sent: 620 },
  { name: 'Summer Offer 2025', status: 'PAUSED', contacts: 400, sent: 200 },
]

const statusColors = { COMPLETED: C.success, RUNNING: '#8B5CF6', PAUSED: C.warning, DRAFT: '#71717a', FAILED: C.error }

export default function WhatsAppDashboard({ navigate }) {
  return (
    <div style={{ background: C.pageBg, minHeight: '100%' }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(160deg, ${C.primary}, ${C.primaryDark})`, padding: '20px 20px 32px', borderRadius: '0 0 32px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 20, padding: '5px 12px', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>← MARKETINGKART</div>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.2)', borderRadius: 19, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>🔔</div>
            <div style={{ position: 'absolute', top: 2, right: 2, width: 10, height: 10, background: C.success, borderRadius: 5, border: '2px solid #3F51B5' }} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, background: C.waGreen, borderRadius: 4 }} />
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>WhatsApp Business Active</span>
        </div>
        <div style={{ color: '#fff', fontWeight: 800, fontSize: 26 }}>Marketing</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18, fontWeight: 400 }}>Dashboard</div>
        {/* Glass stats */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 12, marginTop: 16, gap: 4 }}>
          {[['1,245','Total Leads','👥'],['8,932','Msgs Sent','📤'],['94.2%','Delivered','✅']].map(([v,l,i],idx) => (
            <div key={idx} style={{ flex: 1, textAlign: 'center', borderRight: idx < 2 ? '1px solid rgba(255,255,255,0.2)' : 'none' }}>
              <div style={{ fontSize: 14 }}>{i}</div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>{v}</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Connected card */}
        <div style={{ background: C.successBg, borderRadius: 16, padding: '14px 16px', border: `1px solid ${C.success}30`, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <div style={{ width: 8, height: 8, background: C.success, borderRadius: 4 }} />
              <span style={{ fontWeight: 700, fontSize: 13, color: '#15803D' }}>ACTIVE</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.textTitle }}>+91 98765 43210</div>
            <div style={{ fontSize: 12, color: C.textMuted }}>Rahul Digital Agency</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: '6px 12px', background: '#fff', border: `1px solid ${C.success}50`, borderRadius: 20, fontSize: 11, fontWeight: 600, color: '#15803D', cursor: 'pointer' }}>Reconnect</button>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: 6, fontWeight: 700, fontSize: 14, color: C.textTitle }}>Quick Actions</div>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, marginBottom: 16 }}>
          {quickActions.map((a, i) => (
            <div key={i} onClick={() => a.label === 'Campaigns' && navigate('campaigns')} style={{ flexShrink: 0, width: 80, background: '#fff', borderRadius: 20, padding: '12px 8px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', cursor: 'pointer' }}>
              <div style={{ width: 46, height: 46, background: `linear-gradient(135deg, ${a.bg[0]}, ${a.bg[1]})`, borderRadius: 14, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{a.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.textBody }}>{a.label}</div>
            </div>
          ))}
        </div>

        {/* Launch CTA */}
        <div onClick={() => navigate('campaigns')} style={{ background: `linear-gradient(90deg, ${C.waGreen}, #128C7E)`, borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, cursor: 'pointer', boxShadow: '0 4px 16px rgba(37,211,102,0.3)' }}>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>🚀 Launch Campaign</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 }}>Send to your contacts now</div>
          </div>
          <span style={{ color: '#fff', fontSize: 22 }}>→</span>
        </div>

        {/* Recent Campaigns */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.textTitle }}>Recent Campaigns</div>
          <div onClick={() => navigate('campaigns')} style={{ color: C.primary, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>View all</div>
        </div>
        {recent.map((c, i) => {
          const col = statusColors[c.status] || '#94A3B8'
          return (
            <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', marginBottom: 8, boxShadow: '0 1px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: C.textTitle, marginBottom: 4 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{c.sent}/{c.contacts} sent</div>
              </div>
              <div style={{ background: col + '20', borderRadius: 20, padding: '4px 10px', border: `1px solid ${col}40` }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: col }}>{c.status}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom nav */}
      <div style={{ position: 'sticky', bottom: 0, background: '#fff', borderTop: '1px solid #E2E8F0', display: 'flex', padding: '10px 0 8px' }}>
        {[['🏠','Home','home'],['📩','Inbox','wa_chat'],['💰','Wallet','wallet'],['⚙️','Settings','']].map(([icon,label,route],i) => (
          <div key={i} onClick={() => route && navigate(route)} style={{ flex: 1, textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: 20 }}>{icon}</div>
            <div style={{ fontSize: 10, color: i===0 ? C.primary : C.textInactive, fontWeight: i===0 ? 700 : 400 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
