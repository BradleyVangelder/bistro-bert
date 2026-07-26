'use client'

import { useMemo, useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Footer from '@/components/layout/Footer'
import ReviewSchema from '@/components/ui/ReviewSchema'
import BreadcrumbSchema from '@/components/ui/BreadcrumbSchema'
import { MenuJsonLd } from '@/components/ui/MenuJsonLd'

import { RestaurantSectionHeading, RestaurantSubsectionHeading } from '@/components/ui/SmartHeadings'
import MenuDessertSelector from '@/components/menu/MenuDessertSelector'
import ResponsiveMenuViewer, { type MenuImagePage } from '@/components/menu/ResponsiveMenuViewer'
import ActionButton from '@/components/ui/ActionButton'
import { useReservation } from '@/contexts/ReservationContext'
import { spotlightReviews } from '@/data/reviews'

// Force dynamic rendering for this page to avoid SSR issues with PDF viewer
export const dynamic = 'force-dynamic'

// Page-specific metadata for Menu is now handled in the root layout.tsx

const MENU_IMAGE_PAGES: Record<'suggestions' | 'menu' | 'dessert' | 'wine', MenuImagePage[]> = {
  suggestions: [
    {
      src: '/menu-pages/suggesties.png',
      alt: 'Suggesties van Bistro Bert',
      width: 1241,
      height: 1754
    }
  ],
  menu: [
    {
      src: '/menu-pages/lunch-diner.png',
      alt: 'Lunch en diner: pasta, salades, voor-, hoofd- en kleine gerechten',
      width: 1241,
      height: 2263
    }
  ],
  dessert: [
    {
      src: '/menu-pages/desserts.png',
      alt: 'Dessertenkaart van Bistro Bert',
      width: 1241,
      height: 1755
    }
  ],
  wine: Array.from({ length: 10 }, (_, index) => ({
    src: `/menu-pages/wijn-${String(index + 1).padStart(2, '0')}.png`,
    alt: `Wijnkaart van Bistro Bert, pagina ${index + 1} van 10`,
    width: 1240,
    height: 1754
  }))
}

// Component that uses useSearchParams wrapped in Suspense
function MenuContent() {
  const { open } = useReservation()
  const searchParams = useSearchParams()
  const [menuType, setMenuType] = useState<'suggestions' | 'menu' | 'dessert' | 'wine' | 'valentine'>('suggestions')

  // Handle URL parameter for auto-selecting tabs
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'suggestions' || tab === 'menu') {
      setMenuType(tab)
    } else if (tab === 'dessert') {
      setMenuType('dessert')
    } else if (tab === 'wine') {
      setMenuType('wine')
    } else if (tab === 'valentine') {
      const now = new Date()
      // Set to end of February 15th (23:59:59) in local time
      const valentineEndDate = new Date(2026, 1, 15, 23, 59, 59)
      if (now <= valentineEndDate) {
        setMenuType('valentine')
      }
    }
  }, [searchParams])

  const sectionsToDisplay = useMemo(() => {
    return []
  }, [menuType])

  const breadcrumbItems = [
    { name: 'Home', url: 'https://www.bistro-bert.be' },
    { name: 'Menukaart', url: 'https://www.bistro-bert.be/menu' },
  ]

  const handleReserveClick = () => {
    open()
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
                    {sectionsToDisplay.map((section: { id: string; name: string; description?: string; items: Array<{ name: string; price?: string; description?: string; dietary?: string[] }> }) => (
                      <article key={section.id} className="text-center max-w-2xl mx-auto">
                        <RestaurantSubsectionHeading className="text-center text-black">
                          {section.name}
                        </RestaurantSubsectionHeading>
                        {section.description && (
                          <p className="typography-body text-gray-600 mb-4">
                            {section.description}
                          </p>
                        )}
                        <ul className="space-y-4">
                          {section.items.map((item: { name: string; price?: string; description?: string; dietary?: string[] }) => (
                            <li key={item.name} className="border-none rounded-lg p-4 flex flex-col items-center bg-gray-50/50 shadow-sm">
                              <h4 className="font-serif text-lg text-black">
                                {item.name}
                              </h4>
                              {item.price && (
                                <p className="font-serif text-burgundy mt-1 text-lg">€{item.price}</p>
                              )}
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



                {/* Responsive menu viewer */}
                {(menuType === 'suggestions' || menuType === 'menu' || menuType === 'dessert' || menuType === 'wine') && (
                  <div key={menuType} className="mb-8 md:mb-20">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <ResponsiveMenuViewer
                        key={`${menuType}-viewer`}
                        pages={MENU_IMAGE_PAGES[menuType]}
                      />
                    </motion.div>
                  </div>
                )}

                {/* Image Display for Valentine Menu */}
                {menuType === 'valentine' && (
                  <div className="mb-8 md:mb-20 flex justify-center">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6 }}
                      className="max-w-lg w-full"
                    >
                      <img
                        src="/valentijns-menu.jpg"
                        alt="Valentijnsmenu 2025 - Carpaccio coquille, Griet of Entrecote, Javanais voor 59 euro"
                        className="w-full h-auto rounded-lg shadow-lg"
                      />
                    </motion.div>
                  </div>
                )}



                {/* Reservation CTA - Luxury divider styling */}
                <motion.div
                  key={`${menuType}-cta`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="text-center pt-6 md:pt-12 border-t border-gray-200"
                >
                  <p className="typography-body text-gray-600 mb-6">
                    {menuType === 'suggestions'
                      ? 'Zin om een van onze suggesties te proeven?'
                      : menuType === 'menu'
                        ? 'Klaar voor lunch of diner?'
                        : menuType === 'wine'
                          ? 'Ontdek onze wijnselectie bij uw maaltijd'
                          : menuType === 'valentine'
                            ? 'Vier de liefde bij Bistro Bert'
                            : 'Klaar voor een zoete afsluiting?'
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row button-tight-spacing justify-center">
                    <ActionButton
                      onClick={handleReserveClick}
                      variant="reserve"
                      ariaLabel={menuType === 'valentine' ? 'Reserveer voor Valentijn' : 'Open reserveringswidget'}
                      dataZcAction="open"
                    >
                      {menuType === 'valentine' ? 'Reserveer voor Valentijn' : 'Reserveer een tafel'}
                    </ActionButton>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div >
        </section >

        {/* Footer */}
        < Footer />
      </div >
    </>
  )
}

// Main page component with Suspense boundary
export default function MenuPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy mx-auto mb-4"></div>
          <p className="text-gray-600">Menu laden...</p>
        </div>
      </div>
    }>
      <MenuContent />
    </Suspense>
  )
}
