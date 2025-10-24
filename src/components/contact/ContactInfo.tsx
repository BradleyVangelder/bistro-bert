'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function ContactInfo() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-24"
      >
        <h2 className="heading-serif-large mb-6 md:mb-8">Reserveringsinformatie</h2>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto" />
        <p className="text-gray-600 text-lg leading-relaxed font-luxury max-w-2xl mx-auto">
          Verfijnde keuken met een uitgebreide wijnkaart. Reserveer uw tafel voor een onvergetelijke culinaire ervaring.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-luxury font-medium text-rich-black mb-1">Locatie</h3>
              <p className="text-gray-600 font-luxury">Verboekt 121, 2430 Laakdal, België</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-luxury font-medium text-rich-black mb-1">Reserveringen</h3>
              <p className="text-gray-600 font-luxury">+32 13 48 01 39 — 10:00–23:00</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-6"
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-luxury font-medium text-rich-black mb-1">E-mail</h3>
              <p className="text-gray-600 font-luxury">info@bistro-bert.be</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-luxury font-medium text-rich-black mb-1">Openingstijden</h3>
              <p className="text-gray-600 font-luxury">Dinsdag–Zondag: 11:00–23:00</p>
              <p className="text-sm text-gray-500">Maandag gesloten</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}