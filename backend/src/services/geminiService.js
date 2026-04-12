// ============================================================
//  src/services/geminiService.js — LOCATION-SPECIFIC CROPS
// ============================================================
const { getModel }        = require('../config/gemini');
const { getFallbackData } = require('../utils/fallbackData');

async function generateRecommendations(params) {
  const { location, soilType, season, waterAvailability, farmSize, language, weather } = params;
  const isHindi = language === 'hi';

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.warn('⚠️  GEMINI_API_KEY not set — using location-based fallback');
    return getFallbackData(soilType, season, isHindi, location);
  }

  const prompt = _buildPrompt({ location, soilType, season, waterAvailability, farmSize, weather, isHindi });

  try {
    const model  = getModel();
    const result = await model.generateContent(prompt);
    const raw    = result.response.text().trim();
    console.log(`✅ Gemini responded for location: ${location}`);
    return _parseJson(raw, soilType, season, isHindi, location);
  } catch (err) {
    console.error('❌  Gemini API error:', err.message);
    return getFallbackData(soilType, season, isHindi, location);
  }
}

function _buildPrompt({ location, soilType, season, waterAvailability, farmSize, weather, isHindi }) {
  const langInstruction = isHindi
    ? 'Respond ENTIRELY in Hindi using Devanagari script. All text values in JSON must be in Hindi.'
    : 'Respond entirely in English.';

  return `
You are an expert Indian agricultural scientist. ${langInstruction}

CRITICAL INSTRUCTION: You MUST recommend crops that are SPECIFICALLY AND UNIQUELY suited to ${location}, India.
DO NOT give generic recommendations. The crops MUST be different for different locations.

For example:
- Rajasthan → Bajra, Jowar, Moth Bean, Cluster Bean, Sesame
- Punjab/Haryana → Wheat, Paddy, Sugarcane, Maize
- Maharashtra → Cotton, Soybean, Jowar, Tur Dal
- Kerala → Coconut, Rubber, Tapioca, Banana, Pepper
- West Bengal → Rice, Jute, Tea, Mustard, Potato
- Gujarat → Groundnut, Cotton, Castor, Cumin, Fennel
- Uttar Pradesh → Wheat, Sugarcane, Potato, Mentha, Mustard
- Madhya Pradesh → Soybean, Wheat, Gram, Lentil, Maize
- Andhra/Telangana → Paddy, Cotton, Chili, Tobacco, Sunflower
- Karnataka → Ragi, Jowar, Sunflower, Groundnut, Mulberry
- Bihar → Wheat, Maize, Lentil, Mustard, Litchi
- Himachal Pradesh → Apple, Pea, Potato, Wheat, Ginger

Farmer's Exact Details:
- Location: ${location}, India
- Soil Type: ${soilType}
- Season: ${season}
- Water: ${waterAvailability}
- Farm Size: ${farmSize ? farmSize + ' acres' : 'not specified'}
- Temperature: ${weather.temperature}°C
- Humidity: ${weather.humidity}%
- Weather: ${weather.description}
- Rainfall: ${weather.rainfall} mm

Based on the EXACT LOCATION "${location}" and all above parameters, recommend 3 crops
that are SPECIFICALLY grown in that region. The first crop must be the most iconic/famous
crop of that specific region.

Return ONLY raw JSON — no markdown, no backticks:

{
  "topCrops": [
    {
      "name": "crop name in English",
      "nameHindi": "फसल का नाम हिंदी में",
      "suitabilityScore": 95,
      "estimatedYield": "X-Y quintals/acre",
      "growingDuration": "X-Y days",
      "waterRequirement": "low/medium/high in the response language",
      "profitPotential": "low/medium/high in the response language",
      "whyRecommended": "2-3 sentences specifically mentioning ${location} and why this crop suits THIS location",
      "risks": "main risks for this crop in ${location}",
      "mandiCropKey": "wheat"
    }
  ],
  "farmingCalendar": [
    { "month": "Month", "activity": "activity", "icon": "🌱" }
  ],
  "soilPreparation": "advice specific to ${location} soil",
  "irrigationAdvice": "irrigation advice for ${location} climate",
  "fertilizerSchedule": "NPK schedule",
  "pestManagement": "pests common in ${location} region",
  "governmentSchemes": [
    { "name": "scheme", "benefit": "benefit", "link": "website" }
  ],
  "bankLoanAdvice": "KCC guidance",
  "expectedRevenue": "₹X - ₹Y per acre",
  "weatherAlert": "weather alert for ${location}"
}

Rules:
- Exactly 3 crops
- suitabilityScore: 0-100
- mandiCropKey must be one of: wheat, rice, maize, sugarcane, cotton, soybean, groundnut, mustard, tomato, onion, potato, chickpea, lentil, bajra, jowar, arhar, moong, sunflower
- farmingCalendar: 6-8 months for ${season}
- governmentSchemes: 3-4 relevant schemes
- MOST IMPORTANT: crops must be region-specific to ${location}
`.trim();
}

function _parseJson(raw, soilType, season, isHindi, location) {
  try {
    const clean = raw.replace(/```json|```/gi, '').trim();
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    return JSON.parse(clean);
  } catch (err) {
    console.error('❌  Failed to parse Gemini JSON:', err.message);
    console.error('    Raw (first 300 chars):', raw.slice(0, 300));
    return getFallbackData(soilType, season, isHindi, location);
  }
}

module.exports = { generateRecommendations };