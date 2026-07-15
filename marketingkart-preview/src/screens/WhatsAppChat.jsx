import { useState } from 'react'
import { C } from '../theme'

const convos = [
  { id:1, name:'Priya Sharma', phone:'+91 98765 43210', last:'Thank you! I received the order.', time:'10:42 AM', unread:2, color:'#7C3AED' },
  { id:2, name:'Rahul Mehta', phone:'+91 91234 56789', last:'Can you send me the invoice?', time:'9:15 AM', unread:0, color:'#0EA5E9' },
  { id:3, name:'Anjali Verma', phone:'+91 99887 76655', last:'Is the product still available?', time:'Yesterday', unread:5, color:'#F59E0B' },
  { id:4, name:'Sanjay Patel', phone:'+91 93456 12345', last:'Please share the catalog.', time:'Yesterday', unread:0, color:'#10B981' },
  { id:5, name:'Deepika Singh', phone:'+91 88123 45678', last:'When will the offer end?', time:'Mon', unread:1, color:'#EF4444' },
  { id:6, name:'Meera Joshi', phone:'+91 85567 89012', last:'I want to place a bulk order.', time:'Sun', unread:3, color:'#6366F1' },
]

const msgs = [
  { type:'in', text:'Hi, I saw your ad for the summer sale!', time:'10:01 AM', status:'read' },
  { type:'out', text:'Hello! Yes, we have 30% off on all products until Sunday 🎉', time:'10:03 AM', status:'read' },
  { type:'in', text:'That sounds amazing! Please send the catalog.', time:'10:05 AM', status:'read' },
  { type:'out', text:"Sure! Here's our catalog: marketingkart.in/catalog", time:'10:07 AM', status:'delivered' },
  { type:'in', text:'Do you offer free delivery?', time:'10:30 AM', status:'read' },
  { type:'out', text:'Yes! Free delivery on orders above ₹999 🚀', time:'10:32 AM', status:'sent' },
  { type:'in', text:'Thank you! I received the order.', time:'10:42 AM', status:'read' },
]

export default function WhatsAppChat() {
  const [view, setView] = useState('list')
  const [active, setActive] = useState(null)
  const [msg, setMsg] = useState('')
  const [messages, setMessages] = useState(msgs)

  const getInitials = n => n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
  const getTicks = s => s==='sent'?'✓':s==='delivered'?'✓✓':<span style={{color:C.waBlueTick}}>✓✓</span>

  if (view === 'thread' && active) {
    return (
      <div style={{ display:'flex', flexDirection:'column', height:'100%', background: C.waWallpaper }}>
        {/* Header */}
        <div style={{ background: C.waHeader, padding:'12px 16px', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
          <span onClick={() => setView('list')} style={{ color:'#fff', fontSize:18, cursor:'pointer' }}>←</span>
          <div style={{ width:36, height:36, background:active.color, borderRadius:18, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#fff' }}>{getInitials(active.name)}</div>
          <div>
            <div style={{ color:'#fff', fontWeight:700, fontSize:14 }}>{active.name}</div>
            <div style={{ color:'rgba(255,255,255,0.7)', fontSize:11 }}>online</div>
          </div>
          <span style={{ marginLeft:'auto', color:'#fff', fontSize:18 }}>⋮</span>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:'auto', padding:'12px 12px 0' }}>
          {messages.map((m,i) => (
            <div key={i} style={{ display:'flex', justifyContent: m.type==='out'?'flex-end':'flex-start', marginBottom:6 }}>
              <div style={{ maxWidth:'78%', background: m.type==='out'? C.waBubbleOut:'#fff', borderRadius: m.type==='out'?'12px 2px 12px 12px':'2px 12px 12px 12px', padding:'8px 12px', boxShadow:'0 1px 2px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize:13, color:'#111', lineHeight:1.4 }}>{m.text}</div>
                <div style={{ fontSize:10, color:'#999', marginTop:4, textAlign:'right' }}>{m.time} {m.type==='out' && getTicks(m.status)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Composer */}
        <div style={{ background:'#fff', padding:'10px 12px', display:'flex', alignItems:'center', gap:10, borderTop:'1px solid #eee', flexShrink:0 }}>
          <span style={{ fontSize:22, cursor:'pointer' }}>➕</span>
          <input value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Message (within 24hrs)..." style={{ flex:1, background:'#F5F5F5', border:'none', borderRadius:20, padding:'10px 14px', fontSize:13, outline:'none' }} onKeyDown={e => {
            if (e.key==='Enter' && msg.trim()) {
              setMessages(prev => [...prev, {type:'out',text:msg,time:'Now',status:'sent'}])
              setMsg('')
            }
          }} />
          <div style={{ width:40, height:40, background:C.waGreenSend, borderRadius:20, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:16 }} onClick={() => { if(msg.trim()){setMessages(prev=>[...prev,{type:'out',text:msg,time:'Now',status:'sent'}]);setMsg('')} }}>➤</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background:'#fff', minHeight:'100%', display:'flex', flexDirection:'column' }}>
      {/* Header */}
      <div style={{ background: C.primary, padding:'16px 16px 12px', flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ color:'#fff', fontWeight:800, fontSize:17 }}>WhatsApp CRM</div>
            <div style={{ color:'rgba(255,255,255,0.7)', fontSize:12 }}>Inbox ({convos.reduce((a,c)=>a+c.unread,0)} unread)</div>
          </div>
          <span style={{ fontSize:22, color:'#fff' }}>🔍</span>
        </div>
      </div>

      {/* List */}
      <div style={{ flex:1, overflowY:'auto' }}>
        {convos.map((c,i) => (
          <div key={i} onClick={() => { setActive(c); setView('thread') }} style={{ display:'flex', alignItems:'center', padding:'13px 16px', borderBottom:'1px solid #F5F5F5', cursor:'pointer', gap:12 }}>
            <div style={{ width:46, height:46, background:c.color, borderRadius:23, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:700, color:'#fff', flexShrink:0 }}>{getInitials(c.name)}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                <div style={{ fontWeight:700, fontSize:14, color:C.textTitle }}>{c.name}</div>
                <div style={{ fontSize:11, color:C.textMuted }}>{c.time}</div>
              </div>
              <div style={{ fontSize:12, color:C.textMuted, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.last}</div>
            </div>
            {c.unread > 0 && <div style={{ width:20, height:20, background:C.waGreen, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'#fff', fontWeight:700, flexShrink:0 }}>{c.unread}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
