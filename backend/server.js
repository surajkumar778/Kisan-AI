// ============================================================
//  backend/server.js  —  Express entry point
// ============================================================
require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');

const { rateLimiter }   = require('./src/middleware/rateLimiter');
const { requestLogger } = require('./src/middleware/requestLogger');
const { errorHandler }  = require('./src/middleware/errorHandler');

const recommendRoutes = require('./src/routes/recommendRoutes');
const healthRoutes    = require('./src/routes/healthRoutes');
const ttsRoutes       = require('./src/routes/ttsRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security ────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));

// ── CORS ────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://kisan-ai-nalh.vercel.app',
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Logging ─────────────────────────────────────────────────
app.use(requestLogger);

// ── Rate Limiting ───────────────────────────────────────────
app.use('/api/', rateLimiter);

// ── API Routes ──────────────────────────────────────────────
app.use('/api', recommendRoutes);
app.use('/api', healthRoutes);
app.use('/api', ttsRoutes);

// ── Root Route (IMPORTANT FIX) ──────────────────────────────
app.get('/', (_req, res) => {
  res.send('Kisan AI Backend is running 🚀');
});

// ── Error Handler ───────────────────────────────────────────
app.use(errorHandler);

// ── Start Server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n╔═══════════════════════════════════════════════╗');
  console.log('║   🌾  KISAN AI  —  Backend Server Started      ║');
  console.log(`║   🌐  API:      http://localhost:${PORT}/api      ║`);
  console.log(`║   🔊  TTS:      http://localhost:${PORT}/api/tts  ║`);
  console.log(`║   📋  Health:   http://localhost:${PORT}/api/health║`);
  console.log(`║   🤖  Gemini:   ${process.env.GEMINI_API_KEY  && process.env.GEMINI_API_KEY  !== 'your_gemini_api_key_here'  ? '✅ configured' : '❌ MISSING'}`);
  console.log(`║   ☁️   Weather:  ${process.env.OPENWEATHER_API_KEY ? '✅ configured' : '❌ MISSING'}`);
  console.log('╚═══════════════════════════════════════════════╝\n');
});

module.exports = app;