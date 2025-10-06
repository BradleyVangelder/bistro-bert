'use client'

import { useEffect, useState } from 'react'

interface CoreWebVitals {
  lcp: number | null
  cls: number | null
  tbt: number | null
  fid: number | null
}

export default function PDFPerformanceMonitor() {
  const [vitals, setVitals] = useState<CoreWebVitals>({
    lcp: null,
    cls: null,
    tbt: null,
    fid: null
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return

    // Measure LCP (Largest Contentful Paint)
    const measureLCP = () => {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        setVitals(prev => ({ ...prev, lcp: lastEntry.startTime }))
      }).observe({ entryTypes: ['largest-contentful-paint'] })
    }

    // Measure CLS (Cumulative Layout Shift)
    const measureCLS = () => {
      let clsValue = 0
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value || 0
          }
        }
        setVitals(prev => ({ ...prev, cls: clsValue }))
      }).observe({ entryTypes: ['layout-shift'] })
    }

    // Measure TBT (Total Blocking Time)
    const measureTBT = () => {
      let tbtValue = 0
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const longTaskEntry = entry as PerformanceEntry & { duration?: number }
          tbtValue += (longTaskEntry.duration || 0) - 50
        }
        setVitals(prev => ({ ...prev, tbt: tbtValue }))
      }).observe({ entryTypes: ['longtask'] })
    }

    // Measure FID (First Input Delay)
    const measureFID = () => {
      new PerformanceObserver((entryList) => {
        const firstInput = entryList.getEntries()[0]
        if (firstInput) {
          const inputEntry = firstInput as PerformanceEntry & { processingStart?: number }
          setVitals(prev => ({
            ...prev,
            fid: (inputEntry.processingStart || 0) - firstInput.startTime
          }))
        }
      }).observe({ entryTypes: ['first-input'] })
    }

    // Start measuring
    measureLCP()
    measureCLS()
    measureTBT()
    measureFID()

    // Toggle visibility with Ctrl+Shift+V
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'V') {
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return null
  }

  const getScoreColor = (metric: keyof CoreWebVitals, value: number | null) => {
    if (value === null) return 'text-gray-500'
    
    switch (metric) {
      case 'lcp':
        return value <= 2500 ? 'text-green-500' : value <= 4000 ? 'text-yellow-500' : 'text-red-500'
      case 'cls':
        return value <= 0.05 ? 'text-green-500' : value <= 0.1 ? 'text-yellow-500' : 'text-red-500'
      case 'tbt':
        return value <= 200 ? 'text-green-500' : value <= 600 ? 'text-yellow-500' : 'text-red-500'
      case 'fid':
        return value <= 100 ? 'text-green-500' : value <= 300 ? 'text-yellow-500' : 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const formatValue = (metric: keyof CoreWebVitals, value: number | null) => {
    if (value === null) return 'N/A'
    
    switch (metric) {
      case 'lcp':
      case 'tbt':
      case 'fid':
        return `${Math.round(value)}ms`
      case 'cls':
        return value.toFixed(3)
      default:
        return value.toString()
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-xs">
      <h3 className="font-bold mb-3 text-green-400">PDF Performance Monitor</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">LCP:</span>
          <span className={getScoreColor('lcp', vitals.lcp)}>
            {formatValue('lcp', vitals.lcp)} {'<'} 2.5s
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300">CLS:</span>
          <span className={getScoreColor('cls', vitals.cls)}>
            {formatValue('cls', vitals.cls)} {'<'} 0.05
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300">TBT:</span>
          <span className={getScoreColor('tbt', vitals.tbt)}>
            {formatValue('tbt', vitals.tbt)} {'<'} 200ms
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300">FID:</span>
          <span className={getScoreColor('fid', vitals.fid)}>
            {formatValue('fid', vitals.fid)} {'<'} 100ms
          </span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-600 text-gray-400">
        <div className="text-xs space-y-1">
          <div>• Green: Good</div>
          <div>• Yellow: Needs improvement</div>
          <div>• Red: Poor</div>
        </div>
        <div className="mt-2 text-xs">
          Press Ctrl+Shift+V to toggle
        </div>
      </div>
    </div>
  )
}