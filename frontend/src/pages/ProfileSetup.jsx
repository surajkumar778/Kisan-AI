import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFarmer } from '../hooks/useFarmer'

const STATES = [
  'Andhra Pradesh','Bihar','Gujarat','Haryana','Himachal Pradesh',
  'Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha',
  'Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh',
  'Uttarakhand','West Bengal',
]
const SOIL_TYPES   = ['alluvial','black','red','laterite','sandy','loamy','clayey','other']
const WATER_SOURCE = ['rain','canal','borewell','river','tank','other']
const labelHi = {
  alluvial:'जलोढ़', black:'काली', red:'लाल', laterite:'लैटेराइट',
  sandy:'बलुई', loamy:'दोमट', clayey:'चिकनी', other:'अन्य',
  rain:'वर्षा', canal:'नहर', borewell:'बोरवेल',
  river:'नदी', tank:'तालाब',
}

export default function ProfileSetup() {
  const { saveProfile, getProfile, loading } = useFarmer()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    phone:'', state:'', district:'', city:'', pincode:'',
    areaAcres:'', soilType:'', waterSource:'', currentCrops:'', language:'hi',
  })

  useEffect(() => {
    getProfile().then(data => {
      if (!data) return
      setForm(prev => ({
        ...prev,
        phone:        data.phone || '',
        state:        data.location?.state    || '',
        district:     data.location?.district || '',
        city:         data.location?.city     || '',
        pincode:      data.location?.pincode  || '',
        areaAcres:    data.farm?.areaAcres    || '',
        soilType:     data.farm?.soilType     || '',
        waterSource:  data.farm?.waterSource  || '',
        currentCrops: (data.farm?.currentCrops || []).join(', '),
        language:     data.language || 'hi',
      }))
    })
  }, [])

  const handle = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const user = JSON.parse(localStorage.getItem('kisan_user') || '{}')
    await saveProfile({
      googleId: user.googleId,
      name:     user.name,
      email:    user.email,
      avatar:   user.avatar,
      phone:    form.phone,
      language: form.language,
      location: { state: form.state, district: form.district, city: form.city, pincode: form.pincode },
      farm: {
        areaAcres:    Number(form.areaAcres),
        soilType:     form.soilType,
        waterSource:  form.waterSource,
        currentCrops: form.currentCrops.split(',').map(s => s.trim()).filter(Boolean),
      },
    })
    setSaved(true)
    setTimeout(() => navigate('/advisor'), 1500)
  }

  const inp = {
    width:'100%', padding:'12px 16px', borderRadius:'12px',
    border:'1px solid rgba(26,92,42,.2)', background:'#fff',
    fontFamily:"'Noto Sans Devanagari','DM Sans',sans-serif",
    fontSize:'14px', color:'#1a3320', outline:'none', marginBottom:'16px',
  }
  const lbl = {
    display:'block', fontSize:'12px', fontWeight:600,
    color:'#2d7a45', marginBottom:'6px', letterSpacing:'.04em',
  }
  const sectionHead = {
    fontSize:'13px', fontWeight:700, color:'#0c2415',
    letterSpacing:'.06em', textTransform:'uppercase',
    marginBottom:'16px', paddingBottom:'8px', borderBottom:'1px solid #f0ead8',
  }

  return (
    <div style={{ minHeight:'100vh', background:'#faf6ed', padding:'80px 20px 40px' }}>
      <div style={{ maxWidth:'560px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'40px' }}>
          <div style={{ fontSize:'48px', marginBottom:'12px' }}>👨‍🌾</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'28px', fontWeight:900, color:'#0c2415' }}>
            अपनी जानकारी भरें
          </h1>
          <p style={{ fontFamily:"'Noto Sans Devanagari',sans-serif", color:'#5a7060', fontSize:'14px', marginTop:'8px' }}>
            बेहतर AI सलाह के लिए अपनी खेत की details save करें
          </p>
        </div>

        <form onSubmit={submit} style={{ background:'#fff', borderRadius:'24px', padding:'32px', boxShadow:'0 4px 24px rgba(6,36,21,.08)', border:'1px solid rgba(6,36,21,.06)' }}>

          {/* Personal */}
          <div style={{ marginBottom:'24px' }}>
            <div style={sectionHead}>📱 व्यक्तिगत जानकारी</div>
            <label style={lbl}>मोबाइल नंबर</label>
            <input style={inp} name="phone" value={form.phone} onChange={handle} placeholder="9876543210" type="tel"/>
            <label style={lbl}>भाषा / Language</label>
            <select style={inp} name="language" value={form.language} onChange={handle}>
              <option value="hi">हिंदी</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Location */}
          <div style={{ marginBottom:'24px' }}>
            <div style={sectionHead}>📍 आपका स्थान</div>
            <label style={lbl}>राज्य *</label>
            <select style={inp} name="state" value={form.state} onChange={handle} required>
              <option value="">-- राज्य चुनें --</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <label style={lbl}>जिला *</label>
            <input style={inp} name="district" value={form.district} onChange={handle} placeholder="जैसे: Jaipur" required/>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
              <div>
                <label style={lbl}>शहर / गाँव</label>
                <input style={{...inp, marginBottom:0}} name="city" value={form.city} onChange={handle} placeholder="जैसे: Sanganer"/>
              </div>
              <div>
                <label style={lbl}>पिनकोड</label>
                <input style={{...inp, marginBottom:0}} name="pincode" value={form.pincode} onChange={handle} placeholder="302029" maxLength={6}/>
              </div>
            </div>
          </div>

          {/* Farm */}
          <div style={{ marginBottom:'28px' }}>
            <div style={sectionHead}>🌾 खेत की जानकारी</div>
            <label style={lbl}>जमीन (एकड़ में)</label>
            <input style={inp} name="areaAcres" value={form.areaAcres} onChange={handle} type="number" min="0.1" step="0.1" placeholder="जैसे: 5.5"/>
            <label style={lbl}>मिट्टी का प्रकार</label>
            <select style={inp} name="soilType" value={form.soilType} onChange={handle}>
              <option value="">-- मिट्टी चुनें --</option>
              {SOIL_TYPES.map(s => <option key={s} value={s}>{labelHi[s]} ({s})</option>)}
            </select>
            <label style={lbl}>पानी का स्रोत</label>
            <select style={inp} name="waterSource" value={form.waterSource} onChange={handle}>
              <option value="">-- स्रोत चुनें --</option>
              {WATER_SOURCE.map(s => <option key={s} value={s}>{labelHi[s]} ({s})</option>)}
            </select>
            <label style={lbl}>अभी की फसलें (comma से अलग करें)</label>
            <input style={inp} name="currentCrops" value={form.currentCrops} onChange={handle} placeholder="जैसे: गेहूं, सरसों, चना"/>
          </div>

          <button type="submit" disabled={loading} style={{
            width:'100%', padding:'16px',
            background: loading ? '#9ab5a0' : 'linear-gradient(135deg,#1a5c35,#2d8a50)',
            color:'#fff', border:'none', borderRadius:'14px',
            fontSize:'16px', fontWeight:700,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily:"'Noto Sans Devanagari','DM Sans',sans-serif",
          }}>
            {loading ? '⏳ Save हो रहा है...' : saved ? '✅ Saved! Redirecting...' : '💾 Profile Save करें'}
          </button>
        </form>
      </div>
    </div>
  )
}