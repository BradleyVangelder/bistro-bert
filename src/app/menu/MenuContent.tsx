'use client'

import { motion } from 'framer-motion'
import Footer from '@/components/layout/Footer'
import ReviewSchema from '@/components/ui/ReviewSchema'
import BreadcrumbSchema from '@/components/ui/BreadcrumbSchema'
import { MenuJsonLd } from '@/components/ui/MenuJsonLd'
import PDFPerformanceMonitor from '@/components/performance/PDFPerformanceMonitor'
import ActionButton from '@/components/ui/ActionButton'
import nextDynamic from 'next/dynamic'

const MinimalistPDFViewer = nextDynamic(() => import('@/components/MinimalistPDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white navbar-spacer py-20">
      <div className="container-dh">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="typography-h1 mb-6 md:mb-8">Onze menukaart</h1>
            <p className="typography-body-large text-gray-600 max-w-3xl mx-auto">
              Seizoensgebonden, dagvers en precies bereid—dagsuggesties naast onze klassiekers.
            </p>
          </div>
          <div className="mb-20">
            <div className="text-center py-20">
              <p>Menukaart wordt geladen...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

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

export default function MenuContent() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://bistrobert.be' },
    { name: 'Menukaart', url: 'https://bistrobert.be/menu' },
  ]

  return (
    <>
      <MenuJsonLd />
      <BreadcrumbSchema items={breadcrumbItems} />
      <ReviewSchema reviews={sampleReviews} />
      
      <div className="min-h-screen bg-white">
        {/* Main Content */}
        <main id="main-content" role="main">
          {/* Content-First Menu Section - Streamlined */}
          <section className="min-h-screen bg-white navbar-spacer py-20">
          <div className="container-dh">
            <div className="max-w-4xl mx-auto">
              {/* Essential Title Only */}
              <div className="text-center mb-24">
                <motion.h1
                  className="typography-h1 mb-6 md:mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  Onze menukaart
                </motion.h1>
                <motion.p
                  className="typography-body-large text-gray-600 max-w-3xl mx-auto"
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
                  <div className="flex flex-col sm:flex-row button-tight-spacing justify-center">
                    <ActionButton
                      href="/contact"
                      variant="reserve"
                    >
                      Reserveer een tafel
                    </ActionButton>
                    <ActionButton
                      href="#wijn"
                      variant="menu"
                    >
                      Bekijk wijnen
                    </ActionButton>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

          {/* Footer */}
          <Footer />
        </main>
      </div>
      
      {/* Performance Monitor - Only visible in development */}
      <PDFPerformanceMonitor />
    </>
  )
}