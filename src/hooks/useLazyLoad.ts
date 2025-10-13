'use client'

import { useState, useEffect, useRef } from 'react'

interface UseLazyLoadOptions {
  rootMargin?: string
  threshold?: number
  triggerOnce?: boolean
}

export function useLazyLoad<T extends HTMLElement = HTMLElement>(
  options: UseLazyLoadOptions = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const elementRef = useRef<T>(null)

  const {
    rootMargin = '50px',
    threshold = 0.1,
    triggerOnce = true
  } = options

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          setHasLoaded(true)
          
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsIntersecting(false)
        }
      },
      {
        rootMargin,
        threshold
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [rootMargin, threshold, triggerOnce])

  return {
    ref: elementRef,
    isIntersecting,
    hasLoaded
  }
}

// Hook for lazy loading components
export function useLazyComponent<T = React.ComponentType<Record<string, unknown>>>(
  importFn: () => Promise<{ default: T }>,
  options: UseLazyLoadOptions = {}
) {
  const [component, setComponent] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { ref, hasLoaded } = useLazyLoad(options)

  useEffect(() => {
    if (!hasLoaded || component) return

    setLoading(true)
    importFn()
      .then(({ default: loadedComponent }) => {
        setComponent(loadedComponent)
        setError(null)
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Failed to load component'))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [hasLoaded, component, importFn])

  return {
    ref,
    component,
    loading,
    error,
    Component: component
  }
}

// Hook for lazy loading images with fade-in effect
export function useLazyImage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    const handleLoad = () => {
      setIsLoaded(true)
    }

    const handleError = () => {
      setHasError(true)
    }

    img.addEventListener('load', handleLoad)
    img.addEventListener('error', handleError)

    // Check if image is already loaded
    if (img.complete && img.naturalHeight !== 0) {
      setIsLoaded(true)
    }

    return () => {
      img.removeEventListener('load', handleLoad)
      img.removeEventListener('error', handleError)
    }
  }, [])

  return {
    ref: imgRef,
    isLoaded,
    hasError,
    style: {
      opacity: isLoaded ? 1 : 0,
      transition: 'opacity 0.3s ease-in-out'
    }
  }
}