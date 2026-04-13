// ============================================================
//  src/services/weatherService.js — Fixed with better error logging
// ============================================================
const axios = require('axios');

const OWM_BASE = 'https://api.openweathermap.org/data/2.5/weather';

async function fetchWeather(location) {
  const apiKey = process.env.OPENWEATHER_API_KEY || process.env.WEATHER_API_KEY;

  if (!apiKey || apiKey === 'your_openweathermap_api_key_here') {
    console.warn('⚠️  WEATHER_API_KEY not set — using demo weather data');
    return _demoData(location);
  }

  console.log(`🌤️  Fetching weather for: ${location} with key: ${apiKey.slice(0,6)}...`);

  try {
    const url = `${OWM_BASE}?q=${encodeURIComponent(location)},IN&appid=${apiKey}&units=metric`;
    const { data } = await axios.get(url, { timeout: 8000 });

    console.log(`✅ Weather fetched for: ${data.name} — ${data.weather[0].description}`);

    return {
      city:        data.name,
      country:     data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike:   Math.round(data.main.feels_like),
      humidity:    data.main.humidity,
      pressure:    data.main.pressure,
      windSpeed:   Math.round(data.wind.speed * 3.6),
      rainfall:    data.rain?.['1h'] ?? 0,
      cloudiness:  data.clouds?.all ?? 0,
      description: data.weather[0].description,
      icon:        _weatherIcon(data.weather[0].main),
      isFallback:  false,
    };
  } catch (err) {
    const code = err.response?.status;
    const msg  = err.response?.data?.message || err.message;
    if (code === 401) console.error(`❌ Invalid OpenWeather API key: ${apiKey.slice(0,6)}...`);
    else if (code === 404) console.warn(`⚠️  City not found: "${location}"`);
    else console.warn(`⚠️  Weather API error ${code}: ${msg}`);
    return _demoData(location);
  }
}

function _demoData(location) {
  const loc = (location || '').toLowerCase();

  if (loc.includes('rajasthan') || loc.includes('jodhpur') || loc.includes('jaipur') || loc.includes('bikaner'))
    return { city:location, country:'IN', temperature:38, feelsLike:42, humidity:25, pressure:1005, windSpeed:20, rainfall:0, cloudiness:10, description:'hot and dry', icon:'☀️', isFallback:true };

  if (loc.includes('kerala') || loc.includes('kochi') || loc.includes('thiruvananthapuram'))
    return { city:location, country:'IN', temperature:30, feelsLike:36, humidity:85, pressure:1008, windSpeed:18, rainfall:5, cloudiness:75, description:'humid and cloudy', icon:'🌦️', isFallback:true };

  if (loc.includes('himachal') || loc.includes('shimla') || loc.includes('manali') || loc.includes('darjeeling'))
    return { city:location, country:'IN', temperature:12, feelsLike:8, humidity:65, pressure:850, windSpeed:15, rainfall:2, cloudiness:60, description:'cool and misty', icon:'🌫️', isFallback:true };

  if (loc.includes('punjab') || loc.includes('haryana') || loc.includes('ludhiana') || loc.includes('amritsar'))
    return { city:location, country:'IN', temperature:22, feelsLike:20, humidity:55, pressure:1015, windSpeed:12, rainfall:0, cloudiness:20, description:'clear sky', icon:'☀️', isFallback:true };

  if (loc.includes('mumbai') || loc.includes('pune') || loc.includes('maharashtra'))
    return { city:location, country:'IN', temperature:32, feelsLike:37, humidity:75, pressure:1010, windSpeed:22, rainfall:0, cloudiness:50, description:'partly cloudy', icon:'⛅', isFallback:true };

  if (loc.includes('kolkata') || loc.includes('west bengal') || loc.includes('bengal'))
    return { city:location, country:'IN', temperature:34, feelsLike:40, humidity:80, pressure:1007, windSpeed:14, rainfall:3, cloudiness:65, description:'humid and hazy', icon:'🌫️', isFallback:true };

  if (loc.includes('gujarat') || loc.includes('ahmedabad') || loc.includes('surat'))
    return { city:location, country:'IN', temperature:36, feelsLike:40, humidity:40, pressure:1008, windSpeed:18, rainfall:0, cloudiness:15, description:'hot and sunny', icon:'☀️', isFallback:true };

  if (loc.includes('madhya pradesh') || loc.includes('bhopal') || loc.includes('indore'))
    return { city:location, country:'IN', temperature:30, feelsLike:34, humidity:50, pressure:1010, windSpeed:14, rainfall:0, cloudiness:30, description:'partly cloudy', icon:'⛅', isFallback:true };

  if (loc.includes('bihar') || loc.includes('patna'))
    return { city:location, country:'IN', temperature:28, feelsLike:32, humidity:65, pressure:1012, windSpeed:12, rainfall:0, cloudiness:40, description:'warm and humid', icon:'⛅', isFallback:true };

  if (loc.includes('lucknow') || loc.includes('uttar pradesh') || loc.includes('varanasi') || loc.includes('agra'))
    return { city:location, country:'IN', temperature:26, feelsLike:28, humidity:58, pressure:1013, windSpeed:10, rainfall:0, cloudiness:25, description:'clear sky', icon:'☀️', isFallback:true };

  // Default
  return { city:location, country:'IN', temperature:27, feelsLike:30, humidity:62, pressure:1012, windSpeed:14, rainfall:0, cloudiness:35, description:'partly cloudy', icon:'⛅', isFallback:true };
}

function _weatherIcon(main) {
  const map = { Clear:'☀️', Clouds:'⛅', Rain:'🌧️', Drizzle:'🌦️', Thunderstorm:'⛈️', Snow:'❄️', Mist:'🌫️', Fog:'🌁', Haze:'🌫️' };
  return map[main] || '🌡️';
}

module.exports = { fetchWeather };
