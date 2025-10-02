'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import Footer from '@/components/layout/Footer'
import ImageGallery from '@/components/ImageGallery'
import { galleryImages } from '@/data/images'
import BreadcrumbSchema from '@/components/ui/BreadcrumbSchema'
import ReviewSchema from '@/components/ui/ReviewSchema'
import { ImageSkeleton } from '@/components/ui/LoadingState'

// Force dynamic rendering to avoid SSR issues with browser APIs
export const dynamic = 'force-dynamic'

export default function Home() {
  const [imagesLoaded, setImagesLoaded] = useState({
    hero: false,
    chef: false,
    dining: false,
    ambiance: false
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

  const breadcrumbItems = [
    { name: 'Home', url: 'https://bistrobert.be' },
  ]

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <ReviewSchema reviews={sampleReviews} />
      
      <div className="min-h-screen bg-white">
        {/* Hero Section - Completely static */}
        <div className="relative w-full overflow-hidden" style={{ height: '100vh' }}>
          <section
            className="relative h-full w-full"
            role="banner"
          >
            {/* Full-screen static background image */}
            <div className="absolute inset-0">
              {!imagesLoaded.hero && (
                <div className="absolute inset-0 z-20">
                  <ImageSkeleton
                    className="w-full h-full"
                    aspectRatio="aspect-video"
                  />
                </div>
              )}
              <Image
                src="/images/restaurant/hero-moody-wine-bar.jpg"
                alt="Bistro Bert Laakdal - Luxe restaurant met verfijnde sfeer en fine dining ambiance"
                fill
                sizes="100vw"
                className={`object-cover object-center brightness-65 ${
                  imagesLoaded.hero ? 'opacity-100' : 'opacity-0'
                }`}
                priority
                onLoad={() => setImagesLoaded(prev => ({ ...prev, hero: true }))}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/10" aria-hidden="true" />
            </div>

            {/* Static hero content */}
            <div className="relative z-10 h-full flex flex-col justify-end items-start px-8 md:px-16 lg:px-24 pb-16">
              <div className="max-w-4xl">
                {/* Restaurant name with tagline */}
                <h1 className="typography-hero text-white drop-shadow-lg mb-4 max-w-xs md:max-w-none">
                  Bistro Bert • Laakdal
                </h1>
                <p className="typography-body text-white/90 drop-shadow-lg mb-6 max-w-xs md:max-w-2xl">
                  Luxe Belgisch genieten in Laakdal — klassiekers met finesse, dagvers en seizoensgebonden.
                </p>

                {/* Static CTA button */}
                <div>
                  <a
                    href="#menu"
                    className="inline-block mt-4 px-6 md:px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors duration-300 typography-button drop-shadow-lg"
                    aria-label="Navigeer naar onze menukaart"
                  >
                    Ontdek de menukaart
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Menu Section - Ultra-refined */}
        <section id="menu" className="relative min-h-screen bg-white py-20 md:py-40">
          <div className="container-dh">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left side - Radical minimalism */}
                <div className="space-y-16">
                  <div>
                    <h2 className="typography-h1 text-black max-w-md md:max-w-none">
                      Verfijnde Belgische Keuken — Lunch, Zakenlunch & Diner
                    </h2>
                    <p className="typography-body-large text-gray-600 mt-8 max-w-md">
                      Klassiekers met schwung: garnaalkroketten met citroenmayonaise, steak tartaar aan tafel afgewerkt en dagverse Noordzeevis met lichte saus. Altijd seizoensgebonden, altijd precies bereid.
                    </p>
                    <Link
                      href="/menu"
                      className="inline-block mt-8 md:mt-12 px-8 py-3 border border-black text-black hover:bg-black hover:text-white transition-colors typography-button"
                    >
                      Bekijk onze kaart
                    </Link>
                  </div>
                </div>

                {/* Right side - Chef portrait */}
                <div className="relative h-[700px] overflow-hidden">
                  <Image
                    src="/images/restaurant/chef-portrait.jpg"
                    alt="Chef-kok van Bistro Bert - Meester in de Belgische culinaire kunst met passie voor expressieve gerechten"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Unique Selling Points */}
        <section className="min-h-screen bg-gray-50 py-20 md:py-40">
          <div className="container-dh">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16 md:mb-32">
                <h2 className="typography-h1 text-black mb-6 md:mb-12">
                  Wat je mag verwachten
                </h2>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="space-y-16">
                  {/* Section 1: Our Philosophy */}
                  <div className="text-center">
                    <p className="typography-caption text-gray-500 mb-3 md:mb-4">
                      Ons Verhaal
                    </p>
                    <p className="typography-body-large text-gray-600 max-w-lg md:max-w-3xl mx-auto">
                      Van traag gegaarde sauzen tot kraakverse garnalen: we koken met twee voeten in de Belgische traditie—licht, precies en vol smaak. Intiem, warm en zonder poeha.
                    </p>
                  </div>

                  {/* Section 2: Seasonal Approach */}
                  <div className="text-center">
                    <p className="typography-caption text-gray-500 mb-3 md:mb-4">
                      Seizoensgebonden & fris
                    </p>
                    <p className="typography-body-large text-gray-600 max-w-lg md:max-w-3xl mx-auto">
                      Met het seizoen mee: asperges in het voorjaar, hoevekip en Noordzeevis doorheen het jaar, wild wanneer het zover is. Kraakvers, zuiver van smaak, elegant gepresenteerd.
                    </p>
                  </div>

                  {/* Section 3: Ambiance */}
                  <div className="text-center">
                    <p className="typography-caption text-gray-500 mb-3 md:mb-4">
                      Intieme, stijlvolle sfeer
                    </p>
                    <p className="typography-body-large text-gray-600 max-w-lg md:max-w-3xl mx-auto">
                      Zachte verlichting, warme materialen en comfortabele stoelen. Ongeveer 40 couverts, genoeg ruimte voor een rustig zaken- of romantisch diner.
                    </p>
                  </div>

                  {/* Section 4: Our Team */}
                  <div className="text-center">
                    <p className="typography-caption text-gray-500 mb-3 md:mb-4">
                      Ons Team
                    </p>
                    <p className="typography-body-large text-gray-600 max-w-lg md:max-w-3xl mx-auto">
                      Chef Bert focust op precisie en sauswerk; in de zaal helpen we graag met wijnsuggesties, allergenenadvies en timing voor een vlotte zakenlunch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Smaakvolle Verhalen Onvergetelijke Momenten Section */}
        <section className="min-h-[80vh] bg-white py-16 md:py-32">
          <div className="container-dh">
            <div className="max-w-7xl mx-auto">
              {/* Section header - Minimalist elegance */}
              <div className="text-center mb-24">
                <h2 className="typography-h1 text-black mb-6 md:mb-8">
                  Smaakvolle Verhalen — Onvergetelijke Momenten
                </h2>
                <p className="typography-body text-gray-600 max-w-lg md:max-w-2xl mx-auto">
                  Een blik achter de schermen: mise-en-place, het afwerken aan tafel en de sfeer in de zaal. Volg ons op Instagram voor dagelijkse stories.
                </p>
              </div>

              {/* Minimalistic Image Gallery */}
              <ImageGallery
                images={galleryImages.slice(0, 8)}
                className="w-full"
                enableLightbox={true}
              />
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-32 bg-black text-white">
          <div className="container-dh">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="typography-h1 leading-[0.9] mb-6 md:mb-8">
                  Aan Tafel bij Bert — Reserveer vandaag
              </h2>
              <p className="typography-body-large text-white/90 mb-8 md:mb-12 max-w-lg md:max-w-2xl mx-auto">
                Zin in lunch, zakenlunch of diner in Laakdal? Bel of reserveer eenvoudig—we denken graag mee over allergenen, wijn en timing.
              </p>
              <div>
                <Link
                  href="/contact"
                  className="inline-block px-6 md:px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-all duration-500 typography-button"
                >
                  Reserveer voor lunch of zakenlunch
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  )
}
