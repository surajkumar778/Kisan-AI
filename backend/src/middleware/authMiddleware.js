// ============================================================
//  src/middleware/authMiddleware.js — JWT verify (matches authRoutes)
// ============================================================
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'kisan-ai-secret-key'

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Token nahi mila — login karein' })
    }

    const token   = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)

    // decoded = { id, email, name } — from generateToken in authRoutes
    req.user = {
      googleId: decoded.id,   // _id use kar rahe hain as googleId
      email:    decoded.email,
      name:     decoded.name,
    }

    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token — dobara login karein' })
  }
}

module.exports = authMiddleware