import { useState } from 'react'
import { C } from '../theme'

export default function LoginScreen({ navigate }) {
  const [email, setEmail] = useState('demo@marketingkart.in')
  const [pass, setPass] = useState('demo123')
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('home') }, 1200)
  }

  return (
    <div style={{ background: C.pageBg, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(160deg, ${C.primary} 0%, ${C.primaryDark} 100%)`, padding: '52px 28px 40px', borderRadius: '0 0 36px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #FF4500, #FF8C00)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: '#fff' }}>M</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>MarketingKart<span style={{ color: '#FF8C00' }}>.ai</span></div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>marketingkart.in</div>
          </div>
        </div>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 26, lineHeight: 1.2 }}>Welcome back! 👋</div>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 6 }}>Login to your account</div>
      </div>

      {/* Form */}
      <div style={{ padding: '28px 20px', flex: 1 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: 20, boxShadow: '0 4px 20px rgba(63,81,181,0.08)' }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Email</label>
          <div style={{ display: 'flex', alignItems: 'center', background: C.pageBg, borderRadius: 12, padding: '0 14px', marginTop: 6, marginBottom: 16, border: `1.5px solid ${C.primary}30` }}>
            <span style={{ fontSize: 16, marginRight: 8 }}>✉️</span>
            <input value={email} onChange={e => setEmail(e.target.value)} style={{ flex: 1, border: 'none', background: 'transparent', padding: '13px 0', fontSize: 14, color: C.textTitle, outline: 'none' }} />
          </div>

          <label style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Password</label>
          <div style={{ display: 'flex', alignItems: 'center', background: C.pageBg, borderRadius: 12, padding: '0 14px', marginTop: 6, marginBottom: 8, border: `1.5px solid ${C.primary}30` }}>
            <span style={{ fontSize: 16, marginRight: 8 }}>🔒</span>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} style={{ flex: 1, border: 'none', background: 'transparent', padding: '13px 0', fontSize: 14, color: C.textTitle, outline: 'none' }} />
          </div>

          <div style={{ textAlign: 'right', marginBottom: 20 }}>
            <span style={{ color: C.primary, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Forgot Password?</span>
          </div>

          <button onClick={handleLogin} disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? '#94A3B8' : `linear-gradient(90deg, ${C.primary}, ${C.primaryDark})`, color: '#fff', border: 'none', borderRadius: 100, fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 16px rgba(63,81,181,0.35)', transition: 'all 0.2s' }}>
            {loading ? '⏳ Logging in...' : '🚀 Login'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, color: C.textMuted, fontSize: 14 }}>
          Don't have account? <span onClick={() => {}} style={{ color: C.primary, fontWeight: 700, cursor: 'pointer' }}>Register</span>
        </div>

        <div style={{ marginTop: 24, padding: 16, background: '#FFFBEB', borderRadius: 14, border: '1px solid #FEF3C7' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>💡 Demo Credentials</div>
          <div style={{ fontSize: 12, color: '#78350F' }}>Email: demo@marketingkart.in</div>
          <div style={{ fontSize: 12, color: '#78350F' }}>Password: demo123</div>
        </div>
      </div>
    </div>
  )
}
