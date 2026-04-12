// ============================================================
//  src/utils/validators.js
//  Manual input validation (no extra dep like Joi needed).
// ============================================================

const VALID_SOILS   = ['alluvial','black cotton','red laterite','sandy loam','clay loam','saline','acidic'];
const VALID_SEASONS = ['Kharif (June-November)','Rabi (November-April)','Zaid (March-June)'];
const VALID_WATER   = [
  'high - canal/tubewell available',
  'medium - seasonal irrigation',
  'low - rain-fed only',
  'drip irrigation available',
];
const VALID_LANGS   = ['hi', 'en'];

/**
 * Validates the body of POST /api/recommend
 * @returns {{ error: null|{details:[{message:string}]}, value: object }}
 */
function validateRecommendRequest(body = {}) {
  const errors = [];

  const location          = (body.location          || '').trim();
  const soilType          = (body.soilType          || '').trim();
  const season            = (body.season            || '').trim();
  const waterAvailability = (body.waterAvailability || '').trim();
  const language          = (body.language          || 'en').trim();
  const farmSize          = body.farmSize ? String(body.farmSize).trim() : null;

  if (!location)                            errors.push({ message: 'location is required' });
  if (location.length > 100)                errors.push({ message: 'location must be ≤ 100 chars' });

  if (!soilType)                            errors.push({ message: 'soilType is required' });
  if (!VALID_SOILS.includes(soilType))      errors.push({ message: `soilType must be one of: ${VALID_SOILS.join(', ')}` });

  if (!season)                              errors.push({ message: 'season is required' });
  if (!VALID_SEASONS.includes(season))      errors.push({ message: `season must be one of: ${VALID_SEASONS.join(', ')}` });

  if (!waterAvailability)                   errors.push({ message: 'waterAvailability is required' });
  if (!VALID_WATER.includes(waterAvailability)) errors.push({ message: `waterAvailability must be one of: ${VALID_WATER.join(' | ')}` });

  if (!VALID_LANGS.includes(language))      errors.push({ message: `language must be 'hi' or 'en'` });

  if (farmSize !== null) {
    const n = parseFloat(farmSize);
    if (isNaN(n) || n <= 0 || n > 10000)    errors.push({ message: 'farmSize must be a positive number ≤ 10000' });
  }

  if (errors.length) return { error: { details: errors }, value: null };
  return { error: null, value: { location, soilType, season, waterAvailability, language, farmSize } };
}

module.exports = { validateRecommendRequest };
