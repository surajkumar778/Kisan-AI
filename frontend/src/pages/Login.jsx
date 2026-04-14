// ============================================================
//  src/pages/Login.jsx
// ============================================================
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const API = 'https://kisan-ai-backend-uphj.onrender.com'
const GOOGLE_CLIENT_ID = '1021316997601-a71f2dokn9f56u45e06fbdiqmvvh7f8i.apps.googleusercontent.com'  // Step 4 mein milega

export default function Login() {
  const [tab, setTab]         = useState('login')  // 'login' | 'register'
  const [form, setForm]       = useState({ name:'', email:'', password:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const navigate              = useNavigate()

  // Load Google Sign In script
  useEffect(() => {
    const script = document.createElement('script')
    script.src   = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback:  handleGoogleResponse,
      })
      window.google.accounts.id.renderButton(
        document.getElementById('google-btn'),
        { theme:'outline', size:'large', width:'100%', text:'continue_with' }
      )
    }
    document.body.appendChild(script)
  }, [])

  // Already logged in check
  useEffect(() => {
    if (localStorage.getItem('kisan_token')) navigate('/')
  }, [])

  const handleGoogleResponse = async (response) => {
    setLoading(true); setError('')
    try {
      const res  = await fetch(`${API}/api/auth/google`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ credential: response.credential }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      localStorage.setItem('kisan_token', data.token)
      localStorage.setItem('kisan_user',  JSON.stringify(data.user))
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    setLoading(true); setError('')
    const url = tab === 'login' ? '/api/auth/login' : '/api/auth/register'
    try {
      const res  = await fetch(`${API}${url}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      localStorage.setItem('kisan_token', data.token)
      localStorage.setItem('kisan_user',  JSON.stringify(data.user))
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight:'100vh', background:'linear-gradient(145deg,#082312,#155d2e)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:'20px',
    }}>
      <div style={{
        background:'#fff', borderRadius:'24px', padding:'40px 36px',
        width:'100%', maxWidth:'420px',
        boxShadow:'0 24px 80px rgba(0,0,0,.25)',
      }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'28px' }}>
          <div style={{ fontSize:'48px', marginBottom:'8px' }}>🌾</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'26px', fontWeight:900, color:'#082312' }}>
            किसान AI
          </h1>
          <p style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'13px', color:'#7a9080', marginTop:'4px' }}>
            Smart Farming — AI se Salah Lo
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', background:'#f0faf2', borderRadius:'12px', padding:'4px', marginBottom:'24px' }}>
          {[['login','लॉगिन'],['register','रजिस्टर']].map(([key, label]) => (
            <button key={key} onClick={() => { setTab(key); setError('') }} style={{
              flex:1, padding:'10px', border:'none', borderRadius:'10px',
              background: tab === key ? '#fff' : 'transparent',
              boxShadow: tab === key ? '0 2px 8px rgba(0,0,0,.1)' : 'none',
              fontFamily:"'Noto Sans Devanagari',sans-serif",
              fontSize:'14px', fontWeight: tab === key ? 700 : 400,
              color: tab === key ? '#082312' : '#7a9080',
              cursor:'pointer', transition:'all .2s',
            }}>{label}</button>
          ))}
        </div>

        {/* Form */}
        <div style={{ display:'flex', flexDirection:'column', gap:'14px', marginBottom:'20px' }}>
          {tab === 'register' && (
            <input
              placeholder="आपका नाम"
              value={form.name}
              onChange={e => setForm(f => ({...f, name: e.target.value}))}
              style={inputStyle}
            />
          )}
          <input
            placeholder="Email address"
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({...f, email: e.target.value}))}
            style={inputStyle}
          />
          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={e => setForm(f => ({...f, password: e.target.value}))}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={inputStyle}
          />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background:'#fff5f5', border:'1px solid #ffcdd2',
            borderRadius:'10px', padding:'10px 14px', marginBottom:'16px',
            fontFamily:"'Noto Sans Devanagari',sans-serif",
            fontSize:'13px', color:'#b71c1c',
          }}>❌ {error}</div>
        )}

        {/* Submit button */}
        <button onClick={handleSubmit} disabled={loading} style={{
          width:'100%', padding:'14px',
          background:'linear-gradient(135deg,#082312,#1e9644)',
          color:'#fff', border:'none', borderRadius:'12px',
          fontFamily:"'Noto Sans Devanagari',sans-serif",
          fontSize:'15px', fontWeight:700,
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom:'16px', opacity: loading ? .7 : 1,
          display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
        }}>
          {loading
            ? <><span style={{ width:'18px',height:'18px',border:'3px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 1s linear infinite',display:'inline-block' }}/> लोड हो रहा है...</>
            : (tab === 'login' ? '🔐 लॉगिन करें' : '✅ रजिस्टर करें')}
        </button>

        {/* Divider */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
          <div style={{ flex:1, height:'1px', background:'#e0e0e0' }}/>
          <span style={{ fontSize:'12px', color:'#aaa', fontFamily:"'DM Sans',sans-serif" }}>OR</span>
          <div style={{ flex:1, height:'1px', background:'#e0e0e0' }}/>
        </div>

        {/* Google button */}
        <div id="google-btn" style={{ width:'100%', marginBottom:'16px' }}/>

        {/* Footer */}
        <p style={{ textAlign:'center', fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'12px', color:'#aaa' }}>
          {tab === 'login'
            ? <span>Account नहीं है? <button onClick={() => setTab('register')} style={{ background:'none', border:'none', color:'#1e9644', fontWeight:700, cursor:'pointer', fontSize:'12px' }}>रजिस्टर करें</button></span>
            : <span>पहले से account है? <button onClick={() => setTab('login')} style={{ background:'none', border:'none', color:'#1e9644', fontWeight:700, cursor:'pointer', fontSize:'12px' }}>लॉगिन करें</button></span>
          }
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

const inputStyle = {
  padding: '13px 16px',
  border: '2px solid #e0e0e0',
  borderRadius: '12px',
  fontFamily: "'Noto Sans Devanagari','DM Sans',sans-serif",
  fontSize: '15px', color: '#082312',
  background: '#fafaf5', outline: 'none', width: '100%',
}