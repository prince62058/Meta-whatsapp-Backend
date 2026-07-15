import { useState } from 'react'
import { C } from '../theme'

const txns = [
  { type:'CREDIT', amount:1000, desc:'Wallet recharge via Razorpay', date:'10 Jan 2025' },
  { type:'DEBIT', amount:250, desc:'Campaign: Diwali Festival Offer', date:'9 Jan 2025' },
  { type:'CREDIT', amount:2000, desc:'Wallet recharge via Razorpay', date:'5 Jan 2025' },
  { type:'DEBIT', amount:300, desc:'Campaign: New Year Sale', date:'4 Jan 2025' },
  { type:'DEBIT', amount:150, desc:'Template: festival_offer usage', date:'2 Jan 2025' },
]

const quickAmts = [500, 1000, 2000, 5000]

export default function WalletScreen() {
  const [showAdd, setShowAdd] = useState(false)
  const [amount, setAmount] = useState('')
  const [balance] = useState(2450)

  return (
    <div style={{ background: C.pageBg, minHeight:'100%' }}>
      {/* Hero */}
      <div style={{ background:`linear-gradient(160deg, ${C.primary}, ${C.primaryDark})`, padding:'20px 20px 40px', borderRadius:'0 0 32px 32px' }}>
        <div style={{ color:'rgba(255,255,255,0.8)', fontSize:13, marginBottom:4 }}>← WhatsApp Wallet</div>
        <div style={{ background:'rgba(255,255,255,0.15)', borderRadius:20, padding:'20px', marginTop:8 }}>
          <div style={{ color:'rgba(255,255,255,0.7)', fontSize:12, marginBottom:4 }}>Available Balance</div>
          <div style={{ color:'#fff', fontWeight:900, fontSize:36, marginBottom:16 }}>₹{balance.toLocaleString('en-IN')}</div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => setShowAdd(true)} style={{ flex:1, padding:'11px', background:'#fff', border:'none', borderRadius:30, fontWeight:700, fontSize:13, color:C.primary, cursor:'pointer' }}>+ Add Money</button>
            <button style={{ flex:1, padding:'11px', background:'rgba(255,255,255,0.15)', border:'2px solid rgba(255,255,255,0.5)', borderRadius:30, fontWeight:700, fontSize:13, color:'#fff', cursor:'pointer' }}>Buy Plan</button>
          </div>
        </div>
      </div>

      <div style={{ padding:'20px 16px' }}>
        <div style={{ fontWeight:700, fontSize:15, color:C.textTitle, marginBottom:12 }}>Transaction History</div>
        {txns.map((t,i) => (
          <div key={i} style={{ background:'#fff', borderRadius:14, padding:'13px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12, boxShadow:'0 1px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ width:40, height:40, background: t.type==='CREDIT'?C.success+'15':C.error+'15', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
              {t.type==='CREDIT'?'↓':'↑'}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:13, color:C.textTitle }}>{t.desc}</div>
              <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{t.date}</div>
            </div>
            <div style={{ fontWeight:700, fontSize:14, color: t.type==='CREDIT'?C.success:C.error }}>
              {t.type==='CREDIT'?'+':'−'}₹{t.amount}
            </div>
          </div>
        ))}
      </div>

      {/* Add Money overlay */}
      {showAdd && (
        <div style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.6)', display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:100 }} onClick={()=>setShowAdd(false)}>
          <div style={{ background:'#fff', borderRadius:'24px 24px 0 0', padding:'20px', width:390, maxWidth:'100%' }} onClick={e=>e.stopPropagation()}>
            <div style={{ width:40, height:4, background:'#E2E8F0', borderRadius:2, margin:'0 auto 16px' }} />
            <div style={{ fontWeight:800, fontSize:17, color:C.textTitle, marginBottom:4 }}>Add Money to Wallet</div>
            <div style={{ fontSize:12, color:C.textMuted, marginBottom:16 }}>Minimum ₹100</div>
            <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Enter amount" style={{ width:'100%', padding:'13px 16px', border:`1.5px solid ${C.primary}40`, borderRadius:14, fontSize:15, fontWeight:600, color:C.textTitle, outline:'none', marginBottom:12, boxSizing:'border-box' }} />
            <div style={{ display:'flex', gap:8, marginBottom:20 }}>
              {quickAmts.map(a => (
                <button key={a} onClick={()=>setAmount(String(a))} style={{ flex:1, padding:'9px 0', background: amount==a?C.primary:'#F5F7FF', border:`1.5px solid ${amount==a?C.primary:C.primary+'30'}`, borderRadius:12, fontSize:12, fontWeight:700, color: amount==a?'#fff':C.primary, cursor:'pointer' }}>₹{a}</button>
              ))}
            </div>
            <button onClick={()=>setShowAdd(false)} style={{ width:'100%', padding:'14px', background:'linear-gradient(90deg,#F37254,#E55A38)', border:'none', borderRadius:30, fontWeight:700, fontSize:15, color:'#fff', cursor:'pointer' }}>💳 Pay via Razorpay ₹{amount||'0'}</button>
          </div>
        </div>
      )}
    </div>
  )
}
