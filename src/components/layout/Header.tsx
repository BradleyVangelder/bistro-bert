'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Cloud, Thermometer, MapPin, Phone, Mail, Clock, X } from 'lucide-react'
import MinimalistMenuButton from './MinimalistMenuButton'

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
  const logoWidth = isMobile ? 72 : 90
  const logoHeight = isMobile ? 72 : 90
  const containerPadding = isMobile ? 'px-8 pt-3 pb-2' : 'px-8 md:px-16 lg:px-24 pt-4 pb-2'

  
  // Navigation items - luxury experience focused
  const navItems = [
    { id: 'menu', label: 'Menukaart', href: '/menu' },
    { id: 'over-ons', label: 'Over Ons', href: '/over-ons' },
    { id: 'contact', label: 'Reserveringen', href: '/contact' },
  ]

  // Static weather data (removes API dependency)
  const weather = {
    temperature: 16,
    condition: 'Partly Cloudy',
    location: 'Brussels, Belgium'
  }

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
                className="w-auto h-auto"
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
              className="fixed inset-0 bg-black/60 z-[55] pointer-events-auto"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[65] pointer-events-auto mobile-nav-container"
              role="dialog"
              aria-modal="true"
              aria-labelledby="menu-title"
            >
              <div className="h-full flex flex-col">
                {/* Menu Header - Mobile Friendly */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 md:w-20 md:h-20">
                      <Image
                        src="/bistro-bert-logo.png"
                        alt=""
                        fill
                        className="object-contain"
                        aria-hidden="true"
                      />
                    </div>
                    <h2 id="menu-title" className="text-xl font-serif font-light text-black">
                      Menu
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-burgundy focus:ring-offset-2"
                    aria-label="Sluit menu"
                  >
                    <X className="w-6 h-6 md:w-5 md:h-5 text-black" />
                  </button>
                </div>

                {/* Navigation Items */}
                <nav
                  className="flex-1 px-6 py-8 overflow-y-auto"
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
                          className="group block py-4 px-3 focus:outline-none focus:ring-2 focus:ring-burgundy focus:ring-offset-2 rounded mobile-nav-item"
                          onClick={() => setIsMenuOpen(false)}
                          aria-label={`Navigeer naar ${item.label}`}
                        >
                          <div className="text-2xl md:text-2xl font-serif font-light text-black leading-tight tracking-tight group-hover:text-gray-600 transition-colors duration-300">
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
                    className="mt-8 pt-6 border-t border-gray-100 space-y-4"
                  >
                    {/* Mobile Weather Info */}
                    <div className="flex items-center gap-3 text-gray-700 bg-gray-50 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-5 h-5 text-burgundy" />
                        <span className="text-base font-medium font-luxury">{weather.temperature}°C</span>
                      </div>
                      <div className="w-px h-4 bg-gray-300" />
                      <div className="flex items-center gap-2">
                        <Cloud className="w-5 h-5 text-burgundy" />
                        <span className="text-sm text-gray-600 font-luxury">{weather.condition}</span>
                      </div>
                    </div>

                    <a
                      href="tel:+3213480139"
                      className="flex items-center gap-3 text-gray-700 p-3 rounded-lg hover:bg-gray-50 transition-colors mobile-nav-item"
                    >
                      <Phone className="w-5 h-5 text-burgundy" />
                      <span className="text-base font-luxury">+32 13 48 01 39</span>
                    </a>
                    
                    <a
                      href="mailto:info@bistro-bert.be"
                      className="flex items-center gap-3 text-gray-700 p-3 rounded-lg hover:bg-gray-50 transition-colors mobile-nav-item"
                    >
                      <Mail className="w-5 h-5 text-burgundy" />
                      <span className="text-base font-luxury">info@bistro-bert.be</span>
                    </a>
                    
                    <div className="flex items-center gap-3 text-gray-700 p-3 rounded-lg bg-gray-50">
                      <Clock className="w-5 h-5 text-burgundy" />
                      <div>
                        <span className="text-base font-luxury">Dinsdag t/m zondag</span>
                        <div className="text-burgundy font-semibold">10:00–22:00</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 text-gray-700 p-3 rounded-lg bg-gray-50">
                      <MapPin className="w-5 h-5 text-burgundy mt-1" />
                      <div>
                        <span className="text-base font-luxury">Verboekt 121</span>
                        <div className="text-sm text-gray-600">2430 Laakdal, België</div>
                      </div>
                    </div>
                  </motion.div>
                </nav>

                {/* Mobile Footer */}
                <div className="px-6 pb-6 pt-4 border-t border-gray-100 bg-gray-50/50">
                  <div className="text-xs text-gray-500 font-light tracking-wider uppercase text-center font-luxury">
                    Ambachtelijke Perfectie
                  </div>
                  <div className="text-xs text-gray-400 font-light tracking-wider uppercase text-center mt-1 font-luxury">
                    Since 2024
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