// ============================================================
//  src/pages/About.jsx  –  About page
// ============================================================
import { useState } from 'react'
import { Link } from 'react-router-dom'

function ValueCard({ icon, title, desc }) {
  return (
    <div style={{
      display: 'flex', gap: '18px', alignItems: 'flex-start',
      padding: '22px',
      background: 'rgba(255,255,255,.6)',
      borderRadius: '16px',
      border: '1px solid rgba(10,61,31,.07)',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        flexShrink: 0, width: '46px', height: '46px',
        background: 'var(--gold-pale)',
        borderRadius: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '22px',
        border: '1px solid rgba(232,166,21,.2)',
      }}>{icon}</div>
      <div>
        <h4 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:'15px', color:'var(--green-deep)', marginBottom:'6px' }}>{title}</h4>
        <p style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'13px', lineHeight:1.7, color:'var(--text-mid)' }}>{desc}</p>
      </div>
    </div>
  )
}

function TechBadge({ icon, name, desc }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'var(--green-deep)' : '#fff',
        borderRadius: '16px',
        padding: '20px 18px',
        textAlign: 'center',
        boxShadow: hov ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        border: '1px solid rgba(0,0,0,.05)',
        transform: hov ? 'scale(1.04)' : 'scale(1)',
        transition: 'all .22s ease',
        cursor: 'default',
      }}
    >
      <div style={{ fontSize:'32px', marginBottom:'8px' }}>{icon}</div>
      <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:'14px', color: hov?'#fff':'var(--green-deep)', marginBottom:'4px' }}>{name}</div>
      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', color: hov?'rgba(255,255,255,.6)':'var(--text-light)' }}>{desc}</div>
    </div>
  )
}

export default function About() {
  return (
    <>
      {/* ════ HERO ════ */}
      <section style={{
        background: 'linear-gradient(145deg,#0a3d1f 0%,#185c2e 60%,#0f4a24 100%)',
        padding: '90px 28px 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          background:'radial-gradient(ellipse 50% 60% at 80% 40%, rgba(232,166,21,.1) 0%, transparent 60%)',
        }} />
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div className="section-label" style={{ color:'var(--gold-light)' }}>✦ OUR STORY</div>
          <h1 style={{
            fontFamily:"'Syne',sans-serif",
            fontSize:'clamp(34px,6vw,62px)',
            fontWeight:800, color:'#fff',
            lineHeight:1.1, marginBottom:'22px', maxWidth:'680px',
          }}>
            भारतीय किसानों के लिए<br />
            <span style={{ color:'var(--gold-light)' }}>बनाया, उन्हीं के साथ</span>
          </h1>
          <p style={{
            fontFamily:"'Noto Sans Devanagari',sans-serif",
            fontSize:'17px', color:'rgba(255,255,255,.72)',
            lineHeight:1.8, maxWidth:'540px',
          }}>
            किसान AI की शुरुआत एक सरल सवाल से हुई — क्या हम AI की शक्ति को
            भारत के करोड़ों किसानों तक पहुँचा सकते हैं? आज वो सपना हकीकत है।
          </p>
        </div>
      </section>

      {/* ════ MISSION ════ */}
      <section className="section">
        <div className="container">
          <div style={{
            display:'grid', gridTemplateColumns:'1fr 1fr',
            gap:'64px', alignItems:'center',
          }} className="mission-grid">

            {/* Left */}
            <div>
              <div className="section-label">✦ OUR MISSION</div>
              <h2 className="section-title">हमारा मिशन</h2>
              <p style={{
                fontFamily:"'Noto Sans Devanagari',sans-serif",
                fontSize:'16px', lineHeight:1.85,
                color:'var(--text-mid)', marginBottom:'24px',
              }}>
                भारत की 60% आबादी कृषि पर निर्भर है, फिर भी किसानों को सही
                जानकारी के अभाव में नुकसान उठाना पड़ता है। किसान AI का लक्ष्य
                है — <strong style={{color:'var(--green-deep)'}}>हर किसान को डेटा-आधारित, AI-powered खेती की जानकारी</strong>
                — हिंदी में, मुफ्त में।
              </p>
              <p style={{
                fontFamily:"'Noto Sans Devanagari',sans-serif",
                fontSize:'16px', lineHeight:1.85,
                color:'var(--text-mid)',
              }}>
                हम Gemini AI, OpenWeatherMap और सरकारी MSP डेटा को मिलाकर
                एक ऐसा उपकरण बनाते हैं जो हर किसान — छोटे खेत से लेकर बड़े
                उद्यम तक — के लिए उपयोगी है।
              </p>
            </div>

            {/* Right — Stats */}
            <div style={{
              background:'linear-gradient(135deg,var(--green-deep),var(--green-mid))',
              borderRadius:'24px', padding:'36px',
              boxShadow:'var(--shadow-lg)',
            }}>
              {[
                ['50,000+', 'किसान लाभान्वित'],
                ['28',      'राज्यों में उपलब्ध'],
                ['18+',     'फसल प्रकार सलाह'],
                ['94%',     'सटीकता दर'],
                ['100%',    'मुफ्त सेवा'],
              ].map(([val, label]) => (
                <div key={label} style={{
                  display:'flex', justifyContent:'space-between', alignItems:'center',
                  padding:'14px 0',
                  borderBottom:'1px solid rgba(255,255,255,.09)',
                }}>
                  <span style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'14px', color:'rgba(255,255,255,.7)' }}>{label}</span>
                  <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'22px', color:'var(--gold-light)' }}>{val}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
        <style>{`@media(max-width:768px){.mission-grid{grid-template-columns:1fr !important;}}`}</style>
      </section>

      {/* ════ VALUES ════ */}
      <section className="section" style={{ background:'var(--cream-dark)' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'50px' }}>
            <div className="section-label">✦ WHAT WE BELIEVE</div>
            <h2 className="section-title">हमारे मूल्य</h2>
          </div>
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',
            gap:'18px',
          }}>
            {[
              { icon:'🌾', title:'किसान पहले',    desc:'हर फीचर किसान की जरूरत को ध्यान में रखकर बनाया गया है — तकनीक के लिए नहीं।' },
              { icon:'🌐', title:'सभी की पहुँच',  desc:'हिंदी सपोर्ट, सरल UI और मुफ्त सेवा — ताकि कोई भी किसान पीछे न रहे।' },
              { icon:'🔬', title:'डेटा पर भरोसा', desc:'Gemini AI, सरकारी MSP और live weather — सभी निर्णय तथ्यों पर आधारित।' },
              { icon:'🤝', title:'पारदर्शिता',     desc:'हम बताते हैं कि हमारी सलाह क्यों दी गई — कोई hidden agenda नहीं।' },
              { icon:'📱', title:'सरलता',          desc:'जटिल AI को सरल भाषा में — ताकि बिना tech knowledge के भी काम आए।' },
              { icon:'🌱', title:'स्थायित्व',      desc:'खेती को टिकाऊ बनाने के लिए organic और पर्यावरण-अनुकूल सुझाव।' },
            ].map(v => <ValueCard key={v.title} {...v} />)}
          </div>
        </div>
      </section>

      {/* ════ TECHNOLOGY ════ */}
      <section className="section" style={{ background:'var(--green-deep)' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'50px' }}>
            <div className="section-label" style={{ color:'var(--gold-light)' }}>✦ TECHNOLOGY</div>
            <h2 className="section-title" style={{ color:'#fff' }}>हमारी तकनीक</h2>
            <p className="section-sub" style={{ color:'rgba(255,255,255,.65)', margin:'0 auto', textAlign:'center' }}>
              World-class APIs और open-source tools से बना किसान AI
            </p>
          </div>
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',
            gap:'16px',
          }}>
            {[
              { icon:'🤖', name:'Gemini AI',         desc:'Google\'s LLM' },
              { icon:'⚡', name:'Vite + React',       desc:'Fast Frontend' },
              { icon:'🌤️', name:'OpenWeatherMap',    desc:'Live Weather'  },
              { icon:'🟢', name:'Node.js + Express',  desc:'Backend API'  },
              { icon:'📊', name:'MSP Data',           desc:'Govt. CACP'   },
              { icon:'🔒', name:'Helmet.js',          desc:'API Security' },
            ].map(t => <TechBadge key={t.name} {...t} />)}
          </div>
        </div>
      </section>

      {/* ════ CTA ════ */}
      <section style={{
        background:'linear-gradient(135deg,var(--green-deep),var(--green-mid))',
        padding:'70px 28px', textAlign:'center',
      }}>
        <div className="container">
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(24px,4vw,38px)', fontWeight:800, color:'#fff', marginBottom:'14px' }}>
            हमारे साथ जुड़ें
          </h2>
          <p style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'16px', color:'rgba(255,255,255,.7)', maxWidth:'420px', margin:'0 auto 32px' }}>
            किसान AI को और बेहतर बनाने में मदद करें — feedback, partnership या volunteer के रूप में।
          </p>
          <div style={{ display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/contact" className="btn-gold" style={{ padding:'15px 32px' }}>📞 संपर्क करें</Link>
            <Link to="/advisor" style={{
              display:'inline-flex', alignItems:'center', gap:'8px',
              padding:'15px 28px', borderRadius:'50px',
              border:'2px solid rgba(255,255,255,.3)', color:'rgba(255,255,255,.85)',
              fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:'15px',
              transition:'all .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,.08)'; e.currentTarget.style.borderColor='rgba(255,255,255,.5)' }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(255,255,255,.3)' }}
            >
              🤖 Try AI Advisor
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}