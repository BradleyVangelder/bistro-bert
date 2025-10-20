'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Footer from '@/components/layout/Footer'
import ReviewSchema from '@/components/ui/ReviewSchema'
import BreadcrumbSchema from '@/components/ui/BreadcrumbSchema'
import { MenuJsonLd } from '@/components/ui/MenuJsonLd'
import MinimalistPDFViewer from '@/components/MinimalistPDFViewer'
import { RestaurantSectionHeading } from '@/components/ui/SmartHeadings'
import MenuDessertSelector from '@/components/menu/MenuDessertSelector'
import ActionButton from '@/components/ui/ActionButton'
import { openZenchefWidget } from '@/utils/zenchef'

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
  const [menuType, setMenuType] = useState<'menu' | 'dessert'>('menu')

  const breadcrumbItems = [
    { name: 'Home', url: 'https://www.bistro-bert.be' },
    { name: 'Menukaart', url: 'https://www.bistro-bert.be/menu' },
  ]

  const handleReserveClick = () => {
    const widgetOpened = openZenchefWidget()
    if (!widgetOpened) {
      // Don't navigate away - just log the error and let user try again
      console.warn('Zenchef widget niet beschikbaar. Gelieve later opnieuw te proberen.')
      // Optional: You could show a toast message here instead of navigating away
    }
  }

  const getPdfUrl = () => {
    return menuType === 'menu' ? '/menu.pdf' : '/files/dessert.pdf'
  }

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
              {/* Menu Type Selector */}
              <MenuDessertSelector
                selectedType={menuType}
                onTypeChange={setMenuType}
              />

              {/* Essential Title Only */}
              <div className="text-center mb-8 md:mb-16">
                <motion.div
                  key={menuType}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <RestaurantSectionHeading className="text-center">
                    {menuType === 'menu' ? 'Onze menukaart' : 'Onze desserts'}
                  </RestaurantSectionHeading>
                </motion.div>
                <motion.p
                  key={`${menuType}-description`}
                  className="typography-body-large text-gray-600 max-w-3xl mx-auto mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {menuType === 'menu'
                    ? 'Seizoensgebonden, dagvers en precies bereid—dagsuggesties naast onze klassiekers.'
                    : 'Ambachtelijk bereide desserts, perfect als zoete afsluiting van uw culinaire ervaring.'
                  }
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
                <div key={menuType} className="mb-8 md:mb-20">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <MinimalistPDFViewer pdfUrl={getPdfUrl()} />
                  </motion.div>
                </div>


  
                {/* Reservation CTA - Luxury divider styling */}
                <motion.div
                  key={`${menuType}-cta`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="text-center pt-6 md:pt-12 border-t border-gray-200"
                >
                  <p className="typography-body text-gray-600 mb-6">
                    {menuType === 'menu'
                      ? 'Klaar voor lunch of diner?'
                      : 'Klaar voor een zoete afsluiting?'
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row button-tight-spacing justify-center">
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
