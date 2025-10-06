'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { LoadingState } from './LoadingState'

interface AnimatedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  ariaLabel?: string
}

export function AnimatedButton({
  children,
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  ariaLabel
}: AnimatedButtonProps) {
  const baseClasses = 'relative inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-burgundy focus:ring-offset-2 rounded-sm overflow-hidden group'

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg'
  }

  const variantClasses = {
    primary: 'bg-burgundy text-white hover:bg-burgundy/90 shadow-md hover:shadow-lg',
    secondary: 'bg-black text-white hover:bg-gray-800 shadow-md hover:shadow-lg',
    outline: 'border-2 border-burgundy text-burgundy hover:bg-burgundy hover:text-white',
    ghost: 'text-gray-700 hover:text-burgundy hover:bg-gray-100'
  }

  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'

  const motionProps = {
    whileHover: !disabled && !loading ? { scale: 1.02, y: -1 } : {},
    whileTap: !disabled && !loading ? { scale: 0.98 } : {},
    transition: { type: "spring", stiffness: 400, damping: 17 }
  }

  const content = (
    <>
      {/* Ripple effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />

      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <LoadingState type="spinner" size="sm" className="text-white" />
        </div>
      )}

      {/* Button content */}
      <span className={`relative z-10 flex items-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
        {children}
      </span>
    </>
  )

  const buttonElement = href ? (
    <a
      href={href}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      aria-label={ariaLabel}
    >
      {content}
    </a>
  ) : (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  )

  return (
    <motion.div {...motionProps}>
      {buttonElement}
    </motion.div>
  )
}

export default AnimatedButton