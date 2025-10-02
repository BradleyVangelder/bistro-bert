'use client'

import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  memoryUsage?: number
  domNodes: number
  scriptExecutionTime: number
  renderTime: number
}

export function PerformanceOptimizer() {
  const [, setMetrics] = useState<PerformanceMetrics>({
    domNodes: 0,
    scriptExecutionTime: 0,
    renderTime: 0
  })

  useEffect(() => {
    // Monitor performance metrics
    const measurePerformance = () => {
      try {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

        const domNodes = document.querySelectorAll('*').length

        // Type assertion for performance.memory which is not in standard TypeScript types
        const performanceMemory = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory

        setMetrics({
          memoryUsage: performanceMemory?.usedJSHeapSize,
          domNodes,
          scriptExecutionTime: navigation?.loadEventEnd - navigation?.loadEventStart || 0,
          renderTime: navigation?.domComplete - navigation?.domInteractive || 0
        })

        // Performance warnings
        if (domNodes > 1500) {
          console.warn('High DOM node count detected:', domNodes)
        }

        if (performanceMemory?.usedJSHeapSize && performanceMemory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
          console.warn('High memory usage detected:', performanceMemory.usedJSHeapSize)
        }
      } catch (error) {
        console.warn('Failed to measure performance:', error)
      }
    }

    // Initial measurement
    setTimeout(measurePerformance, 100)

    // Measure after route changes
    const handleRouteChange = () => {
      setTimeout(measurePerformance, 100)
    }

    // Cleanup unused images and event listeners
    const cleanup = () => {
      // Mark visible images for loading priority
      const images = document.querySelectorAll('img[data-src]')
      images.forEach(img => {
        const rect = img.getBoundingClientRect()
        if (rect.top < window.innerHeight + 1000) { // 1000px buffer
          img.setAttribute('loading', 'eager')
        }
      })
    }

    // Set up intersection observer for lazy loading optimization
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.removeAttribute('data-src')
              observer.unobserve(img)
            }
          }
        })
      },
      { rootMargin: '50px' }
    )

    // Observe images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      observer.observe(img)
    })

    window.addEventListener('routeChangeComplete', handleRouteChange)
    window.addEventListener('scroll', cleanup, { passive: true })

    return () => {
      window.removeEventListener('routeChangeComplete', handleRouteChange)
      window.removeEventListener('scroll', cleanup)
      observer.disconnect()
    }
  }, [])

  return null // This component doesn't render anything visible
}

// Hook for optimizing image loading
export function useImageOptimization() {
  const [optimizedImages, setOptimizedImages] = useState<Set<string>>(new Set())

  const optimizeImage = (src: string) => {
    if (optimizedImages.has(src)) return src

    // Create optimized image URL with size parameters
    const url = new URL(src, window.location.origin)

    // Add quality and size parameters based on device pixel ratio
    const dpr = window.devicePixelRatio || 1
    const quality = dpr > 1 ? 85 : 90

    if (src.includes('?')) {
      url.searchParams.set('q', quality.toString())
      url.searchParams.set('auto', 'format')
    } else {
      url.searchParams.set('q', quality.toString())
      url.searchParams.set('auto', 'format')
    }

    const optimizedSrc = url.toString()
    setOptimizedImages(prev => new Set(prev).add(src))

    return optimizedSrc
  }

  return { optimizeImage }
}

// Component for preloading critical resources
export function ResourcePreloader() {
  useEffect(() => {
    // Preload critical fonts
    const fontLinks = [
      { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      { href: '/fonts/playfair-display-var.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' }
    ]

    fontLinks.forEach(font => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = font.href
      link.as = font.as
      if (font.type) link.type = font.type
      if (font.crossOrigin) link.crossOrigin = font.crossOrigin
      document.head.appendChild(link)
    })

    // Preconnect to external domains
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ]

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = domain
      document.head.appendChild(link)
    })

    // Prefetch next likely pages
    const likelyPages = ['/menu', '/contact', '/over-ons']
    likelyPages.forEach(page => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = page
      document.head.appendChild(link)
    })
  }, [])

  return null
}

// Performance monitoring for development
export function PerformanceDebug() {
  const [isVisible, setIsVisible] = useState(false)
  const metrics = useState<PerformanceMetrics>({
    domNodes: 0,
    scriptExecutionTime: 0,
    renderTime: 0
  })[0]

  useEffect(() => {
    // Toggle with Ctrl+Shift+P
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return null
  }

  return (
    <div className="fixed top-4 left-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono z-50">
      <h3 className="font-bold mb-2 text-green-400">Performance Debug</h3>
      <div className="space-y-1">
        <div>DOM Nodes: {metrics.domNodes}</div>
        <div>Memory: {metrics.memoryUsage ? `${Math.round(metrics.memoryUsage / 1024 / 1024)}MB` : 'N/A'}</div>
        <div>Script Time: {metrics.scriptExecutionTime}ms</div>
        <div>Render Time: {metrics.renderTime}ms</div>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-600 text-gray-400">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  )
}

export default PerformanceOptimizer