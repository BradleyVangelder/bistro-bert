'use client'

import { motion } from 'framer-motion'
import Footer from '@/components/layout/Footer'
import ReviewSchema from '@/components/ui/ReviewSchema'
import BreadcrumbSchema from '@/components/ui/BreadcrumbSchema'
import { MenuJsonLd } from '@/components/ui/MenuJsonLd'
import MinimalistPDFViewer from '@/components/MinimalistPDFViewer'
import { RestaurantSectionHeading } from '@/components/ui/SmartHeadings'

// Force dynamic rendering for this page to avoid SSR issues with PDF viewer
export const dynamic = 'force-dynamic'

// Page-specific metadata for Menu is now handled in the root layout.tsx

// Sample reviews for structured data
const sampleReviews = [
  {
    author: 'Jan Janssens',
    rating: 5,
    date: '2024-03-15',
    content: 'Uitzonderlijke culinaire ervaring bij Bistro Bert. De aandacht voor detail en de kwaliteit van de ingrediënten is ongeëvenaard.'
  },
  {
    author: 'Marie Pieters',
    rating: 5,
    date: '2024-02-28',
    content: 'Het menu van Bistro Bert is een feest voor de smaakpapillen. Seizoensgebonden en perfect bereid.'
  }
]

export default function MenuPage() {

  const breadcrumbItems = [
    { name: 'Home', url: 'https://www.bistro-bert.be' },
    { name: 'Menukaart', url: 'https://www.bistro-bert.be/menu' },
  ]

  return (
    <>
      <MenuJsonLd />
      <BreadcrumbSchema items={breadcrumbItems} />
      <ReviewSchema reviews={sampleReviews} />
      
      <div className="min-h-screen bg-white">

        {/* Content-First Menu Section - Streamlined */}
        <section className="min-h-screen bg-white navbar-spacer pt-6 pb-8 md:py-20">
          <div className="container-dh">
            <div className="max-w-4xl mx-auto">
              {/* Essential Title Only */}
              <div className="text-center mb-8 md:mb-16">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <RestaurantSectionHeading className="text-center">
                    Onze menukaart
                  </RestaurantSectionHeading>
                </motion.div>
                <motion.p
                  className="typography-body-large text-gray-600 max-w-3xl mx-auto mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Seizoensgebonden, dagvers en precies bereid—dagsuggesties naast onze klassiekers.
                </motion.p>
              </div>

              {/* Menu Display - The Hero */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-8 md:mb-16"
              >

                {/* PDF Viewer - Main Feature */}
                <div className="mb-8 md:mb-20">
                  <MinimalistPDFViewer pdfUrl="/menu.pdf" />
                </div>


  
                {/* Reservation CTA - Luxury divider styling */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="text-center pt-6 md:pt-12 border-t border-gray-200"
                >
                  <p className="typography-body text-gray-600 mb-6">
                    Klaar voor lunch of diner?
                  </p>
                  <div className="flex flex-col sm:flex-row button-tight-spacing justify-center">
                    <a
                      href="/contact"
                      className="btn-dh-minimal"
                    >
                      Reserveer een tafel
                    </a>
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
