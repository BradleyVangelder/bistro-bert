'use client'

import { useEffect, useState } from 'react'

interface SkipLinksProps {
  showOnLoad?: boolean
}

export default function SkipLinks({ showOnLoad = false }: SkipLinksProps) {
  const [showSkipLinks, setShowSkipLinks] = useState(showOnLoad)

  useEffect(() => {
    // Show skip links when tab key is pressed
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setShowSkipLinks(true)
      }
    }

    const handleMouseDown = () => {
      setShowSkipLinks(false)
    }

    const handleFocusIn = (e: FocusEvent) => {
      if (e.target === document.body) {
        setShowSkipLinks(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('focusin', handleFocusIn)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('focusin', handleFocusIn)
    }
  }, [])

  const skipToMain = () => {
    const main = document.querySelector('main')
    main?.focus()
  }

  const skipToNavigation = () => {
    const nav = document.querySelector('nav, [role="navigation"]') as HTMLElement
    nav?.focus()
  }

  const skipToContact = () => {
    const contact = document.querySelector('#contact, [aria-label*="contact"], [aria-label*="reserveren"]') as HTMLElement
    contact?.focus()
  }

  const skipToMenu = () => {
    const menu = document.querySelector('#menu, [aria-label*="menu"], [aria-label*="kaart"]') as HTMLElement
    menu?.focus()
  }

  if (!showSkipLinks) return null

  return (
    <>
      {/* Dutch skip link for screen readers */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-burgundy focus:ring-offset-2"
      >
        Ga naar inhoud
      </a>
      
      {/* Original skip links */}
      <div className="fixed top-0 left-0 z-50 transform -translate-y-full focus:translate-y-0 transition-transform duration-300 bg-white border-b border-gray-200">
        <div className="flex flex-col p-2 space-y-1">
          <a
            href="#main-content"
            onClick={(e) => { e.preventDefault(); skipToMain() }}
            className="px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-burgundy focus:ring-offset-2 rounded"
          >
            Skip to main content
          </a>
          <a
            href="#navigation"
            onClick={(e) => { e.preventDefault(); skipToNavigation() }}
            className="px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-burgundy focus:ring-offset-2 rounded"
          >
            Skip to navigation
          </a>
          <a
            href="#menu-section"
            onClick={(e) => { e.preventDefault(); skipToMenu() }}
            className="px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-burgundy focus:ring-offset-2 rounded"
          >
            Skip to menu
          </a>
          <a
            href="#contact-section"
            onClick={(e) => { e.preventDefault(); skipToContact() }}
            className="px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-burgundy focus:ring-offset-2 rounded"
          >
            Skip to contact
          </a>
        </div>
      </div>
    </>
  )
}