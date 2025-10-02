'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useCursor } from './CursorProvider'

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const { setCursorVariant } = useCursor()

  useEffect(() => {
    setIsMounted(true)

    // Handle page transitions
    const handleStart = () => {
      setIsTransitioning(true)
      setCursorVariant('loading')
    }

    // Next.js navigation events
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleStart)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', handleStart)
      }
    }
  }, [setCursorVariant])

  return (
    <div className="relative min-h-screen">
      {/* Page Loading Overlay */}
      <div
        className={`fixed inset-0 bg-white z-50 transition-all duration-700 ease-in-out ${
          isMounted && !isTransitioning ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Animated logo */}
            <div className="w-20 h-20 bg-[#0F3B2F] rounded-full flex items-center justify-center animate-pulse">
              <div className="relative w-12 h-12">
                <Image
                  src="/bistro-bert-logo.png"
                  alt="Bistro Bert"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Orbiting elements */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-1 h-4 bg-[#0F3B2F]/30 animate-orbit" />
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-1 h-4 bg-[#0F3B2F]/30 animate-orbit delay-1000" />
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 w-4 h-1 bg-[#0F3B2F]/30 animate-orbit delay-500" />
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 w-4 h-1 bg-[#0F3B2F]/30 animate-orbit delay-1500" />
            </div>
          </div>
        </div>
      </div>

      {/* Page Content with Staggered Reveal */}
      <div
        className={`transform transition-all duration-1000 ease-out ${
          isMounted && !isTransitioning ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {children}
      </div>

      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        <div className="absolute w-96 h-96 bg-[#0F3B2F]/3 rounded-full blur-3xl animate-float" style={{ left: '10%', top: '20%' }} />
        <div className="absolute w-64 h-64 bg-[#0F3B2F]/2 rounded-full blur-3xl animate-float delay-2000" style={{ right: '15%', top: '60%' }} />
        <div className="absolute w-80 h-80 bg-[#0F3B2F]/4 rounded-full blur-3xl animate-float delay-4000" style={{ left: '50%', bottom: '10%' }} />
      </div>

      {/* Interactive Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-5">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" id="interactive-background" />
        </div>
      </div>
    </div>
  )
}