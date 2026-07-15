import { useState } from 'react'
import { C } from '../theme'

const plans = [
  { name:'Starter', price:2999, duration:'7 Days', reach:'10K–25K', leads:'50–120', color:['#3F51B5','#5C6BC0'] },
  { name:'Growth', price:5999, duration:'15 Days', reach:'40K–80K', leads:'200–450', color:['#7B1FA2','#AB47BC'], badge:'BEST VALUE' },
  { name:'Pro', price:9999, duration:'30 Days', reach:'1L–2.5L', leads:'500–1200', color:['#1565C0','#1E88E5'], badge:'POPULAR' },
]

export default function AdsCreate({ navigate }) {
  const [step, setStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [fbBudget, setFbBudget] = useState(1000)
  const [igBudget, setIgBudget] = useState(1000)
  const [interests, setInterests] = useState(['Real Estate','Home Decor'])
  const [locations, setLocations] = useState(['Mumbai','Pune'])
  const [gender, setGender] = useState(['Male','Female'])
  const [tcs, setTcs] = useState(false)
  const [success, setSuccess] = useState(false)

  if (success) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', background:'#fff', padding:32, textAlign:'center' }}>
      <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
      <div style={{ fontWeight:800, fontSize:22, color:C.success, marginBottom:8 }}>Campaign Created!</div>
      <div style={{ color:C.textMuted, fontSize:14, marginBottom:28 }}>Your ad is now being reviewed by Meta. It'll be live within 24 hours.</div>
      <button onClick={() => navigate('ads')} style={{ padding:'13px 32px', background:`linear-gradient(90deg, ${C.primary}, ${C.primaryDark})`, border:'none', borderRadius:30, fontWeight:700, fontSize:15, color:'#fff', cursor:'pointer' }}>View My Ads</button>
    </div>
  )

  return (
    <div style={{ background: C.pageBg, minHeight:'100%' }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, padding:'16px 16px 12px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
          <span onClick={() => step>1?setStep(step-1):navigate('ads')} style={{ color:'#fff', fontSize:18, cursor:'pointer' }}>←</span>
          <div style={{ color:'#fff', fontWeight:800, fontSize:16 }}>{step===1?'Create Lead Ads — Budget':step===2?'Create an Ad':'Ad Campaign Settings'}</div>
        </div>
        {/* Progress */}
        <div style={{ display:'flex', gap:6 }}>
          {[1,2,3].map(s => (
            <div key={s} style={{ flex:1, height:4, background: s<=step?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.3)', borderRadius:2, transition:'all 0.3s' }} />
          ))}
        </div>
        <div style={{ color:'rgba(255,255,255,0.7)', fontSize:11, marginTop:4 }}>Step {step} of 3</div>
      </div>

      <div style={{ padding:'16px', overflowY:'auto' }}>
        {step === 1 && (
          <>
            <div style={{ fontWeight:700, fontSize:14, color:C.textTitle, marginBottom:12 }}>Total Budget</div>
            {[['Facebook', fbBudget, setFbBudget],['Instagram', igBudget, setIgBudget]].map(([p,v,set],i) => (
              <div key={i} style={{ background:'#fff', borderRadius:14, padding:'14px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12, boxShadow:'0 1px 8px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize:18 }}>{p==='Facebook'?'📘':'📸'}</span>
                <div style={{ fontWeight:600, fontSize:13, color:C.textTitle, flex:1 }}>{p}</div>
                <button onClick={()=>set(Math.max(1000,v-1000))} style={{ width:32,height:32,borderRadius:16,border:`1.5px solid ${C.primary}`,background:'#fff',color:C.primary,fontWeight:700,cursor:'pointer',fontSize:16 }}>−</button>
                <span style={{ fontWeight:800, fontSize:15, color:C.primary, minWidth:56, textAlign:'center' }}>₹{v.toLocaleString()}</span>
                <button onClick={()=>set(v+1000)} style={{ width:32,height:32,borderRadius:16,border:`1.5px solid ${C.primary}`,background:C.primary,color:'#fff',fontWeight:700,cursor:'pointer',fontSize:16 }}>+</button>
              </div>
            ))}

            {/* Estimated */}
            <div style={{ background:`linear-gradient(135deg, ${C.primary}10, ${C.primary}05)`, borderRadius:14, padding:'14px 16px', border:`1px solid ${C.primary}20`, marginBottom:16 }}>
              <div style={{ fontWeight:700, fontSize:13, color:C.primary, marginBottom:8 }}>📊 Estimated Results</div>
              <div style={{ display:'flex', justifyContent:'space-around' }}>
                <div style={{ textAlign:'center' }}><div style={{ fontWeight:800, fontSize:18, color:C.textTitle }}>{Math.round((fbBudget+igBudget)/250*2)}K–{Math.round((fbBudget+igBudget)/250*4)}K</div><div style={{ fontSize:11, color:C.textMuted }}>Views</div></div>
                <div style={{ width:1, background:'#E2E8F0' }} />
                <div style={{ textAlign:'center' }}><div style={{ fontWeight:800, fontSize:18, color:C.textTitle }}>{Math.round((fbBudget+igBudget)/250*0.8)}–{Math.round((fbBudget+igBudget)/250*1.5)}</div><div style={{ fontSize:11, color:C.textMuted }}>Leads</div></div>
                <div style={{ width:1, background:'#E2E8F0' }} />
                <div style={{ textAlign:'center' }}><div style={{ fontWeight:800, fontSize:18, color:C.textTitle }}>{Math.round((fbBudget+igBudget)/250)}</div><div style={{ fontSize:11, color:C.textMuted }}>Days</div></div>
              </div>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
              <div style={{ flex:1, height:1, background:'#E2E8F0' }} />
              <span style={{ fontWeight:700, color:C.textMuted, fontSize:13 }}>OR</span>
              <div style={{ flex:1, height:1, background:'#E2E8F0' }} />
            </div>
            <div style={{ fontWeight:700, fontSize:14, color:C.textTitle, marginBottom:10 }}>Select a Plan</div>
            {plans.map((pl,i) => (
              <div key={i} onClick={()=>setSelectedPlan(pl.name)} style={{ borderRadius:16, overflow:'hidden', marginBottom:10, border: selectedPlan===pl.name?`2px solid ${C.primary}`:'2px solid transparent', cursor:'pointer', boxShadow:'0 2px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ background:`linear-gradient(135deg, ${pl.color[0]}, ${pl.color[1]})`, padding:'14px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ color:'#fff', fontWeight:800, fontSize:16 }}>{pl.name}</span>
                      {pl.badge && <span style={{ background:'rgba(255,255,255,0.25)', padding:'2px 8px', borderRadius:20, fontSize:10, color:'#fff', fontWeight:700 }}>{pl.badge}</span>}
                    </div>
                    <div style={{ color:'rgba(255,255,255,0.8)', fontSize:12 }}>{pl.duration} · Reach {pl.reach}</div>
                  </div>
                  <div>
                    <div style={{ color:'#fff', fontWeight:900, fontSize:20 }}>₹{pl.price.toLocaleString()}</div>
                    {selectedPlan===pl.name && <div style={{ textAlign:'right', color:'rgba(255,255,255,0.9)', fontSize:16 }}>✓</div>}
                  </div>
                </div>
                <div style={{ background:'#fff', padding:'10px 16px' }}>
                  <span style={{ fontSize:12, color:C.textMuted }}>Est. {pl.leads} Leads</span>
                </div>
              </div>
            ))}
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ border:`2px dashed ${C.primary}40`, borderRadius:16, padding:'20px', textAlign:'center', marginBottom:12, background:'#fff', cursor:'pointer' }}>
              <div style={{ fontSize:32 }}>📁</div>
              <div style={{ fontWeight:700, fontSize:14, color:C.primary, marginTop:8 }}>Upload Media</div>
              <div style={{ fontSize:12, color:C.textMuted }}>Max 5 images or 1 video</div>
            </div>
            <button style={{ width:'100%', padding:'11px', background:`linear-gradient(90deg, #7C3AED, #5B21B6)`, border:'none', borderRadius:30, fontWeight:700, fontSize:13, color:'#fff', cursor:'pointer', marginBottom:16 }}>✨ Generate content with AI</button>
            {[['Campaign Name *','My Real Estate Lead Campaign'],['Ad Headline *','Find Your Dream Home Today!'],['Primary Text *','Looking for your perfect home? We have 1000+ verified listings...'],['Caption *','Contact us now for free consultation']].map(([l,ph],i) => (
              <div key={i} style={{ marginBottom:12 }}>
                <label style={{ fontSize:12, fontWeight:700, color:C.textMuted, textTransform:'uppercase', letterSpacing:0.5 }}>{l}</label>
                <input defaultValue={ph} style={{ width:'100%', marginTop:4, padding:'11px 14px', border:`1.5px solid ${C.primary}30`, borderRadius:12, fontSize:13, color:C.textTitle, outline:'none', background:'#fff', boxSizing:'border-box' }} />
              </div>
            ))}
            <div style={{ marginBottom:8, fontSize:12, fontWeight:700, color:C.textMuted, textTransform:'uppercase', letterSpacing:0.5 }}>Interests *</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {interests.map(i => <div key={i} style={{ background:C.primary+'20', border:`1px solid ${C.primary}40`, borderRadius:20, padding:'5px 12px', fontSize:12, fontWeight:600, color:C.primary, display:'flex', alignItems:'center', gap:6 }}>{i} <span style={{ cursor:'pointer', fontWeight:900 }}>×</span></div>)}
              <div style={{ background:'#F5F7FF', border:`1.5px dashed ${C.primary}60`, borderRadius:20, padding:'5px 12px', fontSize:12, color:C.primary, cursor:'pointer' }}>+ Add</div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ fontWeight:700, fontSize:14, color:C.textTitle, marginBottom:10 }}>Select the Gender</div>
            <div style={{ display:'flex', gap:10, marginBottom:16 }}>
              {['Male','Female'].map(g => (
                <div key={g} onClick={() => setGender(prev => prev.includes(g)?prev.filter(x=>x!==g):[...prev,g])} style={{ flex:1, background:'#fff', borderRadius:14, padding:'12px', textAlign:'center', border:`2px solid ${gender.includes(g)?C.primary:'#E2E8F0'}`, cursor:'pointer' }}>
                  <div style={{ fontSize:24 }}>{g==='Male'?'👨':'👩'}</div>
                  <div style={{ fontWeight:600, fontSize:13, color: gender.includes(g)?C.primary:C.textMuted, marginTop:4 }}>{g}</div>
                  {gender.includes(g) && <div style={{ width:20, height:20, background:C.primary, borderRadius:10, margin:'4px auto 0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'#fff', fontWeight:700 }}>✓</div>}
                </div>
              ))}
            </div>

            <div style={{ fontWeight:700, fontSize:14, color:C.textTitle, marginBottom:8 }}>Target Areas</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:16 }}>
              {locations.map(l => <div key={l} style={{ background:C.primary+'15', border:`1px solid ${C.primary}40`, borderRadius:20, padding:'5px 12px', fontSize:12, fontWeight:600, color:C.primary }}>📍 {l} <span style={{ cursor:'pointer' }}>×</span></div>)}
              <div style={{ background:'#F5F7FF', border:`1.5px dashed ${C.primary}60`, borderRadius:20, padding:'5px 12px', fontSize:12, color:C.primary, cursor:'pointer' }}>+ Add Area</div>
            </div>

            <div style={{ fontWeight:700, fontSize:14, color:C.textTitle, marginBottom:8 }}>Age Range: 18 — 65</div>
            <div style={{ background:'#fff', borderRadius:14, padding:'14px 16px', marginBottom:16 }}>
              <input type="range" min={18} max={65} defaultValue={35} style={{ width:'100%', accentColor: C.primary }} />
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:C.textMuted }}>
                <span>18</span><span style={{ fontWeight:700, color:C.primary }}>35</span><span>65</span>
              </div>
            </div>

            <div onClick={() => setTcs(!tcs)} style={{ display:'flex', alignItems:'center', gap:12, background:'#fff', borderRadius:14, padding:'14px 16px', marginBottom:16, cursor:'pointer' }}>
              <div style={{ width:22, height:22, borderRadius:11, background: tcs?C.primary:'#fff', border:`2px solid ${tcs?C.primary:'#D1D5DB'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {tcs && <span style={{ color:'#fff', fontSize:13, fontWeight:700 }}>✓</span>}
              </div>
              <span style={{ fontSize:13, color:C.textBody }}>I agree with <span style={{ color:C.primary, fontWeight:700 }}>Terms & Conditions</span></span>
            </div>
          </>
        )}
      </div>

      {/* Sticky footer */}
      <div style={{ position:'sticky', bottom:0, background:'#fff', padding:'12px 16px', borderTop:'1px solid #F0F0F0' }}>
        <button
          disabled={step===3 && !tcs}
          onClick={() => step < 3 ? setStep(step+1) : setSuccess(true)}
          style={{ width:'100%', padding:'14px', background: (step===3&&!tcs)?'#94A3B8':`linear-gradient(90deg, ${C.primary}, ${C.primaryDark})`, border:'none', borderRadius:30, fontWeight:700, fontSize:15, color:'#fff', cursor: (step===3&&!tcs)?'not-allowed':'pointer', boxShadow: (step===3&&!tcs)?'none':'0 4px 16px rgba(63,81,181,0.35)' }}>
          {step < 3 ? 'Next →' : '💳 Pay Now'}
        </button>
      </div>
    </div>
  )
}
