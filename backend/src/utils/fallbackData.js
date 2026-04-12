// ============================================================
//  fallbackData.js — LOCATION-SPECIFIC fallback crops
//  Used when Gemini API is not configured or fails
// ============================================================

// ── Location → crop mapping ──────────────────────────────────
const LOCATION_CROPS = {
  // Rajasthan
  rajasthan:  ['bajra', 'jowar', 'mothbeans'],
  jodhpur:    ['bajra', 'jowar', 'mothbeans'],
  jaipur:     ['bajra', 'mustard', 'wheat'],
  bikaner:    ['bajra', 'mothbeans', 'jowar'],
  udaipur:    ['maize', 'wheat', 'soybean'],
  kota:       ['soybean', 'wheat', 'mustard'],
  ajmer:      ['wheat', 'mustard', 'bajra'],

  // Punjab & Haryana
  punjab:     ['wheat', 'rice', 'sugarcane'],
  ludhiana:   ['wheat', 'rice', 'potato'],
  amritsar:   ['wheat', 'rice', 'maize'],
  haryana:    ['wheat', 'rice', 'sugarcane'],
  chandigarh: ['wheat', 'rice', 'sugarcane'],

  // Uttar Pradesh
  lucknow:    ['sugarcane', 'wheat', 'mentha'],
  varanasi:   ['wheat', 'rice', 'mustard'],
  agra:       ['wheat', 'mustard', 'potato'],
  meerut:     ['sugarcane', 'wheat', 'rice'],
  kanpur:     ['wheat', 'mustard', 'chickpea'],
  allahabad:  ['wheat', 'rice', 'potato'],
  gorakhpur:  ['sugarcane', 'rice', 'wheat'],
  mathura:    ['wheat', 'mustard', 'potato'],
  bareilly:   ['sugarcane', 'wheat', 'mentha'],
  moradabad:  ['sugarcane', 'wheat', 'rice'],

  // Maharashtra
  maharashtra:['cotton', 'soybean', 'jowar'],
  mumbai:     ['rice', 'jowar', 'groundnut'],
  pune:       ['sugarcane', 'grapes', 'wheat'],
  nagpur:     ['cotton', 'soybean', 'orange'],
  nashik:     ['grapes', 'onion', 'tomato'],
  aurangabad: ['cotton', 'soybean', 'jowar'],
  solapur:    ['sugarcane', 'jowar', 'cotton'],

  // Gujarat
  gujarat:    ['groundnut', 'cotton', 'castor'],
  ahmedabad:  ['groundnut', 'cotton', 'wheat'],
  surat:      ['sugarcane', 'rice', 'groundnut'],
  vadodara:   ['groundnut', 'cotton', 'maize'],
  rajkot:     ['groundnut', 'cotton', 'wheat'],

  // Madhya Pradesh
  'madhya pradesh': ['soybean', 'wheat', 'chickpea'],
  bhopal:     ['soybean', 'wheat', 'chickpea'],
  indore:     ['soybean', 'wheat', 'garlic'],
  gwalior:    ['wheat', 'mustard', 'soybean'],
  jabalpur:   ['rice', 'wheat', 'soybean'],

  // Karnataka
  karnataka:  ['ragi', 'jowar', 'sunflower'],
  bangalore:  ['ragi', 'tomato', 'flowers'],
  mysore:     ['ragi', 'sugarcane', 'jowar'],
  hubli:      ['cotton', 'jowar', 'groundnut'],

  // Kerala
  kerala:     ['coconut', 'rubber', 'tapioca'],
  thiruvananthapuram: ['coconut', 'banana', 'tapioca'],
  kochi:      ['coconut', 'rubber', 'pepper'],
  kozhikode:  ['coconut', 'banana', 'ginger'],

  // West Bengal
  'west bengal': ['rice', 'jute', 'potato'],
  kolkata:    ['rice', 'jute', 'vegetables'],
  darjeeling: ['tea', 'ginger', 'cardamom'],

  // Andhra Pradesh / Telangana
  hyderabad:  ['rice', 'cotton', 'maize'],
  'andhra pradesh': ['rice', 'cotton', 'chili'],
  telangana:  ['rice', 'cotton', 'soybean'],
  guntur:     ['chili', 'cotton', 'rice'],
  vizag:      ['rice', 'sugarcane', 'groundnut'],

  // Tamil Nadu
  'tamil nadu': ['rice', 'sugarcane', 'banana'],
  chennai:    ['rice', 'groundnut', 'vegetables'],
  coimbatore: ['sugarcane', 'coconut', 'banana'],
  madurai:    ['rice', 'banana', 'cotton'],

  // Bihar
  bihar:      ['wheat', 'rice', 'maize'],
  patna:      ['wheat', 'rice', 'mustard'],
  muzaffarpur:['litchi', 'maize', 'wheat'],
  gaya:       ['wheat', 'rice', 'lentil'],

  // Himachal Pradesh
  himachal:   ['apple', 'pea', 'potato'],
  shimla:     ['apple', 'pea', 'wheat'],
  manali:     ['apple', 'pea', 'potato'],
  dharamshala:['tea', 'ginger', 'wheat'],

  // Uttarakhand
  uttarakhand:['wheat', 'rice', 'mandua'],
  dehradun:   ['wheat', 'rice', 'lychee'],
  haridwar:   ['sugarcane', 'wheat', 'rice'],

  // Chhattisgarh
  chhattisgarh: ['rice', 'maize', 'soybean'],
  raipur:     ['rice', 'maize', 'arhar'],

  // Odisha
  odisha:     ['rice', 'jute', 'groundnut'],
  bhubaneswar:['rice', 'jute', 'sugarcane'],

  // Jharkhand
  jharkhand:  ['rice', 'maize', 'arhar'],
  ranchi:     ['rice', 'maize', 'potato'],

  // Default
  default:    ['wheat', 'rice', 'maize'],
}

// ── Crop detail database ──────────────────────────────────────
const CROP_DATA = {
  wheat: {
    name: 'Wheat', nameHindi: 'गेहूँ', yield: '22-28 quintals/acre',
    duration: '120-130 days', water: { en:'Medium', hi:'मध्यम' }, profit: { en:'High', hi:'उच्च' },
    why: { en:'Ideal rabi crop with strong MSP support.', hi:'रबी की आदर्श फसल, MSP समर्थन अच्छा है।' },
    risks: { en:'Frost and rust disease risk.', hi:'पाला और जंग रोग से बचाव जरूरी।' }, key:'wheat', score: 90,
  },
  rice: {
    name: 'Rice', nameHindi: 'धान', yield: '18-25 quintals/acre',
    duration: '100-150 days', water: { en:'High', hi:'अधिक' }, profit: { en:'High', hi:'उच्च' },
    why: { en:'Staple kharif crop well suited to this region.', hi:'इस क्षेत्र की प्रमुख खरीफ फसल।' },
    risks: { en:'Blast disease and stem borer.', hi:'ब्लास्ट रोग और तना छेदक।' }, key:'rice', score: 88,
  },
  bajra: {
    name: 'Bajra (Pearl Millet)', nameHindi: 'बाजरा', yield: '10-15 quintals/acre',
    duration: '75-90 days', water: { en:'Very Low', hi:'बहुत कम' }, profit: { en:'Medium', hi:'मध्यम' },
    why: { en:'Best crop for dry regions like Rajasthan — thrives in sandy soil with minimal water.', hi:'राजस्थान जैसे सूखे क्षेत्रों के लिए सर्वोत्तम — बालुई मिट्टी में कम पानी में उगती है।' },
    risks: { en:'Downy mildew disease.', hi:'मृदुरोमिल आसिता रोग।' }, key:'bajra', score: 92,
  },
  jowar: {
    name: 'Jowar (Sorghum)', nameHindi: 'जोवार', yield: '12-18 quintals/acre',
    duration: '90-120 days', water: { en:'Low', hi:'कम' }, profit: { en:'Medium', hi:'मध्यम' },
    why: { en:'Drought-resistant crop ideal for dry regions, used as food and fodder.', hi:'सूखा प्रतिरोधी फसल, भोजन और चारे के लिए उपयुक्त।' },
    risks: { en:'Shoot fly and stem borer.', hi:'शूट फ्लाई और तना छेदक।' }, key:'jowar', score: 85,
  },
  mothbeans: {
    name: 'Moth Beans', nameHindi: 'मोठ', yield: '4-6 quintals/acre',
    duration: '60-75 days', water: { en:'Very Low', hi:'बहुत कम' }, profit: { en:'Medium', hi:'मध्यम' },
    why: { en:'Extremely drought-tolerant legume, perfect for arid Rajasthan conditions.', hi:'अत्यंत सूखा सहिष्णु दलहन, राजस्थान की शुष्क परिस्थितियों के लिए आदर्श।' },
    risks: { en:'Pod borer and leaf spot.', hi:'फली छेदक और पत्ती धब्बा।' }, key:'arhar', score: 88,
  },
  mustard: {
    name: 'Mustard', nameHindi: 'सरसों', yield: '8-12 quintals/acre',
    duration: '110-120 days', water: { en:'Low', hi:'कम' }, profit: { en:'High', hi:'उच्च' },
    why: { en:'High-value oilseed crop with excellent market demand.', hi:'कम पानी में उत्कृष्ट उपज, तेल उद्योग की मांग के कारण अच्छा भाव।' },
    risks: { en:'Aphid and white rust.', hi:'माहू कीट और सफेद रतुआ।' }, key:'mustard', score: 85,
  },
  cotton: {
    name: 'Cotton', nameHindi: 'कपास', yield: '8-15 quintals/acre',
    duration: '150-180 days', water: { en:'Medium', hi:'मध्यम' }, profit: { en:'High', hi:'उच्च' },
    why: { en:'Cash crop with strong textile industry demand, well suited to black cotton soil.', hi:'काली मिट्टी के लिए उत्तम नकदी फसल, कपड़ा उद्योग की मांग अधिक।' },
    risks: { en:'Bollworm and whitefly.', hi:'बॉलवर्म और सफेद मक्खी।' }, key:'cotton', score: 87,
  },
  soybean: {
    name: 'Soybean', nameHindi: 'सोयाबीन', yield: '8-12 quintals/acre',
    duration: '90-100 days', water: { en:'Medium', hi:'मध्यम' }, profit: { en:'High', hi:'उच्च' },
    why: { en:'Leading kharif oilseed in central India with good MSP and market demand.', hi:'मध्य भारत की प्रमुख खरीफ तिलहन फसल, अच्छा MSP और बाजार।' },
    risks: { en:'Yellow mosaic virus and stem fly.', hi:'पीला मोज़ेक वायरस और तना मक्खी।' }, key:'soybean', score: 86,
  },
  groundnut: {
    name: 'Groundnut', nameHindi: 'मूंगफली', yield: '10-15 quintals/acre',
    duration: '90-120 days', water: { en:'Medium', hi:'मध्यम' }, profit: { en:'High', hi:'उच्च' },
    why: { en:'Most important oilseed of Gujarat, grows well in sandy loam soil.', hi:'गुजरात की सबसे महत्वपूर्ण तिलहन फसल, बालुई दोमट में उत्तम।' },
    risks: { en:'Leaf spot and aflatoxin in storage.', hi:'पत्ती धब्बा और भंडारण में अफ्लाटॉक्सिन।' }, key:'groundnut', score: 89,
  },
  sugarcane: {
    name: 'Sugarcane', nameHindi: 'गन्ना', yield: '250-350 quintals/acre',
    duration: '10-12 months', water: { en:'High', hi:'अधिक' }, profit: { en:'High', hi:'उच्च' },
    why: { en:'High-value crop with guaranteed mill purchase, ideal for irrigated regions.', hi:'उच्च मूल्य फसल, मिल खरीद की गारंटी, सिंचित क्षेत्रों के लिए आदर्श।' },
    risks: { en:'Red rot disease and pyrilla pest.', hi:'लाल सड़न रोग और पाइरिला।' }, key:'sugarcane', score: 85,
  },
  maize: {
    name: 'Maize', nameHindi: 'मक्का', yield: '20-28 quintals/acre',
    duration: '80-90 days', water: { en:'Medium', hi:'मध्यम' }, profit: { en:'Medium', hi:'मध्यम' },
    why: { en:'Versatile crop for food, feed and industry with quick returns.', hi:'खाद्य, चारा और उद्योग के लिए उपयोगी फसल, जल्दी आय।' },
    risks: { en:'Fall armyworm and stem borer.', hi:'फॉल आर्मीवर्म और तना छेदक।' }, key:'maize', score: 82,
  },
  chickpea: {
    name: 'Chickpea (Gram)', nameHindi: 'चना', yield: '6-9 quintals/acre',
    duration: '95-110 days', water: { en:'Low', hi:'कम' }, profit: { en:'Medium', hi:'मध्यम' },
    why: { en:'Low-water rabi pulse that fixes nitrogen and improves soil fertility.', hi:'कम पानी की रबी दलहन, नाइट्रोजन स्थिरीकरण से मिट्टी उपजाऊ होती है।' },
    risks: { en:'Wilt disease and pod borer.', hi:'उकठा रोग और फली छेदक।' }, key:'chickpea', score: 80,
  },
  potato: {
    name: 'Potato', nameHindi: 'आलू', yield: '80-120 quintals/acre',
    duration: '70-90 days', water: { en:'Medium', hi:'मध्यम' }, profit: { en:'High', hi:'उच्च' },
    why: { en:'High-value vegetable crop with year-round market demand.', hi:'उच्च मूल्य सब्जी फसल, साल भर बाजार मांग।' },
    risks: { en:'Late blight and aphid.', hi:'पछेती झुलसा और माहू।' }, key:'potato', score: 84,
  },
  coconut: {
    name: 'Coconut', nameHindi: 'नारियल', yield: '60-80 nuts/tree/year',
    duration: 'Perennial', water: { en:'High', hi:'अधिक' }, profit: { en:'High', hi:'उच्च' },
    why: { en:'Most important plantation crop of Kerala, multiple uses from copra to coir.', hi:'केरल की सबसे महत्वपूर्ण बागान फसल, कई उपयोग।' },
    risks: { en:'Root wilt disease and rhinoceros beetle.', hi:'जड़ सड़न रोग और गैंडा भृंग।' }, key:'rice', score: 91,
  },
  ragi: {
    name: 'Ragi (Finger Millet)', nameHindi: 'रागी', yield: '8-12 quintals/acre',
    duration: '90-120 days', water: { en:'Low', hi:'कम' }, profit: { en:'Medium', hi:'मध्यम' },
    why: { en:'Most important millet of Karnataka, rich in calcium and iron, low input cost.', hi:'कर्नाटक का सबसे महत्वपूर्ण मोटा अनाज, कैल्शियम और आयरन से भरपूर।' },
    risks: { en:'Blast disease and finger millet aphid.', hi:'ब्लास्ट रोग और माहू।' }, key:'bajra', score: 88,
  },
  arhar: {
    name: 'Arhar (Tur Dal)', nameHindi: 'अरहर', yield: '6-10 quintals/acre',
    duration: '150-180 days', water: { en:'Low', hi:'कम' }, profit: { en:'High', hi:'उच्च' },
    why: { en:'Important kharif pulse with high market value and drought tolerance.', hi:'महत्वपूर्ण खरीफ दलहन, उच्च बाजार मूल्य और सूखा सहिष्णु।' },
    risks: { en:'Wilt and pod borer.', hi:'उकठा और फली छेदक।' }, key:'arhar', score: 83,
  },
  sunflower: {
    name: 'Sunflower', nameHindi: 'सूरजमुखी', yield: '6-10 quintals/acre',
    duration: '90-100 days', water: { en:'Medium', hi:'मध्यम' }, profit: { en:'High', hi:'उच्च' },
    why: { en:'High-value oilseed with year-round cultivation potential.', hi:'उच्च मूल्य तिलहन, वर्षभर खेती की संभावना।' },
    risks: { en:'Head rot and aphid.', hi:'सिर सड़न और माहू।' }, key:'sunflower', score: 82,
  },
  lentil: {
    name: 'Lentil (Masoor)', nameHindi: 'मसूर', yield: '5-8 quintals/acre',
    duration: '90-110 days', water: { en:'Low', hi:'कम' }, profit: { en:'Medium', hi:'मध्यम' },
    why: { en:'Cool-season pulse with good protein content and market demand.', hi:'ठंडे मौसम की दलहन, अच्छी प्रोटीन और बाजार मांग।' },
    risks: { en:'Rust and wilt.', hi:'जंग और उकठा।' }, key:'lentil', score: 80,
  },
  mentha: {
    name: 'Mentha (Mint)', nameHindi: 'मेंथा', yield: '100-150 kg oil/acre',
    duration: '90-100 days', water: { en:'High', hi:'अधिक' }, profit: { en:'Very High', hi:'बहुत उच्च' },
    why: { en:'High-value aromatic crop, UP produces 80% of world\'s mint oil.', hi:'उच्च मूल्य सुगंधित फसल, यूपी विश्व का 80% मेंथा तेल उत्पादित करता है।' },
    risks: { en:'Alternaria blight and root rot.', hi:'अल्टरनेरिया झुलसा और जड़ सड़न।' }, key:'maize', score: 86,
  },
  apple: {
    name: 'Apple', nameHindi: 'सेब', yield: '80-120 quintals/acre',
    duration: 'Perennial', water: { en:'Medium', hi:'मध्यम' }, profit: { en:'Very High', hi:'बहुत उच्च' },
    why: { en:'Himachal Pradesh is India\'s top apple producer, ideal temperate climate.', hi:'हिमाचल प्रदेश भारत का शीर्ष सेब उत्पादक, उत्तम समशीतोष्ण जलवायु।' },
    risks: { en:'Scab, fire blight and wooly aphid.', hi:'स्कैब, आग झुलसा और माहू।' }, key:'maize', score: 92,
  },
}

// ── Match location to crop keys ───────────────────────────────
function getCropsForLocation(location) {
  if (!location) return LOCATION_CROPS.default

  const loc = location.toLowerCase().trim()

  // Exact match
  if (LOCATION_CROPS[loc]) return LOCATION_CROPS[loc]

  // Partial match
  for (const [key, crops] of Object.entries(LOCATION_CROPS)) {
    if (loc.includes(key) || key.includes(loc)) return crops
  }

  // State-level keyword match
  if (loc.includes('rajasthan') || loc.includes('desert') || loc.includes('thar'))
    return LOCATION_CROPS.rajasthan
  if (loc.includes('punjab') || loc.includes('ludhiana') || loc.includes('amritsar'))
    return LOCATION_CROPS.punjab
  if (loc.includes('haryana') || loc.includes('gurgaon') || loc.includes('faridabad'))
    return LOCATION_CROPS.haryana
  if (loc.includes('up') || loc.includes('uttar pradesh') || loc.includes('lucknow'))
    return LOCATION_CROPS.lucknow
  if (loc.includes('maharashtra') || loc.includes('vidarbha'))
    return LOCATION_CROPS.maharashtra
  if (loc.includes('gujarat') || loc.includes('saurashtra'))
    return LOCATION_CROPS.gujarat
  if (loc.includes('mp') || loc.includes('madhya pradesh'))
    return LOCATION_CROPS['madhya pradesh']
  if (loc.includes('karnataka') || loc.includes('mysore') || loc.includes('bengaluru'))
    return LOCATION_CROPS.karnataka
  if (loc.includes('kerala'))
    return LOCATION_CROPS.kerala
  if (loc.includes('west bengal') || loc.includes('bengal') || loc.includes('kolkata'))
    return LOCATION_CROPS['west bengal']
  if (loc.includes('andhra') || loc.includes('telangana') || loc.includes('hyderabad'))
    return LOCATION_CROPS.hyderabad
  if (loc.includes('tamil') || loc.includes('tamilnadu') || loc.includes('tn'))
    return LOCATION_CROPS['tamil nadu']
  if (loc.includes('bihar') || loc.includes('patna'))
    return LOCATION_CROPS.bihar
  if (loc.includes('himachal') || loc.includes('shimla') || loc.includes('manali'))
    return LOCATION_CROPS.himachal
  if (loc.includes('uttarakhand') || loc.includes('dehradun'))
    return LOCATION_CROPS.uttarakhand
  if (loc.includes('chhattisgarh') || loc.includes('raipur'))
    return LOCATION_CROPS.chhattisgarh
  if (loc.includes('odisha') || loc.includes('orissa'))
    return LOCATION_CROPS.odisha
  if (loc.includes('jharkhand') || loc.includes('ranchi'))
    return LOCATION_CROPS.jharkhand

  return LOCATION_CROPS.default
}

// ── Main export ───────────────────────────────────────────────
function getFallbackData(soilType, season, isHindi, location = '') {
  const cropKeys = getCropsForLocation(location)
  const hi = isHindi

  const topCrops = cropKeys.slice(0, 3).map((key, i) => {
    const c = CROP_DATA[key] || CROP_DATA.wheat
    return {
      name:             c.name,
      nameHindi:        c.nameHindi,
      suitabilityScore: Math.max(75, c.score - i * 5),
      estimatedYield:   c.yield,
      growingDuration:  c.duration,
      waterRequirement: hi ? c.water.hi : c.water.en,
      profitPotential:  hi ? c.profit.hi : c.profit.en,
      whyRecommended:   hi ? c.why.hi : c.why.en,
      risks:            hi ? c.risks.hi : c.risks.en,
      mandiCropKey:     c.key,
    }
  })

  const loc = location || 'आपके क्षेत्र'

  return {
    topCrops,
    farmingCalendar: [
      { month: hi?'पहला महीना':'Month 1', activity: hi?'खेत की जुताई व तैयारी':'Field ploughing & preparation', icon:'🚜' },
      { month: hi?'दूसरा महीना':'Month 2', activity: hi?'बीज उपचार व बुवाई':'Seed treatment & sowing', icon:'🌱' },
      { month: hi?'तीसरा महीना':'Month 3', activity: hi?'पहली सिंचाई व खाद':'First irrigation & fertilizer', icon:'💧' },
      { month: hi?'चौथा महीना':'Month 4', activity: hi?'निराई-गुड़ाई व कीट निगरानी':'Weeding & pest scouting', icon:'🔍' },
      { month: hi?'पाँचवाँ महीना':'Month 5', activity: hi?'दूसरी सिंचाई':'Second irrigation', icon:'🌸' },
      { month: hi?'छठा महीना':'Month 6', activity: hi?'कटाई व मंडी':'Harvesting & market', icon:'🌾' },
    ],
    soilPreparation:    hi
      ? `${loc} की मिट्टी के अनुसार: गहरी जुताई करें, जैविक खाद डालें।`
      : `For ${loc}: Deep plough and add organic manure before sowing.`,
    irrigationAdvice:   hi
      ? `${loc} के मौसम के अनुसार सिंचाई करें। ड्रिप या स्प्रिंकलर से पानी बचाएं।`
      : `Irrigate as per ${loc} weather. Use drip or sprinkler to save water.`,
    fertilizerSchedule: hi
      ? 'बुवाई पर DAP 50 kg/एकड़। एक महीने बाद यूरिया 25 kg। फूल आने पर MOP 20 kg।'
      : 'At sowing: DAP 50 kg/acre. After 1 month: Urea 25 kg. At flowering: MOP 20 kg.',
    pestManagement:     hi
      ? 'नियमित निगरानी करें। जैविक कीटनाशक पहले उपयोग करें। जरूरत पर रासायनिक दवा लें।'
      : 'Regular scouting. Use bio-pesticides first. Chemical only if needed.',
    governmentSchemes: [
      { name:'PM-KISAN', benefit: hi?'₹6000 प्रति वर्ष सीधे खाते में':'₹6000/year direct to account', link:'pmkisan.gov.in' },
      { name:'PMFBY', benefit: hi?'फसल बीमा — कम प्रीमियम':'Crop insurance at low premium', link:'pmfby.gov.in' },
      { name:'KCC', benefit: hi?'किसान क्रेडिट कार्ड — 4% ब्याज पर ऋण':'Loan at 4% interest', link:'nabard.org' },
      { name:'e-NAM', benefit: hi?'ऑनलाइन मंडी — बेहतर भाव':'Online market for better price', link:'enam.gov.in' },
    ],
    bankLoanAdvice: hi
      ? 'किसान क्रेडिट कार्ड (KCC) से ₹1.6 लाख तक 4% ब्याज पर ऋण। नजदीकी बैंक में आधार और जमीन के कागज लेकर जाएं।'
      : 'Kisan Credit Card (KCC): up to ₹1.6 lakh at 4% interest. Visit nearest bank with Aadhaar and land documents.',
    expectedRevenue: _getRevenue(cropKeys[0], hi),
    weatherAlert:    hi
      ? `${loc} के मौसम के अनुसार बुवाई का सही समय चुनें।`
      : `Choose the right sowing time based on ${loc} weather conditions.`,
  }
}


function _getRevenue(cropKey, hi) {
  const map = {
    wheat:      hi ? '₹45,000 – ₹65,000 प्रति एकड़'        : '₹45,000 – ₹65,000 per acre',
    rice:       hi ? '₹40,000 – ₹60,000 प्रति एकड़'        : '₹40,000 – ₹60,000 per acre',
    bajra:      hi ? '₹25,000 – ₹40,000 प्रति एकड़'        : '₹25,000 – ₹40,000 per acre',
    jowar:      hi ? '₹28,000 – ₹42,000 प्रति एकड़'        : '₹28,000 – ₹42,000 per acre',
    mothbeans:  hi ? '₹20,000 – ₹32,000 प्रति एकड़'        : '₹20,000 – ₹32,000 per acre',
    mustard:    hi ? '₹50,000 – ₹75,000 प्रति एकड़'        : '₹50,000 – ₹75,000 per acre',
    cotton:     hi ? '₹60,000 – ₹90,000 प्रति एकड़'        : '₹60,000 – ₹90,000 per acre',
    soybean:    hi ? '₹35,000 – ₹55,000 प्रति एकड़'        : '₹35,000 – ₹55,000 per acre',
    groundnut:  hi ? '₹55,000 – ₹80,000 प्रति एकड़'        : '₹55,000 – ₹80,000 per acre',
    sugarcane:  hi ? '₹80,000 – ₹1,20,000 प्रति एकड़'      : '₹80,000 – ₹1,20,000 per acre',
    maize:      hi ? '₹30,000 – ₹48,000 प्रति एकड़'        : '₹30,000 – ₹48,000 per acre',
    chickpea:   hi ? '₹32,000 – ₹50,000 प्रति एकड़'        : '₹32,000 – ₹50,000 per acre',
    potato:     hi ? '₹70,000 – ₹1,10,000 प्रति एकड़'      : '₹70,000 – ₹1,10,000 per acre',
    coconut:    hi ? '₹90,000 – ₹1,40,000 प्रति एकड़'      : '₹90,000 – ₹1,40,000 per acre',
    ragi:       hi ? '₹28,000 – ₹44,000 प्रति एकड़'        : '₹28,000 – ₹44,000 per acre',
    arhar:      hi ? '₹38,000 – ₹58,000 प्रति एकड़'        : '₹38,000 – ₹58,000 per acre',
    sunflower:  hi ? '₹35,000 – ₹52,000 प्रति एकड़'        : '₹35,000 – ₹52,000 per acre',
    lentil:     hi ? '₹30,000 – ₹46,000 प्रति एकड़'        : '₹30,000 – ₹46,000 per acre',
    mentha:     hi ? '₹80,000 – ₹1,20,000 प्रति एकड़'      : '₹80,000 – ₹1,20,000 per acre',
    apple:      hi ? '₹2,00,000 – ₹3,50,000 प्रति एकड़'    : '₹2,00,000 – ₹3,50,000 per acre',
    grapes:     hi ? '₹1,50,000 – ₹2,50,000 प्रति एकड़'    : '₹1,50,000 – ₹2,50,000 per acre',
    onion:      hi ? '₹60,000 – ₹1,00,000 प्रति एकड़'      : '₹60,000 – ₹1,00,000 per acre',
    tomato:     hi ? '₹80,000 – ₹1,20,000 प्रति एकड़'      : '₹80,000 – ₹1,20,000 per acre',
    ginger:     hi ? '₹1,20,000 – ₹2,00,000 प्रति एकड़'    : '₹1,20,000 – ₹2,00,000 per acre',
    castor:     hi ? '₹40,000 – ₹60,000 प्रति एकड़'        : '₹40,000 – ₹60,000 per acre',
    rubber:     hi ? '₹70,000 – ₹1,10,000 प्रति एकड़'      : '₹70,000 – ₹1,10,000 per acre',
    jute:       hi ? '₹35,000 – ₹55,000 प्रति एकड़'        : '₹35,000 – ₹55,000 per acre',
    tea:        hi ? '₹1,00,000 – ₹1,80,000 प्रति एकड़'    : '₹1,00,000 – ₹1,80,000 per acre',
  }
  return map[cropKey] || (hi ? '₹35,000 – ₹60,000 प्रति एकड़' : '₹35,000 – ₹60,000 per acre')
}

module.exports = { getFallbackData }
