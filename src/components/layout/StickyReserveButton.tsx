'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { revealPresets, microInteractionPresets } from '@/utils/animations/presets'
import { ANIMATION_DURATIONS, EASING } from '@/utils/animations/constants'
import { openZenchefWidget } from '@/utils/zenchef'
import ActionButton from '@/components/ui/ActionButton'

export default function StickyReserveButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const handleReserveClick = () => {
    const widgetOpened = openZenchefWidget()
    if (!widgetOpened) {
      // Don't navigate away - just log the error and let user try again
      console.warn('Zenchef widget niet beschikbaar. Gelieve later opnieuw te proberen.')
      // Optional: You could show a toast message here instead of navigating away
    }
  }

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
      <ActionButton
        onClick={handleReserveClick}
        variant="reserve"
        ariaLabel="Reserveer een tafel bij Bistro Bert"
        dataZcAction="open"
      >
        Reserveer een tafel
      </ActionButton>
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
            <ActionButton
              onClick={handleReserveClick}
              variant="reserve"
              ariaLabel="Reserveer een tafel bij Bistro Bert"
              dataZcAction="open"
              className="w-full"
            >
              Reserveer een tafel
            </ActionButton>
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