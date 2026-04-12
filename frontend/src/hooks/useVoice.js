// ============================================================
//  useVoice.js — GUARANTEED HINDI via Backend TTS + ResponsiveVoice
//
//  Strategy (in order):
//  1. Backend /api/tts proxy → Google TTS audio (real Hindi mp3)
//  2. ResponsiveVoice CDN    → free Hindi TTS (no install needed)
//  3. Web Speech hi-IN       → only if hi-IN voice actually exists
//
//  Web Speech English voice is NEVER used for Hindi text.
// ============================================================
import { useState, useRef, useCallback, useEffect } from 'react'

export const hasTTS = typeof window !== 'undefined'
export const hasSTT = typeof window !== 'undefined' &&
  ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

// ── Load ResponsiveVoice CDN (free Hindi TTS, works everywhere) ─
let rvLoaded = false
let rvLoading = false

function loadResponsiveVoice() {
  return new Promise((resolve) => {
    if (rvLoaded && window.responsiveVoice) { resolve(true); return }
    if (rvLoading) {
      const check = setInterval(() => {
        if (window.responsiveVoice) { clearInterval(check); rvLoaded = true; resolve(true) }
      }, 100)
      setTimeout(() => { clearInterval(check); resolve(false) }, 5000)
      return
    }
    rvLoading = true
    const script = document.createElement('script')
    script.src = 'https://code.responsivevoice.org/responsivevoice.js?key=FREE'
    script.async = true
    script.onload = () => {
      setTimeout(() => {
        rvLoaded = !!(window.responsiveVoice)
        resolve(rvLoaded)
      }, 500)
    }
    script.onerror = () => resolve(false)
    document.head.appendChild(script)
  })
}

// ── Split text into ≤180-char chunks ─────────────────────────
function splitText(text) {
  if (!text) return []
  const str = String(text).trim()
  if (str.length <= 180) return [str]
  const sentences = str.match(/[^।.!?\n]+[।.!?\n]+|[^।.!?\n]+$/g) || [str]
  const chunks = []
  let cur = ''
  for (const s of sentences) {
    if ((cur + s).length > 180) {
      if (cur.trim()) chunks.push(cur.trim())
      if (s.trim().length > 180) {
        const parts = s.split(/[,،]/)
        let sub = ''
        for (const p of parts) {
          if ((sub + ',' + p).length > 180) {
            if (sub.trim()) chunks.push(sub.trim())
            sub = p
          } else { sub = sub ? sub + ',' + p : p }
        }
        if (sub.trim()) chunks.push(sub.trim())
        cur = ''
      } else { cur = s }
    } else { cur += s }
  }
  if (cur.trim()) chunks.push(cur.trim())
  return chunks.length ? chunks : [str]
}

// ══════════════════════════════════════════════════════════════
//  METHOD 1: Backend /api/tts proxy → real Hindi Google audio
// ══════════════════════════════════════════════════════════════
async function speakViaBackend(text, lang, cancelRef, onChunk, onDone) {
  const chunks = splitText(text)
  let idx = 0

  const playNext = async () => {
    if (cancelRef.current || idx >= chunks.length) { onDone(); return }

    const chunk = chunks[idx]
    const gtLang = lang === 'hi' ? 'hi' : 'en'
    const url = `/api/tts?text=${encodeURIComponent(chunk)}&lang=${gtLang}`

    try {
      const resp = await fetch(url)
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)

      const contentType = resp.headers.get('content-type') || ''
      if (!contentType.includes('audio') && !contentType.includes('mpeg') && !contentType.includes('octet')) {
        throw new Error(`Not audio: ${contentType}`)
      }

      const blob = await resp.blob()
      if (blob.size < 100) throw new Error('Audio too small')

      const blobUrl = URL.createObjectURL(blob)
      const audio = new Audio(blobUrl)
      audio.volume = 1.0

      await new Promise((resolve, reject) => {
        audio.onended  = () => { URL.revokeObjectURL(blobUrl); resolve() }
        audio.onerror  = () => { URL.revokeObjectURL(blobUrl); reject(new Error('Audio play failed')) }
        audio.oncanplaythrough = () => {
          onChunk(idx + 1, chunks.length)
          audio.play().catch(reject)
        }
        audio.load()
        setTimeout(() => reject(new Error('Audio timeout')), 12000)
      })

      idx++
      await new Promise(r => setTimeout(r, 100))
      playNext()

    } catch (err) {
      console.warn(`[TTS Backend] chunk ${idx} failed:`, err.message)
      throw err
    }
  }

  return new Promise(async (resolve, reject) => {
    try { await playNext(); resolve() }
    catch (err) { reject(err) }
  })
}

// ══════════════════════════════════════════════════════════════
//  METHOD 2: ResponsiveVoice — free Hindi CDN TTS
// ══════════════════════════════════════════════════════════════
async function speakViaResponsiveVoice(text, lang, cancelRef, onChunk, onDone) {
  const loaded = await loadResponsiveVoice()
  if (!loaded || !window.responsiveVoice) throw new Error('ResponsiveVoice not available')

  const chunks = splitText(text)
  const voiceName = lang === 'hi' ? 'Hindi Female' : 'UK English Female'
  let idx = 0

  const speakNext = () => {
    if (cancelRef.current || idx >= chunks.length) { onDone(); return }
    onChunk(idx + 1, chunks.length)

    window.responsiveVoice.speak(chunks[idx], voiceName, {
      rate: lang === 'hi' ? 0.9 : 1.0,
      pitch: 1,
      volume: 1,
      onend: () => { idx++; setTimeout(speakNext, 100) },
      onerror: () => { idx++; speakNext() },
    })
    idx++
  }

  speakNext()
}

// ══════════════════════════════════════════════════════════════
//  METHOD 3: Web Speech — only if hi-IN voice actually installed
// ══════════════════════════════════════════════════════════════
function getHindiVoice() {
  const voices = window.speechSynthesis?.getVoices() || []
  return voices.find(v => v.lang === 'hi-IN' && /google/i.test(v.name)) ||
         voices.find(v => v.lang === 'hi-IN') ||
         voices.find(v => v.lang.startsWith('hi'))
}

async function speakViaWebSpeech(text, lang, cancelRef, onChunk, onDone) {
  if (!('speechSynthesis' in window)) throw new Error('No Web Speech')

  if (lang === 'hi') {
    await new Promise(r => setTimeout(r, 500))
    const hiVoice = getHindiVoice()
    if (!hiVoice) throw new Error('No Hindi voice installed')
  }

  const chunks = splitText(text)
  let idx = 0

  const ka = setInterval(() => {
    if (cancelRef.current) { clearInterval(ka); return }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause(); window.speechSynthesis.resume()
    }
  }, 10000)

  const next = () => {
    if (cancelRef.current || idx >= chunks.length) { clearInterval(ka); onDone(); return }
    const u = new SpeechSynthesisUtterance(chunks[idx])
    u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
    u.rate = lang === 'hi' ? 0.85 : 0.9
    u.pitch = 1.0; u.volume = 1.0
    const hiVoice = getHindiVoice()
    if (lang === 'hi' && hiVoice) try { u.voice = hiVoice } catch(_) {}
    u.onstart = () => onChunk(idx + 1, chunks.length)
    u.onend   = () => { idx++; setTimeout(next, 80) }
    u.onerror = () => { idx++; setTimeout(next, 80) }
    window.speechSynthesis.speak(u)
    idx++
  }
  next()
}

// ═════════════════════════════════════════════════════════════
//  useVoice hook
// ═════════════════════════════════════════════════════════════
export function useVoice(lang = 'hi') {
  const [speaking, setSpeaking]         = useState(false)
  const [listening, setListening]       = useState(false)
  const [transcript, setTranscript]     = useState('')
  const [currentChunk, setCurrentChunk] = useState(0)
  const [totalChunks, setTotalChunks]   = useState(0)
  const [ttsMethod, setTtsMethod]       = useState('')

  const cancelRef = useRef(false)
  const langRef   = useRef(lang)
  useEffect(() => { langRef.current = lang }, [lang])

  useEffect(() => { loadResponsiveVoice() }, [])

  const speak = useCallback(async (text, overrideLang) => {
    if (!text) return

    cancelRef.current = true
    window.responsiveVoice?.cancel()
    window.speechSynthesis?.cancel()
    await new Promise(r => setTimeout(r, 200))
    cancelRef.current = false

    const l = overrideLang || langRef.current
    const chunks = splitText(String(text))
    setSpeaking(true)
    setCurrentChunk(0)
    setTotalChunks(chunks.length)

    const onChunk = (cur, tot) => {
      if (!cancelRef.current) { setCurrentChunk(cur); setTotalChunks(tot) }
    }
    const onDone = () => {
      setSpeaking(false); setCurrentChunk(0); setTotalChunks(0)
    }

    const methods = [
      {
        name: 'Backend TTS',
        fn: () => speakViaBackend(String(text), l, cancelRef, onChunk, onDone)
      },
      {
        name: 'ResponsiveVoice',
        fn: () => new Promise((res, rej) => {
          speakViaResponsiveVoice(String(text), l, cancelRef, onChunk, () => { onDone(); res() })
            .catch(rej)
        })
      },
      {
        name: 'Web Speech hi-IN',
        fn: () => new Promise((res, rej) => {
          speakViaWebSpeech(String(text), l, cancelRef, onChunk, () => { onDone(); res() })
            .catch(rej)
        })
      },
    ]

    for (const method of methods) {
      if (cancelRef.current) break
      try {
        console.log(`[TTS] Trying: ${method.name}`)
        await method.fn()
        setTtsMethod(method.name)
        console.log(`[TTS] Success: ${method.name}`)
        return
      } catch (err) {
        console.warn(`[TTS] ${method.name} failed:`, err.message)
      }
    }

    console.error('[TTS] All methods failed')
    onDone()
  }, [])

  const stopSpeaking = useCallback(() => {
    cancelRef.current = true
    window.responsiveVoice?.cancel()
    window.speechSynthesis?.cancel()
    setSpeaking(false); setCurrentChunk(0); setTotalChunks(0)
  }, [])

  const listen = useCallback((onResult) => {
    if (!hasSTT) return
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const r = new SR()
    r.lang            = langRef.current === 'hi' ? 'hi-IN' : 'en-IN'
    r.continuous      = false
    r.interimResults  = false
    r.maxAlternatives = 1
    r.onstart  = () => setListening(true)
    r.onend    = () => setListening(false)
    r.onerror  = () => setListening(false)
    r.onresult = e => {
      const t = e.results[0][0].transcript
      setTranscript(t)
      if (onResult) onResult(t)
    }
    r.start()
    return r
  }, [])

  const stopListening = useCallback(() => {
    window.speechSynthesis?.cancel()
    setListening(false)
  }, [])

  useEffect(() => () => {
    cancelRef.current = true
    window.responsiveVoice?.cancel()
    window.speechSynthesis?.cancel()
  }, [])

  return {
    speak, stopSpeaking, speaking,
    listen, stopListening, listening,
    transcript, currentChunk, totalChunks,
    ttsMethod, hasTTS, hasSTT,
  }
}

// ── Voice content builders ────────────────────────────────────
export function buildDetailedVoiceSummary(data, lang) {
  if (!data?.recommendations) return ''
  const rec = data.recommendations
  const crops = rec.topCrops || []
  const w = data.weather
  const inp = data.inputData || {}

  if (lang === 'hi') {
    let m = 'नमस्ते किसान भाई। किसान AI आपकी पूरी फसल सलाह लेकर आया है। '
    if (inp.location) m += `आपने ${inp.location} के लिए सलाह माँगी है। `
    if (inp.soilType) m += `आपकी मिट्टी ${inp.soilType} प्रकार की है। `
    if (inp.season)   m += `यह ${inp.season} का मौसम है। `
    if (w?.temperature) m += `तापमान ${w.temperature} डिग्री, नमी ${w.humidity} प्रतिशत। `
    if (rec.expectedRevenue) m += `अनुमानित कमाई ${rec.expectedRevenue} प्रति एकड़। `
    crops.forEach((c, i) => {
      const r = ['पहली', 'दूसरी', 'तीसरी'][i] || `${i+1}वीं`
      m += `${r} फसल है ${c.nameHindi || c.name}। `
      if (c.suitabilityScore) m += `अनुकूलता ${c.suitabilityScore} प्रतिशत। `
      if (c.estimatedYield)   m += `उपज ${c.estimatedYield}। `
      if (c.growingDuration)  m += `अवधि ${c.growingDuration}। `
      if (c.waterRequirement) m += `पानी ${c.waterRequirement}। `
      if (c.profitPotential)  m += `मुनाफा ${c.profitPotential}। `
      if (c.whyRecommended)   m += `${c.whyRecommended} `
      if (c.mandiPrice?.min)  m += `मंडी भाव ${c.mandiPrice.min} से ${c.mandiPrice.max} रुपये। `
      if (c.risks)            m += `सावधानी: ${c.risks} `
    })
    if (rec.soilPreparation)    m += `मिट्टी: ${rec.soilPreparation} `
    if (rec.irrigationAdvice)   m += `सिंचाई: ${rec.irrigationAdvice} `
    if (rec.fertilizerSchedule) m += `उर्वरक: ${rec.fertilizerSchedule} `
    if (rec.pestManagement)     m += `कीट: ${rec.pestManagement} `
    if (rec.governmentSchemes?.length) {
      m += 'सरकारी योजनाएँ: '
      rec.governmentSchemes.slice(0,3).forEach(s => { m += `${s.name}। ${s.benefit||''} ` })
    }
    if (rec.bankLoanAdvice) m += `बैंक ऋण: ${rec.bankLoanAdvice} `
    m += 'किसान AI की ओर से आपको खूब अच्छी फसल हो। धन्यवाद।'
    return m
  }

  let m = 'Hello Farmer. Kisan AI has your complete crop recommendation. '
  if (inp.location) m += `Advice for ${inp.location}. `
  if (w?.temperature) m += `Temperature ${w.temperature} degrees. `
  if (rec.expectedRevenue) m += `Revenue ${rec.expectedRevenue} per acre. `
  crops.forEach((c, i) => {
    m += `${['First','Second','Third'][i]||`${i+1}th`} crop: ${c.name}. `
    if (c.suitabilityScore) m += `Suitability ${c.suitabilityScore}%. `
    if (c.estimatedYield)   m += `Yield ${c.estimatedYield}. `
    if (c.profitPotential)  m += `Profit ${c.profitPotential}. `
  })
  m += 'Kisan AI wishes you a great harvest. Thank you.'
  return m
}

export function buildVoiceSummary(data, lang) {
  if (!data?.recommendations) return ''
  const rec = data.recommendations
  const crops = rec.topCrops || []
  const top = crops[0]

  if (lang === 'hi') {
    let m = 'किसान भाई, आपकी फसल सलाह तैयार है। '
    if (top) {
      m += `सबसे अच्छी फसल है ${top.nameHindi || top.name}। `
      if (top.suitabilityScore) m += `अनुकूलता ${top.suitabilityScore} प्रतिशत। `
      if (top.estimatedYield)   m += `उपज ${top.estimatedYield}। `
      if (top.profitPotential)  m += `मुनाफा ${top.profitPotential}। `
    }
    if (crops[1]) m += `दूसरी पसंद ${crops[1].nameHindi || crops[1].name}। `
    if (crops[2]) m += `तीसरी पसंद ${crops[2].nameHindi || crops[2].name}। `
    if (rec.expectedRevenue) m += `अनुमानित आय ${rec.expectedRevenue} प्रति एकड़। `
    m += 'विस्तार से सुनने के लिए नीचे बटन दबाएं।'
    return m
  }

  let m = 'Your recommendation is ready. '
  if (top) {
    m += `Best crop: ${top.name}. `
    if (top.estimatedYield) m += `Yield ${top.estimatedYield}. `
  }
  if (crops[1]) m += `Second: ${crops[1].name}. `
  return m
}

export function buildSectionVoice(section, data, lang) {
  if (!data?.recommendations) return ''
  const rec = data.recommendations
  const w = data.weather
  const isHi = lang === 'hi'

  switch (section) {
    case 'weather':
      if (!w) return isHi ? 'मौसम उपलब्ध नहीं।' : 'No weather data.'
      return isHi
        ? `मौसम: तापमान ${w.temperature} डिग्री, नमी ${w.humidity}%, हवा ${w.windSpeed} किलोमीटर, ${w.description}.`
        : `Weather: ${w.temperature}°C, ${w.humidity}% humidity, ${w.description}.`

    case 'revenue':
      return isHi
        ? (rec.expectedRevenue ? `अनुमानित कमाई ${rec.expectedRevenue} प्रति एकड़।` : 'उपलब्ध नहीं।')
        : (rec.expectedRevenue ? `Revenue ${rec.expectedRevenue} per acre.` : 'Not available.')

    case 'crops': {
      const c = rec.topCrops || []
      if (!c.length) return isHi ? 'फसल नहीं।' : 'No crops.'
      let t = isHi ? 'अनुशंसित फसलें: ' : 'Crops: '
      c.forEach((cr, i) => {
        const r = isHi ? ['पहली','दूसरी','तीसरी'][i] : ['First','Second','Third'][i]
        const n = isHi ? (cr.nameHindi || cr.name) : cr.name
        t += `${r} ${n}। `
        if (cr.suitabilityScore) t += isHi ? `अनुकूलता ${cr.suitabilityScore}%। ` : `Suitability ${cr.suitabilityScore}%. `
        if (cr.estimatedYield)   t += isHi ? `उपज ${cr.estimatedYield}। ` : `Yield ${cr.estimatedYield}. `
        if (cr.mandiPrice?.min)  t += isHi ? `मंडी भाव ${cr.mandiPrice.min} से ${cr.mandiPrice.max} रुपये। ` : `Market ₹${cr.mandiPrice.min}–${cr.mandiPrice.max}. `
      })
      return t
    }

    case 'advice': {
      let t = isHi ? 'खेती सलाह: ' : 'Advice: '
      if (rec.soilPreparation)    t += isHi ? `मिट्टी: ${rec.soilPreparation}। ` : `Soil: ${rec.soilPreparation}. `
      if (rec.irrigationAdvice)   t += isHi ? `सिंचाई: ${rec.irrigationAdvice}। ` : `Irrigation: ${rec.irrigationAdvice}. `
      if (rec.fertilizerSchedule) t += isHi ? `उर्वरक: ${rec.fertilizerSchedule}। ` : `Fertilizer: ${rec.fertilizerSchedule}. `
      if (rec.pestManagement)     t += isHi ? `कीट: ${rec.pestManagement}। ` : `Pests: ${rec.pestManagement}. `
      return t
    }

    case 'schemes': {
      const s = rec.governmentSchemes || []
      if (!s.length) return isHi ? 'योजनाएँ नहीं।' : 'None.'
      let t = isHi ? 'योजनाएँ: ' : 'Schemes: '
      s.forEach(sc => { t += `${sc.name}। ` })
      return t
    }

    case 'loan':
      return isHi
        ? (rec.bankLoanAdvice ? `बैंक ऋण: ${rec.bankLoanAdvice}` : 'उपलब्ध नहीं।')
        : (rec.bankLoanAdvice ? `Loan: ${rec.bankLoanAdvice}` : 'Not available.')

    case 'calendar': {
      const cal = rec.farmingCalendar || []
      if (!cal.length) return ''
      let t = isHi ? 'कैलेंडर: ' : 'Calendar: '
      cal.forEach(m => { t += isHi ? `${m.month} में ${m.activity}। ` : `${m.month}: ${m.activity}. ` })
      return t
    }

    default: return ''
  }
}

export function getMicResponse(input, lang) {
  const t = (input || '').toLowerCase()
  const isHi = lang === 'hi'
  if (t.includes('फसल') || t.includes('crop') || t.includes('बोएं'))
    return isHi ? 'फसल सलाह के लिए AI फसल सलाहकार में जाएं।' : 'Go to AI Crop Advisor.'
  if (t.includes('मौसम') || t.includes('weather'))
    return isHi ? 'मौसम के लिए AI सलाहकार में स्थान डालें।' : 'Enter location in AI Advisor for weather.'
  if (t.includes('भाव') || t.includes('मंडी') || t.includes('price'))
    return isHi ? 'मंडी भाव AI सलाहकार में मिलता है।' : 'Market prices are in the AI Advisor.'
  if (t.includes('योजना') || t.includes('scheme'))
    return isHi ? 'सरकारी योजनाओं के लिए AI सलाहकार उपयोग करें।' : 'Use AI Advisor for government schemes.'
  if (t.includes('ऋण') || t.includes('loan') || t.includes('कर्ज'))
    return isHi ? 'किसान क्रेडिट कार्ड के लिए नजदीकी बैंक जाएं।' : 'Visit nearest bank for Kisan Credit Card.'
  return isHi
    ? 'AI फसल सलाहकार में जाकर जानकारी भरें।'
    : 'Fill your details in the AI Crop Advisor.'
}

export const PAGE_GREETINGS = {
  home: {
    hi: 'किसान AI में आपका स्वागत है। यह भारतीय किसानों के लिए AI आधारित फसल सलाह सेवा है। मेनू में AI से सलाह लें बटन दबाकर फसल की जानकारी पाएं।',
    en: 'Welcome to Kisan AI, AI-powered crop advisory for Indian farmers.',
  },
  about: {
    hi: 'किसान AI के बारे में। हम भारतीय किसानों के लिए आधुनिक AI तकनीक लाते हैं।',
    en: 'About Kisan AI. We bring AI technology to Indian farmers.',
  },
  contact: {
    hi: 'हमसे संपर्क करें। अपना नाम, ईमेल और संदेश भरकर भेजें।',
    en: 'Contact us. Fill your name, email and message.',
  },
  advisor: {
    hi: 'AI फसल सलाहकार में आपका स्वागत है। अपना स्थान, मिट्टी का प्रकार, मौसम और पानी की सुविधा भरें। फिर बटन दबाएं।',
    en: 'Welcome to AI Crop Advisor. Fill your farm details and press the button.',
  },
}