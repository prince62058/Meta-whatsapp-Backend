import { useState } from 'react'
import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import AdsTabScreen from './screens/AdsTabScreen'
import WhatsAppDashboard from './screens/WhatsAppDashboard'
import WhatsAppChat from './screens/WhatsAppChat'
import AdsCreate from './screens/AdsCreate'
import AdsDetails from './screens/AdsDetails'
import CampaignScreen from './screens/CampaignScreen'
import WalletScreen from './screens/WalletScreen'
import TemplatesScreen from './screens/TemplatesScreen'
import './App.css'

const SCREENS = [
  { id: 'login', label: '🔐 Login', component: LoginScreen },
  { id: 'home', label: '🏠 Home', component: HomeScreen },
  { id: 'wa_dash', label: '💬 WA Dashboard', component: WhatsAppDashboard },
  { id: 'wa_chat', label: '📩 WA Chat', component: WhatsAppChat },
  { id: 'campaigns', label: '📢 Campaigns', component: CampaignScreen },
  { id: 'templates', label: '📄 Templates', component: TemplatesScreen },
  { id: 'wallet', label: '💰 Wallet', component: WalletScreen },
  { id: 'ads', label: '📊 Meta Ads', component: AdsTabScreen },
  { id: 'ads_create', label: '➕ Create Ad', component: AdsCreate },
  { id: 'ads_detail', label: '📈 Ad Detail', component: AdsDetails },
]

export default function App() {
  const [active, setActive] = useState('login')
  const Screen = SCREENS.find(s => s.id === active)?.component || LoginScreen

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0F172A', fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar nav */}
      <div style={{ width: 200, background: '#1E293B', padding: '20px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 16px 20px', borderBottom: '1px solid #334155' }}>
          <div style={{ color: '#FF6B35', fontWeight: 800, fontSize: 16 }}>MarketingKart</div>
          <div style={{ color: '#EF4444', fontWeight: 700, fontSize: 13 }}>.ai</div>
          <div style={{ color: '#64748B', fontSize: 11, marginTop: 4 }}>UI Preview</div>
        </div>
        {SCREENS.map(s => (
          <button key={s.id} onClick={() => setActive(s.id)} style={{
            padding: '10px 16px', background: active === s.id ? '#3F51B5' : 'transparent',
            color: active === s.id ? '#fff' : '#94A3B8', border: 'none', cursor: 'pointer',
            textAlign: 'left', fontSize: 13, fontWeight: active === s.id ? 600 : 400,
            borderLeft: active === s.id ? '3px solid #7986CB' : '3px solid transparent',
            transition: 'all 0.15s',
          }}>{s.label}</button>
        ))}
        <div style={{ marginTop: 'auto', padding: '16px', color: '#475569', fontSize: 11 }}>
          React Native CLI app<br />preview (web render)
        </div>
      </div>

      {/* Phone frame */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 390, height: 844, background: '#fff', borderRadius: 44,
          overflow: 'hidden', boxShadow: '0 0 0 10px #1E293B, 0 0 0 12px #334155, 0 32px 80px rgba(0,0,0,0.6)',
          position: 'relative', display: 'flex', flexDirection: 'column',
        }}>
          {/* Status bar */}
          <div style={{ background: '#3F51B5', padding: '12px 20px 8px', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>9:41</span>
            <span style={{ color: '#fff', fontSize: 12 }}>📶 🔋</span>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <Screen navigate={(id) => setActive(id)} />
          </div>
        </div>
      </div>
    </div>
  )
}
