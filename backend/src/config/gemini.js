// ============================================================
//  src/config/gemini.js
//  Initialises the Google Generative AI (Gemini) client.
// ============================================================
const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      '❌  GEMINI_API_KEY is missing in .env\n' +
      '    Get a free key at https://makersuite.google.com/app/apikey'
    );
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

// Returns the gemini-pro text model ready to call
function getModel() {
  return getGeminiClient().getGenerativeModel({ model: 'gemini-pro' });
}

module.exports = { getModel };
