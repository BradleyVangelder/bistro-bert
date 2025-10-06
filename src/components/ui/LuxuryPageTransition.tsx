'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, Variants, MotionValue } from 'framer-motion'
import Image from 'next/image'
import { useCursor } from './CursorProvider'
import { 
  ANIMATION_DURATIONS, 
  ANIMATION_DELAYS, 
  EASING, 
  ANIMATION_STATES,
  DIRECTIONS,
  SCALES
} from '@/utils/animations/constants'
import { 
  pageTransitionPresets, 
  revealPresets, 
  effectPresets,
  staggerPresets 
} from '@/utils/animations/presets'
import { 
  performanceMonitor, 
  HardwareAccelerationHelper 
} from '@/utils/animations/performance'
import { 
  AccessibilityAnimationAdapter,
  createSafeAnimationProps,
  getSafeAnimationDuration
} from '@/utils/animations/accessibility'

interface LuxuryPageTransitionProps {
  children: React.ReactNode
  variant?: 'gold-shimmer' | 'luxury-reveal' | 'immersive' | 'elegant'
  duration?: number
  enablePerformanceMonitoring?: boolean
  respectReducedMotion?: boolean
  customVariants?: Variants
  onTransitionStart?: () => void
  onTransitionComplete?: () => void
  showLoadingIndicator?: boolean
  loadingMessage?: string
}

export function LuxuryPageTransition({ 
  children, 
  variant = 'luxury-reveal',
  duration = ANIMATION_DURATIONS.immersive,
  enablePerformanceMonitoring = true,
  respectReducedMotion = true,
  customVariants,
  onTransitionStart,
  onTransitionComplete,
  showLoadingIndicator = true,
  loadingMessage = "Ervaar elegantie"
}: LuxuryPageTransitionProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const { setCursorVariant } = useCursor()
  const containerRef = useRef<HTMLDivElement>(null)
  const previousPathRef = useRef<string>('')

  // Get transition variants based on variant type
  const getTransitionVariants = useCallback(() => {
    if (customVariants) return customVariants

    switch (variant) {
      case 'gold-shimmer':
        return createGoldShimmerVariants()
      case 'luxury-reveal':
        return createLuxuryRevealVariants()
      case 'immersive':
        return pageTransitionPresets.immersiveTransition
      case 'elegant':
        return createElegantVariants()
      default:
        return createLuxuryRevealVariants()
    }
  }, [variant, customVariants])

  // Gold shimmer effect variants
  const createGoldShimmerVariants = (): Variants => ({
    initial: {
      opacity: 0,
      scale: 1.05,
      filter: 'blur(8px)',
      background: 'linear-gradient(45deg, #1a1a1a, #2a2a2a)',
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      background: 'linear-gradient(45deg, #ffffff, #fafafa)',
      transition: {
        duration: duration / 1000,
        ease: [0.22, 1, 0.36, 1] as const,
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      filter: 'blur(8px)',
      background: 'linear-gradient(45deg, #1a1a1a, #2a2a2a)',
      transition: {
        duration: duration / 1000,
        ease: [0.22, 1, 0.36, 1] as const,
      }
    }
  })

  // Luxury reveal variants
  const createLuxuryRevealVariants = (): Variants => ({
    initial: {
      opacity: 0,
      y: 30,
      scale: 0.98,
      filter: 'blur(4px)',
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: duration / 1000,
        ease: [0.22, 1, 0.36, 1] as const,
      }
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.98,
      filter: 'blur(4px)',
      transition: {
        duration: duration / 1000,
        ease: [0.22, 1, 0.36, 1] as const,
      }
    }
  })

  // Elegant variants
  const createElegantVariants = (): Variants => ({
    initial: {
      opacity: 0,
      clipPath: 'inset(0 100% 0 0)',
    },
    animate: {
      opacity: 1,
      clipPath: 'inset(0 0% 0 0)',
      transition: {
        duration: duration / 1000,
        ease: [0.23, 1, 0.32, 1] as const,
      }
    },
    exit: {
      opacity: 0,
      clipPath: 'inset(0 0 0 100%)',
      transition: {
        duration: duration / 1000,
        ease: [0.23, 1, 0.32, 1] as const,
      }
    }
  })

  // Create accessible variants
  const safeVariants = createSafeAnimationProps(
    { variants: getTransitionVariants() },
    { respectReducedMotion }
  ).variants as Variants

  // Initialize component
  useEffect(() => {
    setIsMounted(true)
    
    // Apply hardware acceleration to container
    if (containerRef.current) {
      HardwareAccelerationHelper.applyHardwareAcceleration(containerRef.current)
    }

    // Monitor performance if enabled
    if (enablePerformanceMonitoring) {
      performanceMonitor.startMonitoring('luxury-page-transition', 'important')
    }

    return () => {
      // Clean up hardware acceleration
      if (containerRef.current) {
        HardwareAccelerationHelper.removeHardwareAcceleration(containerRef.current)
      }
      
      // Stop performance monitoring
      if (enablePerformanceMonitoring) {
        const metrics = performanceMonitor.stopMonitoring('luxury-page-transition')
        if (metrics) {
          console.log('Luxury page transition performance:', metrics)
        }
      }
    }
  }, [enablePerformanceMonitoring])

  // Handle route changes
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsTransitioning(true)
      setCursorVariant('loading')
      setLoadingProgress(0)
      onTransitionStart?.()
      
      // Simulate loading progress
      if (showLoadingIndicator) {
        const interval = setInterval(() => {
          setLoadingProgress(prev => {
            if (prev >= 90) {
              clearInterval(interval)
              return 90
            }
            return prev + Math.random() * 20
          })
        }, 100)
        
        // Complete loading after duration
        setTimeout(() => {
          setLoadingProgress(100)
          clearInterval(interval)
        }, duration)
      }
    }

    const handleRouteChangeComplete = () => {
      setIsTransitioning(false)
      setCursorVariant('default')
      setLoadingProgress(100)
      onTransitionComplete?.()
    }

    // Next.js navigation events
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleRouteChangeStart)
      window.addEventListener('popstate', handleRouteChangeStart)
      
      return () => {
        window.removeEventListener('beforeunload', handleRouteChangeStart)
        window.removeEventListener('popstate', handleRouteChangeStart)
      }
    }
  }, [setCursorVariant, onTransitionStart, onTransitionComplete, showLoadingIndicator, duration])

  // Adjust duration for accessibility
  const safeDuration = getSafeAnimationDuration(duration, respectReducedMotion)

  // Gold shimmer overlay variants
  const goldShimmerVariants: Variants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeIn",
      }
    }
  }

  // Loading indicator variants
  const loadingVariants: Variants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1] as const,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1] as const,
      }
    }
  }

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Gold Shimmer Overlay */}
      <AnimatePresence mode="wait">
        {isTransitioning && variant === 'gold-shimmer' && (
          <motion.div
            key="gold-shimmer"
            variants={goldShimmerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-50 pointer-events-none"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent skew-x-12 animate-shimmer" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#D4AF37]/10 to-transparent skew-x-12 animate-shimmer-reverse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Luxury Loading Overlay */}
      <AnimatePresence mode="wait">
        {isTransitioning && showLoadingIndicator && (
          <motion.div
            key="luxury-loading"
            variants={loadingVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-white z-50 flex items-center justify-center"
          >
            <div className="relative">
              {/* Luxury Logo Container */}
              <motion.div
                className="relative w-24 h-24 bg-gradient-to-br from-[#0F3B2F] to-[#1a5a47] rounded-2xl flex items-center justify-center shadow-2xl"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: [0.23, 1, 0.32, 1] as const,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/20 to-transparent rounded-2xl" />
                <div className="relative w-16 h-16">
                  <Image
                    src="/bistro-bert-logo.png"
                    alt="Bistro Bert"
                    fill
                    className="object-contain filter brightness-0 invert"
                  />
                </div>
              </motion.div>

              {/* Orbiting Gold Elements */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 w-2 h-6 bg-gradient-to-b from-[#D4AF37] to-transparent rounded-full" />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-3 w-2 h-6 bg-gradient-to-t from-[#D4AF37] to-transparent rounded-full" />
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-3 w-6 h-2 bg-gradient-to-r from-[#D4AF37] to-transparent rounded-full" />
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-3 w-6 h-2 bg-gradient-to-l from-[#D4AF37] to-transparent rounded-full" />
              </motion.div>

              {/* Loading Message */}
              <motion.div
                className="absolute -bottom-16 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-[#0F3B2F]/80 text-sm font-light tracking-wider uppercase">
                  {loadingMessage}
                </p>
              </motion.div>

              {/* Progress Bar */}
              <motion.div
                className="absolute -bottom-24 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gray-200 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#0F3B2F]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content with Luxury Transition */}
      <motion.div
        key={`luxury-page-${window.location.pathname}`}
        variants={safeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative z-10"
      >
        {children}
      </motion.div>

      {/* Luxury Ambient Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-br from-[#D4AF37]/5 to-transparent rounded-full blur-3xl"
          style={{ left: '10%', top: '20%' }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: (ANIMATION_DURATIONS.breathing * 1.5) / 1000,
            repeat: Infinity,
            ease: [0.45, 0.05, 0.55, 0.95] as const,
          }}
        />
        <motion.div
          className="absolute w-64 h-64 bg-gradient-to-br from-[#0F3B2F]/5 to-transparent rounded-full blur-3xl"
          style={{ right: '15%', top: '60%' }}
          animate={{
            y: [0, 25, 0],
            x: [0, -15, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: (ANIMATION_DURATIONS.breathing * 1.2) / 1000,
            repeat: Infinity,
            ease: [0.45, 0.05, 0.55, 0.95] as const,
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-gradient-to-br from-[#D4AF37]/3 to-transparent rounded-full blur-3xl"
          style={{ left: '50%', bottom: '10%' }}
          animate={{
            y: [0, -20, 0],
            x: [0, 25, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: (ANIMATION_DURATIONS.breathing * 1.8) / 1000,
            repeat: Infinity,
            ease: [0.45, 0.05, 0.55, 0.95] as const,
            delay: 1,
          }}
        />
      </div>

      {/* Elegant Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, #0F3B2F 1px, transparent 1px),
                             radial-gradient(circle at 80% 70%, #D4AF37 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>
    </div>
  )
}