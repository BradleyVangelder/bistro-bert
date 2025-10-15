'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface ActionButtonProps {
  children: React.ReactNode
  href: string
  variant?: 'hero-reserve' | 'hero-menu' | 'menu' | 'cta' | 'reserve'
  className?: string
  ariaLabel?: string
}

export function ActionButton({
  children,
  href,
  variant = 'menu',
  className = '',
  ariaLabel
}: ActionButtonProps) {
  const baseClasses = 'inline-block px-3 md:px-8 py-1.5 md:py-3 transition-colors typography-button mobile-button'

  const variantClasses = {
    'hero-reserve': 'bg-white text-black hover:bg-transparent hover:text-white border border-white drop-shadow-lg',
    'hero-menu': 'border border-white text-white hover:bg-white hover:text-black drop-shadow-lg',
    'menu': 'border border-black text-black hover:bg-black hover:text-white',
    'cta': 'border border-white text-white hover:bg-white hover:text-black',
    'reserve': 'bg-black text-white hover:bg-gray-800 border border-black'
  }

  const motionProps = {
    whileHover: { scale: 1.05, y: -2 },
    whileTap: { scale: 0.95 },
    transition: { duration: 0.2 }
  }

  return (
    <motion.div {...motionProps}>
      <Link
        href={href}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    </motion.div>
  )
}

export default ActionButton