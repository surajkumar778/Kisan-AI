// ============================================================
//  src/routes/recommendRoutes.js
// ============================================================
const express = require('express');
const { recommend } = require('../controllers/recommendController');
const { fetchWeather } = require('../services/weatherService');

const router = express.Router();

// ✅ POST /api/recommend
router.post('/recommend', recommend);

// ✅ NEW: GET /api/weather
router.get('/weather', async (req, res) => {
  try {
    const city = req.query.city;

    if (!city) {
      return res.status(400).json({
        success: false,
        error: 'City query parameter is required'
      });
    }

    const weather = await fetchWeather(city);

    res.json({
      success: true,
      city,
      weather
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;