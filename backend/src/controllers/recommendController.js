// ============================================================
//  src/controllers/recommendController.js
//  Handles POST /api/recommend
//  Orchestrates: validate → weather → Gemini → mandi → respond
// ============================================================
const { fetchWeather }             = require('../services/weatherService');
const { generateRecommendations }  = require('../services/geminiService');
const { enrichWithMandiPrices }    = require('../services/mandiService');
const { validateRecommendRequest } = require('../utils/validators');

/**
 * POST /api/recommend
 */
async function recommend(req, res, next) {
  try {
    // 1. Validate input ─────────────────────────────────────
    const { error, value } = validateRecommendRequest(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error:   'Validation failed',
        details: error.details.map(d => d.message),
      });
    }

    const { location, soilType, season, waterAvailability, farmSize, language } = value;

    // 2. Fetch weather ───────────────────────────────────────
    const weather = await fetchWeather(location);

    // 3. Gemini AI recommendations ───────────────────────────
    const aiData = await generateRecommendations({
      location, soilType, season, waterAvailability,
      farmSize, language, weather,
    });

    // 4. Enrich with mandi prices ────────────────────────────
    if (Array.isArray(aiData.topCrops)) {
      aiData.topCrops = enrichWithMandiPrices(aiData.topCrops);
    }

    // 5. Respond ─────────────────────────────────────────────
    return res.json({
      success:     true,
      generatedAt: new Date().toISOString(),
      inputData:   { location, soilType, season, waterAvailability, farmSize, language },
      weather,
      recommendations: aiData,
    });

  } catch (err) {
    next(err);   // passed to global errorHandler middleware
  }
}

module.exports = { recommend };
