'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

interface LuxuryMenuButtonProps {
  isOpen: boolean
  onToggle: () => void
  className?: string
}

export default function LuxuryMenuButton({ isOpen, onToggle, className = '' }: LuxuryMenuButtonProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Luxury gold shimmer animation
  const GoldShimmer = ({ className = '' }: { className?: string }) => (
    <motion.div
      className={`absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent ${className}`}
      initial={{ x: '-100%' }}
      animate={{ x: '100%' }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatDelay: 3,
        ease: 'easeInOut'
      }}
    />
  )

  // Mobile version - Circular design
  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className={`pointer-events-auto ${className}`}
      >
        <button
          onClick={onToggle}
          className="
            relative w-14 h-14
            bg-[#800020]
            rounded-full
            border-2 border-[#D4AF37]
            shadow-lg shadow-[#800020]/25
            hover:shadow-xl hover:shadow-[#800020]/35
            transition-all duration-300
            hover:scale-105
            active:scale-95
            focus:outline-none
            focus:ring-2
            focus:ring-[#D4AF37]
            focus:ring-offset-2
            focus:ring-offset-black/20
            overflow-hidden
            group
          "
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {/* Gold shimmer effect */}
          <GoldShimmer className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Icon background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#800020] to-[#600018] rounded-full" />

          {/* Menu/Close icon */}
          <div className="relative z-10 flex items-center justify-center w-full h-full">
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="text-white"
            >
              {isOpen ? (
                <X className="w-6 h-6" strokeWidth={2} />
              ) : (
                <Menu className="w-6 h-6" strokeWidth={2} />
              )}
            </motion.div>
          </div>

          {/* Subtle gold border highlight */}
          <div className="absolute inset-0 rounded-full border border-[#D4AF37]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </motion.div>
    )
  }

  // Desktop version - Elegant rounded rectangle
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
      className={`pointer-events-auto ${className}`}
    >
      <button
        onClick={onToggle}
        className="
          relative
          px-8 py-4
          bg-[#800020]
          rounded-lg
          border border-[#D4AF37]
          shadow-lg shadow-[#800020]/25
          hover:shadow-xl hover:shadow-[#800020]/35
          transition-all duration-300
          hover:scale-105
          active:scale-95
          focus:outline-none
          focus:ring-2
          focus:ring-[#D4AF37]
          focus:ring-offset-2
          focus:ring-offset-black/20
          overflow-hidden
          group
          min-w-[140px]
        "
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {/* Gold shimmer effect */}
        <GoldShimmer className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#800020] to-[#600018] rounded-lg" />

        {/* Menu text with luxury styling */}
        <div className="relative z-10 flex items-center justify-center gap-3">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="text-white"
          >
            {isOpen ? (
              <X className="w-5 h-5" strokeWidth={2} />
            ) : (
              <Menu className="w-5 h-5" strokeWidth={2} />
            )}
          </motion.div>

          <span className="text-white text-sm font-light tracking-[0.3em] uppercase">
            {isOpen ? 'Close' : 'Menu'}
          </span>
        </div>

        {/* Gold underline animation */}
        <motion.div
          className="absolute bottom-2 left-1/2 h-px bg-[#D4AF37]"
          initial={{ width: 0, x: '-50%' }}
          animate={{
            width: isOpen ? '80%' : '60%',
            x: '-50%'
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />

        {/* Subtle gold border highlight */}
        <div className="absolute inset-0 rounded-lg border border-[#D4AF37]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>
    </motion.div>
  )
}