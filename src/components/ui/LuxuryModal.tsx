'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, Variants, MotionProps } from 'framer-motion'
import { X, Maximize2, Minimize2 } from 'lucide-react'
import useModal, { ModalVariant } from '@/hooks/animations/useModal'
import AnimatedOverlay from './AnimatedOverlay'
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

// Modal size types
export type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen' | 'auto'

// Modal props interface
export interface LuxuryModalProps extends Omit<MotionProps, 'variants' | 'initial' | 'animate' | 'exit'> {
  // Core props
  isOpen: boolean
  onClose: () => void
  variant?: ModalVariant
  size?: ModalSize
  
  // Content props
  title?: string
  description?: string
  children: React.ReactNode
  
  // Animation props
  duration?: number
  enablePerformanceMonitoring?: boolean
  respectReducedMotion?: boolean
  
  // Visual props
  showBackdrop?: boolean
  backdropVariant?: 'blur' | 'vignette' | 'fade' | 'gradient'
  backdropOpacity?: number
  showCloseButton?: boolean
  showMaximizeButton?: boolean
  isMaximized?: boolean
  onMaximize?: () => void
  onMinimize?: () => void
  
  // Interaction props
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  preventBodyScroll?: boolean
  
  // Accessibility props
  ariaLabel?: string
  ariaDescribedBy?: string
  
  // Styling props
  className?: string
  overlayClassName?: string
  modalClassName?: string
  
  // Callbacks
  onAnimationStart?: () => void
  onAnimationComplete?: () => void
}

// Get modal size styles
const getModalSizeStyles = (size: ModalSize, isMaximized: boolean) => {
  if (isMaximized) {
    return {
      width: '95vw',
      height: '95vh',
      maxWidth: 'none',
      maxHeight: 'none',
    }
  }

  switch (size) {
    case 'small':
      return {
        width: '90vw',
        maxWidth: '400px',
        height: 'auto',
        maxHeight: '80vh',
      }
    case 'medium':
      return {
        width: '90vw',
        maxWidth: '600px',
        height: 'auto',
        maxHeight: '85vh',
      }
    case 'large':
      return {
        width: '90vw',
        maxWidth: '800px',
        height: 'auto',
        maxHeight: '90vh',
      }
    case 'fullscreen':
      return {
        width: '100vw',
        height: '100vh',
        maxWidth: 'none',
        maxHeight: 'none',
      }
    case 'auto':
    default:
      return {
        width: 'auto',
        height: 'auto',
        maxWidth: '90vw',
        maxHeight: '90vh',
      }
  }
}

// Create modal variants based on variant type
const createModalVariants = (
  variant: ModalVariant,
  duration: number
): Variants => {
  const baseTransition = {
    duration: duration / 1000,
    ease: EASING.luxury as any,
  }

  switch (variant) {
    case 'elegant':
      return {
        initial: { 
          opacity: 0, 
          scale: 0.95, 
          y: 20,
          filter: 'blur(4px)',
        },
        animate: { 
          opacity: 1, 
          scale: 1, 
          y: 0,
          filter: 'blur(0px)',
          transition: baseTransition
        },
        exit: { 
          opacity: 0, 
          scale: 0.95, 
          y: -20,
          filter: 'blur(4px)',
          transition: { ...baseTransition, duration: (duration / 1000) * 0.8 }
        },
      }

    case 'immersive':
      return {
        initial: { 
          opacity: 0, 
          scale: 0.85, 
          y: 50,
          rotateX: 5,
        },
        animate: { 
          opacity: 1, 
          scale: 1, 
          y: 0,
          rotateX: 0,
          transition: { ...baseTransition, duration: (duration / 1000) * 1.2 }
        },
        exit: { 
          opacity: 0, 
          scale: 0.85, 
          y: 50,
          rotateX: 5,
          transition: { ...baseTransition, duration: (duration / 1000) * 0.9 }
        },
      }

    case 'minimal':
      return {
        initial: { 
          opacity: 0, 
          y: -10,
        },
        animate: { 
          opacity: 1, 
          y: 0,
          transition: { ...baseTransition, duration: (duration / 1000) * 0.7 }
        },
        exit: { 
          opacity: 0, 
          y: -10,
          transition: { ...baseTransition, duration: (duration / 1000) * 0.5 }
        },
      }

    default:
      return createModalVariants('elegant', duration)
  }
}

// Create content variants for staggered animations
const createContentVariants = (duration: number): Variants => {
  return {
    initial: { 
      opacity: 0, 
      y: 10,
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: duration / 1000,
        ease: EASING.refined as any,
        delay: 0.1,
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: {
        duration: (duration / 1000) * 0.6,
        ease: EASING.refined as any,
      }
    },
  }
}

export function LuxuryModal({
  isOpen,
  onClose,
  variant = 'elegant',
  size = 'medium',
  title,
  description,
  children,
  duration = ANIMATION_DURATIONS.content,
  enablePerformanceMonitoring = true,
  respectReducedMotion = true,
  showBackdrop = true,
  backdropVariant = 'blur',
  backdropOpacity = 0.8,
  showCloseButton = true,
  showMaximizeButton = false,
  isMaximized = false,
  onMaximize,
  onMinimize,
  closeOnBackdrop = true,
  closeOnEscape = true,
  preventBodyScroll = true,
  ariaLabel,
  ariaDescribedBy,
  className,
  overlayClassName,
  modalClassName,
  onAnimationStart,
  onAnimationComplete,
  ...motionProps
}: LuxuryModalProps) {
  const [isMaximizedState, setIsMaximizedState] = useState(isMaximized)
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Get modal size styles
  const sizeStyles = getModalSizeStyles(size, isMaximizedState)

  // Create animation variants
  const modalVariants = createModalVariants(variant, duration)
  const contentVariants = createContentVariants(duration)

  // Create accessible variants
  const safeModalVariants = createSafeAnimationProps(
    { variants: modalVariants },
    { respectReducedMotion }
  ).variants as Variants

  const safeContentVariants = createSafeAnimationProps(
    { variants: contentVariants },
    { respectReducedMotion }
  ).variants as Variants

  // Adjust duration for accessibility
  const safeDuration = getSafeAnimationDuration(duration, respectReducedMotion)

  // Handle maximize/minimize
  const handleMaximize = useCallback(() => {
    if (isMaximizedState) {
      setIsMaximizedState(false)
      onMinimize?.()
    } else {
      setIsMaximizedState(true)
      onMaximize?.()
    }
  }, [isMaximizedState, onMaximize, onMinimize])

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isMaximizedState) {
          handleMaximize()
        } else {
          onClose()
        }
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [closeOnEscape, isOpen, onClose, isMaximizedState, handleMaximize])

  // Performance monitoring
  useEffect(() => {
    if (!enablePerformanceMonitoring || !isOpen) return

    performanceMonitor.startMonitoring('luxury-modal', 'important')
    onAnimationStart?.()

    return () => {
      const metrics = performanceMonitor.stopMonitoring('luxury-modal')
      if (metrics && metrics.frameRate < 30) {
        console.warn('Low frame rate detected in luxury modal:', metrics)
      }
      onAnimationComplete?.()
    }
  }, [enablePerformanceMonitoring, isOpen, onAnimationStart, onAnimationComplete])

  // Hardware acceleration
  useEffect(() => {
    if (modalRef.current) {
      HardwareAccelerationHelper.applyHardwareAcceleration(modalRef.current)
    }

    return () => {
      if (modalRef.current) {
        HardwareAccelerationHelper.removeHardwareAcceleration(modalRef.current)
      }
    }
  }, [])

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Focus the modal or first focusable element
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus()
      } else {
        modalRef.current.focus()
      }
    }
  }, [isOpen])

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          {showBackdrop && (
            <AnimatedOverlay
              isOpen={isOpen}
              onClose={closeOnBackdrop ? onClose : undefined}
              variant={backdropVariant}
              opacity={backdropOpacity}
              closeOnClick={closeOnBackdrop}
              closeOnEscape={false}
              preventInteraction={preventBodyScroll}
              duration={duration}
              respectReducedMotion={respectReducedMotion}
            />
          )}

          {/* Modal */}
          <motion.div
            ref={modalRef}
            {...motionProps}
            variants={safeModalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              ...sizeStyles,
              zIndex: 50,
              ...motionProps.style,
            }}
            className={`
              fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
              bg-white rounded-2xl shadow-2xl overflow-hidden
              border border-gray-100/50 backdrop-blur-sm
              ${modalClassName || ''}
              ${className || ''}
            `}
            aria-label={ariaLabel || title}
            aria-describedby={ariaDescribedBy}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
          >
            {/* Modal Header */}
            {(title || showCloseButton || showMaximizeButton) && (
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
                <div className="flex-1">
                  {title && (
                    <h2 className="text-2xl font-serif font-light text-gray-900 leading-tight">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  {showMaximizeButton && (
                    <button
                      onClick={handleMaximize}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-burgundy focus:ring-offset-2"
                      aria-label={isMaximizedState ? "Minimize modal" : "Maximize modal"}
                    >
                      {isMaximizedState ? (
                        <Minimize2 className="w-4 h-4 text-gray-600" />
                      ) : (
                        <Maximize2 className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  )}
                  
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-burgundy focus:ring-offset-2"
                      aria-label="Close modal"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Modal Content */}
            <motion.div
              ref={contentRef}
              variants={safeContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative overflow-auto"
              style={{
                maxHeight: isMaximizedState ? 'calc(95vh - 120px)' : 'calc(90vh - 120px)',
              }}
            >
              <div className="p-6">
                {children}
              </div>
            </motion.div>

            {/* Luxury Accent Border */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
              <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/30 to-transparent" />
              <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/30 to-transparent" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default LuxuryModal