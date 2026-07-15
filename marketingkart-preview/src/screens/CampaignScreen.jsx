import { C, statusColor } from '../theme'

const campaigns = [
  { name:'Diwali Festival Offer', status:'COMPLETED', template:'festival_offer', date:'28 Oct 2024', total:500, sent:498, delivered:471, read:312, failed:2 },
  { name:'New Year Sale Blast', status:'RUNNING', template:'new_year_sale', date:'30 Dec 2024', total:800, sent:620, delivered:589, read:210, failed:0 },
  { name:'Summer Offer 2025', status:'PAUSED', template:'summer_offer', date:'2 Jan 2025', total:400, sent:200, delivered:185, read:90, failed:5 },
  { name:'Product Launch', status:'DRAFT', template:'—', date:'5 Jan 2025', total:0, sent:0, delivered:0, read:0, failed:0 },
]

function StatPill({ label, value, color }) {
  return (
    <div style={{ background: color+'15', borderRadius:20, padding:'4px 10px', display:'inline-flex', alignItems:'center', gap:4 }}>
      <span style={{ fontSize:11, color, fontWeight:700 }}>{label}: {value}</span>
    </div>
  )
}

export default function CampaignScreen({ navigate }) {
  return (
    <div style={{ background: C.pageBg, minHeight:'100%' }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, padding:'20px 16px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ color:'#fff', fontWeight:800, fontSize:18 }}>Campaigns</div>
          <div style={{ color:'rgba(255,255,255,0.7)', fontSize:12 }}>{campaigns.length} total campaigns</div>
        </div>
        <div style={{ width:38, height:38, background:'rgba(255,255,255,0.2)', borderRadius:19, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, cursor:'pointer', color:'#fff' }}>+</div>
      </div>

      <div style={{ padding:'16px' }}>
        {campaigns.map((c,i) => {
          const col = statusColor[c.status] || '#94A3B8'
          return (
            <div key={i} style={{ background:'#fff', borderRadius:18, padding:'16px', marginBottom:12, boxShadow:'0 2px 12px rgba(0,0,0,0.06)', borderLeft:`4px solid ${col}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:C.textTitle, marginBottom:2 }}>{c.name}</div>
                  <div style={{ fontSize:11, color:C.textMuted }}>📄 {c.template} · {c.date}</div>
                </div>
                <div style={{ background: col+'20', borderRadius:20, padding:'4px 10px', border:`1px solid ${col}40` }}>
                  <span style={{ fontSize:11, fontWeight:700, color:col }}>{c.status}</span>
                </div>
              </div>

              {c.total > 0 && (
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:12 }}>
                  <StatPill label="Sent" value={c.sent} color={C.primary} />
                  <StatPill label="Delivered" value={c.delivered} color={C.success} />
                  <StatPill label="Read" value={c.read} color={C.waGreen} />
                  {c.failed > 0 && <StatPill label="Failed" value={c.failed} color={C.error} />}
                </div>
              )}

              <div style={{ display:'flex', gap:8 }}>
                {c.status === 'RUNNING' && <ActionBtn label="⏸ Pause" color={C.warning} />}
                {c.status === 'PAUSED' && <ActionBtn label="▶ Resume" color={C.success} />}
                {c.status !== 'DRAFT' && <ActionBtn label="📊 Report" color={C.primary} onClick={() => navigate('campaigns')} />}
                {c.status === 'DRAFT' && <ActionBtn label="✏️ Edit" color={C.primary} />}
                <ActionBtn label="🗑 Delete" color={C.error} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ActionBtn({ label, color, onClick }) {
  return (
    <button onClick={onClick} style={{ padding:'6px 12px', background: color+'15', border:`1px solid ${color}40`, borderRadius:20, fontSize:11, fontWeight:600, color, cursor:'pointer' }}>{label}</button>
  )
}
