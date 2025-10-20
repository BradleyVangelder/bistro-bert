'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, X } from 'lucide-react'
import MinimalistMenuButton from './MinimalistMenuButton'
import WeatherInfo from '../weather/WeatherInfo'

export default function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Scroll detection for background transparency only
  const [hasScrolledFromTop, setHasScrolledFromTop] = useState(false)

  // Determine header styling based on current page
  const isHomePage = pathname === '/'

  // Mobile detection
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

  // Simplified scroll detection for background transparency only
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      // Update hasScrolledFromTop for background animation
      setHasScrolledFromTop(currentScrollY > 50) // Trigger after 50px from top
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const isWhiteIcon = isHomePage && !hasScrolledFromTop

  // Enhanced responsive behavior
  const logoWidth = isMobile ? 96 : 120
  const logoHeight = isMobile ? 96 : 120
  const containerPadding = isMobile ? 'px-8 pt-3 pb-2' : 'px-8 md:px-16 lg:px-24 pt-4 pb-2'

  
  // Navigation items - luxury experience focused
  const navItems = [
    { id: 'menu', label: 'Menukaart', href: '/menu' },
    { id: 'over-ons', label: 'Over ons', href: '/over-ons' },
    { id: 'contact', label: 'Contact', href: '/contact' },
  ]


  return (
    <>
      {/* Fixed Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-[60] pointer-events-none transition-all duration-300 ${
          hasScrolledFromTop
            ? "bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm"
            : "bg-transparent"
        }`}
        role="banner"
      >
        <div className={`relative w-full flex items-center justify-between ${containerPadding}`}>
          {/* Restaurant Logo */}
          <div className="pointer-events-auto self-center">
            <Link
              href="/"
              className="block hover:opacity-70 transition-all duration-300"
              aria-label="Bistro Bert - Terug naar homepagina"
            >
              <Image
                src="/bistro-bert-logo.png"
                alt=""
                width={logoWidth}
                height={logoHeight}
                className="object-contain"
                priority
                style={{
                  filter: isWhiteIcon ? 'brightness(0) invert(1)' : 'none',
                  transition: 'filter 0.3s ease'
                }}
                aria-hidden="true"
              />
            </Link>
          </div>


          {/* Minimalist Menu Button */}
          <div className="self-center">
            <MinimalistMenuButton
              isOpen={isMenuOpen}
              onToggle={() => setIsMenuOpen(!isMenuOpen)}
              isWhite={isWhiteIcon}
            />
          </div>

        </div>
      </header>

      {/* Navigation Overlay - Noma style slide-out menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 z-[70] pointer-events-auto"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[75] pointer-events-auto mobile-nav-container"
              role="dialog"
              aria-modal="true"
              aria-label="Navigatiemenu"
            >
              <div className="h-full flex flex-col">
                {/* Menu Header - Simplified */}
                <div className="flex justify-end items-center px-6 py-4 bg-white/95 backdrop-blur-sm">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="w-14 h-14 md:w-12 md:h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
                    aria-label="Sluit menu"
                  >
                    <X className="w-8 h-8 md:w-8 md:h-8 text-black" />
                  </button>
                </div>

                {/* Navigation Items */}
                <nav
                  className="flex-1 px-6 py-2 overflow-y-auto"
                  role="navigation"
                  aria-label="Hoofdnavigatie"
                >
                  <div className="space-y-4">
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                      >
                        <Link
                          href={item.href}
                          className="group block py-4 px-3 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 rounded mobile-nav-item"
                          onClick={() => setIsMenuOpen(false)}
                          aria-label={`Navigeer naar ${item.label}`}
                        >
                          <div className="font-serif text-xl font-medium text-black leading-tight tracking-tight group-hover:text-gray-600 transition-colors duration-300">
                            {item.label}
                          </div>
                          <div className="w-0 h-px bg-black transition-all duration-300 group-hover:w-16 mt-2"></div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Mobile Contact Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-8 pt-6 border-t border-gray-100 space-y-2 px-3"
                  >
                    <div className="flex items-center gap-2 md:gap-4 text-gray-700 py-2">
                      <Phone className="w-5 h-5 text-gray-700" />
                      <a
                        href="tel:+3213480139"
                        className="text-base font-luxury"
                      >
                        <span>+32 13 48 01 39</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4 text-gray-700 py-2">
                      <Mail className="w-5 h-5 text-gray-700" />
                      <a
                        href="mailto:info@bistro-bert.be"
                        className="text-base font-luxury"
                      >
                        <span>info@bistro-bert.be</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4 text-gray-700 py-2">
                      <Clock className="w-5 h-5 text-gray-700" />
                      <div>
                        <span className="text-base font-luxury">Dinsdag–Zondag</span>
                        <div className="text-gray-800 font-semibold">10:00–22:00</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-gray-700 py-2">
                      <MapPin className="w-5 h-5 text-gray-700 mt-1" />
                      <div>
                        <span className="text-base font-luxury">Verboekt 121</span>
                        <div className="text-sm text-gray-600">2430 Laakdal, België</div>
                      </div>
                    </div>
                    
                    {/* Weather Information */}
                    <WeatherInfo />
                    
                  </motion.div>
                </nav>

                {/* Mobile Footer */}
                <div className="px-6 pb-6 pt-4 border-t border-gray-100 bg-gray-50/50">
                  <div className="text-xs text-gray-500 font-light tracking-wider uppercase text-center font-luxury">
                    Belgische Traditie
                  </div>
                  <div className="text-xs text-gray-400 font-light tracking-wider uppercase text-center mt-1 font-luxury">
                    Sinds 2025
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}