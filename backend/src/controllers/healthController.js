// ============================================================
//  src/controllers/healthController.js
//  GET /api/health  — quick server status check
// ============================================================

function health(_req, res) {
  res.json({
    status:           'ok',
    timestamp:        new Date().toISOString(),
    uptime:           Math.floor(process.uptime()) + 's',
    geminiConfigured: !!(process.env.GEMINI_API_KEY  && process.env.GEMINI_API_KEY  !== 'your_gemini_api_key_here'),
    weatherConfigured:!!(process.env.WEATHER_API_KEY && process.env.WEATHER_API_KEY !== 'your_openweathermap_api_key_here'),
    node:             process.version,
  });
}

module.exports = { health };
