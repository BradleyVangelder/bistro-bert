"use client"

import { motion } from 'framer-motion'
import Footer from '@/components/layout/Footer'
import ContactInfo from '@/components/contact/ContactInfo'
import { RestaurantSectionHeading } from '@/components/ui/SmartHeadings'

export default function ClientContact() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="navbar-spacer pt-32 pb-20 bg-white">
        <div className="container-dh">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <RestaurantSectionHeading className="mb-6 md:mb-8 text-center">
                Reserveer een tafel
              </RestaurantSectionHeading>
            </motion.div>
            <motion.div
              className="w-24 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-8"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <motion.p
              className="typography-body-large text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Verfijnde Belgische keuken met een doordachte wijnkaart in Laakdal.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
                <motion.a
                  href="mailto:info@bistro-bert.com?subject=Reservatie"
                  className="inline-flex items-center justify-center px-3 md:px-8 py-1.5 md:py-4 bg-black text-white hover:bg-gray-800 transition-colors typography-button w-full sm:w-auto min-w-0"
                  aria-label="Stuur e-mail naar Bistro Bert: info@bistro-bert.com"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Reserveer een tafel
                </motion.a>
                <motion.a
                  href="tel:+3213480139"
                  className="inline-flex items-center justify-center px-3 md:px-8 py-1.5 md:py-4 bg-black text-white hover:bg-gray-800 transition-colors typography-button w-full sm:w-auto min-w-0"
                  aria-label="Bel Bistro Bert direct: +32 13 48 01 39"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  BEL: +32 13 48 01 39
                </motion.a>
            </motion.div>
            <motion.p
              className="mt-4 text-center text-gray-600 typography-body-small"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              We denken graag mee over allergenen, wijn en timing.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <motion.section
        className="section-dh"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="container-dh">
          <ContactInfo />
        </div>
      </motion.section>

       {/* Map Section */}
        <motion.section
          className="relative h-48 md:h-96 lg:h-[500px] bg-gray-100 overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
           <iframe
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2521.2846153846154!2d5.0996063!3d51.0843463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3a4b7e3e3e3e3%3A0x4c3e5b5e5e5e5e5!2sVerboekt%20121%2C%202430%20Laakdal%2C%20Belgium!5e0!3m2!1sen!2sbe!4v1234567890!5m2!1sen!2sbe"
             className="w-full h-full"
             style={{ border: 0 }}
             allowFullScreen
             loading="lazy"
             referrerPolicy="no-referrer-when-downgrade"
             title="Bistro Bert Locatie in Laakdal"
           />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      </motion.section>

  
      {/* Footer */}
      <Footer />
    </div>
  )
}
