'use client'

import { motion } from 'framer-motion'
import Footer from '@/components/layout/Footer'
import { Leaf, ChefHat, Wheat } from 'lucide-react'
import ReviewSchema from '@/components/ui/ReviewSchema'
import BreadcrumbSchema from '@/components/ui/BreadcrumbSchema'
import { RestaurantSectionHeading, RestaurantSubsectionHeading } from '@/components/ui/SmartHeadings'
import ActionButton from '@/components/ui/ActionButton'
import { openZenchefWidget } from '@/utils/zenchef'
import { spotlightReviews } from '@/data/reviews'

// Page-specific metadata for Over ons is now handled in de root layout.tsx

export default function OverOnsPage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://www.bistro-bert.be' },
    { name: 'Over Ons', url: 'https://www.bistro-bert.be/over-ons' },
  ]

  const handleReserveClick = () => {
    const widgetOpened = openZenchefWidget()
    if (!widgetOpened) {
      // Don't navigate away - just log the error and let user try again
      console.warn('Zenchef widget niet beschikbaar. Gelieve later opnieuw te proberen.')
      // Optional: You could show a toast message here instead of navigating away
    }
  }

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <ReviewSchema reviews={spotlightReviews} />

      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <section className="min-h-screen bg-white navbar-spacer py-40">
          <div className="container-dh">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto"
              >
                {/* Page Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-16"
                >
                  <RestaurantSectionHeading className="text-center mb-8">
                    Ons verhaal
                  </RestaurantSectionHeading>
                  <p className="typography-body-large text-gray-600 max-w-3xl mx-auto">
                    In onze keuken combineren wij traditie met moderne technieken. Met passie voor verse, seizoensgebonden ingrediënten.
                  </p>
                </motion.div>

                {/* Culinary Philosophy Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-24"
                >
                  <RestaurantSectionHeading className="text-black mb-8 text-center">
                    Onze Keukenfilosofie
                  </RestaurantSectionHeading>
                  <div className="w-32 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto" />
                </motion.div>

                {/* Three Column Approach */}
                <div className="grid md:grid-cols-3 gap-12 mb-24">
                  {/* Seasonal Ingredients */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Leaf className="w-8 h-8 text-gray-600" />
                    </div>
                    <RestaurantSubsectionHeading className="text-black mb-4 text-center">
                      Puur
                    </RestaurantSubsectionHeading>
                    <p className="typography-body text-gray-600">
                      Respect voor het product en de pure smaak. Dat is de essentie van onze keuken.
                    </p>
                  </motion.div>

                  {/* Classic & Gastronomic */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ChefHat className="w-8 h-8 text-gray-600" />
                    </div>
                    <RestaurantSubsectionHeading className="text-black mb-4 text-center">
                      Ambacht
                    </RestaurantSubsectionHeading>
                    <p className="typography-body text-gray-600">
                      Klassieke technieken, moderne verfijning. We koken met geduld, precisie en passie.
                    </p>
                  </motion.div>

                  {/* Flexible Approach */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Wheat className="w-8 h-8 text-gray-600" />
                    </div>
                    <RestaurantSubsectionHeading className="text-black mb-4 text-center">
                      Flexibel
                    </RestaurantSubsectionHeading>
                    <p className="typography-body text-gray-600">
                      Een vlotte zakenlunch of een avondvullend diner? Uw wens staat centraal.
                    </p>
                  </motion.div>
                </div>



                {/* Service-notitie */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="text-center mb-8"
                >
                  <p className="typography-body text-gray-600 max-w-2xl mx-auto">
                    Discrete, attente bediening. Wijnsuggesties op maat. Transparante allergeneninformatie.
                  </p>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="text-center border-t border-gray-200 pt-8"
                >
                   <div className="flex flex-col sm:flex-row button-tight-spacing justify-center">
                      <ActionButton
                        href="/menu"
                        variant="menu"
                      >
                        Bekijk de menukaart
                      </ActionButton>
                      <ActionButton
                        onClick={handleReserveClick}
                        variant="reserve"
                        ariaLabel="Open reserveringswidget"
                        dataZcAction="open"
                      >
                        Reserveer een tafel
                      </ActionButton>
                    </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  )
}
