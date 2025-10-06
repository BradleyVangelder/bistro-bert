'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import {
  ANIMATION_DURATIONS,
  ANIMATION_PRIORITIES,
  PERFORMANCE_SETTINGS,
  type AnimationDuration,
  type AnimationPriority
} from '@/utils/animations/constants'
import { performanceMonitor } from '@/utils/animations/performance'
import {
  prefersReducedMotion,
  prefersHighContrast,
  isTouchDevice,
  isMobile,
  getViewportSize
} from '@/utils/accessibility'

// Interaction state interface
export interface InteractionState {
  isActive: boolean
  isHovered: boolean
  isPressed: boolean
  isFocused: boolean
  isLoading: boolean
  hasError: boolean
  isSuccess: boolean
  interactionCount: number
  lastInteractionTime: number
}

// Performance metrics interface
export interface PerformanceMetrics {
  averageResponseTime: number
  totalInteractions: number
  slowInteractions: number
  frameDrops: number
  memoryUsage: number
}

// Accessibility preferences interface
export interface AccessibilityPreferences {
  reducedMotion: boolean
  highContrast: boolean
  prefersTouch: boolean
  deviceType: 'mobile' | 'tablet' | 'desktop'
  deviceMemory: 'low' | 'medium' | 'high'
  connectionType: 'slow' | 'fast' | 'unknown'
}

// Micro-interaction configuration
export interface MicroInteractionConfig {
  enableHapticFeedback: boolean
  enableRippleEffects: boolean
  enableGlowEffects: boolean
  enableSoundEffects: boolean
  animationDuration: AnimationDuration
  animationPriority: AnimationPriority
  performanceMode: 'quality' | 'balanced' | 'performance'
  respectAccessibility: boolean
}

// Hook return interface
export interface UseMicroInteractionsReturn {
  // State
  state: InteractionState
  
  // Actions
  activate: () => void
  deactivate: () => void
  setHovered: (hovered: boolean) => void
  setPressed: (pressed: boolean) => void
  setFocused: (focused: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (error: boolean) => void
  setSuccess: (success: boolean) => void
  
  // Utilities
  triggerHapticFeedback: (pattern?: number | number[]) => void
  createRipple: (x: number, y: number) => void
  measurePerformance: (actionName: string) => { end: () => void }
  
  // Analytics
  metrics: PerformanceMetrics
  preferences: AccessibilityPreferences
  config: MicroInteractionConfig
  
  // Configuration
  updateConfig: (config: Partial<MicroInteractionConfig>) => void
  resetMetrics: () => void
}

// Default configuration
const DEFAULT_CONFIG: MicroInteractionConfig = {
  enableHapticFeedback: false,
  enableRippleEffects: true,
  enableGlowEffects: true,
  enableSoundEffects: false,
  animationDuration: 'fast',
  animationPriority: 'critical',
  performanceMode: 'balanced',
  respectAccessibility: true,
}

export function useMicroInteractions(
  initialConfig: Partial<MicroInteractionConfig> = {}
): UseMicroInteractionsReturn {
  // Merge with default config
  const [config, setConfig] = useState<MicroInteractionConfig>({
    ...DEFAULT_CONFIG,
    ...initialConfig,
  })

  // Interaction state
  const [state, setState] = useState<InteractionState>({
    isActive: false,
    isHovered: false,
    isPressed: false,
    isFocused: false,
    isLoading: false,
    hasError: false,
    isSuccess: false,
    interactionCount: 0,
    lastInteractionTime: 0,
  })

  // Performance metrics
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    averageResponseTime: 0,
    totalInteractions: 0,
    slowInteractions: 0,
    frameDrops: 0,
    memoryUsage: 0,
  })

  // Accessibility preferences
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    reducedMotion: false,
    highContrast: false,
    prefersTouch: false,
    deviceType: 'desktop',
    deviceMemory: 'medium',
    connectionType: 'unknown',
  })

  // Refs for performance tracking
  const performanceRef = useRef<{
    startTime: number
    responseTimes: number[]
    frameCount: number
    lastFrameTime: number
  }>({
    startTime: 0,
    responseTimes: [],
    frameCount: 0,
    lastFrameTime: 0,
  })

  // Detect accessibility preferences on mount
  useEffect(() => {
    const detectPreferences = () => {
      const viewport = getViewportSize()
      const isTouch = isTouchDevice()
      const isMobileDevice = isMobile()
      
      // Simple device memory detection (approximation)
      let deviceMemory: 'low' | 'medium' | 'high' = 'medium'
      if ('deviceMemory' in navigator) {
        const nav = navigator as Navigator & { deviceMemory: number }
        const memory = nav.deviceMemory
        if (memory < 4) deviceMemory = 'low'
        else if (memory >= 8) deviceMemory = 'high'
      }
      
      // Simple connection type detection
      let connectionType: 'slow' | 'fast' | 'unknown' = 'unknown'
      if ('connection' in navigator) {
        const nav = navigator as Navigator & {
          connection: {
            effectiveType: string
          }
        }
        const connection = nav.connection
        if (connection) {
          connectionType = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g'
            ? 'slow'
            : connection.effectiveType === '4g'
            ? 'fast'
            : 'unknown'
        }
      }
      
      setPreferences({
        reducedMotion: prefersReducedMotion(),
        highContrast: prefersHighContrast(),
        prefersTouch: isTouch,
        deviceType: viewport.width < 768 ? 'mobile' : viewport.width < 1024 ? 'tablet' : 'desktop',
        deviceMemory,
        connectionType,
      })

      // Auto-adjust config based on preferences
      if (prefersReducedMotion() && config.respectAccessibility) {
        setConfig(prev => ({
          ...prev,
          enableRippleEffects: false,
          enableGlowEffects: false,
          animationDuration: 'instant',
        }))
      }

      // Auto-adjust for performance
      if (deviceMemory === 'low' || connectionType === 'slow' || isMobileDevice) {
        setConfig(prev => ({
          ...prev,
          performanceMode: 'performance',
          enableGlowEffects: false,
        }))
      }
    }

    detectPreferences()
    
    // Listen for preference changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.addEventListener('change', detectPreferences)
    
    return () => mediaQuery.removeEventListener('change', detectPreferences)
  }, [config.respectAccessibility])

  // Performance monitoring
  useEffect(() => {
    let animationFrameId: number
    
    const monitorPerformance = () => {
      const now = performance.now()
      
      if (performanceRef.current.lastFrameTime > 0) {
        const frameTime = now - performanceRef.current.lastFrameTime
        
        // Detect frame drops
        if (frameTime > PERFORMANCE_SETTINGS.frameTimeThreshold * 2) {
          setMetrics(prev => ({
            ...prev,
            frameDrops: prev.frameDrops + 1,
          }))
        }
      }
      
      performanceRef.current.lastFrameTime = now
      performanceRef.current.frameCount++
      
      animationFrameId = requestAnimationFrame(monitorPerformance)
    }
    
    if (config.performanceMode !== 'performance') {
      animationFrameId = requestAnimationFrame(monitorPerformance)
    }
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [config.performanceMode])

  // State update functions
  const updateState = useCallback((updates: Partial<InteractionState>) => {
    setState(prev => ({
      ...prev,
      ...updates,
      interactionCount: updates.interactionCount !== undefined 
        ? updates.interactionCount 
        : prev.interactionCount + 1,
      lastInteractionTime: Date.now(),
    }))
  }, [])

  const activate = useCallback(() => {
    updateState({ isActive: true })
  }, [updateState])

  const deactivate = useCallback(() => {
    updateState({ isActive: false })
  }, [updateState])

  const setHovered = useCallback((hovered: boolean) => {
    updateState({ isHovered: hovered })
  }, [updateState])

  const setPressed = useCallback((pressed: boolean) => {
    updateState({ isPressed: pressed })
  }, [updateState])

  const setFocused = useCallback((focused: boolean) => {
    updateState({ isFocused: focused })
  }, [updateState])

  const setLoading = useCallback((loading: boolean) => {
    updateState({ isLoading: loading })
  }, [updateState])

  const setError = useCallback((error: boolean) => {
    updateState({ hasError: error })
  }, [updateState])

  const setSuccess = useCallback((success: boolean) => {
    updateState({ isSuccess: success })
  }, [updateState])

  // Haptic feedback
  const triggerHapticFeedback = useCallback((pattern: number | number[] = 10) => {
    if (!config.enableHapticFeedback || typeof window === 'undefined') return
    
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate(pattern)
      }
    } catch (error) {
      // Silently fail if haptic feedback is not available
    }
  }, [config.enableHapticFeedback])

  // Ripple effect creation
  const createRipple = useCallback((x: number, y: number) => {
    if (!config.enableRippleEffects) return
    
    // This would typically be handled by the component
    // but we provide the utility for consistency
    const rippleEvent = new CustomEvent('createRipple', {
      detail: { x, y, timestamp: Date.now() }
    })
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(rippleEvent)
    }
  }, [config.enableRippleEffects])

  // Performance measurement
  const measurePerformance = useCallback((actionName: string) => {
    const startTime = performance.now()
    
    const end = () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      performanceRef.current.responseTimes.push(duration)
      
      // Keep only last 50 measurements
      if (performanceRef.current.responseTimes.length > 50) {
        performanceRef.current.responseTimes.shift()
      }
      
      // Update metrics
      const avgResponseTime = performanceRef.current.responseTimes.reduce(
        (sum, time) => sum + time, 0
      ) / performanceRef.current.responseTimes.length
      
      const isSlow = duration > PERFORMANCE_SETTINGS.complexAnimationThreshold
      
      setMetrics(prev => ({
        ...prev,
        averageResponseTime: avgResponseTime,
        totalInteractions: prev.totalInteractions + 1,
        slowInteractions: isSlow ? prev.slowInteractions + 1 : prev.slowInteractions,
      }))
      
      // Log performance issues
      if (isSlow && config.performanceMode !== 'performance') {
        console.warn(`Slow interaction detected: ${actionName} took ${duration.toFixed(2)}ms`)
      }
    }
    
    return { end }
  }, [config.performanceMode])

  // Configuration update
  const updateConfig = useCallback((updates: Partial<MicroInteractionConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }, [])

  // Reset metrics
  const resetMetrics = useCallback(() => {
    setMetrics({
      averageResponseTime: 0,
      totalInteractions: 0,
      slowInteractions: 0,
      frameDrops: 0,
      memoryUsage: 0,
    })
    performanceRef.current.responseTimes = []
    performanceRef.current.frameCount = 0
  }, [])

  return {
    // State
    state,
    
    // Actions
    activate,
    deactivate,
    setHovered,
    setPressed,
    setFocused,
    setLoading,
    setError,
    setSuccess,
    
    // Utilities
    triggerHapticFeedback,
    createRipple,
    measurePerformance,
    
    // Analytics
    metrics,
    preferences,
    config,
    
    // Configuration
    updateConfig,
    resetMetrics,
  }
}

// Utility hook for specific interaction types
export function useButtonInteraction(config?: Partial<MicroInteractionConfig>) {
  const interaction = useMicroInteractions({
    enableHapticFeedback: true,
    enableRippleEffects: true,
    animationPriority: 'critical',
    ...config,
  })

  const handlePress = useCallback(() => {
    const measure = interaction.measurePerformance('button_press')
    interaction.setPressed(true)
    interaction.triggerHapticFeedback(10)
    measure.end()
  }, [interaction])

  const handleRelease = useCallback(() => {
    const measure = interaction.measurePerformance('button_release')
    interaction.setPressed(false)
    measure.end()
  }, [interaction])

  return {
    ...interaction,
    handlePress,
    handleRelease,
  }
}

// Utility hook for form interactions
export function useFormInteraction(config?: Partial<MicroInteractionConfig>) {
  const interaction = useMicroInteractions({
    enableHapticFeedback: false,
    enableRippleEffects: false,
    animationPriority: 'important',
    ...config,
  })

  const handleFocus = useCallback(() => {
    interaction.setFocused(true)
  }, [interaction])

  const handleBlur = useCallback(() => {
    interaction.setFocused(false)
  }, [interaction])

  const handleValidation = useCallback((isValid: boolean) => {
    if (isValid) {
      interaction.setSuccess(true)
      setTimeout(() => interaction.setSuccess(false), 2000)
    } else {
      interaction.setError(true)
      setTimeout(() => interaction.setError(false), 2000)
    }
  }, [interaction])

  return {
    ...interaction,
    handleFocus,
    handleBlur,
    handleValidation,
  }
}

export default useMicroInteractions