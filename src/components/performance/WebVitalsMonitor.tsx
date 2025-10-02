'use client'

import { useEffect, useState } from 'react'
import { track } from '@vercel/analytics'

// Type declaration for gtag function
declare global {
  interface Window {
    gtag?: (command: string, action: string, options: Record<string, unknown>) => void
  }
}

interface VitalMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta?: number
  id: string
}

interface WebVitalsData {
  lcp?: VitalMetric
  cls?: VitalMetric
  fcp?: VitalMetric
  ttfb?: VitalMetric
  inp?: VitalMetric
}

export function WebVitalsMonitor() {
  useEffect(() => {
    // Only run in production or when explicitly enabled
    if (process.env.NODE_ENV !== 'production' && !process.env.NEXT_PUBLIC_WEB_VITALS_DEBUG) {
      return
    }

    const reportWebVitals = async (metric: {
      name: string
      value: number
      rating: 'good' | 'needs-improvement' | 'poor'
      delta?: number
      id: string
    }) => {
      const vitalData: VitalMetric = {
        name: metric.name,
        value: Math.round(metric.value * 100) / 100,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id
      }

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Web Vitals] ${metric.name}:`, vitalData)
      }

      // Send to analytics service in production
      if (process.env.NODE_ENV === 'production') {
        try {
          // Send to Google Analytics 4
          if (process.env.NEXT_PUBLIC_GA_ID && window.gtag) {
            window.gtag('event', metric.name, {
              event_category: 'Web Vitals',
              event_label: metric.id,
              value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
              non_interaction: true,
              custom_map: {
                [metric.name]: metric.value,
                [`${metric.name}_rating`]: metric.rating,
                [`${metric.name}_delta`]: metric.delta
              }
            })
          }

          // Send to Vercel Analytics
          track('web-vital', {
            name: metric.name,
            value: metric.value,
            rating: metric.rating,
            id: metric.id,
            delta: metric.delta || 0,
            page: window.location.pathname
          })
        } catch (error) {
          console.warn('Failed to send web vitals to analytics:', error)
        }
      }

      // Store locally for debugging
      try {
        const stored = localStorage.getItem('web-vitals') || '[]'
        const vitals: WebVitalsData[] = JSON.parse(stored)
        const latestVitals = vitals[vitals.length - 1] || {}

        latestVitals[metric.name.toLowerCase() as keyof WebVitalsData] = vitalData

        const updatedVitals = [...vitals.slice(-9), latestVitals] // Keep last 10 measurements
        localStorage.setItem('web-vitals', JSON.stringify(updatedVitals))
      } catch (error) {
        console.warn('Failed to store web vitals locally:', error)
      }
    }

    // Import and use web-vitals library
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
      onCLS(reportWebVitals)
      onFCP(reportWebVitals)
      onLCP(reportWebVitals)
      onTTFB(reportWebVitals)
      onINP(reportWebVitals)
    }).catch(error => {
      console.warn('Failed to load web-vitals library:', error)
    })

    // Monitor page visibility changes for LCP
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Page became visible, potential new LCP measurement
        console.log('Page became visible, monitoring for new LCP')
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return null // This component doesn't render anything visible
}

// Hook for accessing stored web vitals data
export function useWebVitalsData(): WebVitalsData[] {
  const [vitalsData, setVitalsData] = useState<WebVitalsData[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('web-vitals')
      if (stored) {
        setVitalsData(JSON.parse(stored))
      }
    } catch (error) {
      console.warn('Failed to load web vitals data:', error)
    }
  }, [])

  return vitalsData
}

// Component to display web vitals in development
export function WebVitalsDebug() {
  const vitalsData = useWebVitalsData()
  const latestVitals = vitalsData[vitalsData.length - 1] || {}

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const getRatingColor = (rating?: string) => {
    switch (rating) {
      case 'good': return 'text-green-600'
      case 'needs-improvement': return 'text-yellow-600'
      case 'poor': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const formatValue = (name: string, value?: number) => {
    if (value === undefined) return 'N/A'

    switch (name) {
      case 'cls': return value.toFixed(3)
      case 'lcp':
      case 'fcp':
      case 'ttfb': return `${Math.round(value)}ms`
      case 'fid':
      case 'inp': return `${Math.round(value)}ms`
      default: return value.toString()
    }
  }

  const thresholds: Record<string, { good: number; poor: number }> = {
    lcp: { good: 2500, poor: 4000 },
    fid: { good: 100, poor: 300 },
    cls: { good: 0.1, poor: 0.25 },
    fcp: { good: 1800, poor: 3000 },
    ttfb: { good: 800, poor: 1800 },
    inp: { good: 200, poor: 500 }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-xs">
      <h3 className="font-bold mb-2 text-yellow-400">Web Vitals Debug</h3>
      <div className="space-y-1">
        {Object.entries(thresholds).map(([name, _]) => {
          const vital = latestVitals[name as keyof WebVitalsData] as VitalMetric
          return (
            <div key={name} className="flex justify-between">
              <span className="uppercase">{name}:</span>
              <span className={getRatingColor(vital?.rating)}>
                {formatValue(name, vital?.value)}
              </span>
            </div>
          )
        })}
      </div>
      <div className="mt-2 pt-2 border-t border-gray-600 text-gray-400">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  )
}

export default WebVitalsMonitor