'use client'

import { useEffect, useState } from 'react'
import { useCursor } from './CursorProvider'

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const { setCursorVariant } = useCursor()

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight - windowHeight
      const progress = (scrollY / documentHeight) * 100
      setScrollProgress(progress)

      // Show/hide progress bar based on scroll position
      setIsVisible(scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Main Progress Bar */}
      <div
        className={`fixed top-0 left-0 w-full h-1 bg-[#E9ECEB] z-50 transition-all duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className="h-full bg-[#0F3B2F] transition-all duration-150 ease-out relative overflow-hidden"
          style={{ width: `${scrollProgress}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full animate-shimmer" />
        </div>
      </div>

      {/* Side Progress Indicator */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="relative w-1 h-32 bg-[#E9ECEB] rounded-full overflow-hidden">
          <div
            className="absolute bottom-0 w-full bg-[#0F3B2F] transition-all duration-300 ease-out"
            style={{ height: `${scrollProgress}%` }}
          />
          <div
            className="absolute w-3 h-3 bg-[#0F3B2F] rounded-full transition-all duration-300 ease-out"
            style={{ bottom: `calc(${scrollProgress}% - 6px)` }}
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`fixed bottom-8 left-8 z-40 transition-all duration-300 ${
        scrollProgress < 10 ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-[#E9ECEB]">
          <div className="w-2 h-2 bg-[#0F3B2F] rounded-full animate-pulse" />
          <span className="text-sm font-inter text-[#0F3B2F]">Scroll to explore</span>
        </div>
      </div>
    </>
  )
}