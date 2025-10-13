'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function MobileReserveerBar() {
  const [isVisible, setIsVisible] = useState(false)
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

  useEffect(() => {
    if (!isMobile) return

    const handleScroll = () => {
      // Show after scrolling past hero section
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isMobile])

  if (!isMobile || !isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="container-dh px-4 py-3">
        <Link
          href="/contact"
          className="block w-full bg-black text-white text-center py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300"
          aria-label="Reserveer een tafel bij Bistro Bert"
        >
          Reserveer een tafel
        </Link>
      </div>
    </div>
  )
}