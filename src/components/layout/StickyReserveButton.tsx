'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { revealPresets, microInteractionPresets } from '@/utils/animations/presets'
import { ANIMATION_DURATIONS, EASING } from '@/utils/animations/constants'

export default function StickyReserveButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
      
      // Show after scrolling past hero section on mobile
      if (isMobile) {
        setIsVisible(window.scrollY > 300)
      } else {
        setIsVisible(window.scrollY > 100)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Initial check
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isMobile])

  // Desktop variant - fixed top-right corner
  const DesktopButton = () => (
    <motion.div
      className="fixed top-24 right-6 z-40 hidden lg:block"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={revealPresets.slideRight}
    >
      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="relative group"
      >
        {/* Luxury background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-900 rounded-lg opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Gold accent line */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-600 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        
        {/* Button content */}
        <Link
          href="/contact#reserveer"
          className="relative block px-6 py-3 text-white font-medium text-sm tracking-wide rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
          aria-label="Reserveer een tafel bij Bistro Bert"
        >
          <div className="flex items-center space-x-2">
            <span className="relative z-10">Reserveer</span>
            <svg 
              className="w-4 h-4 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
        
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-transparent rounded-lg blur-sm" />
        </div>
      </motion.div>
    </motion.div>
  )

  // Mobile variant - bottom bar
  const MobileButton = () => (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{
        duration: ANIMATION_DURATIONS.normal / 1000,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      {/* Background with blur effect */}
      <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl">
        <div className="container-dh px-4 py-4">
          <motion.div
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="relative group"
          >
            {/* Luxury button with gradient */}
            <Link
              href="/contact#reserveer"
              className="block w-full bg-gradient-to-r from-black to-gray-900 text-white text-center py-4 px-6 rounded-lg font-medium text-base shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label="Reserveer een tafel bij Bistro Bert"
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="relative z-10">Reserveer tafel</span>
                <svg 
                  className="w-5 h-5 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              
              {/* Gold accent on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </Link>
          </motion.div>
          
          {/* Subtle text hint */}
          <p className="text-center text-xs text-gray-500 mt-2">
            Ervaar culinaire excellentie
          </p>
        </div>
      </div>
    </motion.div>
  )

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <>
          {isMobile ? <MobileButton /> : <DesktopButton />}
        </>
      )}
    </AnimatePresence>
  )
}