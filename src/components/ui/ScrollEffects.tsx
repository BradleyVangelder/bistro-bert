'use client'

import { useEffect, useState, useRef } from 'react'
import { useCursor } from './CursorProvider'

interface ScrollEffectsProps {
  children: React.ReactNode
}

export function ScrollEffects({ children }: ScrollEffectsProps) {
  const { setCursorVariant } = useCursor()
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      setIsVisible(currentScrollY > 200)

      // Reveal sections on scroll
      sectionRefs.current.forEach((section) => {
        if (section) {
          const rect = section.getBoundingClientRect()
          const windowHeight = window.innerHeight

          if (rect.top < windowHeight * 0.8) {
            section.classList.add('revealed')
          }
        }
      })

      // Parallax effects
      const parallaxElements = document.querySelectorAll('[data-parallax]')
      parallaxElements.forEach((element) => {
        const speed = parseFloat(element.getAttribute('data-parallax') || '0.5')
        const yPos = -(currentScrollY * speed)
        ;(element as HTMLElement).style.transform = `translateY(${yPos}px)`
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const addSectionRef = (element: HTMLElement | null) => {
    if (element && !sectionRefs.current.includes(element)) {
      sectionRefs.current.push(element)
    }
  }

  return (
    <div className="relative">
      {/* Floating scroll indicator */}
      <div
        className={`fixed right-8 top-1/2 transform -translate-y-1/2 z-30 transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-px bg-[#0F3B2F]/30" />
          <div className="text-xs font-inter text-[#0F3B2F]/60 writing-mode-vertical-rl">
            Scroll
          </div>
        </div>
      </div>

      {/* Dynamic scroll-based effects */}
      <div
        className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-500"
        style={{
          opacity: Math.min(scrollY / 1000, 0.3),
          background: `radial-gradient(circle at 50% ${scrollY * 0.1}px, rgba(15, 59, 47, 0.05) 0%, transparent 50%)`
        }}
      />

      {/* Reveal animation wrapper */}
      <div
        ref={addSectionRef}
        className="section-reveal min-h-screen"
      >
        {children}
      </div>

      {/* Scroll-to-top button */}
      <button
        className={`fixed bottom-8 right-8 w-12 h-12 bg-[#0F3B2F] text-white rounded-full flex items-center justify-center z-40 transition-all duration-300 transform hover:scale-110 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onMouseEnter={() => setCursorVariant('hover')}
        onMouseLeave={() => setCursorVariant('default')}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  )
}

// Hook for reveal animations
export function useRevealAnimation() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  return ref
}

// Parallax hook
export function useParallax(speed = 0.5) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const scrolled = window.pageYOffset
        const rate = scrolled * -speed
        ref.current.style.transform = `translateY(${rate}px)`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return ref
}