// ============================================================
//  src/pages/Contact.jsx  –  Contact page with form
// ============================================================
import { useState } from 'react'
import { Link } from 'react-router-dom'

/* ── Info card ───────────────────────────────────────────────── */
function InfoCard({ icon, title, lines, link, linkLabel }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff',
        borderRadius: '18px',
        padding: '26px 24px',
        boxShadow: hov ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        border: `1px solid ${hov ? 'rgba(46,168,79,.2)' : 'rgba(0,0,0,.05)'}`,
        transform: hov ? 'translateY(-4px)' : 'none',
        transition: 'all .22s ease',
      }}
    >
      <div style={{
        width:'50px', height:'50px',
        background:'linear-gradient(135deg,rgba(46,168,79,.12),rgba(26,107,53,.06))',
        borderRadius:'13px',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:'24px', marginBottom:'16px',
        border:'1px solid rgba(46,168,79,.12)',
      }}>{icon}</div>
      <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:'15px', color:'var(--green-deep)', marginBottom:'10px' }}>{title}</h3>
      {lines.map(l => (
        <p key={l} style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'13px', color:'var(--text-mid)', lineHeight:1.8 }}>{l}</p>
      ))}
      {link && (
        <a href={link} style={{
          display:'inline-flex', alignItems:'center', gap:'5px',
          marginTop:'12px', fontSize:'13px', fontWeight:600,
          color:'var(--green-bright)', transition:'color .15s',
        }}
          onMouseEnter={e => e.target.style.color='var(--green-deep)'}
          onMouseLeave={e => e.target.style.color='var(--green-bright)'}
        >{linkLabel} →</a>
      )}
    </div>
  )
}

/* ── FAQ item ─────────────────────────────────────────────────── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      background: '#fff',
      borderRadius: '14px',
      border: `1px solid ${open ? 'rgba(46,168,79,.25)' : 'rgba(0,0,0,.06)'}`,
      overflow:'hidden',
      transition:'border-color .2s',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width:'100%', background:'none', border:'none', padding:'18px 22px',
          display:'flex', justifyContent:'space-between', alignItems:'center', gap:'12px',
          cursor:'pointer', textAlign:'left',
        }}
      >
        <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:'15px', color:'var(--green-deep)' }}>{q}</span>
        <span style={{
          flexShrink:0, width:'28px', height:'28px',
          background: open ? 'var(--green-bright)' : 'var(--cream-dark)',
          borderRadius:'50%',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'16px', color: open ? '#fff' : 'var(--text-mid)',
          transition:'all .2s', fontWeight:700,
        }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div style={{
          padding:'0 22px 18px',
          fontFamily:"'Noto Sans Devanagari',sans-serif",
          fontSize:'14px', lineHeight:1.8, color:'var(--text-mid)',
          animation:'slideUp .2s ease both',
        }}>{a}</div>
      )}
    </div>
  )
}

/* ── CONTACT PAGE ────────────────────────────────────────────── */
export default function Contact() {
  const [form, setForm] = useState({ name:'', phone:'', email:'', subject:'', message:'', lang:'hi' })
  const [errors, setErrors]   = useState({})
  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'नाम जरूरी है / Name is required'
    if (!form.message.trim()) e.message = 'संदेश जरूरी है / Message is required'
    if (!form.subject)        e.subject = 'विषय चुनें / Select subject'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'सही email डालें'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSending(true)
    // Simulate API call (replace with real POST /api/contact)
    await new Promise(r => setTimeout(r, 1600))
    setSending(false)
    setSent(true)
  }

  const INPUT = (id, placeholder, type='text', opts={}) => (
    <div className="field">
      <input
        type={type}
        id={id}
        value={form[id]}
        onChange={e => set(id, e.target.value)}
        placeholder={placeholder}
        {...opts}
        style={{
          ...(errors[id] ? { borderColor:'var(--red)', boxShadow:'0 0 0 3px rgba(192,57,43,.1)' } : {}),
        }}
      />
      {errors[id] && (
        <span style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'12px', color:'var(--red)', marginTop:'2px' }}>
          {errors[id]}
        </span>
      )}
    </div>
  )

  return (
    <>
      {/* ════ HERO ════ */}
      <section style={{
        background:'linear-gradient(145deg,#0a3d1f 0%,#1a6b35 60%,#0d5228 100%)',
        padding:'90px 28px 80px',
        position:'relative', overflow:'hidden',
      }}>
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          background:'radial-gradient(ellipse 55% 55% at 90% 30%, rgba(232,166,21,.1) 0%, transparent 60%)',
        }}/>
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div className="section-label" style={{ color:'var(--gold-light)' }}>✦ REACH US</div>
          <h1 style={{
            fontFamily:"'Syne',sans-serif",
            fontSize:'clamp(34px,6vw,60px)',
            fontWeight:800, color:'#fff',
            lineHeight:1.1, marginBottom:'18px', maxWidth:'600px',
          }}>
            हम यहाँ हैं —<br/>
            <span style={{ color:'var(--gold-light)' }}>बात करें हमसे</span>
          </h1>
          <p style={{
            fontFamily:"'Noto Sans Devanagari',sans-serif",
            fontSize:'17px', color:'rgba(255,255,255,.7)',
            lineHeight:1.75, maxWidth:'480px',
          }}>
            कोई सवाल, सुझाव या partnership? हमारी टीम हर किसान की
            मदद के लिए हमेशा तैयार है।
          </p>
        </div>
      </section>

      {/* ════ CONTACT CARDS ════ */}
      <section style={{ padding:'56px 28px 0' }}>
        <div className="container">
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',
            gap:'18px',
          }}>
            <InfoCard
              icon="📞" title="Toll-Free Helpline"
              lines={['1800-XXX-XXXX', 'सोम–शनि, सुबह 9 बजे – शाम 6 बजे', '(Monday–Saturday, 9am–6pm IST)']}
            />
            <InfoCard
              icon="📧" title="Email Support"
              lines={['support@kisanai.in', 'General enquiries & partnerships']}
              link="mailto:support@kisanai.in" linkLabel="Email us"
            />
            <InfoCard
              icon="📍" title="Head Office"
              lines={['Kisan AI Technologies Pvt. Ltd.', 'Sector-62, Noida, UP 201309', 'India']}
            />
            <InfoCard
              icon="💬" title="WhatsApp (Beta)"
              lines={['+91 98765 XXXXX', 'Quick queries — Hindi only', '(Beta — limited availability)']}
              link="https://wa.me/91987650000" linkLabel="Message us"
            />
          </div>
        </div>
      </section>

      {/* ════ FORM + FAQ ════ */}
      <section className="section">
        <div className="container">
          <div style={{
            display:'grid', gridTemplateColumns:'1fr 1fr',
            gap:'56px', alignItems:'start',
          }} className="contact-grid">

            {/* ── Contact Form ── */}
            <div>
              <div className="section-label">✦ WRITE TO US</div>
              <h2 className="section-title" style={{ marginBottom:'8px' }}>संदेश भेजें</h2>
              <p style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'14px', color:'var(--text-mid)', marginBottom:'32px' }}>
                हम 24 घंटे में जवाब देंगे।
              </p>

              {sent ? (
                <div style={{
                  background:'linear-gradient(135deg,#e8f5e9,#f1f8e9)',
                  border:'1px solid rgba(46,168,79,.3)',
                  borderRadius:'18px', padding:'40px 32px', textAlign:'center',
                  animation:'slideUp .4s ease both',
                }}>
                  <div style={{ fontSize:'52px', marginBottom:'16px' }}>✅</div>
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:'20px', color:'var(--green-deep)', marginBottom:'10px' }}>
                    संदेश भेजा गया!
                  </h3>
                  <p style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'14px', color:'var(--text-mid)', lineHeight:1.75 }}>
                    धन्यवाद <strong>{form.name}</strong>! हम जल्द ही संपर्क करेंगे।
                    इस बीच हमारा AI Advisor जरूर आजमाएं।
                  </p>
                  <Link to="/advisor" className="btn-primary" style={{ marginTop:'20px', display:'inline-flex' }}>
                    🤖 AI Advisor Try करें
                  </Link>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                  {/* Name + Phone row */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
                    {INPUT('name',  'आपका नाम / Your name *')}
                    {INPUT('phone', 'मोबाइल नंबर',  'tel', { maxLength:10 })}
                  </div>

                  {INPUT('email', 'Email (optional)', 'email')}

                  {/* Subject select */}
                  <div className="field">
                    <select
                      value={form.subject}
                      onChange={e => set('subject', e.target.value)}
                      style={{ ...(errors.subject ? { borderColor:'var(--red)' } : {}) }}
                    >
                      <option value="">-- विषय चुनें / Select subject --</option>
                      <option value="technical">🔧 Technical Issue</option>
                      <option value="crop">🌾 Crop Recommendation Help</option>
                      <option value="loan">🏦 Bank Loan Report</option>
                      <option value="partnership">🤝 Partnership / Business</option>
                      <option value="feedback">💬 Feedback / Suggestion</option>
                      <option value="other">📝 Other</option>
                    </select>
                    {errors.subject && <span style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'12px', color:'var(--red)' }}>{errors.subject}</span>}
                  </div>

                  {/* Language preference */}
                  <div className="field">
                    <label style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'12px', fontWeight:700, color:'var(--text-mid)', textTransform:'uppercase', letterSpacing:'.5px' }}>
                      भाषा प्राथमिकता / Language Preference
                    </label>
                    <div style={{ display:'flex', gap:'10px' }}>
                      {[['hi','हिंदी'], ['en','English']].map(([val, lbl]) => (
                        <button
                          key={val}
                          onClick={() => set('lang', val)}
                          style={{
                            flex:1, padding:'10px',
                            borderRadius:'10px',
                            border:`2px solid ${form.lang===val ? 'var(--green-bright)' : '#e4e4d8'}`,
                            background: form.lang===val ? 'rgba(46,168,79,.08)' : '#fafaf5',
                            fontFamily:"'Noto Sans Devanagari','DM Sans',sans-serif",
                            fontSize:'14px', fontWeight: form.lang===val ? 700 : 400,
                            color: form.lang===val ? 'var(--green-deep)' : 'var(--text-mid)',
                            cursor:'pointer', transition:'all .15s',
                          }}
                        >{lbl}</button>
                      ))}
                    </div>
                  </div>

                  {/* Message textarea */}
                  <div className="field">
                    <textarea
                      value={form.message}
                      onChange={e => set('message', e.target.value)}
                      placeholder="आपका संदेश यहाँ लिखें... / Write your message here... *"
                      rows={5}
                      style={{
                        padding:'13px 16px',
                        border:`2px solid ${errors.message ? 'var(--red)' : '#e4e4d8'}`,
                        borderRadius:'var(--radius-sm)',
                        fontSize:'14px',
                        fontFamily:"'Noto Sans Devanagari','DM Sans',sans-serif",
                        color:'var(--text-dark)',
                        background:'#fafaf5',
                        outline:'none',
                        resize:'vertical',
                        width:'100%',
                        transition:'border-color .2s, box-shadow .2s',
                        lineHeight:1.7,
                      }}
                      onFocus={e => { e.target.style.borderColor='var(--green-bright)'; e.target.style.boxShadow='0 0 0 3px rgba(46,168,79,.12)'; e.target.style.background='#fff' }}
                      onBlur={e  => { e.target.style.borderColor=errors.message?'var(--red)':'#e4e4d8'; e.target.style.boxShadow='none'; e.target.style.background='#fafaf5' }}
                    />
                    {errors.message && <span style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'12px', color:'var(--red)' }}>{errors.message}</span>}
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={sending}
                    className="btn-primary"
                    style={{
                      width:'100%', padding:'16px',
                      fontSize:'15px', borderRadius:'var(--radius-sm)',
                      opacity: sending ? .7 : 1,
                      cursor: sending ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {sending ? (
                      <><span style={{ width:'18px',height:'18px',border:'3px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 1s linear infinite',display:'inline-block' }} /> भेजा जा रहा है...</>
                    ) : '📤 संदेश भेजें'}
                  </button>

                  <p style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'12px', color:'var(--text-light)', textAlign:'center' }}>
                    🔒 आपकी जानकारी सुरक्षित है — हम spam नहीं करते
                  </p>
                </div>
              )}
            </div>

            {/* ── FAQ ── */}
            <div>
              <div className="section-label">✦ QUICK ANSWERS</div>
              <h2 className="section-title" style={{ marginBottom:'8px' }}>अक्सर पूछे जाने वाले सवाल</h2>
              <p style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'14px', color:'var(--text-mid)', marginBottom:'28px' }}>
                यहाँ आपको जवाब मिल सकता है।
              </p>

              <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                {[
                  {
                    q: 'क्या किसान AI बिल्कुल मुफ्त है?',
                    a: 'हाँ! किसान AI की सभी सुविधाएँ — AI फसल सुझाव, मंडी भाव, कैलेंडर और PDF रिपोर्ट — सब 100% मुफ्त हैं। कोई subscription या hidden charge नहीं।',
                  },
                  {
                    q: 'क्या यह हिंदी में काम करता है?',
                    a: 'बिल्कुल! किसान AI पूरी तरह हिंदी में काम करता है — input, output और रिपोर्ट सब Devanagari में। भविष्य में 15+ क्षेत्रीय भाषाएँ जोड़ी जाएंगी।',
                  },
                  {
                    q: 'AI की सलाह कितनी सटीक है?',
                    a: 'हमारे beta testing में 94% किसानों ने सलाह को "सटीक" या "बहुत सटीक" माना। सलाह Gemini AI, live weather और CACP के MSP डेटा पर आधारित है।',
                  },
                  {
                    q: 'बैंक लोन के लिए PDF रिपोर्ट कैसे बनती है?',
                    a: 'AI सलाह मिलने के बाद "PDF रिपोर्ट प्रिंट करें" बटन दबाएं। रिपोर्ट में फसल, उपज अनुमान, आय अनुमान और KCC जानकारी होती है।',
                  },
                  {
                    q: 'क्या इंटरनेट जरूरी है?',
                    a: 'AI सलाह के लिए इंटरनेट जरूरी है (Gemini + weather API)। हम offline mode पर काम कर रहे हैं जो 2025 में आएगा।',
                  },
                  {
                    q: 'मेरी जानकारी सुरक्षित है?',
                    a: 'हाँ। आपका डेटा किसी तीसरे पक्ष को नहीं दिया जाता। हम किसी भी personally identifiable information को store नहीं करते।',
                  },
                ].map(f => <FaqItem key={f.q} {...f} />)}
              </div>

              {/* Gov links */}
              <div style={{
                marginTop:'28px',
                background:'var(--gold-pale)',
                border:'1px solid rgba(232,166,21,.25)',
                borderRadius:'16px', padding:'22px',
              }}>
                <h4 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:'14px', color:'var(--green-deep)', marginBottom:'14px' }}>
                  🏛️ Useful Government Links
                </h4>
                {[
                  ['https://pmkisan.gov.in',          'PM-KISAN Portal'],
                  ['https://pmfby.gov.in',             'PMFBY Crop Insurance'],
                  ['https://agricoop.gov.in',          'Agriculture Ministry'],
                  ['https://mkisan.gov.in',            'mKisan Portal'],
                  ['https://soilhealth.dac.gov.in',   'Soil Health Card'],
                ].map(([href, label]) => (
                  <a key={href} href={href} target="_blank" rel="noopener" style={{
                    display:'flex', justifyContent:'space-between',
                    padding:'8px 0',
                    fontFamily:"'DM Sans',sans-serif", fontSize:'13px',
                    color:'var(--green-mid)', fontWeight:500,
                    borderBottom:'1px solid rgba(232,166,21,.15)',
                    transition:'color .15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color='var(--green-deep)'}
                    onMouseLeave={e => e.currentTarget.style.color='var(--green-mid)'}
                  >
                    <span>{label}</span>
                    <span>↗</span>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
        <style>{`@media(max-width:768px){.contact-grid{grid-template-columns:1fr !important;}}`}</style>
      </section>

      {/* ════ MAP placeholder ════ */}
      <section style={{ padding:'0 0 80px' }}>
        <div className="container">
          <div style={{
            background:'linear-gradient(135deg,var(--cream-dark),#e8f5e9)',
            borderRadius:'24px',
            padding:'48px 32px',
            textAlign:'center',
            border:'1px solid rgba(46,168,79,.12)',
          }}>
            <div style={{ fontSize:'48px', marginBottom:'16px' }}>📍</div>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:'18px', color:'var(--green-deep)', marginBottom:'8px' }}>
              Sector-62, Noida, Uttar Pradesh
            </h3>
            <p style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'14px', color:'var(--text-mid)', marginBottom:'20px' }}>
              Kisan AI Technologies Pvt. Ltd. · PIN 201309
            </p>
            <a
              href="https://maps.google.com/?q=Sector+62+Noida+Uttar+Pradesh"
              target="_blank" rel="noopener"
              className="btn-primary"
              style={{ display:'inline-flex', padding:'12px 28px', fontSize:'14px' }}
            >
              🗺️ Google Maps पर देखें
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
