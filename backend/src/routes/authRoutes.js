// ============================================================
//  src/routes/authRoutes.js
// ============================================================
const express  = require('express')
const bcrypt   = require('bcryptjs')
const jwt      = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const User     = require('../models/User')
const router   = express.Router()

const client   = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const JWT_SECRET = process.env.JWT_SECRET || 'kisan-ai-secret-key'

// ── Helper: generate JWT ─────────────────────────────────────
function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// ── POST /api/auth/register ──────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ success: false, error: 'सभी जानकारी भरें' })

    const exists = await User.findOne({ email })
    if (exists)
      return res.status(400).json({ success: false, error: 'यह email पहले से registered है' })

    const hashed = await bcrypt.hash(password, 10)
    const user   = await User.create({ name, email, password: hashed, provider: 'email' })
    const token  = generateToken(user)

    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ── POST /api/auth/login ─────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ success: false, error: 'Email और password डालें' })

    const user = await User.findOne({ email })
    if (!user || !user.password)
      return res.status(400).json({ success: false, error: 'Email या password गलत है' })

    const match = await bcrypt.compare(password, user.password)
    if (!match)
      return res.status(400).json({ success: false, error: 'Email या password गलत है' })

    const token = generateToken(user)
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ── POST /api/auth/google ────────────────────────────────────
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body
    const ticket = await client.verifyIdToken({
      idToken:  credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const { name, email, picture, sub } = ticket.getPayload()

    let user = await User.findOne({ email })
    if (!user) {
      user = await User.create({
        name, email,
        googleId: sub,
        avatar:   picture,
        provider: 'google',
      })
    }

    const token = generateToken(user)
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } })
  } catch (err) {
    res.status(400).json({ success: false, error: 'Google login failed: ' + err.message })
  }
})

// ── GET /api/auth/me ─────────────────────────────────────────
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ success: false, error: 'Token missing' })
    const decoded = jwt.verify(token, JWT_SECRET)
    const user    = await User.findById(decoded.id).select('-password')
    res.json({ success: true, user })
  } catch (err) {
    res.status(401).json({ success: false, error: 'Invalid token' })
  }
})

module.exports = router