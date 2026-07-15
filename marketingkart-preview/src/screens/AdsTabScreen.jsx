import { C, statusColor } from '../theme'

const ads = [
  { id:1, name:'Real Estate Lead Gen', status:'ACTIVE', type:'Lead Ads', budget:5000, imp:12400, reach:9800, leads:87, spent:3200, start:'1 Jan', end:'20 Jan', platforms:'FB + IG', areas:'Mumbai, Pune' },
  { id:2, name:'Hotel Booking Campaign', status:'IN_REVIEW', type:'WhatsApp Ads', budget:3000, imp:0, reach:0, leads:0, spent:0, start:'12 Jan', end:'25 Jan', platforms:'Facebook', areas:'Delhi, Gurgaon' },
  { id:3, name:'Fashion Sale — Summer', status:'COMPLETED', type:'Traffic', budget:2000, imp:45000, reach:32000, leads:0, spent:2000, start:'15 Dec', end:'30 Dec', platforms:'Instagram', areas:'Bangalore' },
  { id:4, name:'Tech Product Launch', status:'PAUSED', type:'Awareness', budget:4000, imp:6200, reach:5100, leads:0, spent:1800, start:'5 Jan', end:'15 Jan', platforms:'FB + IG', areas:'All India' },
]

function KpiCell({ label, value }) {
  return (
    <div style={{ textAlign:'center' }}>
      <div style={{ fontWeight:700, fontSize:13, color:'#fff' }}>{value}</div>
      <div style={{ fontSize:9, color:'rgba(255,255,255,0.7)' }}>{label}</div>
    </div>
  )
}

function fmtN(n) { if(n>=1000) return (n/1000).toFixed(1)+'K'; return String(n) }

export default function AdsTabScreen({ navigate }) {
  return (
    <div style={{ background: C.pageBg, minHeight:'100%' }}>
      {/* Header */}
      <div style={{ background:'#fff', padding:'16px 16px 12px', borderBottom:'1px solid #F0F0F0' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ fontWeight:800, fontSize:16, color:C.textTitle }}>Your Created Ads Report</div>
            <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>You can see your ad performance here</div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <div style={{ background:C.primary, borderRadius:20, padding:'5px 12px', fontSize:12, fontWeight:700, color:'#fff', cursor:'pointer' }}>Help?</div>
            <div style={{ background:'#F5F5F5', borderRadius:20, padding:'5px 10px', fontSize:14, cursor:'pointer' }}>⚙️</div>
          </div>
        </div>
      </div>

      <div style={{ padding:'12px 12px' }}>
        {ads.map((ad,i) => {
          const col = statusColor[ad.status] || '#94A3B8'
          return (
            <div key={i} onClick={() => navigate('ads_detail')} style={{ background:'#fff', borderRadius:18, marginBottom:14, overflow:'hidden', boxShadow:'0 3px 16px rgba(0,0,0,0.08)', cursor:'pointer' }}>
              {/* Creative area */}
              <div style={{ background:`linear-gradient(160deg, ${C.primary}30, ${C.primaryDark}50)`, height:140, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ fontSize:48 }}>📣</div>
                {/* Status pill */}
                <div style={{ position:'absolute', top:10, left:10, background:col, borderRadius:20, padding:'4px 10px', display:'flex', alignItems:'center', gap:5 }}>
                  <div style={{ width:6, height:6, background:'rgba(255,255,255,0.8)', borderRadius:3 }} />
                  <span style={{ fontSize:11, fontWeight:700, color:'#fff' }}>{ad.status.replace('_',' ')}</span>
                </div>
                {/* Dark gradient + KPIs */}
                <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(0deg, rgba(0,0,0,0.75), transparent)', padding:'16px 14px 10px', display:'flex', justifyContent:'space-between' }}>
                  <KpiCell label="Imp." value={fmtN(ad.imp)} />
                  <KpiCell label="Reach" value={fmtN(ad.reach)} />
                  <KpiCell label={ad.type==='Lead Ads'?'Leads':'Clicks'} value={fmtN(ad.leads)} />
                  <KpiCell label="Spent" value={`₹${fmtN(ad.spent)}`} />
                </div>
              </div>

              {/* Info */}
              <div style={{ padding:'12px 14px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:13, color:C.textTitle, marginBottom:2 }}>{ad.name}</div>
                  <div style={{ fontSize:11, color:C.textMuted }}>{ad.type} · {ad.start} – {ad.end} · {ad.platforms}</div>
                </div>
                {ad.status === 'COMPLETED' && (
                  <button onClick={e => { e.stopPropagation(); navigate('ads_create') }} style={{ padding:'7px 14px', background:'#F5F7FF', border:`1.5px solid ${C.primary}`, borderRadius:20, fontSize:12, fontWeight:700, color:C.primary, cursor:'pointer' }}>🔄 Restart</button>
                )}
              </div>
            </div>
          )
        })}

        {/* FAB */}
        <div onClick={() => navigate('ads_create')} style={{ position:'sticky', bottom:20, float:'right', background:`linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, borderRadius:28, padding:'12px 20px', cursor:'pointer', boxShadow:'0 4px 16px rgba(63,81,181,0.4)', display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ color:'#fff', fontSize:18 }}>+</span>
          <span style={{ color:'#fff', fontSize:13, fontWeight:700 }}>Create Ad</span>
        </div>
      </div>
    </div>
  )
}
