'use client'

import { useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, Variants, MotionProps } from 'framer-motion'
import { 
  ANIMATION_DURATIONS, 
  ANIMATION_DELAYS, 
  EASING, 
  ANIMATION_STATES 
} from '@/utils/animations/constants'
import { 
  performanceMonitor, 
  HardwareAccelerationHelper 
} from '@/utils/animations/performance'
import { 
  AccessibilityAnimationAdapter,
  createSafeAnimationProps,
  getSafeAnimationDuration
} from '@/utils/animations/accessibility'

// Overlay variant types
export type OverlayVariant = 'blur' | 'vignette' | 'fade' | 'gradient'

// Overlay position types
export type OverlayPosition = 'full' | 'top' | 'bottom' | 'left' | 'right' | 'center'

// Overlay props interface
export interface AnimatedOverlayProps extends Omit<MotionProps, 'variants' | 'initial' | 'animate' | 'exit'> {
  // Core props
  isOpen: boolean
  onClose?: () => void
  variant?: OverlayVariant
  position?: OverlayPosition
  
  // Animation props
  duration?: number
  delay?: number
  enablePerformanceMonitoring?: boolean
  respectReducedMotion?: boolean
  
  // Visual props
  opacity?: number
  blur?: number
  color?: string
  gradient?: string
  
  // Interaction props
  closeOnClick?: boolean
  closeOnEscape?: boolean
  preventInteraction?: boolean
  
  // Accessibility props
  ariaLabel?: string
  ariaHidden?: boolean
  
  // Children
  children?: React.ReactNode
  
  // Callbacks
  onAnimationStart?: () => void
  onAnimationComplete?: () => void
}

// Create overlay variants based on variant type
const createOverlayVariants = (
  variant: OverlayVariant,
  position: OverlayPosition,
  duration: number,
  opacity: number,
  blur: number,
  color: string,
  gradient: string
): Variants => {
  const baseTransition = {
    duration: duration / 1000,
    ease: EASING.luxury as any,
  }

  switch (variant) {
    case 'blur':
      return {
        initial: {
          opacity: 0,
          backdropFilter: 'blur(0px)',
        },
        animate: {
          opacity: opacity,
          backdropFilter: `blur(${blur}px)`,
          transition: baseTransition
        },
        exit: {
          opacity: 0,
          backdropFilter: 'blur(0px)',
          transition: { ...baseTransition, duration: (duration / 1000) * 0.8 }
        },
      }

    case 'vignette':
      return {
        initial: {
          opacity: 0,
          background: 'radial-gradient(circle at center, transparent 0%, transparent 100%)',
        },
        animate: {
          opacity: opacity,
          background: `radial-gradient(circle at center, transparent 30%, ${color} 100%)`,
          transition: baseTransition
        },
        exit: {
          opacity: 0,
          background: 'radial-gradient(circle at center, transparent 0%, transparent 100%)',
          transition: { ...baseTransition, duration: (duration / 1000) * 0.8 }
        },
      }

    case 'gradient':
      return {
        initial: {
          opacity: 0,
          background: gradient || `linear-gradient(135deg, ${color} 0%, transparent 100%)`,
          backgroundSize: '200% 200%',
          backgroundPosition: '0% 0%',
        },
        animate: {
          opacity: opacity,
          background: gradient || `linear-gradient(135deg, ${color} 0%, transparent 100%)`,
          backgroundSize: '200% 200%',
          backgroundPosition: '100% 100%',
          transition: {
            ...baseTransition,
            backgroundPosition: { duration: (duration / 1000) * 2 }
          }
        },
        exit: {
          opacity: 0,
          background: gradient || `linear-gradient(135deg, ${color} 0%, transparent 100%)`,
          backgroundSize: '200% 200%',
          backgroundPosition: '0% 0%',
          transition: { ...baseTransition, duration: (duration / 1000) * 0.8 }
        },
      }

    case 'fade':
    default:
      return {
        initial: { opacity: 0 },
        animate: {
          opacity: opacity,
          backgroundColor: color,
          transition: baseTransition
        },
        exit: {
          opacity: 0,
          transition: { ...baseTransition, duration: (duration / 1000) * 0.8 }
        },
      }
  }
}

// Get position styles based on position type
const getPositionStyles = (position: OverlayPosition) => {
  switch (position) {
    case 'top':
      return {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        height: '50vh',
      }
    case 'bottom':
      return {
        position: 'fixed' as const,
        bottom: 0,
        left: 0,
        right: 0,
        height: '50vh',
      }
    case 'left':
      return {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        bottom: 0,
        width: '50vw',
      }
    case 'right':
      return {
        position: 'fixed' as const,
        top: 0,
        right: 0,
        bottom: 0,
        width: '50vw',
      }
    case 'center':
      return {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80vw',
        height: '80vh',
        borderRadius: '16px',
      }
    case 'full':
    default:
      return {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }
  }
}

export function AnimatedOverlay({
  isOpen,
  onClose,
  variant = 'fade',
  position = 'full',
  duration = ANIMATION_DURATIONS.normal,
  delay = ANIMATION_DELAYS.none,
  enablePerformanceMonitoring = true,
  respectReducedMotion = true,
  opacity = 0.8,
  blur = 8,
  color = 'rgba(0, 0, 0, 0.5)',
  gradient,
  closeOnClick = true,
  closeOnEscape = true,
  preventInteraction = false,
  ariaLabel = 'Overlay',
  ariaHidden = false,
  children,
  onAnimationStart,
  onAnimationComplete,
  ...motionProps
}: AnimatedOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const isAnimatingRef = useRef(false)

  // Get position styles
  const positionStyles = getPositionStyles(position)

  // Create animation variants
  const variants = createOverlayVariants(
    variant,
    position,
    duration,
    opacity,
    blur,
    color,
    gradient || ''
  )

  // Create accessible variants
  const safeVariants = createSafeAnimationProps(
    { variants },
    { respectReducedMotion }
  ).variants as Variants

  // Adjust duration for accessibility
  const safeDuration = getSafeAnimationDuration(duration, respectReducedMotion)

  // Handle click events
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (closeOnClick && e.target === e.currentTarget) {
      onClose?.()
    }
  }, [closeOnClick, onClose])

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [closeOnEscape, isOpen, onClose])

  // Performance monitoring
  useEffect(() => {
    if (!enablePerformanceMonitoring) return

    if (isOpen && !isAnimatingRef.current) {
      isAnimatingRef.current = true
      performanceMonitor.startMonitoring('animated-overlay', 'normal')
      onAnimationStart?.()
    }

    return () => {
      if (isAnimatingRef.current) {
        const metrics = performanceMonitor.stopMonitoring('animated-overlay')
        if (metrics && metrics.frameRate < 30) {
          console.warn('Low frame rate detected in animated overlay:', metrics)
        }
        isAnimatingRef.current = false
        onAnimationComplete?.()
      }
    }
  }, [isOpen, enablePerformanceMonitoring, onAnimationStart, onAnimationComplete])

  // Hardware acceleration
  useEffect(() => {
    if (overlayRef.current) {
      HardwareAccelerationHelper.applyHardwareAcceleration(overlayRef.current)
    }

    return () => {
      if (overlayRef.current) {
        HardwareAccelerationHelper.removeHardwareAcceleration(overlayRef.current)
      }
    }
  }, [])

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen && preventInteraction) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, preventInteraction])

  const shouldCapturePointerEvents = preventInteraction || closeOnClick || !!onClose

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          ref={overlayRef}
          {...motionProps}
          variants={safeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{
            ...positionStyles,
            zIndex: 40,
            pointerEvents: shouldCapturePointerEvents ? 'auto' : 'none',
            ...motionProps.style,
          }}
          className={`
            ${shouldCapturePointerEvents ? 'pointer-events-auto' : 'pointer-events-none'}
          `}
          onClick={handleClick}
          aria-label={ariaLabel}
          aria-hidden={ariaHidden}
          role="presentation"
        >
          {/* Render children if provided */}
          {children && (
            <div className="relative w-full h-full flex items-center justify-center">
              {children}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AnimatedOverlay
