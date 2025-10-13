// Weather data interface
export interface WeatherData {
  temperature: number
  description: string
  icon: string
  location: string
  humidity?: number
  windSpeed?: number
}

// Fallback weather data for Laakdal, Belgium
const FALLBACK_WEATHER: WeatherData = {
  temperature: 18,
  description: 'Deels bewolkt',
  icon: '02d',
  location: 'Laakdal',
  humidity: 65,
  windSpeed: 12
}

// Cache weather data to avoid excessive API calls
let cachedWeather: WeatherData | null = null
let lastFetchTime = 0
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

// Weather condition mapping from Open-Meteo to display values (Dutch)
function getWeatherDescription(code: number): string {
  const weatherCodes: { [key: number]: string } = {
    0: 'Helder',
    1: 'Overwegend helder',
    2: 'Deels bewolkt',
    3: 'Bewolkt',
    45: 'Mist',
    48: 'Mist',
    51: 'Lichte motregen',
    53: 'Motregen',
    55: 'Zware motregen',
    56: 'Lichte ijzel',
    57: 'IJzel',
    61: 'Lichte regen',
    63: 'Regen',
    65: 'Zware regen',
    66: 'Lichte vriesneerslag',
    67: 'Vriesneerslag',
    71: 'Lichte sneeuw',
    73: 'Sneeuw',
    75: 'Zware sneeuw',
    77: 'Sneeuwkorrels',
    80: 'Lichte buien',
    81: 'Buien',
    82: 'Zware buien',
    85: 'Lichte sneeuwbuien',
    86: 'Sneeuwbuien',
    95: 'Onweer',
    96: 'Onweer',
    99: 'Onweer'
  }
  return weatherCodes[code] || 'Onbekend'
}

// Map weather code to icon class
function getWeatherIcon(code: number): string {
  if (code === 0) return '01d' // Clear sky
  if (code >= 1 && code <= 3) return '02d' // Cloudy
  if (code >= 45 && code <= 48) return '50d' // Fog
  if (code >= 51 && code <= 57) return '10d' // Drizzle
  if (code >= 61 && code <= 67) return '10d' // Rain
  if (code >= 71 && code <= 77) return '13d' // Snow
  if (code >= 80 && code <= 82) return '09d' // Showers
  if (code >= 85 && code <= 86) return '13d' // Snow showers
  if (code >= 95 && code <= 99) return '11d' // Thunderstorm
  return '02d' // Default
}

/**
 * Fetches weather data for Laakdal, Belgium
 * Uses Open-Meteo API (free, no API key required)
 */
export async function getWeatherData(): Promise<WeatherData> {
  const now = Date.now()
  
  // Return cached data if still valid
  if (cachedWeather && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedWeather
  }

  try {
    // Laakdal, Belgium coordinates
    const lat = 51.0944
    const lon = 5.0083
    
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m,windspeed_10m`
    )
    
    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.current_weather) {
      throw new Error('No current weather data available')
    }

    const weatherCode = data.current_weather.weathercode
    const temperature = Math.round(data.current_weather.temperature)
    
    // Get hourly data for humidity and wind speed
    const currentHour = new Date().getHours()
    const humidity = data.hourly?.relativehumidity_2m?.[currentHour] || FALLBACK_WEATHER.humidity
    const windSpeed = Math.round(data.hourly?.windspeed_10m?.[currentHour] || FALLBACK_WEATHER.windSpeed)

    const weather: WeatherData = {
      temperature,
      description: getWeatherDescription(weatherCode),
      icon: getWeatherIcon(weatherCode),
      location: 'Laakdal',
      humidity,
      windSpeed
    }

    // Cache the successful response
    cachedWeather = weather
    lastFetchTime = now
    
    return weather
  } catch (error) {
    console.error('Error fetching weather data:', error)
    
    // Return cached data if available, otherwise fallback
    if (cachedWeather) {
      return cachedWeather
    }
    
    cachedWeather = FALLBACK_WEATHER
    lastFetchTime = now
    return FALLBACK_WEATHER
  }
}

/**
 * Gets weather icon URL for OpenWeatherMap icons
 */
export function getWeatherIconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`
}

/**
 * Formats temperature for display
 */
export function formatTemperature(temp: number): string {
  return `${temp}°C`
}

/**
 * Formats weather for restaurant display (Dutch)
 * Format: "15°C • Bewolkt 70% 4 km/h"
 */
export function formatRestaurantWeather(weather: WeatherData): string {
  const temp = `${weather.temperature}°C`
  const desc = weather.description
  const humidity = weather.humidity ? `${weather.humidity}%` : ''
  const wind = weather.windSpeed ? `${weather.windSpeed} km/h` : ''
  
  // Combine with bullet points
  const parts = [temp, desc]
  if (humidity) parts.push(humidity)
  if (wind) parts.push(wind)
  
  return parts.join(' • ')
}

/**
 * Capitalizes first letter of weather description
 */
export function formatWeatherDescription(description: string): string {
  return description.charAt(0).toUpperCase() + description.slice(1)
}
