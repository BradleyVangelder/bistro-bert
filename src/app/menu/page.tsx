'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Footer from '@/components/layout/Footer'
import ReviewSchema from '@/components/ui/ReviewSchema'
import BreadcrumbSchema from '@/components/ui/BreadcrumbSchema'
import { MenuJsonLd } from '@/components/ui/MenuJsonLd'
import MinimalistPDFViewer from '@/components/MinimalistPDFViewer'
import { RestaurantSectionHeading, RestaurantSubsectionHeading } from '@/components/ui/SmartHeadings'
import MenuDessertSelector from '@/components/menu/MenuDessertSelector'
import ActionButton from '@/components/ui/ActionButton'
import { openZenchefWidget } from '@/utils/zenchef'
import { visibleMenuSections } from '@/data/menu'
import { spotlightReviews } from '@/data/reviews'

// Force dynamic rendering for this page to avoid SSR issues with PDF viewer
export const dynamic = 'force-dynamic'

// Page-specific metadata for Menu is now handled in the root layout.tsx

export default function MenuPage() {
  const [menuType, setMenuType] = useState<'menu' | 'dessert'>('menu')

  const sectionsToDisplay = useMemo(() => {
    if (menuType === 'dessert') {
      return []
    }

    return visibleMenuSections.filter(section => section.id !== 'desserts')
  }, [menuType])

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
      <ReviewSchema reviews={spotlightReviews} />
      
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

              {/* Menu Type Selector */}
              <MenuDessertSelector
                selectedType={menuType}
                onTypeChange={setMenuType}
              />

              {/* Text-first menu content for crawlers and guests */}
              {sectionsToDisplay.length > 0 && (
                <div className="mb-12 md:mb-16">
                  <motion.div
                    key={`${menuType}-sections`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-10"
                  >
                    {sectionsToDisplay.map(section => (
                      <article key={section.id} className="text-left">
                        <RestaurantSubsectionHeading className="text-left text-black">
                          {section.name}
                        </RestaurantSubsectionHeading>
                        {section.description && (
                          <p className="typography-body text-gray-600 mb-4">
                            {section.description}
                          </p>
                        )}
                        <ul className="space-y-4">
                          {section.items.map(item => (
                            <li key={item.name} className="border border-gray-100 rounded-lg p-4">
                              <h4 className="font-serif text-lg text-black">
                                {item.name}
                              </h4>
                              {item.description && (
                                <p className="typography-body text-gray-600 mt-2">
                                  {item.description}
                                </p>
                              )}
                              {item.dietary && (
                                <p className="typography-small text-gray-500 mt-3">
                                  Dieetopties: {item.dietary.join(', ')}
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </motion.div>
                </div>
              )}

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
                    <MinimalistPDFViewer key={`${menuType}-pdf`} pdfUrl={getPdfUrl()} />
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
