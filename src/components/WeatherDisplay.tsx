'use client'

import { useState, useEffect } from 'react'
import { getWeatherData, formatRestaurantWeather, type WeatherData } from '@/utils/weather'

interface WeatherDisplayProps {
  className?: string
  showLocation?: boolean
}

export default function WeatherDisplay({ className = '', showLocation = false }: WeatherDisplayProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true)
        setError(null)
        const weatherData = await getWeatherData()
        setWeather(weatherData)
      } catch (err) {
        console.error('Failed to fetch weather:', err)
        setError('Weer niet beschikbaar')
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
    
    // Update weather every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className={`text-gray-500 ${className}`}>
        Weer laden...
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div className={`text-gray-500 ${className}`}>
        {error || 'Weer niet beschikbaar'}
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLocation && (
        <span className="text-sm text-gray-600 mr-1">
          {weather.location}:
        </span>
      )}
      <span className="font-medium">
        {formatRestaurantWeather(weather)}
      </span>
    </div>
  )
}