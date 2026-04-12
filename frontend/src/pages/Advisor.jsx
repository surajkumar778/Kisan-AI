// ============================================================
//  frontend/src/pages/Advisor.jsx
//  AI Crop Recommendation — calls Express backend at /api/recommend
//  Includes: full results rendering + PDF download + print report
// ============================================================
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useVoice, buildVoiceSummary, buildDetailedVoiceSummary, buildSectionVoice, hasTTS } from '../hooks/useVoice'

// ── Constants ─────────────────────────────────────────────────
const SOIL_OPTIONS = [
  { value: 'alluvial',      label: 'जलोढ़ / Alluvial'         },
  { value: 'black cotton',  label: 'काली / Black Cotton'       },
  { value: 'red laterite',  label: 'लाल / Red Laterite'        },
  { value: 'sandy loam',    label: 'बलुई दोमट / Sandy Loam'   },
  { value: 'clay loam',     label: 'चिकनी दोमट / Clay Loam'   },
  { value: 'saline',        label: 'लवणीय / Saline'            },
  { value: 'acidic',        label: 'अम्लीय / Acidic'           },
]
const SEASON_OPTIONS = [
  { value: 'Kharif (June-November)', label: 'खरीफ (जून–नवम्बर)'   },
  { value: 'Rabi (November-April)',  label: 'रबी (नवम्बर–अप्रैल)' },
  { value: 'Zaid (March-June)',      label: 'जायद (मार्च–जून)'    },
]
const WATER_OPTIONS = [
  { value: 'high - canal/tubewell available', label: 'अधिक – नहर / नलकूप'      },
  { value: 'medium - seasonal irrigation',   label: 'मध्यम – मौसमी सिंचाई'     },
  { value: 'low - rain-fed only',            label: 'कम – केवल वर्षा'           },
  { value: 'drip irrigation available',      label: 'ड्रिप सिंचाई उपलब्ध'       },
]
const TREND_COLOR  = { rising: '#2e7d32', falling: '#c0392b', stable: '#f57c00', volatile: '#1565c0' }
const TREND_LABEL  = { rising: '↑ बढ़त', falling: '↓ गिरावट', stable: '→ स्थिर', volatile: '↕ अस्थिर' }
const RANK_LABELS  = ['🥇 पहली पसंद', '🥈 दूसरी पसंद', '🥉 तीसरी पसंद']
const SCHEME_ICONS = ['🌾', '💳', '🛡️', '💊', '🏦']

// ═════════════════════════════════════════════════════════════
//  CROP CARD
// ═════════════════════════════════════════════════════════════
function CropCard({ crop, rank }) {
  const [hov, setHov] = useState(false)
  const price = crop.mandiPrice || {}
  const trend = price.trend || 'stable'

  return (
    <div
      className="print-section"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff', borderRadius: '20px', overflow: 'hidden',
        boxShadow:  hov ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        border:     `1px solid ${hov ? 'rgba(46,168,79,.2)' : 'rgba(0,0,0,.05)'}`,
        transform:  hov ? 'translateY(-5px)' : 'none',
        transition: 'all .25s ease',
        animation:  `slideUp .5s ease ${rank * 0.1}s both`,
      }}
    >
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,#0a3d1f,#1a6b35)',
        padding: '20px 22px 16px', position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          background: 'var(--gold)', color: 'var(--green-deep)',
          fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '50px',
        }}>{RANK_LABELS[rank]}</div>

        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '22px', fontWeight: 800, color: '#fff' }}>
          {crop.name}
        </div>
        {crop.nameHindi && crop.nameHindi !== crop.name && (
          <div style={{ fontFamily: "'Noto Sans Devanagari',sans-serif", fontSize: '13px', color: 'rgba(255,255,255,.6)', marginTop: '2px' }}>
            {crop.nameHindi}
          </div>
        )}

        <div style={{ marginTop: '12px', height: '5px', background: 'rgba(255,255,255,.2)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${crop.suitabilityScore || 80}%`, background: 'var(--gold-light)', borderRadius: '3px' }} />
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.6)', marginTop: '4px' }}>
          अनुकूलता: {crop.suitabilityScore || '–'}%
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 22px' }}>
        {/* Stats 2x2 grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
          {[
            ['🌾 उपज/एकड़', crop.estimatedYield],
            ['📆 अवधि',     crop.growingDuration],
            ['💧 पानी',     crop.waterRequirement],
            ['💰 लाभ',      crop.profitPotential],
          ].map(([label, val]) => (
            <div key={label} style={{ background: 'var(--cream)', padding: '9px 11px', borderRadius: '9px' }}>
              <div style={{ fontFamily: "'Noto Sans Devanagari',sans-serif", fontSize: '11px', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>{label}</div>
              <div style={{ fontFamily: "'Noto Sans Devanagari',sans-serif", fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', marginTop: '2px' }}>{val || '–'}</div>
            </div>
          ))}
        </div>

        {/* Mandi price */}
        <div style={{
          background: 'linear-gradient(135deg,#fff8e1,#fff3cd)',
          border: '1px solid #f5c842', borderRadius: '10px',
          padding: '11px 14px', marginBottom: '12px',
        }}>
          <div style={{ fontFamily: "'Noto Sans Devanagari',sans-serif", fontSize: '11px', color: 'var(--earth)', fontWeight: 700, marginBottom: '4px' }}>
            📈 मंडी भाव पूर्वानुमान
          </div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '17px', fontWeight: 800, color: 'var(--green-deep)' }}>
            ₹{price.min || '–'}–{price.max || '–'}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-mid)', marginLeft: '4px' }}>{price.unit || '/quintal'}</span>
          <span style={{ fontSize: '12px', fontWeight: 700, marginLeft: '8px', color: TREND_COLOR[trend] }}>
            {TREND_LABEL[trend]}
          </span>
          {price.msp && (
            <div style={{ fontFamily: "'Noto Sans Devanagari',sans-serif", fontSize: '11px', color: '#666', marginTop: '2px' }}>
              MSP: ₹{price.msp}/quintal
            </div>
          )}
        </div>

        <p style={{ fontFamily: "'Noto Sans Devanagari',sans-serif", fontSize: '13px', lineHeight: 1.75, color: 'var(--text-mid)', marginBottom: '10px' }}>
          {crop.whyRecommended}
        </p>

        {crop.risks && (
          <div style={{
            background: '#fff5f5', borderLeft: '3px solid var(--red)',
            padding: '7px 11px', borderRadius: '4px',
            fontFamily: "'Noto Sans Devanagari',sans-serif", fontSize: '12px', color: 'var(--red)',
          }}>
            ⚠️ {crop.risks}
          </div>
        )}
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
//  PDF GENERATOR
// ═════════════════════════════════════════════════════════════
function generatePDF(data, lang) {
  const rec     = data.recommendations
  const weather = data.weather
  const input   = data.inputData
  const date    = new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8" />
<title>किसान AI — फसल सलाह रिपोर्ट</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700;900&family=Syne:wght@700;800&display=swap" rel="stylesheet"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Noto Sans Devanagari', sans-serif; background: #fdf8ee; color: #111810; font-size: 13px; line-height: 1.65; }
  .page { max-width: 900px; margin: 0 auto; padding: 0; }
  .header { background: linear-gradient(135deg,#0a3d1f,#1a6b35); color:#fff; padding:32px 40px; display:flex; justify-content:space-between; align-items:center; }
  .header h1 { font-family:'Syne',sans-serif; font-size:28px; font-weight:800; }
  .header .sub { font-size:13px; opacity:.75; margin-top:4px; }
  .header .date { text-align:right; font-size:12px; opacity:.7; }
  .header .badge { background:#e8a615; color:#0a3d1f; padding:5px 14px; border-radius:50px; font-weight:700; font-size:11px; margin-top:8px; display:inline-block; }
  .section { padding:24px 40px; border-bottom:1px solid #e4e4d8; }
  .section:last-child { border-bottom:none; }
  .section-title { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; color:#0a3d1f; margin-bottom:14px; padding-bottom:6px; border-bottom:2px solid #6fcf8a; }
  .info-table { width:100%; border-collapse:collapse; }
  .info-table td { padding:6px 12px; border:1px solid #e4e4d8; font-size:13px; }
  .info-table td:first-child { background:#f5edd8; font-weight:600; width:35%; }
  .weather-strip { display:flex; gap:24px; background:#e3f2fd; border:1px solid #90caf9; border-radius:10px; padding:14px 20px; flex-wrap:wrap; margin-bottom:16px; }
  .weather-item .val { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; color:#1565c0; }
  .weather-item .lbl { font-size:11px; color:#5c7fa3; }
  .revenue { background:linear-gradient(135deg,#0a3d1f,#1a6b35); color:#fff; border-radius:12px; padding:24px; text-align:center; margin-bottom:20px; }
  .revenue h3 { font-size:13px; opacity:.75; margin-bottom:6px; }
  .revenue .amount { font-family:'Syne',sans-serif; font-size:36px; font-weight:900; color:#f5c842; }
  .revenue .sub { font-size:11px; opacity:.65; margin-top:4px; }
  .crop-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
  .crop-card { border:1px solid #e4e4d8; border-radius:12px; overflow:hidden; }
  .crop-head { background:linear-gradient(135deg,#0a3d1f,#1a6b35); color:#fff; padding:14px 16px; }
  .crop-head .rank { background:#e8a615; color:#0a3d1f; font-size:10px; font-weight:700; padding:3px 8px; border-radius:50px; display:inline-block; margin-bottom:6px; }
  .crop-head .name { font-family:'Syne',sans-serif; font-size:18px; font-weight:800; }
  .crop-head .score-bar { height:4px; background:rgba(255,255,255,.2); border-radius:2px; margin-top:8px; overflow:hidden; }
  .crop-head .score-fill { height:100%; background:#f5c842; border-radius:2px; }
  .crop-body { padding:12px 14px; }
  .stat-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:10px; }
  .stat { background:#f5edd8; padding:6px 8px; border-radius:6px; }
  .stat .sl { font-size:10px; color:#8a9280; font-weight:600; text-transform:uppercase; }
  .stat .sv { font-size:12px; font-weight:700; color:#111810; margin-top:1px; }
  .mandi { background:#fff8e1; border:1px solid #f5c842; border-radius:8px; padding:8px 10px; margin-bottom:8px; }
  .mandi .mt { font-size:10px; color:#7a4f2d; font-weight:700; }
  .mandi .mp { font-size:15px; font-weight:800; color:#0a3d1f; }
  .mandi .msp { font-size:10px; color:#666; margin-top:1px; }
  .why { font-size:11px; color:#4a5240; line-height:1.65; margin-bottom:6px; }
  .risk { font-size:11px; color:#c0392b; background:#fff5f5; border-left:2px solid #c0392b; padding:5px 8px; border-radius:3px; }
  .cal-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
  .cal-item { background:#fff; border:1px solid #e4e4d8; border-top:3px solid #2ea84f; border-radius:8px; padding:10px; text-align:center; }
  .cal-icon { font-size:20px; margin-bottom:4px; }
  .cal-month { font-family:'Syne',sans-serif; font-size:12px; font-weight:700; color:#0a3d1f; margin-bottom:2px; }
  .cal-act { font-size:10px; color:#4a5240; line-height:1.5; }
  .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .info-card { background:#fff; border:1px solid #e4e4d8; border-radius:10px; padding:14px; }
  .info-card h4 { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; color:#0a3d1f; margin-bottom:6px; }
  .info-card p { font-size:12px; color:#4a5240; line-height:1.7; }
  .scheme-item { display:flex; gap:12px; align-items:flex-start; padding:10px 12px; background:#fff; border:1px solid #e4e4d8; border-left:3px solid #e8a615; border-radius:8px; margin-bottom:8px; }
  .scheme-name { font-weight:700; font-size:13px; color:#0a3d1f; }
  .scheme-ben  { font-size:11px; color:#4a5240; margin-top:2px; }
  .scheme-link { margin-left:auto; font-size:11px; color:#1565c0; font-weight:600; white-space:nowrap; }
  .loan-card { background:#fff; border:1px solid #90caf9; border-radius:10px; padding:16px; }
  .loan-card h4 { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; color:#1565c0; margin-bottom:8px; }
  .loan-card p { font-size:12px; color:#4a5240; line-height:1.75; }
  .bank-note { background:#f5edd8; border:1px solid #e8a615; border-radius:10px; padding:16px 20px; margin-top:16px; font-size:11px; color:#4a5240; }
  .bank-note strong { color:#0a3d1f; }
  .report-footer { background:#0a3d1f; color:rgba(255,255,255,.7); padding:20px 40px; display:flex; justify-content:space-between; font-size:11px; }
  @media print { body { background:#fff; } .section { page-break-inside: avoid; } .crop-grid { page-break-inside: avoid; } }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div>
      <h1>🌾 किसान AI — फसल सलाह रिपोर्ट</h1>
      <div class="sub">AI-Powered Crop Recommendation Report</div>
      <div class="badge">🏦 Bank Loan Ready Document</div>
    </div>
    <div class="date">
      <div>${date}</div>
      <div style="margin-top:4px">रिपोर्ट ID: KAI-${Date.now().toString(36).toUpperCase()}</div>
      <div style="margin-top:4px">Generated by Gemini AI</div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">📋 किसान और खेत की जानकारी</div>
    <table class="info-table">
      <tr><td>स्थान / Location</td><td>${input.location}</td></tr>
      <tr><td>मिट्टी का प्रकार / Soil Type</td><td>${input.soilType}</td></tr>
      <tr><td>मौसम / Season</td><td>${input.season}</td></tr>
      <tr><td>पानी / Water Availability</td><td>${input.waterAvailability}</td></tr>
      <tr><td>खेत का आकार / Farm Size</td><td>${input.farmSize ? input.farmSize + ' acres' : 'Not specified'}</td></tr>
      <tr><td>रिपोर्ट भाषा / Language</td><td>${input.language === 'hi' ? 'हिंदी' : 'English'}</td></tr>
    </table>
  </div>
  <div class="section">
    <div class="section-title">🌤️ वर्तमान मौसम — ${weather.city}</div>
    <div class="weather-strip">
      <div class="weather-item"><div class="val">🌡️ ${weather.temperature}°C</div><div class="lbl">तापमान</div></div>
      <div class="weather-item"><div class="val">💧 ${weather.humidity}%</div><div class="lbl">नमी</div></div>
      <div class="weather-item"><div class="val">🌬️ ${weather.windSpeed} km/h</div><div class="lbl">हवा</div></div>
      <div class="weather-item"><div class="val">☁️ ${weather.description}</div><div class="lbl">स्थिति</div></div>
    </div>
    ${rec.weatherAlert ? `<div style="background:#fff3e0;border:1px solid #ffcc02;border-radius:8px;padding:10px 14px;font-size:12px;color:#e65100;">⚠️ ${rec.weatherAlert}</div>` : ''}
  </div>
  <div class="section">
    <div class="revenue">
      <h3>अनुमानित आय / Estimated Revenue</h3>
      <div class="amount">${rec.expectedRevenue || '₹40,000–₹80,000'}</div>
      <div class="sub">प्रति एकड़ प्रति सीजन / per acre per season</div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">🌱 शीर्ष 3 अनुशंसित फसलें</div>
    <div class="crop-grid">
      ${(rec.topCrops || []).map((crop, i) => {
        const p = crop.mandiPrice || {}
        const trend = p.trend || 'stable'
        const trendColors = { rising:'#2e7d32', falling:'#c0392b', stable:'#f57c00', volatile:'#1565c0' }
        const trendLabels = { rising:'↑ बढ़त', falling:'↓ गिरावट', stable:'→ स्थिर', volatile:'↕ अस्थिर' }
        return `
        <div class="crop-card">
          <div class="crop-head">
            <div class="rank">${['🥇 पहली पसंद','🥈 दूसरी पसंद','🥉 तीसरी पसंद'][i]}</div>
            <div class="name">${crop.name || ''}</div>
            ${crop.nameHindi && crop.nameHindi !== crop.name ? `<div style="font-size:11px;opacity:.6;margin-top:1px">${crop.nameHindi}</div>` : ''}
            <div class="score-bar"><div class="score-fill" style="width:${crop.suitabilityScore||80}%"></div></div>
            <div style="font-size:10px;opacity:.6;margin-top:3px">अनुकूलता: ${crop.suitabilityScore||'–'}%</div>
          </div>
          <div class="crop-body">
            <div class="stat-grid">
              <div class="stat"><div class="sl">🌾 उपज/एकड़</div><div class="sv">${crop.estimatedYield||'–'}</div></div>
              <div class="stat"><div class="sl">📆 अवधि</div><div class="sv">${crop.growingDuration||'–'}</div></div>
              <div class="stat"><div class="sl">💧 पानी</div><div class="sv">${crop.waterRequirement||'–'}</div></div>
              <div class="stat"><div class="sl">💰 लाभ</div><div class="sv">${crop.profitPotential||'–'}</div></div>
            </div>
            <div class="mandi">
              <div class="mt">📈 मंडी भाव पूर्वानुमान</div>
              <span class="mp">₹${p.min||'–'}–${p.max||'–'} <span style="font-size:10px;font-weight:400">${p.unit||'/qtl'}</span></span>
              <span style="font-size:11px;font-weight:700;color:${trendColors[trend]};margin-left:6px">${trendLabels[trend]}</span>
              ${p.msp ? `<div class="msp">MSP: ₹${p.msp}/quintal</div>` : ''}
            </div>
            <div class="why">${crop.whyRecommended||''}</div>
            ${crop.risks ? `<div class="risk">⚠️ ${crop.risks}</div>` : ''}
          </div>
        </div>`
      }).join('')}
    </div>
  </div>
  ${rec.farmingCalendar?.length ? `
  <div class="section">
    <div class="section-title">📅 मौसमी खेती कैलेंडर</div>
    <div class="cal-grid">
      ${rec.farmingCalendar.map(c => `
        <div class="cal-item">
          <div class="cal-icon">${c.icon||'📅'}</div>
          <div class="cal-month">${c.month}</div>
          <div class="cal-act">${c.activity}</div>
        </div>`).join('')}
    </div>
  </div>` : ''}
  <div class="section">
    <div class="section-title">🧪 खेती सलाह</div>
    <div class="info-grid">
      ${[
        ['🪱 मिट्टी तैयारी', rec.soilPreparation],
        ['💧 सिंचाई सलाह', rec.irrigationAdvice],
        ['🧪 उर्वरक अनुसूची', rec.fertilizerSchedule],
        ['🐛 कीट प्रबंधन', rec.pestManagement],
      ].filter(([,t]) => t).map(([title, text]) =>
        `<div class="info-card"><h4>${title}</h4><p>${text}</p></div>`
      ).join('')}
    </div>
  </div>
  ${rec.governmentSchemes?.length ? `
  <div class="section">
    <div class="section-title">🏛️ सरकारी योजनाएँ</div>
    ${rec.governmentSchemes.map((s, i) => `
      <div class="scheme-item">
        <span style="font-size:22px">${['🌾','💳','🛡️','💊','🏦'][i%5]}</span>
        <div>
          <div class="scheme-name">${s.name}</div>
          <div class="scheme-ben">${s.benefit}</div>
        </div>
        <div class="scheme-link">🔗 ${s.link}</div>
      </div>`).join('')}
  </div>` : ''}
  ${rec.bankLoanAdvice ? `
  <div class="section">
    <div class="section-title">🏦 बैंक ऋण सहायता</div>
    <div class="loan-card">
      <h4>🏦 किसान क्रेडिट कार्ड (KCC) सलाह</h4>
      <p>${rec.bankLoanAdvice}</p>
    </div>
    <div class="bank-note">
      <strong>बैंक के लिए नोट:</strong> यह रिपोर्ट किसान AI द्वारा ${date} को ${input.location} के लिए तैयार की गई है।
      अनुमानित आय: <strong>${rec.expectedRevenue || 'N/A'}</strong>
    </div>
  </div>` : ''}
  <div class="report-footer">
    <span>🌾 किसान AI — kisanai.in</span>
    <span>Powered by Google Gemini AI + OpenWeatherMap</span>
    <span>${date}</span>
  </div>
</div>
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `KisanAI-Report-${input.location}-${Date.now()}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ═════════════════════════════════════════════════════════════
//  ADVISOR PAGE
// ═════════════════════════════════════════════════════════════
export default function Advisor({ onLangChange }) {
  const [lang,      setLang]     = useState('hi')
  const [form,      setForm]     = useState({ location:'', soilType:'', season:'', waterAvailability:'', farmSize:'' })
  const [loading,   setLoading]  = useState(false)
  const [error,     setError]    = useState('')
  const [data,      setData]     = useState(null)
  const [dlLoading, setDlLoading] = useState(false)
  const resultsRef = useRef(null)

  const { speak, stopSpeaking, speaking } = useVoice(lang)
  const hindiAvailable = true

  useEffect(() => { if (onLangChange) onLangChange(lang) }, [lang])

  useEffect(() => {
    if (data) {
      const summary = buildVoiceSummary(data, lang)
      if (summary) setTimeout(() => speak(summary), 600)
    }
  }, [data])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    const { location, soilType, season, waterAvailability } = form
    if (!location || !soilType || !season || !waterAvailability) {
      setError(lang === 'hi' ? 'कृपया सभी जरूरी जानकारी भरें।' : 'Please fill in all required fields.')
      return
    }
    setError(''); setLoading(true); setData(null)
    try {
      const res  = await fetch('/api/recommend', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...form, language: lang }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Server returned an error')
      setData(json)
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = () => {
    if (!data) return
    setDlLoading(true)
    try { generatePDF(data, lang) } finally { setTimeout(() => setDlLoading(false), 800) }
  }

  const printReport  = () => window.print()

  const shareReport = async () => {
    const title = lang === 'hi' ? 'किसान AI फसल रिपोर्ट' : 'Kisan AI Crop Report'
    if (navigator.share) {
      await navigator.share({ title, url: window.location.href }).catch(() => {})
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert(lang === 'hi' ? 'लिंक कॉपी हो गया!' : 'Link copied to clipboard!')
    }
  }

  const rec     = data?.recommendations
  const weather = data?.weather

  const SectionHeader = ({ children, section }) => (
    <h2 style={{
      fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '20px',
      color: 'var(--green-deep)',
      margin: '36px 0 16px',
      borderBottom: '3px solid var(--green-light)', paddingBottom: '10px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
    }}>
      <span style={{ display:'flex', alignItems:'center', gap:'8px' }}>{children}</span>
      {hasTTS && section && data && (
        <button
          onClick={() => speak(buildSectionVoice(section, data, lang))}
          title={lang==='hi' ? 'यह भाग सुनें' : 'Listen to this section'}
          style={{
            flexShrink: 0, padding: '4px 12px',
            background: 'rgba(10,61,31,.08)', border: '1px solid rgba(10,61,31,.18)',
            borderRadius: '50px',
            fontFamily: "'Noto Sans Devanagari','DM Sans',sans-serif",
            fontSize: '11px', fontWeight: 600, color: 'var(--green-deep)',
            cursor: 'pointer', whiteSpace: 'nowrap',
            display: 'flex', alignItems: 'center', gap: '4px',
          }}
        >
          🔊 {lang==='hi' ? 'सुनें' : 'Listen'}
        </button>
      )}
    </h2>
  )

  return (
    <>
      {/* ════ HERO ════ */}
      <section style={{
        background: 'linear-gradient(145deg,#0a3d1f 0%,#1a6b35 60%,#0d5228 100%)',
        padding: '80px 28px 64px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 50% 60% at 80% 40%, rgba(232,166,21,.1) 0%, transparent 60%)',
        }}/>
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '52px', animation: 'sway 4s ease-in-out infinite', display: 'inline-block', marginBottom: '16px' }}>🌾</div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(30px,5vw,52px)', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: '14px' }}>
            AI फसल सलाहकार
          </h1>
          <p style={{ fontFamily: "'Noto Sans Devanagari',sans-serif", fontSize: '16px', color: 'rgba(255,255,255,.72)', lineHeight: 1.75, maxWidth: '480px', margin: '0 auto 20px' }}>
            अपनी खेत की जानकारी दें — Gemini AI सर्वश्रेष्ठ फसल, मंडी भाव और खेती कैलेंडर तैयार करेगा।
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {[['/', '🏠 Home'], ['/about', '🌿 About'], ['/contact', '📞 Contact']].map(([to, label]) => (
              <Link key={to} to={to} style={{
                padding: '7px 18px', borderRadius: '50px',
                border: '1px solid rgba(255,255,255,.25)',
                color: 'rgba(255,255,255,.8)',
                fontFamily: "'DM Sans',sans-serif", fontSize: '13px',
                textDecoration: 'none', transition: 'all .2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,.1)'; e.currentTarget.style.borderColor='rgba(255,255,255,.5)' }}
                onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(255,255,255,.25)' }}
              >{label}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════ FORM ════ */}
      <section style={{ padding: '48px 28px 0' }}>
        <div className="container">
          <div style={{
            background: '#fff', borderRadius: '24px',
            boxShadow: 'var(--shadow-md)',
            padding: 'clamp(24px,4vw,44px)',
            border: '1px solid rgba(0,0,0,.06)',
            maxWidth: '820px', margin: '0 auto',
          }}>

            {/* Hindi voice status banner */}
            {hasTTS && lang === 'hi' && (
              <div style={{
                display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'8px',
                background: '#e8f5e9', border: '1px solid #a5d6a7',
                borderRadius:'10px', padding:'10px 14px', marginBottom:'16px',
              }}>
                <span style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'13px', color:'#2e7d32', fontWeight:600 }}>
                  ✅ हिंदी आवाज़ आपके डिवाइस पर उपलब्ध है — बोलकर सुनें!
                </span>
              </div>
            )}

            {/* Header + Lang toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '18px', color: 'var(--green-deep)' }}>
                📋 {lang === 'hi' ? 'खेत की जानकारी दर्ज करें' : 'Enter Your Farm Details'}
              </h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[['hi','हिंदी'],['en','English']].map(([l, lbl]) => (
                  <button key={l} onClick={() => setLang(l)} style={{
                    padding: '8px 18px', borderRadius: '50px',
                    border: `2px solid ${lang === l ? 'var(--green-bright)' : '#e4e4d8'}`,
                    background: lang === l ? 'rgba(46,168,79,.08)' : 'transparent',
                    fontFamily: "'Noto Sans Devanagari','DM Sans',sans-serif",
                    fontSize: '13px', fontWeight: lang === l ? 700 : 400,
                    color: lang === l ? 'var(--green-deep)' : 'var(--text-mid)',
                    cursor: 'pointer', transition: 'all .15s',
                  }}>{lbl}</button>
                ))}
              </div>
            </div>

            {/* Input grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: '18px', marginBottom: '24px' }}>
              <div className="field">
                <label>{lang==='hi' ? '📍 स्थान / जिला *' : '📍 Location / District *'}</label>
                <input type="text" value={form.location}
                  onChange={e => set('location', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submit()}
                  placeholder={lang==='hi' ? 'जैसे: Lucknow, Varanasi' : 'e.g. Lucknow, Varanasi'} />
              </div>
              <div className="field">
                <label>{lang==='hi' ? '🪱 मिट्टी का प्रकार *' : '🪱 Soil Type *'}</label>
                <select value={form.soilType} onChange={e => set('soilType', e.target.value)}>
                  <option value="">-- {lang==='hi'?'चुनें':'Select'} --</option>
                  {SOIL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="field">
                <label>{lang==='hi' ? '🌤️ मौसम / सीजन *' : '🌤️ Farming Season *'}</label>
                <select value={form.season} onChange={e => set('season', e.target.value)}>
                  <option value="">-- {lang==='hi'?'चुनें':'Select'} --</option>
                  {SEASON_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="field">
                <label>{lang==='hi' ? '💧 पानी की उपलब्धता *' : '💧 Water Availability *'}</label>
                <select value={form.waterAvailability} onChange={e => set('waterAvailability', e.target.value)}>
                  <option value="">-- {lang==='hi'?'चुनें':'Select'} --</option>
                  {WATER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="field">
                <label>{lang==='hi' ? '🏡 खेत (एकड़)' : '🏡 Farm Size (Acres)'}</label>
                <input type="number" min="0.1" step="0.5" value={form.farmSize}
                  onChange={e => set('farmSize', e.target.value)}
                  placeholder={lang==='hi' ? 'जैसे: 2.5' : 'e.g. 2.5'} />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: '#fff5f5', border: '1px solid #ffcdd2',
                borderLeft: '4px solid var(--red)', borderRadius: '10px',
                padding: '12px 16px', marginBottom: '16px',
                fontFamily: "'Noto Sans Devanagari',sans-serif", fontSize: '14px', color: '#b71c1c',
              }}>❌ {error}</div>
            )}

            {/* Submit */}
            <button onClick={submit} disabled={loading} style={{
              width: '100%', padding: '17px',
              background: loading ? '#9e9e9e' : 'linear-gradient(135deg,var(--green-bright),var(--green-mid))',
              color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)',
              fontFamily: "'Syne',sans-serif", fontSize: '16px', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(46,168,79,.35)',
              transition: 'all .15s',
            }}>
              {loading
                ? <><span style={{ width:'20px',height:'20px',border:'3px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 1s linear infinite',display:'inline-block' }} />
                    {lang==='hi' ? 'Gemini AI विश्लेषण कर रहा है...' : 'Gemini AI is analysing...'}</>
                : `🤖 ${lang==='hi' ? 'AI से फसल सुझाव प्राप्त करें' : 'Get AI Crop Recommendations'}`}
            </button>

          </div>
        </div>
      </section>

      {/* ════ RESULTS ════ */}
      {data && (
        <section ref={resultsRef} style={{ padding: '48px 28px 80px' }} className="no-print">
          <div className="container">

            {/* Weather strip */}
            <div style={{
              background: 'linear-gradient(135deg,#e3f2fd,#bbdefb)',
              border: '1px solid #90caf9', borderRadius: '16px',
              padding: '18px 26px', marginBottom: '22px',
              display: 'flex', flexWrap: 'wrap', gap: '28px', alignItems: 'center',
            }}>
              {[
                [`${weather?.icon||'🌡️'} ${weather?.temperature}°C`, lang==='hi'?'तापमान':'Temperature'],
                [`💧 ${weather?.humidity}%`,                          lang==='hi'?'नमी':'Humidity'],
                [`🌬️ ${weather?.windSpeed} km/h`,                    lang==='hi'?'हवा':'Wind'],
                [`☁️ ${weather?.description}`,                        weather?.city],
              ].map(([val, lbl]) => (
                <div key={lbl}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'18px', fontWeight:700, color:'var(--blue)' }}>{val}</div>
                  <div style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'12px', color:'#5c7fa3' }}>{lbl}</div>
                </div>
              ))}
              {weather?.isFallback && <span style={{ fontSize:'12px', color:'#888', fontStyle:'italic' }}>⚠️ demo weather data</span>}
              {hasTTS && (
                <button onClick={() => speak(buildSectionVoice('weather', data, lang))}
                  style={{ marginLeft:'auto', padding:'6px 14px', borderRadius:'50px',
                    background:'rgba(21,101,192,.1)', border:'1px solid rgba(21,101,192,.2)',
                    fontFamily:"'Noto Sans Devanagari','DM Sans',sans-serif",
                    fontSize:'12px', fontWeight:600, color:'#1565c0', cursor:'pointer' }}>
                  🔊 {lang==='hi' ? 'मौसम सुनें' : 'Listen'}
                </button>
              )}
            </div>

            {/* Alert */}
            {rec.weatherAlert && (
              <div style={{
                background:'#fff3e0', border:'1px solid #ffcc02', borderRadius:'12px',
                padding:'12px 18px', marginBottom:'18px',
                fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'13px', color:'#e65100',
              }}>⚠️ {rec.weatherAlert}</div>
            )}

            {/* Revenue */}
            <div style={{
              background: 'linear-gradient(135deg,var(--green-deep),var(--green-mid))',
              borderRadius: '18px', padding: '32px', textAlign: 'center', marginBottom: '28px',
              position: 'relative',
            }}>
              {hasTTS && (
                <button onClick={() => speak(buildSectionVoice('revenue', data, lang))}
                  style={{ position:'absolute', top:'14px', right:'16px',
                    padding:'5px 12px', borderRadius:'50px',
                    background:'rgba(255,255,255,.15)', border:'1px solid rgba(255,255,255,.3)',
                    fontFamily:"'Noto Sans Devanagari','DM Sans',sans-serif",
                    fontSize:'11px', fontWeight:600, color:'#fff', cursor:'pointer' }}>
                  🔊 {lang==='hi' ? 'सुनें' : 'Listen'}
                </button>
              )}
              <div style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'14px', color:'rgba(255,255,255,.75)', marginBottom:'6px' }}>
                {lang==='hi'?'अनुमानित आय':'Estimated Revenue'}
              </div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(28px,5vw,44px)', fontWeight:900, color:'var(--gold-light)', lineHeight:1 }}>
                {rec.expectedRevenue || '₹40,000–₹80,000'}
              </div>
              <div style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'13px', color:'rgba(255,255,255,.6)', marginTop:'6px' }}>
                {lang==='hi'?'प्रति एकड़ प्रति सीजन':'per acre per season'}
              </div>
            </div>

            {/* Crop cards */}
            <SectionHeader section="crops">🌱 {lang==='hi'?'शीर्ष अनुशंसित फसलें':'Top Recommended Crops'}</SectionHeader>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:'22px' }}>
              {(rec.topCrops||[]).map((crop, i) => <CropCard key={i} crop={crop} rank={i} />)}
            </div>

            {/* Calendar */}
            {rec.farmingCalendar?.length > 0 && (
              <>
                <SectionHeader section="calendar">📅 {lang==='hi'?'मौसमी खेती कैलेंडर':'Seasonal Farming Calendar'}</SectionHeader>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(148px,1fr))', gap:'12px' }}>
                  {rec.farmingCalendar.map((c, i) => (
                    <div key={i} style={{
                      background:'#fff', borderRadius:'12px', padding:'14px',
                      textAlign:'center', boxShadow:'var(--shadow-sm)',
                      borderTop:'4px solid var(--green-bright)',
                    }}>
                      <div style={{ fontSize:'24px', marginBottom:'6px' }}>{c.icon||'📅'}</div>
                      <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:'13px', color:'var(--green-deep)', marginBottom:'4px' }}>{c.month}</div>
                      <div style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'11px', color:'var(--text-mid)', lineHeight:1.5 }}>{c.activity}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Advisory cards */}
            <SectionHeader section="advice">🧪 {lang==='hi'?'खेती सलाह':'Farming Advice'}</SectionHeader>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'16px' }}>
              {[
                { icon:'🪱', hi:'मिट्टी तैयारी',    en:'Soil Preparation',    text: rec.soilPreparation    },
                { icon:'💧', hi:'सिंचाई सलाह',      en:'Irrigation Advice',   text: rec.irrigationAdvice   },
                { icon:'🧪', hi:'उर्वरक अनुसूची',   en:'Fertilizer Schedule', text: rec.fertilizerSchedule },
                { icon:'🐛', hi:'कीट प्रबंधन',      en:'Pest Management',     text: rec.pestManagement     },
              ].filter(c => c.text).map((c, i) => (
                <div key={i} style={{ background:'#fff', borderRadius:'16px', padding:'22px', boxShadow:'var(--shadow-sm)', border:'1px solid rgba(0,0,0,.05)' }}>
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:'14px', color:'var(--green-deep)', marginBottom:'10px' }}>
                    {c.icon} {lang==='hi'?c.hi:c.en}
                  </h3>
                  <p style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'13px', lineHeight:1.75, color:'var(--text-mid)' }}>{c.text}</p>
                </div>
              ))}
            </div>

            {/* Govt schemes */}
            {rec.governmentSchemes?.length > 0 && (
              <>
                <SectionHeader section="schemes">🏛️ {lang==='hi'?'सरकारी योजनाएँ':'Government Schemes'}</SectionHeader>
                <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                  {rec.governmentSchemes.map((s, i) => (
                    <div key={i} style={{
                      background:'#fff', borderRadius:'12px', padding:'15px 18px',
                      display:'flex', alignItems:'center', gap:'14px',
                      boxShadow:'var(--shadow-sm)', borderLeft:'4px solid var(--gold)',
                    }}>
                      <span style={{ fontSize:'26px', flexShrink:0 }}>{SCHEME_ICONS[i%SCHEME_ICONS.length]}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:'14px', color:'var(--green-deep)' }}>{s.name}</div>
                        <div style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'12px', color:'var(--text-mid)', marginTop:'2px' }}>{s.benefit}</div>
                      </div>
                      {s.link && <a href={`https://${s.link}`} target="_blank" rel="noopener" style={{ fontSize:'12px', color:'var(--blue)', fontWeight:600, flexShrink:0 }}>🔗 {s.link}</a>}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Loan */}
            {rec.bankLoanAdvice && (
              <>
                <SectionHeader section="loan">🏦 {lang==='hi'?'बैंक ऋण सहायता':'Bank Loan Support'}</SectionHeader>
                <div style={{ background:'#fff', borderRadius:'16px', padding:'26px', boxShadow:'var(--shadow-sm)', border:'1px solid rgba(0,0,0,.05)' }}>
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:'15px', color:'var(--blue)', marginBottom:'10px' }}>
                    🏦 {lang==='hi'?'बैंक ऋण सलाह':'Bank Loan Advisory'}
                  </h3>
                  <p style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", fontSize:'14px', lineHeight:1.8, color:'var(--text-mid)' }}>
                    {rec.bankLoanAdvice}
                  </p>
                </div>
              </>
            )}

            {/* ════ ACTION BUTTONS ════ */}
            <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', marginTop:'40px' }}>

              <button onClick={downloadReport} disabled={dlLoading} style={{
                flex:1, minWidth:'200px', padding:'16px 24px',
                background: 'linear-gradient(135deg,#1565c0,#1976d2)',
                color:'#fff', border:'none', borderRadius:'var(--radius-sm)',
                fontFamily:"'Syne',sans-serif", fontSize:'14px', fontWeight:700,
                cursor: dlLoading ? 'wait' : 'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                boxShadow:'0 4px 16px rgba(21,101,192,.35)',
                transition:'transform .15s, box-shadow .15s',
                opacity: dlLoading ? .7 : 1,
              }}
                onMouseEnter={e => !dlLoading && (e.currentTarget.style.transform='translateY(-2px)')}
                onMouseLeave={e => (e.currentTarget.style.transform='')}
              >
                {dlLoading
                  ? <><span style={{ width:'16px',height:'16px',border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 1s linear infinite',display:'inline-block' }} /> Generating...</>
                  : `📥 ${lang==='hi'?'रिपोर्ट डाउनलोड करें':'Download Report'}`}
              </button>

              <button onClick={printReport} style={{
                flex:1, minWidth:'180px', padding:'16px 24px',
                background:'linear-gradient(135deg,var(--green-bright),var(--green-mid))',
                color:'#fff', border:'none', borderRadius:'var(--radius-sm)',
                fontFamily:"'Syne',sans-serif", fontSize:'14px', fontWeight:700,
                cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                boxShadow:'0 4px 16px rgba(46,168,79,.35)',
                transition:'transform .15s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform=''}
              >
                🖨️ {lang==='hi'?'प्रिंट करें':'Print'}
              </button>

              <button onClick={shareReport} style={{
                flex:1, minWidth:'180px', padding:'16px 24px',
                background:'linear-gradient(135deg,var(--gold),var(--gold-light))',
                color:'var(--green-deep)', border:'none', borderRadius:'var(--radius-sm)',
                fontFamily:"'Syne',sans-serif", fontSize:'14px', fontWeight:700,
                cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                boxShadow:'0 4px 16px rgba(232,166,21,.35)',
                transition:'transform .15s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform=''}
              >
                📤 {lang==='hi'?'शेयर करें':'Share'}
              </button>

              {hasTTS && (
                <div style={{ flex:'1 1 100%', display:'flex', gap:'10px', flexWrap:'wrap' }}>
                  <button
                    onClick={() => speaking ? stopSpeaking() : speak(buildVoiceSummary(data, lang))}
                    style={{
                      flex:1, minWidth:'160px', padding:'15px 18px',
                      background: speaking
                        ? 'linear-gradient(135deg,#c0392b,#e74c3c)'
                        : 'linear-gradient(135deg,#4a148c,#7b1fa2)',
                      color:'#fff', border:'none', borderRadius:'var(--radius-sm)',
                      fontFamily:"'Syne',sans-serif", fontSize:'13px', fontWeight:700,
                      cursor:'pointer',
                      display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                      boxShadow: speaking ? '0 4px 16px rgba(192,57,43,.4)' : '0 4px 16px rgba(74,20,140,.35)',
                      transition:'transform .15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform=''}
                  >
                    {speaking
                      ? (lang==='hi' ? '⏹ रोकें' : '⏹ Stop')
                      : (lang==='hi' ? '🔊 संक्षेप में सुनें' : '🔊 Short Summary')}
                  </button>

                  <button
                    onClick={() => speaking ? stopSpeaking() : speak(buildDetailedVoiceSummary(data, lang))}
                    style={{
                      flex:1, minWidth:'180px', padding:'15px 18px',
                      background: 'linear-gradient(135deg,#1b5e20,#2e7d32)',
                      color:'#fff', border:'none', borderRadius:'var(--radius-sm)',
                      fontFamily:"'Syne',sans-serif", fontSize:'13px', fontWeight:700,
                      cursor:'pointer',
                      display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                      boxShadow:'0 4px 16px rgba(27,94,32,.4)',
                      transition:'transform .15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform=''}
                  >
                    {lang==='hi' ? '🎙️ विस्तार से सुनें (हिंदी)' : '🎙️ Listen in Detail'}
                  </button>
                </div>
              )}
            </div>

          </div>
        </section>
      )}
    </>
  )
}