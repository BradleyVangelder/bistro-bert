'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  ANIMATION_DURATIONS, 
  EASING 
} from '@/utils/animations/constants'
import { useAccessibleAnimation } from '@/utils/animations/accessibility'

interface AnimatedValidationMessageProps {
  message: string
  type: 'error' | 'warning' | 'success' | 'info'
  isVisible: boolean
  className?: string
  icon?: React.ReactNode
  dismissible?: boolean
  onDismiss?: () => void
}

export default function AnimatedValidationMessage({
  message,
  type,
  isVisible,
  className = '',
  icon,
  dismissible = false,
  onDismiss
}: AnimatedValidationMessageProps) {
  // Get type-specific styles
  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return {
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          color: 'white',
          icon: '⚠️',
          borderColor: 'rgba(220, 38, 38, 0.3)',
          shadowColor: 'rgba(220, 38, 38, 0.2)',
        }
      case 'warning':
        return {
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
          icon: '⚡',
          borderColor: 'rgba(245, 158, 11, 0.3)',
          shadowColor: 'rgba(245, 158, 11, 0.2)',
        }
      case 'success':
        return {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          icon: '✓',
          borderColor: 'rgba(16, 185, 129, 0.3)',
          shadowColor: 'rgba(16, 185, 129, 0.2)',
        }
      case 'info':
        return {
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          color: 'white',
          icon: 'ℹ',
          borderColor: 'rgba(59, 130, 246, 0.3)',
          shadowColor: 'rgba(59, 130, 246, 0.2)',
        }
      default:
        return {
          background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
          color: 'white',
          icon: 'ℹ',
          borderColor: 'rgba(107, 114, 128, 0.3)',
          shadowColor: 'rgba(107, 114, 128, 0.2)',
        }
    }
  }

  const typeStyles = getTypeStyles()

  // Animation variants for different types
  const animationVariants = {
    error: {
      initial: { 
        opacity: 0, 
        scale: 0.9,
        y: -10,
        x: -5,
      },
      animate: { 
        opacity: 1, 
        scale: 1,
        y: 0,
        x: 0,
        transition: {
          duration: ANIMATION_DURATIONS.fast / 1000,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        }
      },
      exit: { 
        opacity: 0, 
        scale: 0.9,
        y: -10,
        x: 5,
        transition: {
          duration: ANIMATION_DURATIONS.instant / 1000,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        }
      },
    },
    warning: {
      initial: { 
        opacity: 0, 
        scale: 0.95,
        y: -5,
      },
      animate: { 
        opacity: 1, 
        scale: 1,
        y: 0,
        transition: {
          duration: ANIMATION_DURATIONS.fast / 1000,
          ease: EASING.luxury as [number, number, number, number],
        }
      },
      exit: { 
        opacity: 0, 
        scale: 0.95,
        y: -5,
        transition: {
          duration: ANIMATION_DURATIONS.instant / 1000,
          ease: EASING.luxury as [number, number, number, number],
        }
      },
    },
    success: {
      initial: { 
        opacity: 0, 
        scale: 0.8,
        y: 10,
      },
      animate: { 
        opacity: 1, 
        scale: 1,
        y: 0,
        transition: {
          duration: ANIMATION_DURATIONS.content / 1000,
          ease: [0.175, 0.885, 0.32, 1.275] as [number, number, number, number],
        }
      },
      exit: { 
        opacity: 0, 
        scale: 0.8,
        y: 10,
        transition: {
          duration: ANIMATION_DURATIONS.fast / 1000,
          ease: [0.175, 0.885, 0.32, 1.275] as [number, number, number, number],
        }
      },
    },
    info: {
      initial: { 
        opacity: 0, 
        scale: 0.95,
        x: -10,
      },
      animate: { 
        opacity: 1, 
        scale: 1,
        x: 0,
        transition: {
          duration: ANIMATION_DURATIONS.fast / 1000,
          ease: EASING.subtle as [number, number, number, number],
        }
      },
      exit: { 
        opacity: 0, 
        scale: 0.95,
        x: -10,
        transition: {
          duration: ANIMATION_DURATIONS.instant / 1000,
          ease: EASING.subtle as [number, number, number, number],
        }
      },
    },
  }

  const accessibleAnimationProps = useAccessibleAnimation(
    animationVariants[type],
    {
      respectReducedMotion: true,
      respectHighContrast: true,
    }
  )

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className={`relative overflow-hidden rounded-lg border ${className}`}
          style={{
            background: typeStyles.background,
            color: typeStyles.color,
            borderColor: typeStyles.borderColor,
            boxShadow: `0 4px 12px ${typeStyles.shadowColor}, 0 2px 4px ${typeStyles.shadowColor}`,
          }}
          {...accessibleAnimationProps}
          role="alert"
          aria-live={type === 'error' ? 'assertive' : 'polite'}
        >
          {/* Gradient overlay for luxury effect */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 100%)',
            }}
          />
          
          <div className="relative z-10 flex items-start gap-3 p-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              {icon || (
                <motion.span
                  className="text-lg"
                  animate={{
                    rotate: type === 'warning' ? [0, 10, -10, 0] : 0,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: type === 'warning' ? Infinity : 0,
                    repeatDelay: 2,
                    ease: EASING.luxury as [number, number, number, number],
                  }}
                >
                  {typeStyles.icon}
                </motion.span>
              )}
            </div>
            
            {/* Message content */}
            <div className="flex-1 min-w-0">
              <motion.p
                className="text-sm font-medium leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                {message}
              </motion.p>
            </div>
            
            {/* Dismiss button */}
            {dismissible && (
              <motion.button
                className="flex-shrink-0 p-1 rounded-md hover:bg-white/20 transition-colors duration-200"
                onClick={onDismiss}
                aria-label="Dismiss message"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            )}
          </div>
          
          {/* Progress bar for auto-dismiss (optional enhancement) */}
          {type === 'success' && (
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-white/30"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 3, ease: 'linear' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}