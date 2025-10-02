'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Phone, Mail, MapPin, Clock } from 'lucide-react'

interface FormData {
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: string
  message: string
}

export default function LuxuryContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      guests: '',
      message: ''
    })
  }

  return (
    <div className="grid md:grid-cols-2 gap-16 items-start">
      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="space-y-8"
      >
        <div>
          <h2 className="text-4xl font-serif font-light mb-4">Neem contact op</h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-burgundy to-transparent mb-8" />
          <p className="text-gray-600 text-lg leading-relaxed">
            Wij heten u van harte welkom in Bistro Bert. Of u nu een speciale viering plant of een intiem diner, ons team staat klaar om uw ervaring onvergetelijk te maken.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-burgundy/10 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-burgundy" />
            </div>
            <div>
              <h3 className="font-luxury font-medium text-rich-black mb-1">Reserveringen</h3>
              <p className="text-gray-600 font-luxury">013 480 139</p>
              <p className="text-sm text-gray-500">Dagelijks van 10:00 - 22:00</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-burgundy/10 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-burgundy" />
            </div>
            <div>
              <h3 className="font-luxury font-medium text-rich-black mb-1">E-mail</h3>
              <p className="text-gray-600 font-luxury">info@bistro-bert.be</p>
              <p className="text-sm text-gray-500">Wij antwoorden binnen 24 uur</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-burgundy/10 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-burgundy" />
            </div>
            <div>
              <h3 className="font-luxury font-medium text-rich-black mb-1">Locatie</h3>
              <p className="text-gray-600 font-luxury">Verboekt 121</p>
              <p className="text-gray-600 font-luxury">2430 Laakdal, België</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-burgundy/10 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-burgundy" />
            </div>
            <div>
              <h3 className="font-luxury font-medium text-rich-black mb-1">Openingsuren</h3>
              <p className="text-gray-600 font-luxury">Dinsdag - Zondag: 18:00 - 22:00</p>
              <p className="text-sm text-gray-500">Gesloten op maandag</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-serif font-light text-rich-black mb-4">
              Bedankt
            </h3>
            <p className="text-gray-600 mb-8">
              Uw bericht is succesvol verzonden. Wij nemen binnen 24 uur contact met u op.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="btn-luxury-enhanced"
            >
              Stuur nog een bericht
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-luxury font-medium text-rich-black mb-2">
                  Volledige naam *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy/10 transition-all duration-300 font-luxury bg-white"
                  placeholder="Uw naam"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-luxury font-medium text-rich-black mb-2">
                  E-mailadres *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy/10 transition-all duration-300 font-luxury bg-white"
                  placeholder="uw@email.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-luxury font-medium text-rich-black mb-2">
                  Telefoonnummer
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy/10 transition-all duration-300 font-luxury bg-white"
                  placeholder="013 480 139"
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-luxury font-medium text-rich-black mb-2">
                  Gewenste datum
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy/10 transition-all duration-300 font-luxury bg-white"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="time" className="block text-sm font-luxury font-medium text-rich-black mb-2">
                  Gewenst uur
                </label>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy/10 transition-all duration-300 font-luxury bg-white"
                >
                  <option value="">Selecteer uur</option>
                  <option value="18:00">18:00</option>
                  <option value="18:30">18:30</option>
                  <option value="19:00">19:00</option>
                  <option value="19:30">19:30</option>
                  <option value="20:00">20:00</option>
                  <option value="20:30">20:30</option>
                  <option value="21:00">21:00</option>
                </select>
              </div>
              <div>
                <label htmlFor="guests" className="block text-sm font-luxury font-medium text-rich-black mb-2">
                  Aantal personen
                </label>
                <select
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy/10 transition-all duration-300 font-luxury bg-white"
                >
                  <option value="">Selecteer aantal</option>
                  <option value="1">1 persoon</option>
                  <option value="2">2 personen</option>
                  <option value="3">3 personen</option>
                  <option value="4">4 personen</option>
                  <option value="5">5 personen</option>
                  <option value="6">6 personen</option>
                  <option value="7+">7+ personen</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-luxury font-medium text-rich-black mb-2">
                Bericht
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy/10 transition-all duration-300 font-luxury bg-white resize-none"
                placeholder="Vertel ons over uw speciale gelegenheid of dieetwensen..."
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className={`btn-luxury-enhanced w-full ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Versturen...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Verstuur bericht</span>
                </div>
              )}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  )
}