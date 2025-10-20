'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Menu, Phone, Mail, MapPin } from 'lucide-react'

interface MenuOverlayProps {
  isOpen: boolean
  onClose: () => void
  pathname: string
}

interface MenuItem {
  id: string
  label: string
  href: string
  description?: string
}

const menuItems: MenuItem[] = [
  {
    id: 'menu',
    label: 'Menukaart',
    href: '/menu',
    description: 'Ontdek onze culinaire creaties'
  },
  {
    id: 'over-ons',
    label: 'Over ons',
    href: '/over-ons',
    description: 'Leer meer over ons restaurant en onze filosofie'
  },
  {
    id: 'contact',
    label: 'Reserveren',
    href: '/contact',
    description: 'Reserveer uw tafel of vraag naar onze diensten'
  }
]

export default function LuxuryNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('')
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setActiveLink(pathname)
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    // Focus trapping implementation
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && menuRef.current) {
        const focusableElements = menuRef.current.querySelectorAll(
          'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            event.preventDefault()
            lastElement?.focus()
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault()
            firstElement?.focus()
          }
        }
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
      
      // Set focus to first focusable element when menu opens
      setTimeout(() => {
        const firstFocusable = menuRef.current?.querySelector(
          'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement
        firstFocusable?.focus()
      }, 100)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const MenuOverlay = ({ isOpen, onClose, pathname }: MenuOverlayProps) => {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Menu Panel */}
            <motion.div
              ref={menuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-center p-8 border-b border-gray-100">
                  <div className="space-y-2">
                    <h2 className="text-suisse-h2 text-rich-black">
                      Bistro Bert
                    </h2>
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-burgundy to-transparent" />
                  </div>
                  <button
                    onClick={onClose}
                    className="p-4 hover:bg-gray-50 rounded-full transition-colors duration-200 md:p-2"
                    aria-label="Sluit menu"
                  >
                    <X className="w-8 h-8 text-rich-black md:w-6 md:h-6" />
                  </button>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 p-8">
                  <div className="space-y-8">
                    {menuItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                      >
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={`group block space-y-2 ${
                            pathname === item.href ? 'text-burgundy' : 'text-rich-black'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-suisse-h2 tracking-tight">
                              {item.label}
                            </span>
                            <div className={`w-16 h-px transition-all duration-300 ${
                              pathname === item.href ? 'bg-burgundy' : 'bg-gray-300 group-hover:bg-burgundy'
                            }`} />
                          </div>
                          {item.description && (
                            <p className="text-gray-600 text-sm font-luxury tracking-wide">
                              {item.description}
                            </p>
                          )}
                          <div className={`h-px bg-gradient-to-r from-transparent via-burgundy to-transparent transition-all duration-500 ${
                            pathname === item.href ? 'w-full' : 'w-0 group-hover:w-full'
                          }`} />
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Contact Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 pt-8 border-t border-gray-100 space-y-4"
                  >
                    <div className="flex items-center space-x-3 text-gray-700">
                      <Phone className="w-4 h-4 text-burgundy" />
                      <span className="text-sm font-luxury">+32 13 48 01 39</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700">
                      <Mail className="w-4 h-4 text-burgundy" />
                      <span className="text-sm font-luxury">info@bistro-bert.be</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700">
                      <MapPin className="w-4 h-4 text-burgundy" />
                      <span className="text-sm font-luxury">Verboekt 121, 2430 Laakdal</span>
                    </div>
                  </motion.div>
                  
                </nav>

                {/* Footer */}
                <div className="p-8 border-t border-gray-100">
                  <p className="text-xs text-gray-500 font-luxury tracking-wider uppercase text-center">
                    Ervaar culinaire excellentie sinds 2024
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    )
  }

  return (
    <>
      {/* Main Navbar */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          isScrolled
            ? 'bg-white/98 backdrop-blur-lg border-b border-gray-50 shadow-sm'
            : 'bg-white/95 backdrop-blur-md border-b border-gray-50/50'
        }`}
      >
        <div className="container-dh">
          <div className="flex items-center justify-center py-3 relative">
            {/* Logo - Centered */}
            <Link
              href="/"
              className="group absolute left-6 md:left-auto md:right-auto md:relative"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-burgundy to-gold-accent rounded-full flex items-center justify-center">
                  <span className="text-white font-serif text-lg font-bold">B</span>
                </div>
                <h1 className="heading-serif-nav tracking-tight text-rich-black transition-all duration-300 group-hover:text-burgundy">
                  Bistro Bert
                </h1>
              </motion.div>
              <div className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-transparent via-gold-accent to-transparent transition-all duration-500 group-hover:w-full" />
            </Link>

            {/* Desktop Navigation - Hidden on mobile, visible on larger screens */}
            <nav className="hidden lg:flex items-center space-x-12 absolute left-1/2 transform -translate-x-1/2">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`relative group px-4 py-2 ${
                    activeLink === item.href ? 'text-burgundy' : 'text-rich-black'
                  }`}
                >
                  <span className="text-sm font-luxury font-medium tracking-widest uppercase transition-colors duration-300 group-hover:text-burgundy">
                    {item.label}
                  </span>
                  <div className={`absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-burgundy to-transparent transition-all duration-300 ${
                    activeLink === item.href ? 'opacity-100 w-full' : 'opacity-0 w-0 group-hover:opacity-100 group-hover:w-full'
                  }`} />
                </Link>
              ))}
            </nav>


            {/* Menu Button - Positioned on the right */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 flex items-center justify-center group relative overflow-hidden rounded-full border border-gray-200 bg-white/50 backdrop-blur-sm absolute right-6 md:right-auto md:relative hover:border-burgundy transition-all duration-300 shadow-sm hover:shadow-md"
              aria-label={isMenuOpen ? "Sluit menu" : "Open menu"}
            >
              <div className="relative z-10">
                <div className="w-5 h-4 flex flex-col justify-center items-center">
                  <span className={`block w-5 h-0.5 bg-rich-black transition-all duration-300 group-hover:bg-burgundy ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
                  <span className={`block w-5 h-0.5 bg-rich-black transition-all duration-300 group-hover:bg-burgundy my-0.5 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block w-5 h-0.5 bg-rich-black transition-all duration-300 group-hover:bg-burgundy ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
                </div>
              </div>
              <div className="absolute inset-0 bg-burgundy/5 scale-0 transition-transform duration-300 group-hover:scale-100 rounded-full" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Menu Overlay */}
      <MenuOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        pathname={pathname}
      />
    </>
  )
}