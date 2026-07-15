import { C, statusColor } from '../theme'

const ad = { name:'Real Estate Lead Gen', status:'ACTIVE', type:'Lead Ads', budget:5000, imp:12400, reach:9800, leads:87, spent:3200, start:'1 Jan 2025', end:'20 Jan 2025', platforms:'Facebook, Instagram', areas:'Mumbai, Pune, Thane' }

const ageBars = [
  { range:'18–24', pct:18, color:'#3B82F6' },
  { range:'25–34', pct:35, color:'#8B5CF6' },
  { range:'35–44', pct:27, color:'#EC4899' },
  { range:'45–54', pct:14, color:'#F59E0B' },
  { range:'55+',   pct:6,  color:'#10B981' },
]

export default function AdsDetails({ navigate }) {
  const col = statusColor[ad.status]
  return (
    <div style={{ background:'#C1C1C1', minHeight:'100%' }}>
      {/* Header */}
      <div style={{ background:'#fff', padding:'16px', display:'flex', alignItems:'center', gap:12, borderBottom:'1px solid #eee' }}>
        <span onClick={() => navigate('ads')} style={{ fontSize:18, cursor:'pointer', color:C.textTitle }}>←</span>
        <span style={{ fontWeight:800, fontSize:16, color:C.textTitle }}>Ad Detail</span>
      </div>

      <div style={{ padding:'12px' }}>
        {/* Main card */}
        <div style={{ background:'#fff', borderRadius:18, overflow:'hidden', marginBottom:12, boxShadow:'0 2px 16px rgba(0,0,0,0.1)' }}>
          <div style={{ background:`linear-gradient(135deg, ${C.primary}30, ${C.primaryDark}50)`, height:120, display:'flex', alignItems:'center', justifyContent:'center', fontSize:52 }}>📣</div>
          <div style={{ padding:'14px 16px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, fontSize:15, color:C.textTitle }}>{ad.name}</div>
                <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>{ad.start} – {ad.end} · Running</div>
              </div>
              <div style={{ background:col+'20', borderRadius:20, padding:'4px 10px', border:`1px solid ${col}40` }}>
                <span style={{ fontSize:11, fontWeight:700, color:col }}>● {ad.status}</span>
              </div>
            </div>
            <div style={{ display:'flex', gap:8, fontSize:12, color:C.textMuted }}>
              <span>🖥 {ad.platforms}</span>
              <span>·</span>
              <span>₹{ad.budget.toLocaleString()} Budget</span>
            </div>
            <div style={{ fontSize:12, color:C.textMuted, marginTop:4 }}>📍 {ad.areas} <span style={{ color:C.primary, fontWeight:600 }}>See all →</span></div>
          </div>
        </div>

        {/* Reach message */}
        <div style={{ background:'#fff', borderRadius:16, padding:'14px 16px', marginBottom:12, borderLeft:`4px solid ${col}`, boxShadow:'0 1px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ fontWeight:700, fontSize:14, color:C.textTitle }}>Your ad reached <span style={{ color:col }}>9,800</span> people</div>
          <div style={{ fontSize:12, color:C.textMuted, marginTop:4 }}>Ad is performing well — above industry average for Lead Ads.</div>
        </div>

        {/* KPI grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
          {[['👁','Views','12,400',C.primary],['🖱','Clicks','320',C.metaBlue],['🎯','Leads','87',C.success],['💰','Budget Used','₹3,200',C.warning]].map(([icon,label,val,color],i) => (
            <div key={i} style={{ background:'#fff', borderRadius:16, padding:'14px', boxShadow:'0 1px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize:24, marginBottom:4 }}>{icon}</div>
              <div style={{ fontWeight:900, fontSize:20, color }}>{val}</div>
              <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Age chart */}
        <div style={{ background:'#fff', borderRadius:16, padding:'16px', marginBottom:12, boxShadow:'0 1px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontWeight:700, fontSize:14, color:C.textTitle, marginBottom:14 }}>Age Distribution</div>
          {ageBars.map((b,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <div style={{ width:44, fontSize:11, color:C.textMuted, fontWeight:600, flexShrink:0 }}>{b.range}</div>
              <div style={{ flex:1, background:'#F5F5F5', borderRadius:6, height:10, overflow:'hidden' }}>
                <div style={{ width:`${b.pct}%`, background:`linear-gradient(90deg, ${b.color}, ${b.color}99)`, height:'100%', borderRadius:6, transition:'width 0.5s' }} />
              </div>
              <div style={{ width:32, fontSize:12, fontWeight:700, color:b.color, textAlign:'right', flexShrink:0 }}>{b.pct}%</div>
            </div>
          ))}
        </div>

        {/* Gender */}
        <div style={{ background:'#fff', borderRadius:16, padding:'16px', marginBottom:12, boxShadow:'0 1px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontWeight:700, fontSize:14, color:C.textTitle, marginBottom:12 }}>Gender Breakdown</div>
          <div style={{ display:'flex', gap:4, borderRadius:10, overflow:'hidden', height:14 }}>
            <div style={{ flex:62, background:C.metaBlue }} />
            <div style={{ flex:35, background:'#EC4899' }} />
            <div style={{ flex:3, background:'#94A3B8' }} />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, fontSize:12 }}>
            <span style={{ color:C.metaBlue, fontWeight:700 }}>👨 Male 62%</span>
            <span style={{ color:'#EC4899', fontWeight:700 }}>👩 Female 35%</span>
            <span style={{ color:'#94A3B8', fontWeight:600 }}>Other 3%</span>
          </div>
        </div>

        {/* Engagement */}
        <div style={{ background:'#fff', borderRadius:16, padding:'16px', boxShadow:'0 1px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontWeight:700, fontSize:14, color:C.textTitle, marginBottom:12 }}>Post Engagement</div>
          <div style={{ display:'flex', justifyContent:'space-around' }}>
            {[['❤️','Reactions','1.2K'],['🔗','Link Clicks','320'],['↗️','Shares','48'],['🔖','Saves','92']].map(([icon,label,val],i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div style={{ fontSize:24 }}>{icon}</div>
                <div style={{ fontWeight:800, fontSize:15, color:C.textTitle, marginTop:4 }}>{val}</div>
                <div style={{ fontSize:10, color:C.textMuted }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
