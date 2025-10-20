'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTransitionManager, useTransitionControl, TransitionType } from '@/components/ui/TransitionManager'
import {
  ANIMATION_DURATIONS,
  ANIMATION_PRIORITIES
} from '@/utils/animations/constants'
import {
  performanceMonitor,
  PerformanceOptimizer
} from '@/utils/animations/performance'
import {
  AccessibilityAnimationAdapter
} from '@/utils/animations/accessibility'
import { prefersReducedMotion } from '@/utils/accessibility'

// Page transition state interface
export interface PageTransitionState {
  isTransitioning: boolean
  transitionType: TransitionType | null
  progress: number
  duration: number
  canInterrupt: boolean
}

// Page transition options interface
export interface PageTransitionOptions {
  type?: TransitionType
  duration?: number
  priority?: keyof typeof ANIMATION_PRIORITIES
  respectReducedMotion?: boolean
  enablePerformanceMonitoring?: boolean
  showProgress?: boolean
  canInterrupt?: boolean
  onProgress?: (progress: number) => void
  onStart?: () => void
  onComplete?: () => void
  onCancel?: () => void
}

// Page transition hook return value
export interface UsePageTransitionReturn {
  // State
  state: PageTransitionState
  
  // Control methods
  startTransition: (options?: PageTransitionOptions) => Promise<void>
  cancelTransition: () => void
  completeTransition: () => void
  
  // Navigation helpers
  navigateTo: (path: string, options?: PageTransitionOptions) => Promise<void>
  goBack: (options?: PageTransitionOptions) => void
  goForward: (options?: PageTransitionOptions) => void
  
  // Performance and analytics
  getPerformanceMetrics: () => Record<string, unknown>
  getTransitionHistory: () => Array<{
    from: string
    to: string
    type: TransitionType
    timestamp: number
    duration: number
  }>
  
  // Configuration
  configureDefaultTransition: (options: PageTransitionOptions) => void
  resetConfiguration: () => void
}

// Default transition configuration
const DEFAULT_OPTIONS: PageTransitionOptions = {
  type: 'luxury-reveal',
  duration: ANIMATION_DURATIONS.page,
  priority: 'important',
  respectReducedMotion: true,
  enablePerformanceMonitoring: true,
  showProgress: false,
  canInterrupt: true,
}

/**
 * Advanced page transition hook for managing sophisticated page transitions
 * Provides comprehensive control over transition behavior, performance monitoring, and accessibility
 */
export function usePageTransition(
  customOptions: PageTransitionOptions = {}
): UsePageTransitionReturn {
  const router = useRouter()
  const pathname = usePathname()
  const transitionManager = useTransitionManager()
  const transitionControl = useTransitionControl()
  
  // State management
  const [state, setState] = useState<PageTransitionState>({
    isTransitioning: false,
    transitionType: null,
    progress: 0,
    duration: DEFAULT_OPTIONS.duration!,
    canInterrupt: true,
  })
  
  const [defaultOptions, setDefaultOptions] = useState<PageTransitionOptions>({
    ...DEFAULT_OPTIONS,
    ...customOptions,
  })
  
  // Refs
  const transitionStartTimeRef = useRef<number>(0)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const currentOptionsRef = useRef<PageTransitionOptions>(defaultOptions)
  const isTransitioningRef = useRef<boolean>(false)
  
  // Update state when transition manager state changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      isTransitioning: transitionManager.isTransitioning,
      transitionType: transitionManager.currentTransition,
    }))
    isTransitioningRef.current = transitionManager.isTransitioning
  }, [transitionManager.isTransitioning, transitionManager.currentTransition])
  
  // Start a page transition
  const startTransition = useCallback(async (
    options: PageTransitionOptions = {}
  ): Promise<void> => {
    if (isTransitioningRef.current && !options.canInterrupt && !state.canInterrupt) {
      return Promise.reject(new Error('Transition already in progress and cannot be interrupted'))
    }
    
    const mergedOptions = { ...defaultOptions, ...options }
    currentOptionsRef.current = mergedOptions
    
    // Check for reduced motion preference
    if (mergedOptions.respectReducedMotion && prefersReducedMotion()) {
      mergedOptions.duration = ANIMATION_DURATIONS.instant
      mergedOptions.type = 'fade'
    }
    
    // Start performance monitoring
    if (mergedOptions.enablePerformanceMonitoring) {
      performanceMonitor.startMonitoring(
        `page-transition-${mergedOptions.type}`,
        mergedOptions.priority || 'important'
      )
    }
    
    // Update state
    setState(prev => ({
      ...prev,
      isTransitioning: true,
      transitionType: mergedOptions.type || 'fade',
      duration: mergedOptions.duration || ANIMATION_DURATIONS.page,
      canInterrupt: mergedOptions.canInterrupt !== false,
      progress: 0,
    }))
    
    transitionStartTimeRef.current = performance.now()
    
    // Start transition manager
    transitionControl.startTransition(mergedOptions.type!, mergedOptions)
    
    // Start progress tracking if enabled
    if (mergedOptions.showProgress) {
      const progressInterval = 50 // Update every 50ms
      const totalDuration = mergedOptions.duration || ANIMATION_DURATIONS.page
      
      progressIntervalRef.current = setInterval(() => {
        const elapsed = performance.now() - transitionStartTimeRef.current
        const progress = Math.min((elapsed / totalDuration) * 100, 95) // Cap at 95% until complete
        
        setState(prev => ({ ...prev, progress }))
        mergedOptions.onProgress?.(progress)
      }, progressInterval)
    }
    
    // Call start callback
    mergedOptions.onStart?.()
    
    return new Promise<void>((resolve, reject) => {
      const checkCompletion = setInterval(() => {
        if (!isTransitioningRef.current) {
          clearInterval(checkCompletion)
          completeTransition()
          resolve()
        }
      }, 50)
      
      // Timeout fallback
      setTimeout(() => {
        clearInterval(checkCompletion)
        if (isTransitioningRef.current) {
          completeTransition()
          resolve()
        }
      }, (mergedOptions.duration || ANIMATION_DURATIONS.page) + 500)
    })
  }, [defaultOptions, state.canInterrupt, transitionControl])
  
  // Cancel current transition
  const cancelTransition = useCallback(() => {
    if (!isTransitioningRef.current) return
    
    // Clear progress tracking
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
    
    // Update state
    setState(prev => ({
      ...prev,
      isTransitioning: false,
      transitionType: null,
      progress: 0,
    }))
    
    isTransitioningRef.current = false
    
    // Stop performance monitoring
    const metrics = performanceMonitor.stopMonitoring(
      `page-transition-${currentOptionsRef.current.type}`
    )
    
    // Call cancel callback
    currentOptionsRef.current.onCancel?.()
  }, [])
  
  // Complete current transition
  const completeTransition = useCallback(() => {
    if (!isTransitioningRef.current) return
    
    // Clear progress tracking
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
    
    // Update state
    setState(prev => ({
      ...prev,
      isTransitioning: false,
      transitionType: null,
      progress: 100,
    }))
    
    isTransitioningRef.current = false
    
    // Stop performance monitoring
    const metrics = performanceMonitor.stopMonitoring(
      `page-transition-${currentOptionsRef.current.type}`
    )
    
    // Call complete callback
    currentOptionsRef.current.onComplete?.()
  }, [])
  
  // Navigate to a specific path with transition
  const navigateTo = useCallback(async (
    path: string,
    options: PageTransitionOptions = {}
  ): Promise<void> => {
    if (path === pathname) return Promise.resolve()
    
    try {
      await startTransition(options)
      router.push(path)
    } catch (error) {
      console.error('Navigation failed:', error)
      throw error
    }
  }, [pathname, router, startTransition])
  
  // Go back with transition
  const goBack = useCallback((options: PageTransitionOptions = {}) => {
    const mergedOptions = { ...defaultOptions, ...options }
    
    // Use a different transition type for back navigation
    if (!mergedOptions.type) {
      mergedOptions.type = 'slide'
    }
    
    startTransition(mergedOptions).then(() => {
      router.back()
    }).catch(console.error)
  }, [defaultOptions, router, startTransition])
  
  // Go forward with transition
  const goForward = useCallback((options: PageTransitionOptions = {}) => {
    const mergedOptions = { ...defaultOptions, ...options }
    
    // Use a different transition type for forward navigation
    if (!mergedOptions.type) {
      mergedOptions.type = 'slide'
    }
    
    startTransition(mergedOptions).then(() => {
      router.forward()
    }).catch(console.error)
  }, [defaultOptions, router, startTransition])
  
  // Get performance metrics
  const getPerformanceMetrics = useCallback(() => {
    return {
      ...transitionControl.getPerformanceMetrics(),
      currentTransition: {
        type: state.transitionType,
        duration: state.duration,
        progress: state.progress,
        startTime: transitionStartTimeRef.current,
      }
    }
  }, [transitionControl, state])
  
  // Get transition history
  const getTransitionHistory = useCallback(() => {
    return transitionManager.transitionHistory
  }, [transitionManager])
  
  // Configure default transition
  const configureDefaultTransition = useCallback((options: PageTransitionOptions) => {
    setDefaultOptions(prev => ({ ...prev, ...options }))
  }, [])
  
  // Reset configuration
  const resetConfiguration = useCallback(() => {
    setDefaultOptions({ ...DEFAULT_OPTIONS, ...customOptions })
  }, [customOptions])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      if (isTransitioningRef.current) {
        cancelTransition()
      }
    }
  }, [cancelTransition])
  
  return {
    state,
    startTransition,
    cancelTransition,
    completeTransition,
    navigateTo,
    goBack,
    goForward,
    getPerformanceMetrics,
    getTransitionHistory,
    configureDefaultTransition,
    resetConfiguration,
  }
}

/**
 * Simplified page transition hook for basic use cases
 */
export function useSimplePageTransition(
  type: TransitionType = 'luxury-reveal'
) {
  const { startTransition, state } = usePageTransition({ type })
  
  return {
    isTransitioning: state.isTransitioning,
    startTransition: () => startTransition({ type }),
  }
}

/**
 * Page transition hook for navigation components
 */
export function useNavigationTransition() {
  const { navigateTo, goBack, state } = usePageTransition()
  
  return {
    navigateTo,
    goBack,
    isTransitioning: state.isTransitioning,
  }
}

/**
 * Page transition hook for monitoring and analytics
 */
export function useTransitionAnalytics() {
  const { getPerformanceMetrics, getTransitionHistory } = usePageTransition()
  
  const getAnalytics = useCallback(() => {
    const metrics = getPerformanceMetrics()
    const history = getTransitionHistory()
    
    // Calculate analytics
    const analytics = {
      performance: metrics,
      history: history,
      stats: {
        totalTransitions: history.length,
        averageDuration: history.length > 0 
          ? history.reduce((sum, entry) => sum + entry.duration, 0) / history.length 
          : 0,
        mostUsedType: history.reduce((acc, entry) => {
          acc[entry.type] = (acc[entry.type] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        performanceScore: Object.values(metrics).reduce((score: number, metric: unknown) => {
          if (metric && typeof metric === 'object' && 'performanceScore' in metric) {
            return score + (metric as { performanceScore: number }).performanceScore
          }
          return score
        }, 0) / Object.keys(metrics).length || 0,
      }
    }
    
    return analytics
  }, [getPerformanceMetrics, getTransitionHistory])
  
  return {
    getAnalytics,
  }
}

export default usePageTransition