// ============================================================
//  src/config/gemini.js
// ============================================================
const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('❌ GEMINI_API_KEY is missing in .env');
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

function getModel() {
  return getGeminiClient().getGenerativeModel({ model: "gemini-1.5-flash-latest" });
}

module.exports = { getModel };
