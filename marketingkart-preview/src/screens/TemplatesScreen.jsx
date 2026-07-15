import { C, statusColor } from '../theme'

const templates = [
  { name:'welcome_message', category:'MARKETING', lang:'en_US', status:'APPROVED', body:'Hi {{1}}! Welcome to {{2}}. We are thrilled to have you onboard. Explore our latest offers today! 🎉' },
  { name:'festival_offer', category:'MARKETING', lang:'en_US', status:'APPROVED', body:'🎊 Special festival offer for {{1}}! Get {{2}}% OFF on all products. Valid till {{3}}. Hurry!' },
  { name:'order_confirmation', category:'UTILITY', lang:'en_US', status:'PENDING', body:'Your order #{{1}} has been confirmed! Expected delivery: {{2}}. Track your order here.' },
  { name:'abandoned_cart', category:'MARKETING', lang:'en_US', status:'REJECTED', body:'Hi {{1}}, you left something in your cart! Complete your purchase and get 10% off with code {{2}}.' },
]

const counts = { APPROVED: 2, PENDING: 1, REJECTED: 1 }

export default function TemplatesScreen({ navigate }) {
  return (
    <div style={{ background: C.pageBg, minHeight:'100%' }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, padding:'20px 16px 16px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <div style={{ color:'#fff', fontWeight:800, fontSize:18 }}>Templates</div>
          <div style={{ display:'flex', gap:8 }}>
            <button style={{ padding:'6px 12px', background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.3)', borderRadius:20, fontSize:11, fontWeight:700, color:'#fff', cursor:'pointer' }}>🔄 Sync</button>
            <button style={{ padding:'6px 12px', background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.3)', borderRadius:20, fontSize:11, fontWeight:700, color:'#fff', cursor:'pointer' }}>+ Add</button>
          </div>
        </div>
        {/* Summary chips */}
        <div style={{ display:'flex', gap:8 }}>
          {[['All',templates.length,'rgba(255,255,255,0.2)'],['Approved',counts.APPROVED,C.success+'30'],['Pending',counts.PENDING,C.warning+'30'],['Rejected',counts.REJECTED,C.error+'30']].map(([l,v,bg],i) => (
            <div key={i} style={{ background:bg, borderRadius:20, padding:'4px 10px', border:'1px solid rgba(255,255,255,0.2)' }}>
              <span style={{ fontSize:11, fontWeight:700, color:'#fff' }}>{l} {v}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:'16px' }}>
        {templates.map((t,i) => {
          const col = statusColor[t.status] || '#94A3B8'
          return (
            <div key={i} style={{ background:'#fff', borderRadius:18, marginBottom:12, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', borderLeft:`4px solid ${col}` }}>
              <div style={{ padding:'14px 16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:13, color:C.textTitle }}>{t.name}</div>
                    <div style={{ display:'flex', gap:6, marginTop:4 }}>
                      <span style={{ fontSize:10, fontWeight:600, color:C.primary, background:C.primary+'15', padding:'2px 7px', borderRadius:10 }}>{t.category}</span>
                      <span style={{ fontSize:10, color:C.textMuted }}>{t.lang}</span>
                    </div>
                  </div>
                  <div style={{ background:col+'20', borderRadius:20, padding:'3px 8px', border:`1px solid ${col}40` }}>
                    <span style={{ fontSize:10, fontWeight:700, color:col }}>{t.status}</span>
                  </div>
                </div>
                <div style={{ fontSize:12, color:C.textSecondary, lineHeight:1.5, marginBottom:12, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{t.body}</div>
                <div style={{ display:'flex', gap:8 }}>
                  <button style={{ padding:'7px 14px', background:'#F5F7FF', border:`1px solid ${C.primary}30`, borderRadius:20, fontSize:12, fontWeight:600, color:C.primary, cursor:'pointer' }}>📋 Copy</button>
                  {t.status === 'APPROVED' && <button style={{ padding:'7px 14px', background:C.primary, border:'none', borderRadius:20, fontSize:12, fontWeight:600, color:'#fff', cursor:'pointer' }}>Use Template →</button>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
