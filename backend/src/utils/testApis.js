// ============================================================
//  src/utils/testApis.js
//  Run:  npm test   — verifies both API keys work correctly
// ============================================================
require('dotenv').config();
const axios = require('axios');
const { getModel } = require('../config/gemini');

async function testWeather() {
  console.log('\n☁️  Testing OpenWeatherMap API...');
  const key = process.env.WEATHER_API_KEY;
  if (!key || key === 'your_openweathermap_api_key_here') {
    console.log('   ⚠️  WEATHER_API_KEY not set in .env — skipping');
    return false;
  }
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Lucknow,IN&appid=${key}&units=metric`;
    const { data } = await axios.get(url, { timeout: 8000 });
    console.log(`   ✅  Weather OK — Lucknow: ${data.main.temp}°C, ${data.weather[0].description}`);
    return true;
  } catch (err) {
    const msg = err.response?.status === 401
      ? 'Invalid API key'
      : err.response?.status === 404
        ? 'City not found'
        : err.message;
    console.log(`   ❌  Weather FAILED: ${msg}`);
    return false;
  }
}

async function testGemini() {
  console.log('\n🤖  Testing Gemini API...');
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'your_gemini_api_key_here') {
    console.log('   ⚠️  GEMINI_API_KEY not set in .env — skipping');
    return false;
  }
  try {
    const model  = getModel();
    const result = await model.generateContent('Reply with exactly: OK');
    const text   = result.response.text().trim();
    console.log(`   ✅  Gemini OK — response: "${text}"`);
    return true;
  } catch (err) {
    console.log(`   ❌  Gemini FAILED: ${err.message}`);
    return false;
  }
}

async function testRecommendEndpoint() {
  console.log('\n🌾  Testing /api/recommend endpoint...');
  try {
    const { data } = await axios.post('http://localhost:3000/api/recommend', {
      location:          'Lucknow',
      soilType:          'alluvial',
      season:            'Rabi (November-April)',
      waterAvailability: 'medium - seasonal irrigation',
      farmSize:          '2',
      language:          'en',
    }, { timeout: 30000 });

    if (data.success) {
      console.log(`   ✅  Endpoint OK`);
      console.log(`       Weather: ${data.weather.temperature}°C in ${data.weather.city}`);
      console.log(`       Top crop: ${data.recommendations.topCrops?.[0]?.name}`);
      console.log(`       Revenue:  ${data.recommendations.expectedRevenue}`);
    } else {
      console.log('   ❌  Endpoint returned success:false', data.error);
    }
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      console.log('   ⚠️  Server not running — start with: npm run dev');
    } else {
      console.log('   ❌  Endpoint FAILED:', err.message);
    }
  }
}

(async () => {
  console.log('═══════════════════════════════════════════');
  console.log('  KISAN AI — API Integration Test Suite  ');
  console.log('═══════════════════════════════════════════');

  const weatherOk = await testWeather();
  const geminiOk  = await testGemini();
  await testRecommendEndpoint();

  console.log('\n─── Summary ────────────────────────────────');
  console.log(`  Weather API : ${weatherOk ? '✅ Working' : '⚠️  Using fallback demo data'}`);
  console.log(`  Gemini API  : ${geminiOk  ? '✅ Working' : '⚠️  Using fallback recommendations'}`);
  console.log('────────────────────────────────────────────');
  console.log('  App works even without API keys (demo mode)');
  console.log('════════════════════════════════════════════\n');
})();
