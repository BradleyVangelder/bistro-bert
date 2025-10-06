'use client'

import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Variants } from 'framer-motion'
import { PageTransition } from './PageTransition'
import { LuxuryPageTransition } from './LuxuryPageTransition'
import {
  ANIMATION_DURATIONS,
  ANIMATION_PRIORITIES
} from '@/utils/animations/constants'
import {
  performanceMonitor
} from '@/utils/animations/performance'

// Transition types
export type TransitionType = 'fade' | 'slide' | 'immersive' | 'luxury' | 'gold-shimmer' | 'luxury-reveal' | 'elegant'

// Route transition configuration
export interface RouteTransitionConfig {
  type: TransitionType
  duration?: number
  priority?: keyof typeof ANIMATION_PRIORITIES
  customVariants?: Variants
  skipTransition?: boolean
}

// Transition history entry
export interface TransitionHistoryEntry {
  from: string
  to: string
  type: TransitionType
  timestamp: number
  duration: number
}

// Transition context interface
interface TransitionContextType {
  // Current transition state
  isTransitioning: boolean
  currentTransition: TransitionType | null
  
  // Transition control
  startTransition: (type?: TransitionType, config?: Partial<RouteTransitionConfig>) => void
  endTransition: () => void
  
  // Route configuration
  setRouteTransition: (path: string, config: RouteTransitionConfig) => void
  getRouteTransition: (path: string) => RouteTransitionConfig | null
  
  // History
  transitionHistory: TransitionHistoryEntry[]
  clearHistory: () => void
  
  // Performance
  getPerformanceMetrics: () => Record<string, unknown>
  
  // Queue management
  queueTransition: (type: TransitionType, config?: Partial<RouteTransitionConfig>) => void
  clearQueue: () => void
}

// Create context
const TransitionContext = createContext<TransitionContextType | null>(null)

// Transition Manager Provider Props
interface TransitionManagerProps {
  children: React.ReactNode
  defaultTransition?: TransitionType
  enablePerformanceMonitoring?: boolean
  respectReducedMotion?: boolean
  maxHistorySize?: number
}

// Route transition mappings
const DEFAULT_ROUTE_TRANSITIONS: Record<string, RouteTransitionConfig> = {
  '/': { type: 'luxury-reveal', duration: ANIMATION_DURATIONS.immersive },
  '/menu': { type: 'elegant', duration: ANIMATION_DURATIONS.page },
  '/contact': { type: 'immersive', duration: ANIMATION_DURATIONS.page },
  '/over-ons': { type: 'slide', duration: ANIMATION_DURATIONS.page },
}

// Transition Manager Provider Component
export function TransitionManager({
  children,
  defaultTransition = 'fade',
  enablePerformanceMonitoring = true,
  respectReducedMotion = true,
  maxHistorySize = 20
}: TransitionManagerProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  // State management
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentTransition, setCurrentTransition] = useState<TransitionType | null>(null)
  const [routeTransitions, setRouteTransitions] = useState(DEFAULT_ROUTE_TRANSITIONS)
  const [transitionHistory, setTransitionHistory] = useState<TransitionHistoryEntry[]>([])
  const [transitionQueue, setTransitionQueue] = useState<Array<{type: TransitionType, config?: Partial<RouteTransitionConfig>}>>()
  
  // Refs
  const previousPathRef = useRef<string>(pathname)
  const transitionStartTimeRef = useRef<number>(0)
  const performanceMetricsRef = useRef<Record<string, unknown>>({})

  // Get transition configuration for a route
  const getRouteTransition = useCallback((path: string): RouteTransitionConfig | null => {
    // Check exact match first
    if (routeTransitions[path]) {
      return routeTransitions[path]
    }
    
    // Check for pattern matches
    const patterns = Object.keys(routeTransitions).filter(route => {
      if (route.includes('*')) {
        const regex = new RegExp(route.replace('*', '.*'))
        return regex.test(path)
      }
      return false
    })
    
    if (patterns.length > 0) {
      return routeTransitions[patterns[0]]
    }
    
    // Return default
    return { type: defaultTransition, duration: ANIMATION_DURATIONS.page }
  }, [routeTransitions, defaultTransition])

  // Set transition configuration for a route
  const setRouteTransition = useCallback((path: string, config: RouteTransitionConfig) => {
    setRouteTransitions(prev => ({
      ...prev,
      [path]: config
    }))
  }, [])

  // Start a transition
  const startTransition = useCallback((
    type: TransitionType = defaultTransition,
    config: Partial<RouteTransitionConfig> = {}
  ) => {
    if (isTransitioning) {
      // Queue the transition if one is already in progress
      queueTransition(type, config)
      return
    }
    
    setIsTransitioning(true)
    setCurrentTransition(type)
    transitionStartTimeRef.current = performance.now()
    
    // Start performance monitoring
    if (enablePerformanceMonitoring) {
      performanceMonitor.startMonitoring(`transition-${type}`, config.priority || 'important')
    }
  }, [isTransitioning, defaultTransition, enablePerformanceMonitoring])

  // End current transition
  const endTransition = useCallback(() => {
    if (!isTransitioning) return
    
    setIsTransitioning(false)
    setCurrentTransition(null)
    
    // Calculate transition duration
    const duration = performance.now() - transitionStartTimeRef.current
    
    // Add to history
    if (previousPathRef.current !== pathname) {
      const historyEntry: TransitionHistoryEntry = {
        from: previousPathRef.current,
        to: pathname,
        type: currentTransition || defaultTransition,
        timestamp: Date.now(),
        duration
      }
      
      setTransitionHistory(prev => {
        const newHistory = [historyEntry, ...prev]
        return newHistory.slice(0, maxHistorySize)
      })
    }
    
    // Stop performance monitoring
    if (enablePerformanceMonitoring) {
      const metrics = performanceMonitor.stopMonitoring(`transition-${currentTransition}`)
      if (metrics) {
        performanceMetricsRef.current = {
          ...performanceMetricsRef.current,
          [currentTransition || 'unknown']: metrics
        }
      }
    }
    
    previousPathRef.current = pathname
    
    // Process next transition in queue
    if (transitionQueue && transitionQueue.length > 0) {
      const next = transitionQueue[0]
      setTransitionQueue(prev => prev?.slice(1))
      startTransition(next.type, next.config)
    }
  }, [isTransitioning, currentTransition, pathname, defaultTransition, enablePerformanceMonitoring, maxHistorySize, transitionQueue])

  // Queue a transition
  const queueTransition = useCallback((
    type: TransitionType,
    config?: Partial<RouteTransitionConfig>
  ) => {
    setTransitionQueue(prev => [...(prev || []), { type, config }])
  }, [])

  // Clear transition queue
  const clearQueue = useCallback(() => {
    setTransitionQueue([])
  }, [])

  // Clear transition history
  const clearHistory = useCallback(() => {
    setTransitionHistory([])
  }, [])

  // Get performance metrics
  const getPerformanceMetrics = useCallback(() => {
    return performanceMetricsRef.current
  }, [])

  // Handle route changes
  useEffect(() => {
    if (pathname !== previousPathRef.current) {
      const config = getRouteTransition(pathname)
      if (config && !config.skipTransition) {
        startTransition(config.type, config)
      }
    }
  }, [pathname, getRouteTransition, startTransition])

  // Auto-end transition after duration
  useEffect(() => {
    if (isTransitioning && currentTransition) {
      const config = getRouteTransition(pathname)
      const duration = config?.duration || ANIMATION_DURATIONS.page
      
      const timeout = setTimeout(() => {
        endTransition()
      }, duration + 100) // Add buffer
      
      return () => clearTimeout(timeout)
    }
  }, [isTransitioning, currentTransition, pathname, getRouteTransition, endTransition])

  // Context value
  const contextValue: TransitionContextType = {
    isTransitioning,
    currentTransition,
    startTransition,
    endTransition,
    setRouteTransition,
    getRouteTransition,
    transitionHistory,
    clearHistory,
    getPerformanceMetrics,
    queueTransition,
    clearQueue
  }

  // Determine which transition component to use
  const renderTransition = () => {
    const config = getRouteTransition(pathname)
    const transitionType = currentTransition || config?.type || defaultTransition
    
    // Use luxury transition for luxury variants
    if (['luxury', 'gold-shimmer', 'luxury-reveal', 'elegant'].includes(transitionType)) {
      return (
        <LuxuryPageTransition
          variant={transitionType as 'gold-shimmer' | 'luxury-reveal' | 'immersive' | 'elegant'}
          duration={config?.duration || ANIMATION_DURATIONS.page}
          enablePerformanceMonitoring={enablePerformanceMonitoring}
          respectReducedMotion={respectReducedMotion}
          onTransitionStart={() => startTransition(transitionType, config || undefined)}
          onTransitionComplete={endTransition}
        >
          {children}
        </LuxuryPageTransition>
      )
    }
    
    // Use standard page transition
    return (
      <PageTransition>
        {children}
      </PageTransition>
    )
  }

  return (
    <TransitionContext.Provider value={contextValue}>
      {renderTransition()}
    </TransitionContext.Provider>
  )
}

// Hook to use transition manager
export function useTransitionManager() {
  const context = useContext(TransitionContext)
  
  if (!context) {
    throw new Error('useTransitionManager must be used within a TransitionManager')
  }
  
  return context
}

// Hook to configure route transitions
export function useRouteTransition(path: string, config: RouteTransitionConfig) {
  const { setRouteTransition } = useTransitionManager()
  
  useEffect(() => {
    setRouteTransition(path, config)
  }, [path, config, setRouteTransition])
}

// Hook to get transition history
export function useTransitionHistory() {
  const { transitionHistory, clearHistory } = useTransitionManager()
  
  return {
    history: transitionHistory,
    clearHistory,
    getRecentTransitions: (count: number = 5) => transitionHistory.slice(0, count),
    getTransitionStats: () => {
      const stats = transitionHistory.reduce((acc, entry) => {
        acc.totalTransitions++
        acc.totalDuration += entry.duration
        acc.typeCounts[entry.type] = (acc.typeCounts[entry.type] || 0) + 1
        return acc
      }, {
        totalTransitions: 0,
        totalDuration: 0,
        typeCounts: {} as Record<string, number>
      })
      
      return {
        ...stats,
        averageDuration: stats.totalTransitions > 0 ? stats.totalDuration / stats.totalTransitions : 0,
        mostUsedType: Object.entries(stats.typeCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || null
      }
    }
  }
}

// Hook to control transitions programmatically
export function useTransitionControl() {
  const {
    isTransitioning,
    currentTransition,
    startTransition,
    endTransition,
    queueTransition,
    clearQueue,
    getPerformanceMetrics
  } = useTransitionManager()
  
  return {
    isTransitioning,
    currentTransition,
    startTransition,
    endTransition,
    queueTransition,
    clearQueue,
    getPerformanceMetrics,
    transitionTo: (type: TransitionType, config?: Partial<RouteTransitionConfig>) => {
      startTransition(type, config)
    }
  }
}

export default TransitionManager