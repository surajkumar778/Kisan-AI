// ============================================================
//  src/services/mandiService.js
//  Enriches Gemini crop recommendations with mandi price data.
// ============================================================
const { getPriceForCrop } = require('../config/mandiPrices');

/**
 * Adds mandiPrice field to each crop in the topCrops array.
 * @param {object[]} topCrops
 * @returns {object[]}
 */
function enrichWithMandiPrices(topCrops = []) {
  return topCrops.map(crop => ({
    ...crop,
    mandiPrice: getPriceForCrop(crop.mandiCropKey || crop.name),
  }));
}

module.exports = { enrichWithMandiPrices };
