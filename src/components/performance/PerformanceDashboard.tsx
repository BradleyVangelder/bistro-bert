'use client'

import { useState, useEffect } from 'react'

interface WebVitalsData {
  lcp?: { value: number; rating?: string }
  fid?: { value: number; rating?: string }
  cls?: { value: number; rating?: string }
  fcp?: { value: number; rating?: string }
  ttfb?: { value: number; rating?: string }
  inp?: { value: number; rating?: string }
}

interface PerformanceMetrics {
  fcp: number
  lcp: number
  cls: number
  fid: number
  ttfb: number
  inp: number
}

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: 0,
    lcp: 0,
    cls: 0,
    fid: 0,
    ttfb: 0,
    inp: 0
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Load stored metrics
    try {
      const stored = localStorage.getItem('web-vitals')
      if (stored) {
        const vitals: WebVitalsData[] = JSON.parse(stored)
        const latest = vitals[vitals.length - 1]
        
        if (latest) {
          setMetrics({
            fcp: latest.fcp?.value || 0,
            lcp: latest.lcp?.value || 0,
            cls: latest.cls?.value || 0,
            fid: latest.fid?.value || 0,
            ttfb: latest.ttfb?.value || 0,
            inp: latest.inp?.value || 0
          })
        }
      }
    } catch (error) {
      console.warn('Failed to load performance metrics:', error)
    }

    // Keyboard shortcut to toggle dashboard
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const getScoreColor = (metric: keyof PerformanceMetrics, value: number) => {
    const thresholds = {
      fcp: { good: 1800, poor: 3000 },
      lcp: { good: 2500, poor: 4000 },
      cls: { good: 0.1, poor: 0.25 },
      fid: { good: 100, poor: 300 },
      ttfb: { good: 800, poor: 1800 },
      inp: { good: 200, poor: 500 }
    }

    const threshold = thresholds[metric]
    if (value <= threshold.good) return 'text-green-500'
    if (value <= threshold.poor) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScore = (metric: keyof PerformanceMetrics, value: number) => {
    const thresholds = {
      fcp: { good: 1800, poor: 3000 },
      lcp: { good: 2500, poor: 4000 },
      cls: { good: 0.1, poor: 0.25 },
      fid: { good: 100, poor: 300 },
      ttfb: { good: 800, poor: 1800 },
      inp: { good: 200, poor: 500 }
    }

    const threshold = thresholds[metric]
    if (value <= threshold.good) return 100
    if (value >= threshold.poor) return 0
    // Linear interpolation between good and poor
    return Math.round(((threshold.poor - value) / (threshold.poor - threshold.good)) * 100)
  }

  const getOverallScore = () => {
    const scores = Object.entries(metrics).map(([key, value]) => 
      getScore(key as keyof PerformanceMetrics, value)
    )
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  const formatValue = (metric: keyof PerformanceMetrics, value: number) => {
    if (metric === 'cls') return value.toFixed(3)
    return `${Math.round(value)}ms`
  }

  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return null
  }

  const overallScore = getOverallScore()

  return (
    <div className="fixed top-4 right-4 bg-black/90 text-white p-6 rounded-lg text-xs font-mono z-50 max-w-sm backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-yellow-400">Performance Dashboard</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className="mb-4 p-3 bg-white/10 rounded">
        <div className="flex justify-between items-center">
          <span className="text-sm">Overall Score</span>
          <span className={`text-lg font-bold ${
            overallScore >= 90 ? 'text-green-500' : 
            overallScore >= 70 ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {overallScore}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              overallScore >= 90 ? 'bg-green-500' : 
              overallScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${overallScore}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {Object.entries(metrics).map(([metric, value]) => (
          <div key={metric} className="flex justify-between items-center">
            <span className="uppercase text-gray-300">{metric}:</span>
            <div className="flex items-center gap-2">
              <span className={getScoreColor(metric as keyof PerformanceMetrics, value)}>
                {formatValue(metric as keyof PerformanceMetrics, value)}
              </span>
              <span className="text-gray-500">
                ({getScore(metric as keyof PerformanceMetrics, value)})
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-600 text-gray-400 text-xs">
        <div>Press Ctrl+Shift+P to toggle</div>
        <div className="mt-1">
          {overallScore >= 90 ? '🟢 Excellent Performance' : 
           overallScore >= 70 ? '🟡 Good Performance' : '🔴 Needs Improvement'}
        </div>
      </div>
    </div>
  )
}

export default PerformanceDashboard