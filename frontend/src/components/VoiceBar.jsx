// ============================================================
//  VoiceBar.jsx — PREMIUM HINDI VOICE PANEL
//  Uses Google TTS for guaranteed Hindi audio
// ============================================================
import { useState, useEffect } from 'react'
import { useVoice, PAGE_GREETINGS, getMicResponse, hasTTS, hasSTT } from '../hooks/useVoice'

const ANIM = `
@keyframes wv{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}
@keyframes mp{0%{box-shadow:0 0 0 0 rgba(185,28,28,.45)}70%{box-shadow:0 0 0 18px rgba(185,28,28,0)}100%{box-shadow:0 0 0 0 rgba(185,28,28,0)}}
@keyframes pIn{from{opacity:0;transform:translateY(12px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes fIn{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
.vbf{transition:all .22s cubic-bezier(.34,1.56,.64,1)!important}
.vbf:hover{transform:scale(1.12)!important;box-shadow:0 12px 36px rgba(0,0,0,.28)!important}
`

function Wave({ h = 18 }) {
  const heights = [4, 9, 5, 14, 6, 11, 4, 9, 5]
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'2.5px', height:`${h}px` }}>
      {heights.map((ht, i) => (
        <span key={i} style={{
          display:'inline-block', width:'3px', height:`${ht}px`,
          background:'currentColor', borderRadius:'2px',
          animation:`wv ${.4+i*.065}s ease-in-out infinite`,
          animationDelay:`${i*.055}s`,
        }}/>
      ))}
    </span>
  )
}

function Progress({ cur, tot }) {
  if (!tot || tot <= 1) return null
  const pct = Math.min(100, Math.round(cur/tot*100))
  return (
    <div style={{ marginTop:'10px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:'10px', color:'rgba(255,255,255,.55)', marginBottom:'4px' }}>
        <span>📖 {cur} / {tot}</span><span>{pct}%</span>
      </div>
      <div style={{ height:'3px', background:'rgba(255,255,255,.15)', borderRadius:'3px', overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background:'#f0a824', borderRadius:'3px', transition:'width .4s ease' }}/>
      </div>
    </div>
  )
}

export default function VoiceBar({ page='home', lang='hi' }) {
  const { speak, stopSpeaking, speaking, listen, stopListening, listening,
          transcript, currentChunk, totalChunks } = useVoice(lang)
  const [open, setOpen]     = useState(false)
  const [tab, setTab]       = useState('listen')
  const [micText, setMicText] = useState('')
  const [micTip, setMicTip] = useState('')

  useEffect(() => {
    if (!document.getElementById('vb-anim')) {
      const s = document.createElement('style')
      s.id = 'vb-anim'; s.textContent = ANIM
      document.head.appendChild(s)
    }
  }, [])

  useEffect(() => {
    if (open) {
      const txt = PAGE_GREETINGS[page]?.[lang] || ''
      if (txt) setTimeout(() => speak(txt), 500)
    } else {
      stopSpeaking()
    }
  }, [open]) // eslint-disable-line

  useEffect(() => { if (transcript) setMicText(transcript) }, [transcript])

  const handleSpeak = () => {
    if (speaking) { stopSpeaking(); return }
    speak(PAGE_GREETINGS[page]?.[lang] || '')
  }

  const handleMic = () => {
    if (listening) { stopListening(); return }
    setMicText(''); setMicTip(lang==='hi' ? '🎤 बोलिए...' : '🎤 Listening...')
    listen(result => {
      setMicText(result); setMicTip('')
      setTimeout(() => speak(getMicResponse(result, lang)), 300)
    })
  }

  if (!hasTTS && !hasSTT) return null
  const isHi = lang === 'hi'

  return (
    <>
      {/* FAB */}
      <button className="vbf" onClick={() => setOpen(v=>!v)}
        title={isHi?'आवाज़ सहायक':'Voice Assistant'}
        style={{
          position:'fixed', bottom:'32px', right:'32px', zIndex:2000,
          width:'64px', height:'64px', borderRadius:'50%',
          background: open
            ? 'linear-gradient(145deg,#7f1d1d,#dc2626)'
            : 'linear-gradient(145deg,#082312,#1e9644)',
          border:'3px solid rgba(255,255,255,.22)',
          color:'#fff', fontSize:'0px',
          boxShadow: speaking
            ? '0 0 0 8px rgba(30,150,68,.2), 0 10px 32px rgba(0,0,0,.28)'
            : '0 10px 32px rgba(0,0,0,.22)',
          cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          animation:'fIn .35s ease both',
        }}
        aria-label={isHi?'आवाज़ सहायक':'Voice Assistant'}
      >
        <span style={{ fontSize:'26px' }}>
          {open ? '✕' : (speaking ? <Wave h={20}/> : '🎙️')}
        </span>
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          position:'fixed', bottom:'110px', right:'32px', zIndex:1999,
          width:'330px',
          background:'#fff',
          borderRadius:'24px',
          boxShadow:'0 24px 72px rgba(8,35,18,.18), 0 4px 16px rgba(8,35,18,.08)',
          border:'1px solid rgba(8,35,18,.07)',
          overflow:'hidden',
          animation:'pIn .26s cubic-bezier(.22,1,.36,1) both',
        }}>

          {/* Header */}
          <div style={{
            background:'linear-gradient(145deg,#082312,#0d3b1f)',
            padding:'18px 20px 16px',
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'4px' }}>
              <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:'17px', color:'#fff', display:'flex', alignItems:'center', gap:'10px' }}>
                🎙️ {isHi?'आवाज़ सहायक':'Voice Assistant'}
                {speaking && <span style={{ color:'#4db86a' }}><Wave h={14}/></span>}
              </span>
              <span style={{
                fontSize:'10px', fontWeight:700, letterSpacing:'1px',
                padding:'3px 10px', borderRadius:'50px',
                background:'rgba(240,168,36,.18)',
                border:'1px solid rgba(240,168,36,.3)',
                color:'#f0a824',
              }}>
                {isHi?'हिंदी':'EN'}
              </span>
            </div>
            <p style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'11px', color:'rgba(255,255,255,.5)', margin:0 }}>
              {isHi?'Google TTS — असली हिंदी आवाज़':'Google TTS — Real Voice'}
            </p>
            {speaking && <Progress cur={currentChunk} tot={totalChunks}/>}
          </div>

          {/* Tabs */}
          <div style={{ display:'flex', background:'#fafaf5', borderBottom:'1px solid rgba(8,35,18,.07)' }}>
            {[{k:'listen',hi:'🔊 सुनें',en:'🔊 Listen'},{k:'mic',hi:'🎤 बोलें',en:'🎤 Speak'}].map(t=>(
              <button key={t.k} onClick={()=>setTab(t.k)} style={{
                flex:1, padding:'11px 8px', border:'none',
                background: tab===t.k ? '#fff' : 'transparent',
                borderBottom:`2.5px solid ${tab===t.k ? '#1e9644' : 'transparent'}`,
                fontFamily:"'Noto Sans Devanagari','DM Sans',sans-serif",
                fontSize:'13px', fontWeight:tab===t.k?700:400,
                color:tab===t.k?'#082312':'#7a9080',
                cursor:'pointer', transition:'all .15s',
              }}>{isHi?t.hi:t.en}</button>
            ))}
          </div>

          {/* Content */}
          <div style={{ padding:'16px 18px' }}>

            {tab==='listen' && (
              <>
                {/* Main listen button */}
                <button onClick={handleSpeak} style={{
                  width:'100%', padding:'14px',
                  background: speaking
                    ? 'linear-gradient(135deg,#7f1d1d,#dc2626)'
                    : 'linear-gradient(135deg,#082312,#1e9644)',
                  color:'#fff', border:'none', borderRadius:'14px',
                  fontFamily:"'Noto Sans Devanagari','DM Sans',sans-serif",
                  fontSize:'14px', fontWeight:600, cursor:'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                  marginBottom:'12px', transition:'all .2s',
                  boxShadow: speaking ? '0 4px 16px rgba(220,38,38,.3)' : '0 4px 16px rgba(30,150,68,.25)',
                }}>
                  {speaking
                    ? <><Wave h={14}/> {isHi?'⏹ रोकें':'⏹ Stop'}</>
                    : (isHi?'🔊 हिंदी में पेज सुनें (Google TTS)':'🔊 Listen to this page')}
                </button>

                {/* Info box */}
                <div style={{ background:'linear-gradient(135deg,#e6f4eb,#f4efe4)', borderRadius:'12px', padding:'12px 14px', border:'1px solid rgba(30,150,68,.15)' }}>
                  <p style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'12px', fontWeight:700, color:'#155d2e', marginBottom:'8px' }}>
                    {isHi?'📢 सुन सकते हैं:':'📢 You can hear:'}
                  </p>
                  {(isHi
                    ?['✓ पेज की पूरी जानकारी','✓ फसल की सिफारिश','✓ मंडी भाव और मुनाफा','✓ खेती की सलाह']
                    :['✓ Full page summary','✓ Crop recommendations','✓ Market prices & profit','✓ Farming advice']
                  ).map((item,i)=>(
                    <p key={i} style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'12px', color:'#3a4f3d', marginBottom:'3px' }}>{item}</p>
                  ))}
                </div>

                {/* Google TTS note */}
                <div style={{ marginTop:'10px', padding:'8px 12px', background:'#e6f4eb', borderRadius:'8px', border:'1px solid rgba(30,150,68,.2)' }}>
                  <p style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'11px', color:'#155d2e', fontWeight:600 }}>
                    {isHi?'✅ Google TTS का उपयोग — असली हिंदी आवाज़':'✅ Using Google TTS — real Hindi voice'}
                  </p>
                </div>
              </>
            )}

            {tab==='mic' && (
              <>
                {hasSTT ? (
                  <button onClick={handleMic} style={{
                    width:'100%', padding:'14px',
                    background: listening ? '#dc2626' : 'rgba(8,35,18,.06)',
                    color: listening ? '#fff' : '#082312',
                    border: listening ? 'none' : '2px solid rgba(8,35,18,.12)',
                    borderRadius:'14px',
                    fontFamily:"'Noto Sans Devanagari','DM Sans',sans-serif",
                    fontSize:'14px', fontWeight:600, cursor:'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                    marginBottom:'12px', transition:'all .15s',
                    animation: listening?'mp 1.2s infinite':'none',
                  }}>
                    {listening
                      ? (isHi?'⏹ सुन रहा है...':'⏹ Listening...')
                      : (isHi?'🎤 हिंदी में सवाल पूछें':'🎤 Ask a question')}
                  </button>
                ) : (
                  <div style={{ background:'#fef7e6', borderRadius:'12px', padding:'14px', border:'1px solid rgba(201,134,10,.2)', textAlign:'center', marginBottom:'12px' }}>
                    <p style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'12px', color:'#c9860a' }}>
                      {isHi?'⚠️ माइक केवल Chrome/Edge पर काम करता है':'⚠️ Mic only works on Chrome/Edge'}
                    </p>
                  </div>
                )}

                {(micText||micTip) && (
                  <div style={{ background:'#e6f4eb', border:'1px solid rgba(30,150,68,.25)', borderRadius:'12px', padding:'11px 14px', marginBottom:'12px' }}>
                    {micTip && <p style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'12px', color:'#7a9080', fontStyle:'italic' }}>{micTip}</p>}
                    {micText && <p style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'13px', color:'#155d2e', lineHeight:1.6 }}>{micText}</p>}
                  </div>
                )}

                <div style={{ background:'#fef7e6', borderRadius:'12px', padding:'12px 14px', border:'1px solid rgba(201,134,10,.15)' }}>
                  <p style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'12px', color:'#c9860a', fontWeight:700, marginBottom:'8px' }}>
                    {isHi?'💡 ऐसे बोलें:':'💡 Try saying:'}
                  </p>
                  {(isHi
                    ?['"फसल क्या बोएं?"','"मौसम कैसा है?"','"मंडी भाव बताओ"','"सरकारी योजनाएँ"']
                    :['"What crop should I sow?"','"How\'s the weather?"','"Market prices"']
                  ).map((q,i)=>(
                    <p key={i} style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'12px', color:'#6b4226', marginBottom:'3px' }}>▶ {q}</p>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div style={{ borderTop:'1px solid rgba(8,35,18,.07)', padding:'9px 18px', background:'#fafaf5' }}>
            <p style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'10.5px', color:'#7a9080', textAlign:'center' }}>
              {isHi?'Chrome / Android पर सबसे अच्छा काम करता है':'Works best on Chrome or Android'}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
