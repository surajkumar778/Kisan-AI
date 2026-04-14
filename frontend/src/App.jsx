// ============================================================
//  frontend/src/App.jsx
// ============================================================
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink, Link, useLocation, Navigate } from 'react-router-dom'
import Home    from './pages/Home.jsx'
import About   from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Advisor from './pages/Advisor.jsx'
import Login   from './pages/Login.jsx'
import VoiceBar from './components/VoiceBar.jsx'

const PATH_PAGE = { '/':'home', '/about':'about', '/contact':'contact', '/advisor':'advisor' }

// ── Auth check ───────────────────────────────────────────────
function isLoggedIn() {
  return !!localStorage.getItem('kisan_token')
}

// ── Protected Route ──────────────────────────────────────────
function ProtectedRoute({ children }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />
  return children
}

function PageWrapper({ children, lang }) {
  const { pathname } = useLocation()
  return (
    <main key={pathname} className="page-enter" style={{ paddingTop:'var(--nav-h)' }}>
      {children}
      <VoiceBar page={PATH_PAGE[pathname]||'home'} lang={lang}/>
    </main>
  )
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  // Get logged in user
  const [user, setUser] = useState(null)
  useEffect(() => {
    const u = localStorage.getItem('kisan_user')
    if (u) setUser(JSON.parse(u))
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('kisan_token')
    localStorage.removeItem('kisan_user')
    window.location.href = '/login'
  }

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn); return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => setMenuOpen(false), [pathname])

  const NAV = [
    { to:'/',        label:'होम / Home',     icon:'🏠' },
    { to:'/about',   label:'परिचय / About',  icon:'🌿' },
    { to:'/contact', label:'संपर्क / Contact', icon:'📞' },
  ]

  const lnk = (active) => ({
    display:'inline-flex', alignItems:'center', gap:'6px',
    padding:'8px 16px', borderRadius:'50px',
    fontFamily:"'DM Sans',sans-serif", fontSize:'13.5px', fontWeight:500,
    color:      active ? '#f0a824' : 'rgba(255,255,255,.75)',
    background: active ? 'rgba(240,168,36,.12)' : 'transparent',
    border:     active ? '1px solid rgba(240,168,36,.25)' : '1px solid transparent',
    transition:'all .2s', textDecoration:'none',
  })

  return (
    <header style={{
      position:'fixed', top:0, left:0, right:0, zIndex:1000,
      height:'var(--nav-h)',
      background: scrolled ? 'rgba(8,35,18,.95)' : 'linear-gradient(180deg,rgba(8,35,18,.92) 0%,rgba(8,35,18,0) 100%)',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,.07)' : 'none',
      transition:'all .35s ease',
      display:'flex', alignItems:'center', padding:'0 32px',
    }}>
      {/* Logo */}
      <Link to="/" style={{
        display:'flex', alignItems:'center', gap:'10px',
        fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:'22px',
        color:'#fff', textDecoration:'none',
      }}>
        <span style={{ fontSize:'30px', display:'inline-block', animation:'leafSway 4s ease-in-out infinite' }}>🌾</span>
        किसान <span style={{ background:'linear-gradient(135deg,#f0a824,#ffc940)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginLeft:'4px' }}>AI</span>
      </Link>

      {/* Desktop nav */}
      <nav style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'4px' }} className="desktop-nav">
        {NAV.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} end={to==='/'} style={({ isActive }) => lnk(isActive)}>
            <span>{icon}</span>{label}
          </NavLink>
        ))}
        <Link to="/advisor" className="btn-gold" style={{ marginLeft:'14px', padding:'10px 24px', fontSize:'13px' }}>
          🤖 AI से सलाह लें
        </Link>

        {/* User info / Login button */}
        {user ? (
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginLeft:'12px' }}>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'13px', color:'rgba(255,255,255,.8)' }}>
              👤 {user.name?.split(' ')[0]}
            </span>
            <button onClick={handleLogout} style={{
              padding:'8px 16px', borderRadius:'50px',
              background:'rgba(220,38,38,.2)', border:'1px solid rgba(220,38,38,.4)',
              color:'#fca5a5', fontFamily:"'DM Sans',sans-serif",
              fontSize:'12px', fontWeight:600, cursor:'pointer',
            }}>
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" style={{
            marginLeft:'12px', padding:'8px 20px', borderRadius:'50px',
            background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.25)',
            color:'#fff', fontFamily:"'DM Sans',sans-serif",
            fontSize:'13px', fontWeight:600, textDecoration:'none',
          }}>
            🔐 Login
          </Link>
        )}
      </nav>

      {/* Mobile burger */}
      <button onClick={() => setMenuOpen(v=>!v)} className="burger-btn"
        style={{ marginLeft:'auto', background:'none', border:'1px solid rgba(255,255,255,.2)', borderRadius:'10px', color:'#fff', fontSize:'18px', padding:'8px 12px', display:'none', cursor:'pointer' }}>
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          position:'absolute', top:'var(--nav-h)', left:0, right:0,
          background:'rgba(8,35,18,.97)', backdropFilter:'blur(24px)',
          padding:'16px 20px 24px',
          display:'flex', flexDirection:'column', gap:'6px',
          borderBottom:'1px solid rgba(255,255,255,.08)',
          animation:'slideUp .2s ease both',
        }}>
          {NAV.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} end={to==='/'} style={({ isActive }) => ({
              padding:'14px 18px', borderRadius:'14px',
              fontFamily:"'DM Sans',sans-serif", fontSize:'15px', fontWeight:500,
              color:      isActive ? '#f0a824' : 'rgba(255,255,255,.8)',
              background: isActive ? 'rgba(240,168,36,.12)' : 'transparent',
              textDecoration:'none',
            })}>
              {icon} {label}
            </NavLink>
          ))}
          <Link to="/advisor" style={{
            marginTop:'8px', padding:'16px', textAlign:'center',
            background:'linear-gradient(135deg,#c9860a,#f0a824)',
            color:'#082312', borderRadius:'14px',
            fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:'15px',
            textDecoration:'none',
          }}>
            🤖 AI से फसल सलाह लें
          </Link>
          {user ? (
            <button onClick={handleLogout} style={{
              marginTop:'8px', padding:'14px', textAlign:'center',
              background:'rgba(220,38,38,.2)', border:'1px solid rgba(220,38,38,.4)',
              color:'#fca5a5', borderRadius:'14px',
              fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:'14px',
              cursor:'pointer',
            }}>
              Logout — {user.name?.split(' ')[0]}
            </button>
          ) : (
            <Link to="/login" style={{
              marginTop:'8px', padding:'14px', textAlign:'center',
              background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)',
              color:'#fff', borderRadius:'14px',
              fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:'14px',
              textDecoration:'none',
            }}>
              🔐 Login / Register
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media(max-width:720px){.desktop-nav{display:none!important}.burger-btn{display:block!important}}
      `}</style>
    </header>
  )
}

function Footer() {
  return (
    <footer style={{
      background:'linear-gradient(160deg,#082312,#0d3b1f)',
      color:'rgba(255,255,255,.55)', padding:'64px 32px 36px', marginTop:'80px',
    }}>
      <div style={{
        maxWidth:'1140px', margin:'0 auto',
        display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',
        gap:'40px', paddingBottom:'40px', borderBottom:'1px solid rgba(255,255,255,.08)',
      }}>
        <div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:'24px', color:'#fff', marginBottom:'14px' }}>
            🌾 किसान AI
          </div>
          <p style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'13px', lineHeight:1.9, maxWidth:'220px' }}>
            भारतीय किसानों के लिए AI आधारित स्मार्ट कृषि सलाह
          </p>
        </div>
        <div>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, color:'#fff', marginBottom:'16px', fontSize:'12px', letterSpacing:'1.5px', textTransform:'uppercase' }}>Pages</p>
          {[['/', '🏠 होम'], ['/about', '🌿 परिचय'], ['/contact', '📞 संपर्क'], ['/advisor', '🤖 AI सलाहकार']].map(([to,label])=>(
            <Link key={to} to={to} style={{ display:'block', fontSize:'13px', color:'rgba(255,255,255,.5)', marginBottom:'10px', textDecoration:'none', transition:'color .15s' }}
              onMouseEnter={e=>e.target.style.color='#f0a824'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,.5)'}>
              {label}
            </Link>
          ))}
        </div>
        <div>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, color:'#fff', marginBottom:'16px', fontSize:'12px', letterSpacing:'1.5px', textTransform:'uppercase' }}>Government Portals</p>
          {[['pmkisan.gov.in','PM-KISAN'],['pmfby.gov.in','PMFBY'],['agricoop.gov.in','Agriculture Dept'],['enam.gov.in','e-NAM']].map(([href,label])=>(
            <a key={href} href={`https://${href}`} target="_blank" rel="noopener" style={{ display:'block', fontSize:'13px', color:'rgba(255,255,255,.5)', marginBottom:'10px', textDecoration:'none' }}
              onMouseEnter={e=>e.target.style.color='#f0a824'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,.5)'}>
              {label} ↗
            </a>
          ))}
        </div>
        <div>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, color:'#fff', marginBottom:'16px', fontSize:'12px', letterSpacing:'1.5px', textTransform:'uppercase' }}>Contact</p>
          <p style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'13px', lineHeight:2.2 }}>
            📧 support@kisanai.in<br/>
            📞 1800-XXX-XXXX<br/>
            🕐 Mon–Sat 9am–6pm IST
          </p>
        </div>
      </div>
      <div style={{ maxWidth:'1140px', margin:'28px auto 0', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'8px', fontSize:'12px' }}>
        <span>© {new Date().getFullYear()} Kisan AI. Built for Indian Farmers.</span>
        <span>Powered by Gemini AI + MongoDB</span>
      </div>
    </footer>
  )
}

export default function App() {
  const [appLang, setAppLang] = useState('hi')
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page — no navbar/footer */}
        <Route path="/login" element={<Login />} />

        {/* All other pages — with navbar/footer */}
        <Route path="/*" element={
          <>
            <Navbar/>
            <PageWrapper lang={appLang}>
              <Routes>
                <Route path="/"        element={<ProtectedRoute><Home/></ProtectedRoute>}/>
                <Route path="/about"   element={<ProtectedRoute><About/></ProtectedRoute>}/>
                <Route path="/contact" element={<ProtectedRoute><Contact/></ProtectedRoute>}/>
                <Route path="/advisor" element={<ProtectedRoute><Advisor onLangChange={setAppLang}/></ProtectedRoute>}/>
              </Routes>
            </PageWrapper>
            <Footer/>
          </>
        }/>
      </Routes>
    </BrowserRouter>
  )
}