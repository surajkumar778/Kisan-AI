const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Token nahi mila — login karein' })
    }
    const token = authHeader.split(' ')[1]
    const ticket = await client.verifyIdToken({
      idToken:  token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    req.user = {
      googleId: payload.sub,
      email:    payload.email,
      name:     payload.name,
      avatar:   payload.picture,
    }
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token — dobara login karein' })
  }
}

module.exports = authMiddleware