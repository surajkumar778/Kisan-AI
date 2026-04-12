// ============================================================
//  src/routes/ttsRoutes.js — Hindi TTS Proxy (Axios version)
//  GET /api/tts?text=नमस्ते&lang=hi
//  Uses axios to fetch Google TTS audio and pipe to client
// ============================================================
const express = require('express')
const axios   = require('axios')
const router  = express.Router()

router.get('/tts', async (req, res) => {
  const text = (req.query.text || '').trim().slice(0, 200)
  const lang = req.query.lang === 'en' ? 'en' : 'hi'

  if (!text) return res.status(400).json({ error: 'text required' })

  const urls = [
    `https://translate.googleapis.com/translate_tts?ie=UTF-8&tl=${lang}&client=gtx&q=${encodeURIComponent(text)}`,
    `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(text)}`,
  ]

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer':    'https://translate.google.com/',
    'Accept':     'audio/mpeg, audio/mp3, audio/*, */*',
    'Accept-Language': 'hi-IN,hi;q=0.9,en;q=0.8',
  }

  for (const url of urls) {
    try {
      const response = await axios.get(url, {
        headers,
        responseType: 'stream',
        timeout: 10000,
        maxRedirects: 5,
      })

      res.setHeader('Content-Type', response.headers['content-type'] || 'audio/mpeg')
      res.setHeader('Cache-Control', 'public, max-age=86400')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('X-TTS-Lang', lang)

      response.data.pipe(res)
      return

    } catch (err) {
      console.warn(`[TTS] URL failed: ${url.slice(0, 60)}... — ${err.message}`)
    }
  }

  if (!res.headersSent) {
    res.status(502).json({ error: 'TTS service unavailable' })
  }
})

module.exports = router