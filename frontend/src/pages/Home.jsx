// ============================================================
//  Home.jsx — PREMIUM LANDING PAGE
// ============================================================
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useVoice, PAGE_GREETINGS, hasTTS } from '../hooks/useVoice'

function useCounter(target, duration = 2000) {
  const [val, setVal] = useState(0)
  const ref = useRef(false)
  useEffect(() => {
    if (ref.current) return; ref.current = true
    const step = target / (duration / 16)
    let cur = 0
    const id = setInterval(() => {
      cur = Math.min(cur + step, target)
      setVal(Math.floor(cur))
      if (cur >= target) clearInterval(id)
    }, 16)
    return () => clearInterval(id)
  }, [target, duration])
  return val
}

function StatCard({ icon, value, suffix, label }) {
  const n = useCounter(value)
  return (
    <div className="glass" style={{ padding:'28px 20px', textAlign:'center', borderRadius:'20px' }}>
      <div style={{ fontSize:'36px', marginBottom:'12px', animation:'leafSway 4s ease-in-out infinite' }}>{icon}</div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(28px,3.5vw,44px)', fontWeight:900, color:'#f0a824', lineHeight:1 }}>
        {n.toLocaleString('en-IN')}{suffix}
      </div>
      <div style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'13px', color:'rgba(255,255,255,.6)', marginTop:'8px' }}>{label}</div>
    </div>
  )
}

const FEATURES = [
  { icon:'🌱', title:'AI फसल सलाह', titleEn:'AI Crop Advisory', desc:'मिट्टी, मौसम और पानी के आधार पर सर्वश्रेष्ठ फसल चुनें।', descEn:'Choose the best crop based on soil, weather and water data.' },
  { icon:'📈', title:'मंडी भाव', titleEn:'Market Prices', desc:'लाइव मंडी भाव और MSP जानकारी एक जगह।', descEn:'Live mandi prices and MSP information in one place.' },
  { icon:'🌤️', title:'मौसम जानकारी', titleEn:'Weather Intelligence', desc:'अपने क्षेत्र का सटीक मौसम पूर्वानुमान पाएं।', descEn:'Get accurate weather forecast for your region.' },
  { icon:'🏛️', title:'सरकारी योजनाएँ', titleEn:'Government Schemes', desc:'PM-KISAN, PMFBY और अन्य योजनाओं की जानकारी।', descEn:'PM-KISAN, PMFBY and other scheme information.' },
  { icon:'🎙️', title:'हिंदी आवाज़', titleEn:'Hindi Voice', desc:'Google TTS से असली हिंदी आवाज़ में सलाह सुनें।', descEn:'Listen to advice in real Hindi voice via Google TTS.' },
  { icon:'📥', title:'रिपोर्ट डाउनलोड', titleEn:'Download Report', desc:'बैंक और बीमा के लिए पूरी रिपोर्ट डाउनलोड करें।', descEn:'Download complete report for bank and insurance use.' },
]

export default function Home() {
  const [lang] = useState('hi')
  const { speak, stopSpeaking, speaking } = useVoice(lang)
  const isHi = lang === 'hi'

  return (
    <>
      {/* ── HERO ── */}
      <section style={{
        background:'linear-gradient(160deg,#082312 0%,#0d3b1f 40%,#155d2e 75%,#082312 100%)',
        backgroundSize:'200% 200%',
        animation:'gradientShift 12s ease infinite',
        minHeight:'100vh',
        display:'flex', alignItems:'center',
        position:'relative', overflow:'hidden',
        paddingTop:'var(--nav-h)',
      }}>
        {/* Decorative circles */}
        {[
          { size:500, x:'72%', y:'10%', op:.06 },
          { size:320, x:'-5%', y:'55%', op:.05 },
          { size:200, x:'85%', y:'70%', op:.07 },
        ].map((c,i) => (
          <div key={i} style={{
            position:'absolute', width:`${c.size}px`, height:`${c.size}px`,
            borderRadius:'50%', pointerEvents:'none',
            background:`radial-gradient(circle, rgba(30,150,68,${c.op*2}) 0%, transparent 70%)`,
            top:c.y, left:c.x,
            animation:`floatY ${5+i*1.2}s ease-in-out infinite`,
            animationDelay:`${i*0.8}s`,
          }}/>
        ))}
        {/* Floating emojis */}
        {['🌾','🚜','💧','🌱','☀️','🐄','🌿','🪴'].map((e,i) => (
          <span key={i} style={{
            position:'absolute', fontSize:`${18+i*5}px`, opacity:.08,
            top:`${5+i*12}%`, left:`${2+i*13}%`,
            animation:`floatY ${3.5+i*.5}s ease-in-out infinite`,
            animationDelay:`${i*.6}s`, pointerEvents:'none',
          }}>{e}</span>
        ))}

        <div className="container" style={{ position:'relative', zIndex:1, padding:'80px 32px' }}>
          <div style={{ maxWidth:'720px' }}>
            {/* Badge */}
            <div style={{
              display:'inline-flex', alignItems:'center', gap:'8px',
              background:'rgba(240,168,36,.12)',
              border:'1px solid rgba(240,168,36,.3)',
              borderRadius:'50px', padding:'7px 18px', marginBottom:'28px',
            }}>
              <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#f0a824', animation:'pulse 2s infinite' }}/>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'13px', fontWeight:500, color:'#f0a824' }}>
                AI-Powered Agricultural Advisory
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontFamily:"'Playfair Display',serif",
              fontSize:'clamp(40px,6vw,80px)', fontWeight:900,
              color:'#fff', lineHeight:1.05, marginBottom:'24px',
            }}>
              किसान AI<br/>
              <span style={{ background:'linear-gradient(135deg,#f0a824,#ffc940)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                स्मार्ट खेती
              </span>
            </h1>

            <p style={{
              fontFamily:"'Noto Sans Devanagari',sans-serif",
              fontSize:'clamp(16px,2vw,20px)', color:'rgba(255,255,255,.75)',
              lineHeight:1.8, marginBottom:'14px', maxWidth:'580px',
            }}>
              AI से फसल चुनें, मंडी भाव जानें, सरकारी योजनाओं का लाभ उठाएं।<br/>
              <span style={{ fontSize:'14px', color:'rgba(255,255,255,.5)' }}>
                Choose crops with AI, know market prices, benefit from government schemes.
              </span>
            </p>

            {/* Voice listen button */}
            {hasTTS && (
              <div style={{ marginBottom:'36px' }}>
                <button onClick={() => speaking ? stopSpeaking() : speak(PAGE_GREETINGS.home[lang])}
                  style={{
                    display:'inline-flex', alignItems:'center', gap:'8px',
                    padding:'8px 20px', borderRadius:'50px',
                    background: speaking ? 'rgba(220,38,38,.2)' : 'rgba(240,168,36,.15)',
                    border: `1px solid ${speaking ? 'rgba(220,38,38,.4)' : 'rgba(240,168,36,.35)'}`,
                    color: speaking ? '#fca5a5' : '#f0a824',
                    fontFamily:"'Noto Sans Devanagari','DM Sans',sans-serif",
                    fontSize:'13px', fontWeight:600, cursor:'pointer',
                  }}>
                  {speaking ? '⏹ रोकें' : '🔊 हिंदी में सुनें (Google TTS)'}
                </button>
              </div>
            )}

            {/* CTAs */}
            <div style={{ display:'flex', gap:'16px', flexWrap:'wrap' }}>
              <Link to="/advisor" className="btn-gold" style={{ fontSize:'16px', padding:'16px 36px' }}>
                🌾 AI फसल सलाह लें
              </Link>
              <Link to="/about" className="btn-primary" style={{ background:'rgba(255,255,255,.12)', border:'2px solid rgba(255,255,255,.25)', boxShadow:'none' }}>
                हमारे बारे में →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background:'linear-gradient(135deg,#082312,#155d2e)', padding:'56px 0' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'20px' }}>
            <StatCard icon="👨‍🌾" value={50000} suffix="+" label="किसानों की मदद / Farmers Helped"/>
            <StatCard icon="🎯" value={95} suffix="%" label="सटीकता / Accuracy Rate"/>
            <StatCard icon="🌾" value={120} suffix="+" label="फसलें / Crops Covered"/>
            <StatCard icon="🗺️" value={28} suffix="" label="राज्य / States Served"/>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'64px' }}>
            <div className="section-label">🌟 Features / विशेषताएँ</div>
            <h2 className="section-title">किसान के लिए सब कुछ</h2>
            <p className="section-sub" style={{ margin:'0 auto', textAlign:'center' }}>
              AI से लेकर सरकारी योजनाओं तक — सब एक जगह
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'24px' }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="card" style={{ animationDelay:`${i*.08}s` }}>
                <div style={{
                  width:'60px', height:'60px', borderRadius:'16px',
                  background:'linear-gradient(135deg,var(--green-pale),rgba(30,150,68,.08))',
                  border:'1px solid rgba(30,150,68,.12)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'28px', marginBottom:'20px',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily:"'Noto Sans Devanagari','Playfair Display',serif", fontSize:'18px', fontWeight:700, color:'var(--green-deep)', marginBottom:'8px' }}>
                  {isHi ? f.title : f.titleEn}
                </h3>
                <p style={{ fontFamily:"'Noto Sans Devanagari','DM Sans',sans-serif", fontSize:'14px', color:'var(--text-mid)', lineHeight:1.8 }}>
                  {isHi ? f.desc : f.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding:'0 32px 96px' }}>
        <div style={{
          background:'linear-gradient(145deg,#082312,#0d3b1f)',
          borderRadius:'28px', padding:'64px 56px',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          gap:'32px', flexWrap:'wrap', position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', right:'-40px', top:'-40px', width:'300px', height:'300px', borderRadius:'50%', background:'rgba(240,168,36,.06)' }}/>
          <div style={{ position:'relative' }}>
            <p style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'13px', color:'rgba(255,255,255,.5)', fontWeight:600, letterSpacing:'2px', textTransform:'uppercase', marginBottom:'10px' }}>
              Ready to grow smarter?
            </p>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(28px,3.5vw,40px)', fontWeight:900, color:'#fff', marginBottom:'10px' }}>
              अभी शुरू करें
            </h2>
            <p style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'16px', color:'rgba(255,255,255,.65)' }}>
              अपनी खेत की जानकारी दें और AI से सलाह पाएं
            </p>
          </div>
          <Link to="/advisor" className="btn-gold" style={{ fontSize:'17px', padding:'18px 40px', flexShrink:0, position:'relative' }}>
            🌾 AI फसल सलाह लें →
          </Link>
        </div>
      </section>
    </>
  )
}
