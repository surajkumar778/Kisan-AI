// ============================================================
//  src/config/mandiPrices.js
//  MSP / Mandi price reference data for major Indian crops.
//  Source: CACP (Commission for Agricultural Costs & Prices)
//          Agmarknet live scraping can replace this later.
// ============================================================

const MANDI_PRICES = {
  wheat:      { min: 2100, max: 2400, unit: '₹/quintal', trend: 'stable',   msp: 2275 },
  rice:       { min: 1940, max: 2200, unit: '₹/quintal', trend: 'rising',   msp: 2183 },
  maize:      { min: 1700, max: 1950, unit: '₹/quintal', trend: 'stable',   msp: 2090 },
  sugarcane:  { min: 305,  max: 340,  unit: '₹/quintal', trend: 'stable',   msp: 315  },
  cotton:     { min: 6620, max: 7200, unit: '₹/quintal', trend: 'rising',   msp: 6620 },
  soybean:    { min: 4300, max: 4800, unit: '₹/quintal', trend: 'falling',  msp: 4600 },
  groundnut:  { min: 5550, max: 6100, unit: '₹/quintal', trend: 'rising',   msp: 5850 },
  mustard:    { min: 5200, max: 5650, unit: '₹/quintal', trend: 'stable',   msp: 5650 },
  tomato:     { min: 800,  max: 2500, unit: '₹/quintal', trend: 'volatile', msp: null },
  onion:      { min: 600,  max: 1800, unit: '₹/quintal', trend: 'volatile', msp: null },
  potato:     { min: 700,  max: 1200, unit: '₹/quintal', trend: 'stable',   msp: null },
  chickpea:   { min: 5100, max: 5500, unit: '₹/quintal', trend: 'rising',   msp: 5440 },
  lentil:     { min: 5500, max: 6200, unit: '₹/quintal', trend: 'rising',   msp: 6000 },
  bajra:      { min: 2150, max: 2400, unit: '₹/quintal', trend: 'stable',   msp: 2500 },
  jowar:      { min: 2970, max: 3200, unit: '₹/quintal', trend: 'stable',   msp: 3180 },
  arhar:      { min: 6000, max: 6600, unit: '₹/quintal', trend: 'rising',   msp: 7000 },
  moong:      { min: 7200, max: 7800, unit: '₹/quintal', trend: 'stable',   msp: 8558 },
  sunflower:  { min: 5800, max: 6400, unit: '₹/quintal', trend: 'rising',   msp: 6760 },
};

/**
 * Fuzzy-match a crop name to our price map.
 * Returns price entry or a default fallback.
 */
function getPriceForCrop(cropName) {
  if (!cropName) return _default();
  const key = cropName.toLowerCase().trim()
    .replace(/\s+/g, '')
    .replace(/[^a-z]/g, '');

  // Direct match
  if (MANDI_PRICES[key]) return MANDI_PRICES[key];

  // Partial match
  const match = Object.keys(MANDI_PRICES).find(k => key.includes(k) || k.includes(key));
  return match ? MANDI_PRICES[match] : _default();
}

function _default() {
  return { min: 2000, max: 3500, unit: '₹/quintal', trend: 'stable', msp: null };
}

module.exports = { MANDI_PRICES, getPriceForCrop };
