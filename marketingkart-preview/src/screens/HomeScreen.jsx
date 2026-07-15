import { C } from '../theme'

const stats = [
  { label: 'Campaigns', value: '12', icon: '📢', color: '#3B82F6' },
  { label: 'Ads Running', value: '3', icon: '📊', color: '#8B5CF6' },
  { label: 'Wallet', value: '₹2,450', icon: '💰', color: C.success },
]

const activity = [
  { icon: '✅', text: 'Campaign "Diwali Offer" completed', time: '2h ago', color: C.success },
  { icon: '🚀', text: 'Ad "Real Estate Lead Gen" is ACTIVE', time: '5h ago', color: C.adActive },
  { icon: '💬', text: 'New message from Priya Sharma', time: '1d ago', color: C.primary },
]

export default function HomeScreen({ navigate }) {
  return (
    <div style={{ background: C.pageBg, minHeight: '100%' }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(160deg, ${C.primary}, ${C.primaryDark})`, padding: '20px 20px 36px', borderRadius: '0 0 32px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Good Morning 👋</div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 22 }}>Rahul Sharma</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Rahul Digital Agency</div>
          </div>
          <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.2)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🔔</div>
        </div>
        {/* Stats */}
        <div style={{ display: 'flex', gap: 10, background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 12 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 18 }}>{s.icon}</div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>{s.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 16px' }}>
        {/* Feature cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div onClick={() => navigate('wa_dash')} style={{ background: `linear-gradient(135deg, ${C.waGreen}, #128C7E)`, borderRadius: 20, padding: 20, cursor: 'pointer', boxShadow: '0 6px 20px rgba(37,211,102,0.3)' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>💬</div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>WhatsApp Marketing</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 4 }}>Campaigns · Templates · CRM</div>
            <div style={{ marginTop: 12, color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 600 }}>Open →</div>
          </div>
          <div onClick={() => navigate('ads')} style={{ background: `linear-gradient(135deg, ${C.metaBlue}, #1565D8)`, borderRadius: 20, padding: 20, cursor: 'pointer', boxShadow: '0 6px 20px rgba(24,119,242,0.3)' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📣</div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>Meta Ads</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 4 }}>Facebook · Instagram</div>
            <div style={{ marginTop: 12, color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 600 }}>Open →</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.textTitle }}>Recent Activity</div>
          <div style={{ color: C.primary, fontSize: 12, fontWeight: 600 }}>View all</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {activity.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', borderBottom: i < activity.length - 1 ? '1px solid #F5F5F5' : 'none' }}>
              <div style={{ width: 36, height: 36, background: a.color + '15', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, marginRight: 12, flexShrink: 0 }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.textBody }}>{a.text}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div style={{ marginTop: 16, background: '#FFFBEB', borderRadius: 16, padding: '14px 16px', border: '1px solid #FEF3C7' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <span style={{ fontSize: 20 }}>💡</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#92400E' }}>Pro Tip</div>
              <div style={{ fontSize: 12, color: '#78350F', marginTop: 3, lineHeight: 1.5 }}>Excel mein "phone" column zaruri hai. Variables <code>{'{{1}}'}</code> se map karo template mein.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ position: 'sticky', bottom: 0, background: '#fff', borderTop: '1px solid #E2E8F0', display: 'flex', padding: '10px 0 8px' }}>
        {[['🏠','Home','home'],['📣','Ads','ads'],['💬','WA','wa_dash'],['👤','Profile','']].map(([icon,label,route],i) => (
          <div key={i} onClick={() => route && navigate(route)} style={{ flex: 1, textAlign: 'center', cursor: route ? 'pointer' : 'default' }}>
            <div style={{ fontSize: 20 }}>{icon}</div>
            <div style={{ fontSize: 10, color: i===0 ? C.primary : C.textInactive, fontWeight: i===0 ? 700 : 400 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
