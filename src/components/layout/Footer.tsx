'use client'

import Link from 'next/link'
import { MapPin, Phone, Mail, Instagram } from 'lucide-react'
import WeatherDisplay from '../WeatherDisplay'

export default function Footer() {
  // Navigation items matching the header
  const navItems = [
    { id: 'menu', label: 'Menukaart', href: '/menu' },
    { id: 'over-ons', label: 'Over ons', href: '/over-ons' },
    { id: 'contact', label: 'Reserveren', href: '/contact' },
  ]

  // Contact information
  const contactInfo = {
    address: 'Verboekt 121, 2430 Laakdal, België',
    phone: '+32 13 48 01 39',
    email: 'info@bistro-bert.be',
    vat: 'BE 1026.203.481'
  }

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="container-dh pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Restaurant Name */}
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-light text-rich-black">
              Bistro Bert
            </h2>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <p className="text-gray-600 text-sm leading-relaxed font-luxury">
              Belgische traditie met moderne finesse.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-sm font-luxury font-medium text-gray-400 uppercase tracking-wider">
              Navigatie
            </h3>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="block text-gray-700 hover:text-burgundy transition-colors text-sm font-luxury ml-0 md:ml-0 pl-0 md:pl-0"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-luxury font-medium text-gray-400 uppercase tracking-wider">
              Contact
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm font-luxury leading-relaxed">
                  {contactInfo.address}
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <a
                  href={`tel:${contactInfo.phone.replace(/[^\d+]/g, '')}`}
                  className="text-gray-700 hover:text-burgundy transition-colors text-sm font-luxury"
                  aria-label="Bel Bistro Bert: +32 13 48 01 39"
                >
                  {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-gray-700 hover:text-burgundy transition-colors text-sm font-luxury"
                  aria-label="E-mail Bistro Bert: info@bistro-bert.be"
                >
                  {contactInfo.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Display */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="text-center">
            <WeatherDisplay className="text-gray-600 text-sm font-luxury justify-center" showLocation={true} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-500 text-sm font-luxury">
              © {new Date().getFullYear()} Bistro Bert. Alle rechten voorbehouden.
            </div>
            <div className="text-gray-500 text-sm font-luxury">
              BTW: {contactInfo.vat}
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://www.instagram.com/bistro_bert?igsh=MWtzZXF1bHJ5em91OQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-burgundy transition-colors"
                aria-label="Bezoek Bistro Bert op Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}