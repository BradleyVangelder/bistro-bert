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

// Force dynamic rendering to avoid SSR issues with browser APIs
export const dynamic = 'force-dynamic'

export default function Home() {
  const [imagesLoaded, setImagesLoaded] = useState({
    hero: false,
    chef: false,
    dining: false,
    ambiance: false
  })




  
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
                src="/images/restaurant/hero-moody-wine-bar.jpg"
                alt="Elegant moody wine bar interior with warm lighting"
                fill
                sizes="100vw"
                className="object-cover object-center brightness-65 opacity-100"
                style={{ objectPosition: 'center' }}
                priority
                quality={85}
                placeholder="empty"
                onLoad={() => setImagesLoaded(prev => ({ ...prev, hero: true }))}
              />
              <div className="absolute inset-0 m-0 p-0 bg-gradient-to-b from-black/90 via-black/75 to-black/50" aria-hidden="true" />
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
                        Bistro Bert — Seizoenskeuken in Laakdal
                      </RestaurantHeroHeading>
                    </FadeIn>
                  </div>
                  
                  <div>
                    <FadeIn delay={0.8} duration={1} direction="up">
                      <p className="typography-body text-white/95 drop-shadow-lg mb-6 max-w-xs md:max-w-2xl">
                        Seizoenskeuken met karakter — dagvers en zorgvuldig bereid in het hart van de Antwerpse Kempen.
                      </p>
                    </FadeIn>
                  </div>

                   {/* CTA buttons with staggered reveal */}
                   <div>
                     <FadeIn delay={1.1} duration={0.8} direction="up">
                       <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                          <ActionButton
                            href="/contact"
                            variant="hero-reserve"
                            className="mt-4"
                            ariaLabel="Reserveer een tafel bij Bistro Bert"
                          >
                            Reserveer een tafel
                          </ActionButton>
                          <ActionButton
                            href="/menu"
                            variant="hero-menu"
                            className="mt-4"
                            ariaLabel="Navigeer naar onze menukaart"
                          >
                            Bekijk de menukaart
                          </ActionButton>
                       </div>
                     </FadeIn>
                   </div>
                </ScrollTriggeredStagger>
              </div>
            </div>
          </section>
        </div>

        {/* Menu Section - Ultra-refined */}
        <section id="menu" className="relative min-h-screen bg-white py-16 md:py-20 lg:py-40">
          <div className="container-dh">
            <div className="max-w-5xl mx-auto px-4 md:px-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                {/* Left side - Radical minimalism with animations */}
                <div className="space-y-8 lg:space-y-16 order-2 lg:order-1">
                  <ScrollTriggeredStagger
                    staggerDelay={250}
                    direction="up"
                    className="space-y-8"
                    threshold={0.2}
                  >
                    <div>
                      <FadeIn delay={0.2} duration={1} direction="up">
                        <RestaurantSectionHeading className="text-black max-w-md md:max-w-none mb-6 md:mb-8">
                          Verfijnde Belgische keuken — Lunch & Diner
                        </RestaurantSectionHeading>
                      </FadeIn>
                    </div>
                    
                    <div>
                      <FadeIn delay={0.5} duration={0.8} direction="up">
                        <p className="typography-body-large text-gray-600 mt-8 max-w-md">
                          Klassiekers met een lichte toets: seizoensgebonden, dagvers en precies bereid.
                        </p>
                      </FadeIn>
                    </div>
                    
                     <div>
                       <FadeIn delay={0.8} duration={0.6} direction="up">
                         <ActionButton
                           href="/menu"
                           variant="menu"
                           className="mt-4 md:mt-12"
                         >
                           Bekijk de menukaart
                         </ActionButton>
                       </FadeIn>
                     </div>
                  </ScrollTriggeredStagger>
                </div>

                {/* Right side - Chef portrait with animation */}
                <div className="order-1 lg:order-2">
                  <FadeIn delay={0.3} duration={1.2} direction="right">
                    <div className="relative h-[400px] md:h-[500px] lg:h-[700px] overflow-hidden">
                      <OptimizedImageNext
                        src="/images/restaurant/chef-portrait.jpg"
                        alt="Portret van de chef – Bistro Bert"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        quality={80}
                        placeholder="blur"
                      />
                    </div>
                  </FadeIn>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Unique Selling Points */}
        <section className="min-h-screen bg-gray-50 py-16 md:py-20 lg:py-40">
          <div className="container-dh">
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

  
        {/* Smaakvolle Verhalen Onvergetelijke Momenten Section */}
        <section className="min-h-[80vh] bg-white py-16 md:py-32">
          <div className="container-dh">
            <div className="max-w-7xl mx-auto px-4 md:px-0">
              {/* Section header with luxury staggered animations */}
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

              {/* Minimalistic Image Gallery with animation */}
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
        </section>

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
                       href="/contact"
                       variant="cta"
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
