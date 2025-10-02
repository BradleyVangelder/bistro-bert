'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { FocusVisible } from '@/components/ui/FocusVisible'

interface MinimalistMenuButtonProps {
  isOpen: boolean
  onToggle: () => void
  className?: string
  isWhite?: boolean
}

export default function MinimalistMenuButton({ isOpen, onToggle, className = '', isWhite = false }: MinimalistMenuButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Simple, clean animation for the icon rotation
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`pointer-events-auto ${className}`}
    >
      <FocusVisible
        focusClassName="ring-2 ring-offset-2 ring-burgundy ring-offset-white"
      >
        <button
          onClick={onToggle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="
            relative
            w-16 h-16
            flex items-center justify-center
            rounded-none
            border-none
            bg-transparent
            hover:bg-white/10
            active:bg-white/20
            transition-all duration-200
            focus:outline-none
            focus:ring-0
            group
          "
          aria-label={isOpen ? "Sluit menu" : "Open menu"}
          aria-expanded={isOpen}
        >
        {/* Hamburger/Close icon */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`${isWhite ? "text-white" : "text-black"} transition-colors duration-300`}
        >
          {isOpen ? (
            <X className="w-9 h-9" strokeWidth={1.5} />
          ) : (
            <Menu className="w-9 h-9" strokeWidth={1.5} />
          )}
        </motion.div>

        {/* Subtle background indicator on hover */}
        <motion.div
          className="absolute inset-0 bg-white/10 rounded-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </button>
      </FocusVisible>
    </motion.div>
  )
}