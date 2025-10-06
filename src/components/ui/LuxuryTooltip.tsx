'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ANIMATION_DURATIONS, 
  EASING 
} from '@/utils/animations/constants'
import { useAccessibleAnimation } from '@/utils/animations/accessibility'

interface LuxuryTooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  variant?: 'elegant' | 'minimal' | 'luxury'
  delay?: number
  disabled?: boolean
  className?: string
  tooltipClassName?: string
  showArrow?: boolean
  maxWidth?: number
}

export default function LuxuryTooltip({
  children,
  content,
  position = 'top',
  variant = 'elegant',
  delay = 300,
  disabled = false,
  className = '',
  tooltipClassName = '',
  showArrow = true,
  maxWidth = 250
}: LuxuryTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [calculatedPosition, setCalculatedPosition] = useState(position)

  // Calculate optimal position based on viewport
  const calculateOptimalPosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY
    }

    // Check if tooltip fits in the preferred position
    let optimalPosition = position

    switch (position) {
      case 'top':
        if (triggerRect.top - tooltipRect.height < 0) {
          optimalPosition = 'bottom'
        }
        break
      case 'bottom':
        if (triggerRect.bottom + tooltipRect.height > viewport.height) {
          optimalPosition = 'top'
        }
        break
      case 'left':
        if (triggerRect.left - tooltipRect.width < 0) {
          optimalPosition = 'right'
        }
        break
      case 'right':
        if (triggerRect.right + tooltipRect.width > viewport.width) {
          optimalPosition = 'left'
        }
        break
    }

    setCalculatedPosition(optimalPosition)
  }

  // Get tooltip styles based on position
  const getTooltipStyles = () => {
    if (!triggerRef.current || !tooltipRef.current) return {}

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()

    const baseStyles: React.CSSProperties = {
      position: 'absolute',
      zIndex: 50,
      maxWidth: `${maxWidth}px`,
    }

    switch (calculatedPosition) {
      case 'top':
        return {
          ...baseStyles,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%) translateY(-8px)',
        }
      case 'bottom':
        return {
          ...baseStyles,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%) translateY(8px)',
        }
      case 'left':
        return {
          ...baseStyles,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%) translateX(-8px)',
        }
      case 'right':
        return {
          ...baseStyles,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%) translateX(8px)',
        }
      default:
        return baseStyles
    }
  }

  // Get arrow styles based on position
  const getArrowStyles = () => {
    const arrowSize = 8
    const baseArrowStyles: React.CSSProperties = {
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    }

    switch (calculatedPosition) {
      case 'top':
        return {
          ...baseArrowStyles,
          bottom: `-${arrowSize}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: `${arrowSize}px ${arrowSize}px 0 ${arrowSize}px`,
          borderColor: '#0F3B2F transparent transparent transparent',
        }
      case 'bottom':
        return {
          ...baseArrowStyles,
          top: `-${arrowSize}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: `0 ${arrowSize}px ${arrowSize}px ${arrowSize}px`,
          borderColor: 'transparent transparent #0F3B2F transparent',
        }
      case 'left':
        return {
          ...baseArrowStyles,
          right: `-${arrowSize}px`,
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: `${arrowSize}px 0 ${arrowSize}px ${arrowSize}px`,
          borderColor: 'transparent transparent transparent #0F3B2F',
        }
      case 'right':
        return {
          ...baseArrowStyles,
          left: `-${arrowSize}px`,
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: `${arrowSize}px ${arrowSize}px ${arrowSize}px 0`,
          borderColor: 'transparent #0F3B2F transparent transparent',
        }
      default:
        return baseArrowStyles
    }
  }

  // Get variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'elegant':
        return {
          background: 'linear-gradient(135deg, #0F3B2F 0%, #1a5d47 100%)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 10px 25px rgba(15, 59, 47, 0.3), 0 4px 10px rgba(15, 59, 47, 0.2)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
        }
      case 'minimal':
        return {
          background: 'rgba(15, 59, 47, 0.95)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: '400',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: 'none',
        }
      case 'luxury':
        return {
          background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4BC 50%, #D4AF37 100%)',
          color: '#0F3B2F',
          padding: '14px 18px',
          borderRadius: '16px',
          fontSize: '14px',
          fontWeight: '600',
          boxShadow: '0 15px 35px rgba(212, 175, 55, 0.4), 0 5px 15px rgba(212, 175, 55, 0.3)',
          border: '2px solid rgba(212, 175, 55, 0.5)',
        }
      default:
        return {}
    }
  }

  // Animation variants
  const animationVariants = {
    elegant: {
      initial: { 
        opacity: 0, 
        scale: 0.8,
        y: calculatedPosition === 'top' ? 10 : calculatedPosition === 'bottom' ? -10 : 0,
        x: calculatedPosition === 'left' ? 10 : calculatedPosition === 'right' ? -10 : 0,
      },
      animate: { 
        opacity: 1, 
        scale: 1,
        y: 0,
        x: 0,
        transition: {
          duration: ANIMATION_DURATIONS.fast / 1000,
          ease: EASING.luxury as [number, number, number, number],
        }
      },
      exit: { 
        opacity: 0, 
        scale: 0.8,
        y: calculatedPosition === 'top' ? 10 : calculatedPosition === 'bottom' ? -10 : 0,
        x: calculatedPosition === 'left' ? 10 : calculatedPosition === 'right' ? -10 : 0,
        transition: {
          duration: ANIMATION_DURATIONS.instant / 1000,
          ease: EASING.luxury as [number, number, number, number],
        }
      },
    },
    minimal: {
      initial: { 
        opacity: 0, 
        scale: 0.95,
      },
      animate: { 
        opacity: 1, 
        scale: 1,
        transition: {
          duration: ANIMATION_DURATIONS.instant / 1000,
          ease: EASING.subtle as [number, number, number, number],
        }
      },
      exit: { 
        opacity: 0, 
        scale: 0.95,
        transition: {
          duration: ANIMATION_DURATIONS.instant / 1000,
          ease: EASING.subtle as [number, number, number, number],
        }
      },
    },
    luxury: {
      initial: { 
        opacity: 0, 
        scale: 0.7,
        rotate: calculatedPosition === 'top' || calculatedPosition === 'bottom' ? -2 : 0,
      },
      animate: { 
        opacity: 1, 
        scale: 1,
        rotate: 0,
        transition: {
          duration: ANIMATION_DURATIONS.content / 1000,
          ease: EASING.luxury as [number, number, number, number],
        }
      },
      exit: { 
        opacity: 0, 
        scale: 0.7,
        rotate: calculatedPosition === 'top' || calculatedPosition === 'bottom' ? -2 : 0,
        transition: {
          duration: ANIMATION_DURATIONS.fast / 1000,
          ease: EASING.luxury as [number, number, number, number],
        }
      },
    },
  }

  // Handle mouse enter
  const handleMouseEnter = () => {
    if (disabled) return

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    const newTimeoutId = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    setTimeoutId(newTimeoutId)
  }

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (disabled) return

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    setIsVisible(false)
  }

  // Handle focus
  const handleFocus = () => {
    if (disabled) return
    setIsVisible(true)
  }

  // Handle blur
  const handleBlur = () => {
    if (disabled) return
    setIsVisible(false)
  }

  // Calculate position when tooltip becomes visible
  useEffect(() => {
    if (isVisible) {
      calculateOptimalPosition()
    }
  }, [isVisible, position])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  const accessibleAnimationProps = useAccessibleAnimation(
    animationVariants[variant],
    {
      respectReducedMotion: true,
      respectHighContrast: true,
    }
  )

  return (
    <div 
      ref={triggerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            className={`pointer-events-none ${tooltipClassName}`}
            style={{
              ...getTooltipStyles(),
              ...getVariantStyles(),
            }}
            {...accessibleAnimationProps}
            role="tooltip"
            aria-hidden={!isVisible}
          >
            {showArrow && (
              <div style={getArrowStyles()} />
            )}
            
            <div className="relative z-10">
              {typeof content === 'string' ? (
                <p className="leading-relaxed">{content}</p>
              ) : (
                content
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}