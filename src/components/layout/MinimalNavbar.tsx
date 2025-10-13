'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MinimalNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      {/* Ultra-minimal navbar - noma.dk inspired */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-none border-0 h-32">
        <div className="absolute inset-0 flex items-center justify-between px-16">
          {/* Logo - Ultra-minimalist */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              href="/"
              className="text-white text-5xl font-serif font-light tracking-tight hover:text-white transition-none"
              style={{
                fontFamily: 'Georgia, serif',
                letterSpacing: '-0.05em',
                lineHeight: '1'
              }}
            >
              Bistro Bert
            </Link>
          </motion.div>

          {/* Desktop Navigation - Hidden behind menu button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:flex items-center"
          >
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white text-sm font-light tracking-widest uppercase hover:text-white transition-none"
            >
              Menu
            </button>
          </motion.div>

          {/* Mobile menu button */}
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            <div className="w-6 h-6 relative">
              <span
                className={`absolute w-full h-px bg-white top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45' : '-translate-y-2'
                }`}
              />
              <span
                className={`absolute w-full h-px bg-white top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute w-full h-px bg-white top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45' : 'translate-y-2'
                }`}
              />
            </div>
          </motion.button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black fixed top-32 left-0 right-0 z-40"
            >
              <div className="px-16 py-12">
                <div className="flex flex-col space-y-8">
                  <Link
                    href="/menu"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white text-2xl font-serif font-light tracking-tight hover:text-white transition-none"
                  >
                    Menukaart
                  </Link>
                  <Link
                    href="/over-ons"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white text-2xl font-serif font-light tracking-tight hover:text-white transition-none"
                  >
                    Over ons
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white text-2xl font-serif font-light tracking-tight hover:text-white transition-none"
                  >
                    Reserveren
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="hidden md:block fixed top-32 left-0 right-0 z-40 bg-black shadow-2xl"
            >
              <div className="px-16 py-12">
                <div className="flex flex-col space-y-8">
                  <Link
                    href="/menu"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white text-2xl font-serif font-light tracking-tight hover:text-white transition-none"
                  >
                    Menukaart
                  </Link>
                  <Link
                    href="/over-ons"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white text-2xl font-serif font-light tracking-tight hover:text-white transition-none"
                  >
                    Over ons
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white text-2xl font-serif font-light tracking-tight hover:text-white transition-none"
                  >
                    Reserveren
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}