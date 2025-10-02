'use client'

import { motion } from 'framer-motion'
import Footer from '@/components/layout/Footer'
import ReviewSchema from '@/components/ui/ReviewSchema'
import BreadcrumbSchema from '@/components/ui/BreadcrumbSchema'
import MinimalistPDFViewer from '@/components/MinimalistPDFViewer'

// Force dynamic rendering for this page to avoid SSR issues with PDF viewer
export const dynamic = 'force-dynamic'

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
    { name: 'Home', url: 'https://bistrobert.be' },
    { name: 'Menu', url: 'https://bistrobert.be/menu' },
  ]

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <ReviewSchema reviews={sampleReviews} />
      
      <div className="min-h-screen bg-white">

        {/* Content-First Menu Section - Streamlined */}
        <section className="min-h-screen bg-white navbar-spacer py-20">
          <div className="container-dh">
            <div className="max-w-4xl mx-auto">
              {/* Essential Title Only */}
              <div className="text-center mb-16">
                <motion.h1
                  className="typography-h1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  Onze Menukaart
                </motion.h1>
                <motion.p
                  className="typography-body-large text-gray-600 max-w-3xl mx-auto mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Dagvers, seizoensgebonden en precies bereid—met dagsuggesties naast onze klassiekers. Perfect voor lunch, zakenlunch of diner.
                </motion.p>
              </div>

              {/* Menu Display - The Hero */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-16"
              >

                {/* PDF Viewer - Main Feature */}
                <div className="mb-20">
                  <MinimalistPDFViewer pdfUrl="/menu.pdf" />
                </div>

  
                {/* Reservation CTA - Luxury divider styling */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="text-center pt-12 border-t border-gray-200"
                >
                  <p className="typography-body text-gray-600 mb-6">
                    Klaar voor lunch of diner?
                  </p>
                  <a
                    href="/contact"
                    className="btn-dh-minimal"
                  >
                    Reserveer voor lunch of zakenlunch
                  </a>
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
