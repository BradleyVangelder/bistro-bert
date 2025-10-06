'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback, useRef, useEffect } from 'react'
import {
  ANIMATION_DURATIONS,
  EASING,
  SCALES,
  type AnimationDuration,
  type EasingFunction
} from '@/utils/animations/constants'
import { microInteractionPresets } from '@/utils/animations/presets'
import { useAccessibleAnimation } from '@/utils/animations/accessibility'

// Interactive Hover Card Component
interface InteractiveCardProps {
  children: React.ReactNode
  className?: string
  hoverElevation?: number
  hoverScale?: number
  delay?: number
  disabled?: boolean
  onClick?: () => void
  variant?: 'default' | 'luxury' | 'subtle'
}

export function InteractiveCard({
  children,
  className = '',
  hoverElevation = 8,
  hoverScale = 1.02,
  delay = 0,
  disabled = false,
  onClick,
  variant = 'default'
}: InteractiveCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const variantStyles = {
    default: 'bg-white border border-gray-200 shadow-sm hover:shadow-lg',
    luxury: 'bg-gradient-to-br from-amber-50 to-white border border-amber-200/50 shadow-md hover:shadow-xl',
    subtle: 'bg-gray-50 border border-gray-100 shadow-none hover:shadow-sm'
  }

  const baseAnimationProps = {
    whileHover: !disabled ? {
      y: -hoverElevation,
      scale: hoverScale,
      transition: {
        duration: ANIMATION_DURATIONS.fast / 1000,
        ease: EASING.graceful as [number, number, number, number],
        delay: delay / 1000,
      }
    } : {},
    whileTap: !disabled && onClick ? {
      scale: SCALES.shrink,
      transition: {
        duration: ANIMATION_DURATIONS.instant / 1000,
        ease: EASING.subtle as [number, number, number, number],
      }
    } : {},
    transition: {
      duration: ANIMATION_DURATIONS.normal / 1000,
      ease: EASING.refined as [number, number, number, number],
    }
  }

  const accessibleAnimationProps = useAccessibleAnimation(baseAnimationProps, {
    respectReducedMotion: true,
    disableHover: disabled,
  })

  return (
    <motion.div
      className={`relative rounded-lg cursor-pointer overflow-hidden ${variantStyles[variant]} ${className}`}
      {...accessibleAnimationProps}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Subtle glow effect for luxury variant */}
      {variant === 'luxury' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-amber-600/10 pointer-events-none"
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{
            duration: ANIMATION_DURATIONS.fast / 1000,
            ease: EASING.refined as [number, number, number, number],
          }}
        />
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

// Enhanced Link with Hover Effects
interface EnhancedLinkProps {
  children: React.ReactNode
  href?: string
  className?: string
  underlineVariant?: 'standard' | 'gradient' | 'dotted' | 'none'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  onClick?: () => void
  disabled?: boolean
}

export function EnhancedLink({
  children,
  href,
  className = '',
  underlineVariant = 'standard',
  icon,
  iconPosition = 'right',
  onClick,
  disabled = false
}: EnhancedLinkProps) {
  const [isHovered, setIsHovered] = useState(false)

  const underlineStyles = {
    standard: 'border-b-2 border-burgundy',
    gradient: 'border-b-2 border-transparent bg-gradient-to-r from-burgundy to-amber-600 bg-clip-text text-transparent',
    dotted: 'border-b-2 border-dotted border-burgundy',
    none: ''
  }

  const baseAnimationProps = {
    whileHover: !disabled ? {
      textDecorationThickness: '3px',
      textUnderlineOffset: '6px',
      transition: {
        duration: ANIMATION_DURATIONS.instant / 1000,
        ease: EASING.subtle as [number, number, number, number],
      }
    } : {},
    transition: {
      duration: ANIMATION_DURATIONS.instant / 1000,
      ease: EASING.subtle as [number, number, number, number],
    }
  }

  const accessibleAnimationProps = useAccessibleAnimation(baseAnimationProps, {
    respectReducedMotion: true,
    disableHover: disabled,
  })

  const content = (
    <>
      {icon && iconPosition === 'left' && (
        <motion.span
          className="mr-2 inline-block"
          animate={{
            x: isHovered ? 2 : 0,
          }}
          transition={{
            duration: ANIMATION_DURATIONS.instant / 1000,
            ease: EASING.subtle as [number, number, number, number],
          }}
        >
          {icon}
        </motion.span>
      )}
      
      <motion.span
        className={`inline-block ${underlineStyles[underlineVariant]}`}
        {...accessibleAnimationProps}
      >
        {children}
      </motion.span>
      
      {icon && iconPosition === 'right' && (
        <motion.span
          className="ml-2 inline-block"
          animate={{
            x: isHovered ? 2 : 0,
          }}
          transition={{
            duration: ANIMATION_DURATIONS.instant / 1000,
            ease: EASING.subtle as [number, number, number, number],
          }}
        >
          {icon}
        </motion.span>
      )}
    </>
  )

  return (
    <span
      className={`inline-flex items-center text-burgundy hover:text-burgundy/80 transition-colors cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={disabled ? undefined : onClick}
    >
      {href ? (
        <a href={href} className="inherit">
          {content}
        </a>
      ) : (
        content
      )}
    </span>
  )
}

// Focus Glow Input Component
interface FocusGlowInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: boolean
  glowColor?: 'burgundy' | 'amber' | 'green' | 'blue'
  className?: string
}

export function FocusGlowInput({
  label,
  error,
  success,
  glowColor = 'burgundy',
  className = '',
  ...props
}: FocusGlowInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const glowColors = {
    burgundy: 'rgba(128, 0, 32, 0.3)',
    amber: 'rgba(212, 175, 55, 0.3)',
    green: 'rgba(34, 197, 94, 0.3)',
    blue: 'rgba(59, 130, 246, 0.3)'
  }

  const borderColors = {
    burgundy: 'border-burgundy',
    amber: 'border-amber-600',
    green: 'border-green-500',
    blue: 'border-blue-500'
  }

  const baseAnimationProps = {
    whileFocus: {
      boxShadow: `0 0 0 3px ${glowColors[glowColor]}`,
      transition: {
        duration: ANIMATION_DURATIONS.fast / 1000,
        ease: EASING.responsive as [number, number, number, number],
      }
    },
    transition: {
      duration: ANIMATION_DURATIONS.instant / 1000,
      ease: EASING.subtle as [number, number, number, number],
    }
  }

  const accessibleAnimationProps = useAccessibleAnimation(baseAnimationProps, {
    respectReducedMotion: true,
  })

  return (
    <div className={`relative ${className}`}>
      {label && (
        <motion.label
          className={`block text-sm font-medium mb-2 ${
            error ? 'text-red-600' : success ? 'text-green-600' : 'text-gray-700'
          }`}
          animate={{
            scale: isFocused ? 1.02 : 1,
          }}
          transition={{
            duration: ANIMATION_DURATIONS.instant / 1000,
            ease: EASING.subtle as [number, number, number, number],
          }}
        >
          {label}
        </motion.label>
      )}
      
      <motion.input
        ref={inputRef}
        className={`w-full px-4 py-2 border rounded-md focus:outline-none transition-colors ${
          error ? 'border-red-500' : success ? 'border-green-500' : `border-gray-300 ${borderColors[glowColor]}`
        }`}
        {...accessibleAnimationProps}
        onFocus={(e) => {
          setIsFocused(true)
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          setIsFocused(false)
          props.onBlur?.(e)
        }}
        {...Object.fromEntries(
          Object.entries(props).filter(([key]) => !key.startsWith('onAnimation'))
        )}
      />
      
      {/* Error/Success feedback */}
      <AnimatePresence>
        {error && (
          <motion.p
            className="mt-1 text-sm text-red-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: ANIMATION_DURATIONS.fast / 1000,
              ease: EASING.refined as [number, number, number, number],
            }}
          >
            {error}
          </motion.p>
        )}
        
        {success && !error && (
          <motion.div
            className="absolute right-3 top-8"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: ANIMATION_DURATIONS.fast / 1000,
              ease: EASING.responsive as [number, number, number, number],
            }}
          >
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Success/Error Feedback Animation Component
interface FeedbackAnimationProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  isVisible: boolean
  onClose?: () => void
  duration?: number
  className?: string
}

export function FeedbackAnimation({
  type,
  message,
  isVisible,
  onClose,
  duration = 4000,
  className = ''
}: FeedbackAnimationProps) {
  useEffect(() => {
    if (isVisible && duration > 0 && onClose) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  const feedbackStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    )
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed top-4 right-4 z-50 flex items-center p-4 border rounded-lg shadow-lg max-w-sm ${feedbackStyles[type]} ${className}`}
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{
            duration: ANIMATION_DURATIONS.normal / 1000,
            ease: EASING.refined as [number, number, number, number],
          }}
        >
          <div className="flex-shrink-0 mr-3">
            {icons[type]}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-3 flex-shrink-0 focus:outline-none"
              aria-label="Close notification"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Touch-friendly Interaction Pattern Component
interface TouchFriendlyProps {
  children: React.ReactNode
  onTap?: () => void
  onPress?: () => void
  onRelease?: () => void
  className?: string
  feedbackType?: 'ripple' | 'scale' | 'glow' | 'none'
  disabled?: boolean
}

export function TouchFriendly({
  children,
  onTap,
  onPress,
  onRelease,
  className = '',
  feedbackType = 'ripple',
  disabled = false
}: TouchFriendlyProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handlePress = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return
    
    setIsPressed(true)
    onPress?.()
    
    if (feedbackType === 'ripple') {
      const rect = event.currentTarget.getBoundingClientRect()
      const x = 'touches' in event ? event.touches[0].clientX - rect.left : event.clientX - rect.left
      const y = 'touches' in event ? event.touches[0].clientY - rect.top : event.clientY - rect.top
      
      const newRipple = { id: Date.now(), x, y }
      setRipples(prev => [...prev, newRipple])
      
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
      }, 600)
    }
  }, [disabled, feedbackType, onPress])

  const handleRelease = useCallback(() => {
    if (disabled) return
    
    setIsPressed(false)
    onRelease?.()
    onTap?.()
  }, [disabled, onTap, onRelease])

  const baseAnimationProps = {
    whileTap: !disabled ? {
      scale: feedbackType === 'scale' ? SCALES.shrink : 1,
      transition: {
        duration: ANIMATION_DURATIONS.instant / 1000,
        ease: EASING.subtle as [number, number, number, number],
      }
    } : {},
    transition: {
      duration: ANIMATION_DURATIONS.instant / 1000,
      ease: EASING.subtle as [number, number, number, number],
    }
  }

  const accessibleAnimationProps = useAccessibleAnimation(baseAnimationProps, {
    respectReducedMotion: true,
  })

  return (
    <motion.div
      className={`relative overflow-hidden cursor-pointer ${className}`}
      {...accessibleAnimationProps}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={handleRelease}
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
    >
      {/* Ripple effects */}
      {feedbackType === 'ripple' && ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
          }}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{
            scale: 4,
            opacity: 0,
          }}
          transition={{
            duration: 0.6,
            ease: EASING.natural as [number, number, number, number],
          }}
        />
      ))}

      {/* Glow effect */}
      {feedbackType === 'glow' && (
        <motion.div
          className="absolute inset-0 bg-amber-400/20 rounded-lg pointer-events-none"
          animate={{
            opacity: isPressed ? 1 : 0,
          }}
          transition={{
            duration: ANIMATION_DURATIONS.instant / 1000,
            ease: EASING.subtle as [number, number, number, number],
          }}
        />
      )}

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

// Export all components
export default {
  InteractiveCard,
  EnhancedLink,
  FocusGlowInput,
  FeedbackAnimation,
  TouchFriendly,
}