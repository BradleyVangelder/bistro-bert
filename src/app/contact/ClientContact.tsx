"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import Footer from '@/components/layout/Footer'
import ContactInfo from '@/components/contact/ContactInfo'
import { RestaurantSectionHeading } from '@/components/ui/SmartHeadings'
import ActionButton from '@/components/ui/ActionButton'
import { openZenchefWidget } from '@/utils/zenchef'

export default function ClientContact() {
  const handleReserveClick = () => {
    const widgetOpened = openZenchefWidget()
    if (!widgetOpened) {
      // Don't navigate away - just log the error and let user try again
      console.warn('Zenchef widget niet beschikbaar. Gelieve later opnieuw te proberen.')
      // Optional: You could show a toast message here instead of navigating away
    }
  }
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

            {/* Alternative contact methods */}
            <motion.div
              className="mt-8 flex flex-col sm:flex-row button-tight-spacing justify-center max-w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
                <ActionButton
                  href="tel:+3213480139"
                  variant="menu"
                  ariaLabel="Bel Bistro Bert direct: +32 13 48 01 39"
                >
                  BEL: +32 13 48 01 39
                </ActionButton>
                <ActionButton
                  onClick={handleReserveClick}
                  variant="reserve"
                  ariaLabel="Open reserveringswidget"
                  dataZcAction="open"
                >
                  Reserveer een tafel
                </ActionButton>
            </motion.div>
            <motion.p
              className="mt-4 text-center text-gray-600 typography-body-small"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              We denken graag mee over allergenen, wijn en timing. Bekijk ook onze{' '}
              <Link href="/faq" className="link-dh-minimal">FAQ</Link> voor praktische antwoorden.
            </motion.p>
          </div>
        </div>
      </section>

  
      {/* Contact Information Section */}
      <motion.section
        className="section-dh"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
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
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2474.1798941469312!2d5.097027276030925!3d51.08434637172845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c153799b7c45a3%3A0x12f0ec6a55ce499a!2sVerboekt%20121%2C%202430%20Laakdal!5e0!3m2!1snl!2sbe!4v1730050000000!5m2!1snl!2sbe"
             className="w-full h-full"
             style={{ border: 0 }}
             allowFullScreen
             loading="lazy"
             referrerPolicy="no-referrer-when-downgrade"
             title="Bistro Bert locatie in Laakdal"
           />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      </motion.section>

  
      {/* Footer */}
      <Footer />
    </div>
  )
}
