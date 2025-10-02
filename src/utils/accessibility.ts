'use client'

import { useState, useEffect } from 'react'

// Check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Check if user prefers high contrast
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-contrast: high)').matches
}

// Get user's color scheme preference
export function getColorScheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Custom hook for accessibility preferences
export function useAccessibilityPreferences() {
  const [preferences, setPreferences] = useState({
    reducedMotion: false,
    highContrast: false,
    colorScheme: 'light' as 'light' | 'dark'
  })

  useEffect(() => {
    const updatePreferences = () => {
      setPreferences({
        reducedMotion: prefersReducedMotion(),
        highContrast: prefersHighContrast(),
        colorScheme: getColorScheme()
      })
    }

    updatePreferences()

    // Listen for changes in preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')
    const colorQuery = window.matchMedia('(prefers-color-scheme: dark)')

    motionQuery.addEventListener('change', updatePreferences)
    contrastQuery.addEventListener('change', updatePreferences)
    colorQuery.addEventListener('change', updatePreferences)

    return () => {
      motionQuery.removeEventListener('change', updatePreferences)
      contrastQuery.removeEventListener('change', updatePreferences)
      colorQuery.removeEventListener('change', updatePreferences)
    }
  }, [])

  return preferences
}

// Get animation variants that respect reduced motion
export function getAccessibleAnimationvariants(baseVariants: Record<string, unknown>, reducedVariants: Record<string, unknown>) {
  return {
    ...baseVariants,
    ...(prefersReducedMotion() ? reducedVariants : {})
  }
}

// Safe motion props that respect user preferences
export function getSafeMotionProps(motionProps: Record<string, unknown>) {
  if (prefersReducedMotion()) {
    return {
      ...motionProps,
      transition: { duration: 0 },
      whileHover: undefined,
      whileTap: undefined,
      animate: motionProps.initial,
      exit: motionProps.initial
    }
  }
  return motionProps
}

// Check if device has touch capability
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - for older browsers
    (navigator as unknown as { msMaxTouchPoints?: number }).msMaxTouchPoints > 0
  )
}

// Get viewport breakpoints
export function getViewportSize() {
  if (typeof window === 'undefined') return { width: 0, height: 0 }
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

// Check if user is on mobile device
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return getViewportSize().width < 768
}

// Generate responsive font sizes that respect user preferences
export function getResponsiveFontSize(
  mobile: string,
  tablet: string,
  desktop: string,
  respectReducedMotion = true
) {
  if (respectReducedMotion && prefersReducedMotion()) {
    return mobile // Use smallest size for reduced motion
  }

  return {
    base: mobile,
    md: tablet,
    lg: desktop
  }
}