const axios = require('axios');

const OWM_BASE = 'https://api.openweathermap.org/data/2.5/weather';

// 🔥 API key directly added here
const WEATHER_API_KEY = "073f7b761ff400045c224feff92920ce";

async function fetchWeather(location) {

  // अब env की जगह direct key use होगी
  const apiKey = WEATHER_API_KEY;

  if (!apiKey) {
    console.warn('⚠️  WEATHER_API_KEY not set — using demo weather data');
    return _demoData(location);
  }

  try {
    const url = `${OWM_BASE}?q=${encodeURIComponent(location)},IN&appid=${apiKey}&units=metric`;
    const { data } = await axios.get(url, { timeout: 6000 });

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
    if (code === 401) console.error('❌ Invalid API key');
    else if (code === 404) console.warn(`⚠️ City not found: "${location}"`);
    else console.warn('⚠️ Weather API error:', err.message);

    return _demoData(location);
  }
}

// helpers same
function _demoData(location) {
  return {
    city: location,
    country: 'IN',
    temperature: 27,
    feelsLike: 30,
    humidity: 62,
    pressure: 1012,
    windSpeed: 14,
    rainfall: 0,
    cloudiness: 35,
    description: 'partly cloudy',
    icon: '⛅',
    isFallback: true,
  };
}

function _weatherIcon(main) {
  const map = {
    Clear: '☀️',
    Clouds: '⛅',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌁',
    Haze: '🌫️',
  };
  return map[main] || '🌡️';
}

module.exports = { fetchWeather };