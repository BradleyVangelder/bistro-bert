'use client'

import { useState } from 'react'
import Footer from '@/components/layout/Footer'
import ImageGallery from '@/components/ImageGallery'
import { galleryImages } from '@/data/images'
import BreadcrumbSchema from '@/components/ui/BreadcrumbSchema'
import { LoadingState, ImageSkeleton } from '@/components/ui/LoadingState'
import OptimizedImageNext from '@/components/ui/OptimizedImageNext'
import { FadeIn, SlideIn } from '@/components/ui/AccessibleMotion'
import {
  StaggeredContainer,
  StaggeredCard,
  ScrollTriggeredStagger,
  LuxuryStaggeredReveal
} from '@/components/ui/StaggeredAnimations'
import { motion } from 'framer-motion'
import {
  RestaurantHeroHeading,
  RestaurantSectionHeading,
  RestaurantSubsectionHeading
} from '@/components/ui/SmartHeadings'
import ActionButton from '@/components/ui/ActionButton'
import { openZenchefWidget, fallbackToContactPage } from '@/utils/zenchef'

// Force dynamic rendering to avoid SSR issues with browser APIs
export const dynamic = 'force-dynamic'

export default function Home() {
  const [imagesLoaded, setImagesLoaded] = useState({
    hero: false,
    chef: false,
    dining: false,
    ambiance: false
  })

  const handleReserveClick = () => {
    const widgetOpened = openZenchefWidget()
    if (!widgetOpened) {
      // Don't navigate away - just log the error and let user try again
      console.warn('Zenchef widget niet beschikbaar. Gelieve later opnieuw te proberen.')
      // Optional: You could show a toast message here instead of navigating away
    }
  }




  
  const breadcrumbItems = [
    { name: 'Home', url: 'https://www.bistro-bert.be' },
  ]

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      
      <div className="min-h-screen bg-white">
        {/* Hero Section - Completely static */}
        <div className="relative w-full overflow-hidden hero-section" style={{ height: '100vh' }}>
          <section
            className="relative h-full w-full"
            role="banner"
          >
            {/* Full-screen static background image */}
            <div className="absolute inset-0 m-0 p-0">
              {!imagesLoaded.hero && (
                <div className="absolute inset-0 z-20">
                  <ImageSkeleton
                    className="w-full h-full"
                    aspectRatio="aspect-video"
                  />
                </div>
              )}
              <OptimizedImageNext
                src="/images/hero/hero.jpeg"
                alt="Bistro Bert - Seizoenskeuken in Laakdal"
                fill
                sizes="100vw"
                className="object-cover object-center brightness-65 opacity-100"
                style={{ objectPosition: 'center' }}
                priority
                quality={85}
                placeholder="empty"
                onLoad={() => setImagesLoaded(prev => ({ ...prev, hero: true }))}
              />
              <div className="absolute inset-0 m-0 p-0 bg-gradient-to-b from-black/60 via-black/45 to-black/30" aria-hidden="true" />
            </div>

            {/* Hero content with staggered animations */}
            <div className="relative z-10 h-full flex flex-col justify-end items-start px-4 sm:px-8 md:px-16 lg:px-24 pb-8 md:pb-12 hero-content">
              <div className="max-w-4xl px-4 sm:px-0">
                <ScrollTriggeredStagger
                  staggerDelay={300}
                  direction="up"
                  initialDelay={500}
                  className="space-y-6"
                >
                  {/* Restaurant name with tagline */}
                  <div>
                    <FadeIn delay={0.5} duration={1.2} direction="up">
                      <RestaurantHeroHeading className="text-white drop-shadow-lg mb-4 max-w-xs md:max-w-none">
                        Bistro Bert — Seizoensgebonden keuken in Laakdal
                      </RestaurantHeroHeading>
                    </FadeIn>
                  </div>
                  
                  <div>
                    <FadeIn delay={0.8} duration={1} direction="up">
                      <p className="typography-body text-white/95 drop-shadow-lg mb-6 max-w-xs md:max-w-2xl">
                        Seizoensgebonden klassiekers met karakter. Dagvers en met zorg bereid, hier in Laakdal.
                      </p>
                    </FadeIn>
                  </div>

                   {/* CTA button with staggered reveal */}
                   <div>
                     <FadeIn delay={1.1} duration={0.8} direction="up">
                       <ActionButton
                         href="/menu"
                         variant="hero-menu"
                         className="mt-4 mb-8"
                         ariaLabel="Navigeer naar onze menukaart"
                       >
                         Bekijk de menukaart
                       </ActionButton>
                     </FadeIn>
                   </div>
                </ScrollTriggeredStagger>
              </div>
            </div>
          </section>
        </div>

        {/* Menu Section - Ultra-refined */}
        <section id="menu" className="relative bg-white py-12 md:py-16 lg:py-24">
          <div className="container-dh">
            <div className="max-w-4xl mx-auto px-4 md:px-0 text-center">
              <ScrollTriggeredStagger
                staggerDelay={250}
                direction="up"
                className="space-y-6"
                threshold={0.2}
              >
                <div>
                  <FadeIn delay={0.2} duration={1} direction="up">
                    <RestaurantSectionHeading className="text-black max-w-3xl mx-auto mb-6">
                      Verfijnde seizoenskeuken — Lunch & Diner
                    </RestaurantSectionHeading>
                  </FadeIn>
                </div>

                <div>
                  <FadeIn delay={0.5} duration={0.8} direction="up">
                    <p className="typography-body-large text-gray-600 max-w-2xl mx-auto">
                      Klassiekers met een lichte toets: seizoensgebonden, dagvers en precies bereid.
                    </p>
                  </FadeIn>
                </div>

                 <div>
                   <FadeIn delay={0.8} duration={0.6} direction="up">
                     <ActionButton
                       href="/menu"
                       variant="menu"
                       className="mt-6"
                     >
                       Bekijk de menukaart
                     </ActionButton>
                   </FadeIn>
                 </div>
              </ScrollTriggeredStagger>
            </div>
          </div>
        </section>

        {/* Unique Selling Points */}
        <section className="min-h-screen bg-gray-50 py-16 md:py-20 lg:py-40 relative overflow-hidden">
          {/* Italian marble background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                linear-gradient(45deg, #f8f6f3 25%, transparent 25%),
                linear-gradient(-45deg, #f8f6f3 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #f8f6f3 75%),
                linear-gradient(-45deg, transparent 75%, #f8f6f3 75%),
                linear-gradient(135deg, #faf9f7 0%, #f5f2ed 50%, #f9f7f4 100%),
                radial-gradient(ellipse at 20% 30%, rgba(245, 242, 237, 0.3) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 70%, rgba(250, 249, 247, 0.2) 0%, transparent 50%),
                radial-gradient(ellipse at 40% 80%, rgba(249, 247, 244, 0.15) 0%, transparent 40%)
              `,
              backgroundSize: '40px 40px, 40px 40px, 20px 20px, 20px 20px, 100% 100%, 100% 100%, 100% 100%, 100% 100%',
              backgroundPosition: '0 0, 0 20px, 20px 0, 0 0, 0 0, 0 0, 0 0, 0 0',
              opacity: 0.15
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse at 25% 25%, rgba(245, 242, 237, 0.2) 0%, transparent 40%),
                radial-gradient(ellipse at 75% 75%, rgba(250, 249, 247, 0.15) 0%, transparent 35%),
                radial-gradient(ellipse at 50% 10%, rgba(249, 247, 244, 0.1) 0%, transparent 30%),
                radial-gradient(ellipse at 10% 60%, rgba(248, 246, 243, 0.12) 0%, transparent 45%),
                radial-gradient(ellipse at 90% 40%, rgba(246, 244, 241, 0.08) 0%, transparent 40%)
              `,
              backgroundSize: '100% 100%',
              opacity: 0.3
            }}
          />
          <div className="container-dh relative z-10">
            <div className="max-w-6xl mx-auto px-4 md:px-0">
              <div className="text-center mb-8 md:mb-12">
                <FadeIn delay={0.2} duration={1} direction="up">
                  <RestaurantSectionHeading className="text-black mb-6 md:mb-8 text-center">
                    Wat je mag verwachten
                  </RestaurantSectionHeading>
                </FadeIn>
              </div>

              <div className="max-w-4xl mx-auto">
                <StaggeredContainer
                  staggerDelay={200}
                  direction="up"
                  initialDelay={300}
                  className="space-y-4 md:space-y-12"
                  triggerOnScroll={true}
                  scrollOffset={150}
                >
                  {/* Section 1: Onze keuken */}
                  <StaggeredCard className="text-center p-2 md:p-0" whileHover={{}} whileTap={{}}>
                    <FadeIn delay={0.1} duration={0.8} direction="up">
                      <RestaurantSubsectionHeading className="text-black mb-3 md:mb-4 font-medium text-center">
                        Onze keuken
                      </RestaurantSubsectionHeading>
                    </FadeIn>
                    <FadeIn delay={0.3} duration={0.8} direction="up">
                      <p className="typography-body-large text-gray-600 max-w-lg md:max-w-3xl mx-auto">
                        Belgische klassiekers, helder en smaakvol. Traditie ontmoet verfijning.
                      </p>
                    </FadeIn>
                  </StaggeredCard>

                  {/* Section 2: Seizoensgebonden */}
                  <StaggeredCard className="text-center p-2 md:p-0" whileHover={{}} whileTap={{}}>
                    <FadeIn delay={0.1} duration={0.8} direction="up">
                      <RestaurantSubsectionHeading className="text-black mb-3 md:mb-4 font-medium text-center">
                        Seizoensgebonden
                      </RestaurantSubsectionHeading>
                    </FadeIn>
                    <FadeIn delay={0.3} duration={0.8} direction="up">
                      <p className="typography-body-large text-gray-600 max-w-lg md:max-w-3xl mx-auto">
                        We volgen het ritme van de seizoenen — piekproducten op hun best.
                      </p>
                    </FadeIn>
                  </StaggeredCard>

                  {/* Section 3: Sfeer */}
                  <StaggeredCard className="text-center p-2 md:p-0" whileHover={{}} whileTap={{}}>
                    <FadeIn delay={0.1} duration={0.8} direction="up">
                      <RestaurantSubsectionHeading className="text-black mb-3 md:mb-4 font-medium text-center">
                        Sfeer
                      </RestaurantSubsectionHeading>
                    </FadeIn>
                    <FadeIn delay={0.3} duration={0.8} direction="up">
                      <p className="typography-body-large text-gray-600 max-w-lg md:max-w-3xl mx-auto">
                        Intiem en warm — zachte verlichting, natuurlijke materialen, rustige elegantie.
                      </p>
                    </FadeIn>
                  </StaggeredCard>

                  {/* Section 4: Service */}
                  <StaggeredCard className="text-center p-2 md:p-0" whileHover={{}} whileTap={{}}>
                    <FadeIn delay={0.1} duration={0.8} direction="up">
                      <RestaurantSubsectionHeading className="text-black mb-3 md:mb-4 font-medium text-center">
                        Service
                      </RestaurantSubsectionHeading>
                    </FadeIn>
                    <FadeIn delay={0.3} duration={0.8} direction="up">
                      <p className="typography-body-large text-gray-600 max-w-lg md:max-w-3xl mx-auto">
                        Attent en ontspannen — doordachte wijnsuggesties en oog voor detail.
                      </p>
                    </FadeIn>
                  </StaggeredCard>
                </StaggeredContainer>
              </div>
            </div>
          </div>
        </section>

  
        {/* Smaakvolle Verhalen Onvergetelijke Momenten Section - Hidden for now */}
        {/* <section className="min-h-[80vh] bg-white py-16 md:py-32">
          <div className="container-dh">
            <div className="max-w-7xl mx-auto px-4 md:px-0">
              <div className="text-center mb-16 md:mb-24">
                <ScrollTriggeredStagger
                  staggerDelay={300}
                  direction="up"
                  className="space-y-6"
                  threshold={0.2}
                >
                  <div>
                    <FadeIn delay={0.2} duration={1.2} direction="up">
                      <RestaurantSectionHeading className="text-black mb-6 md:mb-8 text-center">
                        Smaakvolle Verhalen — Onvergetelijke Momenten
                      </RestaurantSectionHeading>
                    </FadeIn>
                  </div>

                  <div>
                    <FadeIn delay={0.5} duration={1} direction="up">
                      <p className="typography-body text-gray-600 max-w-lg md:max-w-2xl mx-auto">
                        Een blik binnen: de keuken in actie, afwerking aan de pass en de avondlijke sfeer.
                      </p>
                    </FadeIn>
                  </div>

                  <div>
                    <FadeIn delay={0.8} duration={0.8} direction="up">
                      <div className="w-32 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-8 md:mb-12" />
                    </FadeIn>
                  </div>
                </ScrollTriggeredStagger>
              </div>

              <div className="mobile-gallery">
                <FadeIn delay={0.4} duration={1.2} direction="up">
                  <ImageGallery
                    images={galleryImages.slice(0, 8)}
                    className="w-full"
                    enableLightbox={true}
                  />
                </FadeIn>
              </div>
            </div>
          </div>
        </section> */}

        {/* Call to Action Section */}
        <section className="py-16 md:py-32 bg-black text-white">
          <div className="container-dh">
            <div className="max-w-4xl mx-auto text-center px-4 md:px-0">
              <ScrollTriggeredStagger
                staggerDelay={250}
                direction="up"
                className="space-y-8"
                threshold={0.3}
              >
                <div>
                  <FadeIn delay={0.2} duration={1} direction="up">
                    <RestaurantSectionHeading className="text-white leading-[0.9] mb-6 md:mb-8 text-center">
                        Reserveer een tafel
                    </RestaurantSectionHeading>
                  </FadeIn>
                </div>
                
                <div>
                  <FadeIn delay={0.5} duration={0.8} direction="up">
                    <p className="typography-body-large text-white/90 mb-8 md:mb-12 max-w-lg md:max-w-2xl mx-auto">
                      Lunch, zakenlunch of diner in Laakdal. Meld allergieën of timing—wij passen ons aan.
                    </p>
                  </FadeIn>
                </div>
                
                 <div>
                   <FadeIn delay={0.8} duration={0.6} direction="up">
                     <ActionButton
                       onClick={handleReserveClick}
                       variant="cta"
                       ariaLabel="Open reserveringswidget"
                       dataZcAction="open"
                     >
                       Reserveer een tafel
                     </ActionButton>
                   </FadeIn>
                 </div>
              </ScrollTriggeredStagger>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  )
}
