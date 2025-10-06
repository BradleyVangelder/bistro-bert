'use client'

import { motion } from 'framer-motion'
import Footer from '@/components/layout/Footer'
import ReviewSchema from '@/components/ui/ReviewSchema'
import BreadcrumbSchema from '@/components/ui/BreadcrumbSchema'
import { MenuJsonLd } from '@/components/ui/MenuJsonLd'
import PDFPerformanceMonitor from '@/components/performance/PDFPerformanceMonitor'
import nextDynamic from 'next/dynamic'

const MinimalistPDFViewer = nextDynamic(() => import('@/components/MinimalistPDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white navbar-spacer py-20">
      <div className="container-dh">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="typography-h1 mb-6 md:mb-8">Onze Menukaart</h1>
            <p className="typography-body-large text-gray-600 max-w-3xl mx-auto">
              Welkom bij onze menukaart waar elk gerecht een verhaal vertelt van Belgische culinaire erfenis, lokale terroir, en meesterlijke vakmanschap. Onze kaart is een levend document dat evolueert met de seizoenen van de Antwerpse Kempen, waarbij we de rijke tradities van de Belgische keuken eren met eigentijdse creativiteit en technische precisie. Hier vindt u vertrouwde klassiekers die met respect en innovatie worden benaderd, naast verrassende seizoensgebonden creaties die de veelzijdigheid van onze lokale ingrediënten vieren. Of u nu komt voor een snelle zakenlunch, een ontspannen middagmaal, of een uitgebreid diner, onze menukaart biedt opties die elke gelegenheid verheffen tot een culinaire ervaring. Elke schotel is het resultaat van urenlange voorbereiding, zorgvuldige ingrediëntselectie, en een diep begrip van de smaken en technieken die de Belgische keuken wereldberoemd hebben gemaakt.
            </p>
          </div>
          <div className="mb-20">
            <div className="text-center py-20">
              <p>Menukaart wordt geladen…</p>
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
    { name: 'Menu', url: 'https://bistrobert.be/menu' },
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
                  Onze Menukaart
                </motion.h1>
                <motion.p
                  className="typography-body-large text-gray-600 max-w-3xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Welkom bij onze menukaart waar elk gerecht een verhaal vertelt van Belgische culinaire erfenis, lokale terroir, en meesterlijke vakmanschap. Onze kaart is een levend document dat evolueert met de seizoenen van de Antwerpse Kempen, waarbij we de rijke tradities van de Belgische keuken eren met eigentijdse creativiteit en technische precisie. Hier vindt u vertrouwde klassiekers die met respect en innovatie worden benaderd, naast verrassende seizoensgebonden creaties die de veelzijdigheid van onze lokale ingrediënten vieren. Of u nu komt voor een snelle zakenlunch, een ontspannen middagmaal, of een uitgebreid diner, onze menukaart biedt opties die elke gelegenheid verheffen tot een culinaire ervaring. Elke schotel is het resultaat van urenlange voorbereiding, zorgvuldige ingrediëntselectie, en een diep begrip van de smaken en technieken die de Belgische keuken wereldberoemd hebben gemaakt.
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
        </main>
      </div>
      
      {/* Performance Monitor - Only visible in development */}
      <PDFPerformanceMonitor />
    </>
  )
}