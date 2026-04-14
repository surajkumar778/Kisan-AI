// ============================================================
//  App.jsx — PREMIUM NAVBAR + FOOTER + ROUTES + AUTH
// ============================================================
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink, Link, useLocation } from 'react-router-dom'

import Home    from './pages/Home.jsx'
import About   from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Advisor from './pages/Advisor.jsx'
import Login   from './pages/Login.jsx'   // ✅ NEW

import VoiceBar from './components/VoiceBar.jsx'

const PATH_PAGE = { '/':'home', '/about':'about', '/contact':'contact', '/advisor':'advisor' }

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
  const [user, setUser] = useState(null) // ✅ NEW
  const { pathname } = useLocation()

  // scroll effect
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn); 
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // close mobile menu on route change
  useEffect(() => setMenuOpen(false), [pathname])

  // ✅ token check
  useEffect(() => {
    const token = localStorage.getItem('kisan_token')
    if (token) setUser(true)
  }, [])

  // ✅ logout
  const handleLogout = () => {
    localStorage.removeItem('kisan_token')
    setUser(null)
    window.location.href = '/login'
  }

  const NAV = [
    { to:'/',        label:'होम / Home',    icon:'🏠' },
    { to:'/about',   label:'परिचय / About', icon:'🌿' },
    { to:'/contact', label:'संपर्क / Contact',icon:'📞' },
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
        color:'#fff', textDecoration:'none', letterSpacing:'-.5px',
      }}>
        <span style={{ fontSize:'30px' }}>🌾</span>
        किसान <span style={{ background:'linear-gradient(135deg,#f0a824,#ffc940)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginLeft:'4px' }}>AI</span>
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

        {/* ✅ Login / Logout */}
        {user ? (
          <button onClick={handleLogout} style={{
            marginLeft:'10px',
            padding:'8px 16px',
            borderRadius:'20px',
            border:'none',
            background:'#ff4d4f',
            color:'#fff',
            cursor:'pointer'
          }}>
            Logout
          </button>
        ) : (
          <Link to="/login" style={{
            marginLeft:'10px',
            padding:'8px 16px',
            borderRadius:'20px',
            background:'#f0a824',
            color:'#082312',
            textDecoration:'none'
          }}>
            Login
          </Link>
        )}
      </nav>

      <style>{`
        @media(max-width:720px){.desktop-nav{display:none!important}}
      `}</style>
    </header>
  )
}

function Footer() {
  return (
    <footer style={{
      background:'linear-gradient(160deg,#082312,#0d3b1f)',
      color:'rgba(255,255,255,.55)', padding:'64px 32px 36px', marginTop:'80px',
      textAlign:'center'
    }}>
      © {new Date().getFullYear()} Kisan AI 🌾
    </footer>
  )
}

export default function App() {
  const [appLang, setAppLang] = useState('hi')

  return (
    <BrowserRouter>
      <Navbar/>
      <PageWrapper lang={appLang}>
        <Routes>
          <Route path="/"        element={<Home/>}/>
          <Route path="/about"   element={<About/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/advisor" element={<Advisor onLangChange={setAppLang}/>}/>
          <Route path="/login"   element={<Login/>}/> {/* ✅ NEW */}
        </Routes>
      </PageWrapper>
      <Footer/>
    </BrowserRouter>
  )
}