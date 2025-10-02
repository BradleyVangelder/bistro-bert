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
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-serif font-light mb-4">Moderne Verfijning</h2>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-burgundy to-transparent mx-auto mb-8" />
        <p className="text-gray-600 text-lg leading-relaxed font-luxury max-w-2xl mx-auto">
          Belgische traditie met moderne finesse—serieuze keuken, zonder zwaar te worden.
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
            <div className="flex-shrink-0 w-12 h-12 bg-burgundy/10 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-burgundy" />
            </div>
            <div>
              <h3 className="font-luxury font-medium text-rich-black mb-1">Locatie</h3>
              <p className="text-gray-600 font-luxury">Verboekt 121, 2430 Laakdal, België</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-burgundy/10 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-burgundy" />
            </div>
            <div>
              <h3 className="font-luxury font-medium text-rich-black mb-1">Reserveer uw tafel</h3>
              <p className="text-gray-600 font-luxury">+32 13 48 01 39</p>
              <p className="text-sm text-gray-500">Reserveer voor lunch, zakenlunch of diner—wij regelen de rest.</p>
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
            <div className="flex-shrink-0 w-12 h-12 bg-burgundy/10 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-burgundy" />
            </div>
            <div>
              <h3 className="font-luxury font-medium text-rich-black mb-1">Stuur ons een e-mail</h3>
              <p className="text-gray-600 font-luxury">info@bistro-bert.be</p>
              <p className="text-sm text-gray-500">We antwoorden doorgaans binnen 24 uur.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-burgundy/10 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-burgundy" />
            </div>
            <div>
              <h3 className="font-luxury font-medium text-rich-black mb-1">Openingstijden</h3>
              <p className="text-gray-600 font-luxury">Dinsdag t/m zondag: 18:00–22:00. Lunch vrij & zat: 12:00–14:00. (Pas aan indien anders.)</p>
              <p className="text-sm text-gray-500">Maandag: gesloten</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}