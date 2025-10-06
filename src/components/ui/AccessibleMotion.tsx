'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { getSafeMotionProps, useAccessibilityPreferences } from '@/utils/accessibility'

interface AccessibleMotionProps {
  children: ReactNode
  initial?: any
  animate?: any
  whileHover?: any
  whileTap?: any
  transition?: any
  className?: string
  viewport?: any
  onAnimationComplete?: () => void
  reducedMotionVariant?: any
  respectReducedMotion?: boolean
}

export function AccessibleMotion({
  children,
  initial,
  animate,
  whileHover,
  whileTap,
  transition,
  className,
  viewport,
  onAnimationComplete,
  reducedMotionVariant,
  respectReducedMotion = true
}: AccessibleMotionProps) {
  const { reducedMotion } = useAccessibilityPreferences()

  const motionProps = getSafeMotionProps({
    initial: reducedMotion && reducedMotionVariant?.initial ? reducedMotionVariant.initial : initial,
    animate: reducedMotion && reducedMotionVariant?.animate ? reducedMotionVariant.animate : animate,
    whileHover: reducedMotion ? undefined : whileHover,
    whileTap: reducedMotion ? undefined : whileTap,
    transition: reducedMotion ? { duration: 0 } : transition,
    viewport: reducedMotion ? undefined : (viewport || { once: true, margin: "-100px", amount: 0.3 }),
    onAnimationComplete: reducedMotion ? undefined : onAnimationComplete,
    className
  })

  return (
    <motion.div {...motionProps}>
      {children}
    </motion.div>
  )
}

// Fade in animation with accessibility support
export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  className,
  direction = 'up'
}: {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
}) {
  const getDirectionOffset = () => {
    switch (direction) {
      case 'up': return { y: 20 }
      case 'down': return { y: -20 }
      case 'left': return { x: 20 }
      case 'right': return { x: -20 }
      default: return { y: 20 }
    }
  }

  return (
    <AccessibleMotion
      initial={{ opacity: 0, ...getDirectionOffset() }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      reducedMotionVariant={{
        initial: { opacity: 0 },
        animate: { opacity: 1 }
      }}
      transition={{ duration, delay }}
      viewport={{ once: true, margin: "-100px", amount: 0.3 }}
      className={className}
    >
      {children}
    </AccessibleMotion>
  )
}

// Scale animation with accessibility support
export function ScaleIn({
  children,
  delay = 0,
  duration = 0.3,
  className
}: {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}) {
  return (
    <AccessibleMotion
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      reducedMotionVariant={{
        initial: { opacity: 0 },
        animate: { opacity: 1 }
      }}
      transition={{ duration, delay }}
      viewport={{ once: true, margin: "-100px", amount: 0.3 }}
      className={className}
    >
      {children}
    </AccessibleMotion>
  )
}

// Slide animation with accessibility support
export function SlideIn({
  children,
  delay = 0,
  duration = 0.5,
  className,
  direction = 'up'
}: {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
}) {
  const getDirectionOffset = () => {
    switch (direction) {
      case 'up': return { y: 50 }
      case 'down': return { y: -50 }
      case 'left': return { x: 50 }
      case 'right': return { x: -50 }
      default: return { y: 50 }
    }
  }

  return (
    <AccessibleMotion
      initial={{ opacity: 0, ...getDirectionOffset() }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      reducedMotionVariant={{
        initial: { opacity: 0 },
        animate: { opacity: 1 }
      }}
      transition={{ duration, delay, ease: 'easeOut' }}
      viewport={{ once: true, margin: "-100px", amount: 0.3 }}
      className={className}
    >
      {children}
    </AccessibleMotion>
  )
}

export default AccessibleMotion