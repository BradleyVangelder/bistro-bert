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
import { effectPresets, microInteractionPresets } from '@/utils/animations/presets'
import { useAccessibleAnimation } from '@/utils/animations/accessibility'
import { usePerformanceOptimization } from '@/hooks/animations/usePerformanceOptimization'
import { AnimationOptimizer, applyHardwareAcceleration, removeHardwareAcceleration } from '@/utils/animations/optimization'
import { performanceMonitor } from '@/utils/animations/performance'

interface LuxuryButtonProps {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  variant?: 'gold' | 'platinum' | 'rose-gold' | 'burgundy' | 'midnight'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  ariaLabel?: string
  shimmerEnabled?: boolean
  rippleEnabled?: boolean
  glowEnabled?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  animationDuration?: AnimationDuration
  easing?: EasingFunction
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function LuxuryButton({
  children,
  onClick,
  href,
  variant = 'gold',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  ariaLabel,
  shimmerEnabled = true,
  rippleEnabled = true,
  glowEnabled = true,
  icon,
  iconPosition = 'right',
  animationDuration = 'fast',
  easing = 'luxury',
  onSuccess,
  onError
}: LuxuryButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const buttonRef = useRef<HTMLButtonElement>(null)
  const animationName = `luxury-button-${variant}-${Date.now()}`
  
  // Performance optimization hook
  const {
    currentQuality,
    shouldEnableAnimation,
    getOptimizedAnimationProps,
    getPerformanceVariants,
  } = usePerformanceOptimization({
    enableAutoOptimization: true,
    enableDeviceDetection: true,
    performanceThreshold: 50,
  })

  // Luxury variant configurations
  const variantConfigs = {
    gold: {
      background: 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700',
      hoverBackground: 'hover:from-amber-600 hover:via-amber-700 hover:to-amber-800',
      shadow: 'shadow-lg shadow-amber-500/25',
      hoverShadow: 'hover:shadow-xl hover:shadow-amber-500/40',
      glow: 'shadow-amber-500/30',
      shimmer: 'from-amber-300 via-amber-100 to-amber-300',
      border: 'border border-amber-400/50'
    },
    platinum: {
      background: 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500',
      hoverBackground: 'hover:from-gray-400 hover:via-gray-500 hover:to-gray-600',
      shadow: 'shadow-lg shadow-gray-400/25',
      hoverShadow: 'hover:shadow-xl hover:shadow-gray-400/40',
      glow: 'shadow-gray-400/30',
      shimmer: 'from-white via-gray-200 to-white',
      border: 'border border-gray-300/50'
    },
    'rose-gold': {
      background: 'bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600',
      hoverBackground: 'hover:from-rose-500 hover:via-rose-600 hover:to-rose-700',
      shadow: 'shadow-lg shadow-rose-500/25',
      hoverShadow: 'hover:shadow-xl hover:shadow-rose-500/40',
      glow: 'shadow-rose-500/30',
      shimmer: 'from-rose-200 via-rose-100 to-rose-200',
      border: 'border border-rose-400/50'
    },
    burgundy: {
      background: 'bg-gradient-to-r from-burgundy via-burgundy/90 to-burgundy/80',
      hoverBackground: 'hover:from-burgundy/90 hover:via-burgundy/80 hover:to-burgundy/70',
      shadow: 'shadow-lg shadow-burgundy/25',
      hoverShadow: 'hover:shadow-xl hover:shadow-burgundy/40',
      glow: 'shadow-burgundy/30',
      shimmer: 'from-amber-400 via-amber-300 to-amber-400',
      border: 'border border-burgundy/50'
    },
    midnight: {
      background: 'bg-gradient-to-r from-gray-900 via-black to-gray-900',
      hoverBackground: 'hover:from-gray-800 hover:via-black hover:to-gray-800',
      shadow: 'shadow-lg shadow-black/50',
      hoverShadow: 'hover:shadow-xl hover:shadow-black/70',
      glow: 'shadow-blue-500/20',
      shimmer: 'from-blue-400 via-blue-300 to-blue-400',
      border: 'border border-gray-700/50'
    }
  }

  const config = variantConfigs[variant]
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  }

  // Create ripple effect
  const createRipple = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (!rippleEnabled || disabled || loading) return
    
    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    }
    
    setRipples(prev => [...prev, newRipple])
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 1000)
  }, [rippleEnabled, disabled, loading])

  // Handle click with luxury feedback
  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return
    
    createRipple(event)
    setIsPressed(true)
    
    setTimeout(() => setIsPressed(false), ANIMATION_DURATIONS[animationDuration])
    
    try {
      onClick?.()
      onSuccess?.()
    } catch (error) {
      onError?.(error as Error)
    }
  }, [disabled, loading, onClick, createRipple, animationDuration, onSuccess, onError])

  // Performance monitoring
  useEffect(() => {
    if (shouldEnableAnimation()) {
      performanceMonitor.startMonitoring(animationName, 'normal')
      
      return () => {
        performanceMonitor.stopMonitoring(animationName)
      }
    }
  }, [animationName, shouldEnableAnimation])

  // Apply hardware acceleration
  useEffect(() => {
    if (buttonRef.current && currentQuality?.useHardwareAcceleration) {
      applyHardwareAcceleration(buttonRef.current, ['transform', 'opacity'])
    }
    
    return () => {
      if (buttonRef.current) {
        removeHardwareAcceleration(buttonRef.current)
      }
    }
  }, [currentQuality])

  // Get optimized animation properties
  const optimizedProps = getOptimizedAnimationProps({
    duration: ANIMATION_DURATIONS[animationDuration],
    easing: Array.isArray(EASING[easing]) ? EASING[easing].join(',') : EASING[easing] as string,
    delay: 0,
  })

  // Enhanced animation props with luxury effects and performance optimization
  const baseAnimationProps = {
    whileHover: !disabled && !loading && shouldEnableAnimation() ? {
      scale: currentQuality?.quality === 'low' ? 1.02 : SCALES.grow,
      y: currentQuality?.quality === 'low' ? -1 : -3,
      transition: {
        duration: (optimizedProps.duration || 500) / 1000,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      }
    } : {},
    whileTap: !disabled && !loading && shouldEnableAnimation() ? {
      scale: SCALES.shrink,
      transition: {
        duration: ANIMATION_DURATIONS.instant / 1000,
        ease: EASING.subtle as [number, number, number, number],
      }
    } : {},
    transition: {
      type: "tween" as const,
      duration: (optimizedProps.duration || 500) / 1000,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    }
  }

  // Apply performance variants to animation props
  const performanceOptimizedProps = getPerformanceVariants(baseAnimationProps)
  
  const accessibleAnimationProps = useAccessibleAnimation(performanceOptimizedProps, {
    respectReducedMotion: true,
    respectHighContrast: true,
  })

  const content = (
    <>
      {/* Ripple effects - optimized for performance */}
      {shouldEnableAnimation() && (
        <AnimatePresence>
          {ripples.slice(0, currentQuality?.quality === 'low' ? 1 : 3).map(ripple => (
            <motion.span
              key={ripple.id}
              className="absolute bg-white/20 rounded-full pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: 0,
                height: 0,
                willChange: 'transform, opacity',
              }}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{
                scale: currentQuality?.quality === 'low' ? 3 : 6,
                opacity: 0,
              }}
              exit={{ scale: currentQuality?.quality === 'low' ? 3 : 6, opacity: 0 }}
              transition={{
                duration: currentQuality?.quality === 'low' ? 0.5 : 1,
                ease: EASING.natural as [number, number, number, number],
              }}
            />
          ))}
        </AnimatePresence>
      )}

      {/* Gold shimmer effect - optimized for performance */}
      {shimmerEnabled && !disabled && !loading && shouldEnableAnimation() && currentQuality?.enableParticles && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
          style={{
            willChange: 'transform',
          }}
          animate={{
            translateX: isHovered || isPressed ? '200%' : '-200%',
          }}
          transition={{
            duration: currentQuality?.quality === 'low' ? 0.8 : 1.2,
            ease: EASING.shimmer as [number, number, number, number],
            delay: isHovered || isPressed ? 0 : 0.5,
            repeat: isHovered ? Infinity : 0,
            repeatDelay: currentQuality?.quality === 'low' ? 3 : 2,
          }}
        />
      )}

      {/* Luxury glow effect - optimized for performance */}
      {glowEnabled && isHovered && !disabled && !loading && shouldEnableAnimation() && currentQuality?.enableShadows && (
        <motion.div
          className={`absolute inset-0 rounded-lg bg-gradient-to-r ${config.shimmer} opacity-30 pointer-events-none ${currentQuality?.enableBlur ? 'blur-sm' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: (optimizedProps.duration || 500) / 1000,
            ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
          }}
        />
      )}

      {/* Loading state - optimized for performance */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-lg"
          style={{
            willChange: 'opacity',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: (optimizedProps.duration || 500) / 1000,
            ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
          }}
        >
          <div className="relative">
            <motion.div
              className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
              style={{
                willChange: 'transform',
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: currentQuality?.quality === 'low' ? 1.5 : 1,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            {currentQuality?.quality !== 'low' && (
              <motion.div
                className="absolute inset-0 w-6 h-6 border-2 border-transparent border-t-white/50 rounded-full"
                style={{
                  willChange: 'transform',
                }}
                animate={{ rotate: -360 }}
                transition={{
                  duration: currentQuality?.quality === 'medium' ? 2 : 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            )}
          </div>
        </motion.div>
      )}

      {/* Button content with luxury styling - optimized for performance */}
      <motion.span
        className={`relative z-10 flex items-center justify-center gap-3 font-semibold tracking-wide text-white`}
        style={{
          willChange: shouldEnableAnimation() ? 'transform, opacity' : 'auto',
        }}
        animate={shouldEnableAnimation() ? {
          opacity: loading ? 0 : 1,
          scale: loading ? 0.95 : isPressed ? 0.98 : 1,
        } : {}}
        transition={{
          duration: (optimizedProps.duration || 500) / 1000,
          ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
        }}
      >
        {icon && iconPosition === 'left' && (
          <motion.span
            style={{
              willChange: shouldEnableAnimation() ? 'transform' : 'auto',
            }}
            animate={shouldEnableAnimation() ? {
              x: isHovered ? 2 : 0,
            } : {}}
            transition={{
              duration: ANIMATION_DURATIONS.instant / 1000,
              ease: EASING.subtle as [number, number, number, number],
            }}
          >
            {icon}
          </motion.span>
        )}
        
        <span className="drop-shadow-sm">{children}</span>
        
        {icon && iconPosition === 'right' && (
          <motion.span
            style={{
              willChange: shouldEnableAnimation() ? 'transform' : 'auto',
            }}
            animate={shouldEnableAnimation() ? {
              x: isHovered ? 2 : 0,
            } : {}}
            transition={{
              duration: ANIMATION_DURATIONS.instant / 1000,
              ease: EASING.subtle as [number, number, number, number],
            }}
          >
            {icon}
          </motion.span>
        )}
      </motion.span>
    </>
  )

  const buttonElement = href ? (
    <a
      href={href}
      className={`relative inline-flex items-center justify-center rounded-lg ${config.background} ${config.hoverBackground} ${config.shadow} ${config.hoverShadow} ${config.border} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} transition-all duration-300 ${className}`}
      aria-label={ariaLabel}
    >
      {content}
    </a>
  ) : (
    <button
      ref={buttonRef}
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`relative inline-flex items-center justify-center rounded-lg ${config.background} ${config.hoverBackground} ${config.shadow} ${config.hoverShadow} ${config.border} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} transition-all duration-300 ${className}`}
      aria-label={ariaLabel}
      aria-busy={loading}
      style={{
        willChange: currentQuality?.useHardwareAcceleration ? 'transform' : 'auto',
      }}
    >
      {content}
    </button>
  )

  return (
    <motion.div
      {...accessibleAnimationProps}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {buttonElement}
    </motion.div>
  )
}

export default LuxuryButton