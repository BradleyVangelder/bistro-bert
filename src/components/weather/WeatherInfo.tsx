'use client'

import { useState, useEffect } from 'react'
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Droplets } from 'lucide-react'
import { getWeatherData, getWeatherIconUrl, formatTemperature, formatWeatherDescription, WeatherData } from '@/utils/weather'

interface WeatherInfoProps {
  className?: string
}

export default function WeatherInfo({ className = '' }: WeatherInfoProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const weatherData = await getWeatherData()
        setWeather(weatherData)
      } catch (err) {
        setError('Failed to load weather')
        console.error('Weather fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeather()
    
    // Refresh weather every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  // Get appropriate weather icon based on weather condition
  const getWeatherIcon = (iconCode: string) => {
    if (iconCode.includes('01')) return Sun // Clear sky
    if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) return Cloud // Cloudy
    if (iconCode.includes('09') || iconCode.includes('10')) return CloudRain // Rain
    if (iconCode.includes('13')) return CloudSnow // Snow
    return Cloud // Default
  }

  if (isLoading) {
    return (
      <div className={`flex items-center gap-3 text-gray-700 py-2 ${className}`}>
        <div className="w-5 h-5 animate-pulse bg-gray-300 rounded"></div>
        <div className="flex flex-col">
          <div className="h-4 w-16 animate-pulse bg-gray-300 rounded mb-1"></div>
          <div className="h-3 w-20 animate-pulse bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !weather) {
    // Show fallback weather with error state
    return (
      <div className={`flex items-center gap-3 text-gray-700 py-2 ${className}`}>
        <Cloud className="w-5 h-5 text-gray-400" />
        <div className="flex flex-col">
          <span className="text-base font-luxury">Weather unavailable</span>
          <div className="text-sm text-gray-500">Please try again later</div>
        </div>
      </div>
    )
  }

  const WeatherIcon = getWeatherIcon(weather.icon)

  return (
    <div className={`flex items-center gap-3 text-gray-700 py-2 ${className}`}>
      <WeatherIcon className="w-5 h-5 text-gray-700" />
      <div className="flex flex-col">
        <span className="text-base font-luxury">
          {formatTemperature(weather.temperature)} • {formatWeatherDescription(weather.description)}
        </span>
        <div className="text-sm text-gray-600 flex items-center gap-3">
          {weather.humidity && (
            <span className="flex items-center gap-1">
              <Droplets className="w-3 h-3" />
              {weather.humidity}%
            </span>
          )}
          {weather.windSpeed && (
            <span className="flex items-center gap-1">
              <Wind className="w-3 h-3" />
              {weather.windSpeed} km/h
            </span>
          )}
        </div>
      </div>
    </div>
  )
}