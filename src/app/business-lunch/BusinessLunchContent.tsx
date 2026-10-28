'use client'

import Footer from '@/components/layout/Footer'
import OptimizedImageNext from '@/components/ui/OptimizedImageNext'
import { FadeIn } from '@/components/ui/AccessibleMotion'
import {
  RestaurantHeroHeading,
  RestaurantSectionHeading
} from '@/components/ui/SmartHeadings'
import ActionButton from '@/components/ui/ActionButton'
import { useReservation } from '@/contexts/ReservationContext'
import { FaqList } from '@/app/faq/FaqList'
import { businessLunch, businessLunchFaqs } from '@/data/businessLunch'

const ROUTE_URL = 'https://www.google.com/maps/dir/?api=1&destination=Verboekt+121,+2430+Laakdal'

export default function BusinessLunchContent() {
  const { open } = useReservation()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero - same treatment as the homepage */}
      <div className="relative w-full overflow-hidden hero-section" style={{ height: '100vh' }}>
        <section className="relative h-full w-full" aria-label="Business lunch">
          <div className="absolute inset-0 m-0 p-0">
            <OptimizedImageNext
              src="/images/restaurant/chef.jpg"
              alt="Borden worden afgewerkt in de keuken van Bistro Bert"
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: 'center 65%' }}
              priority
              quality={85}
              placeholder="empty"
            />
            <div className="absolute inset-0 m-0 p-0 bg-gradient-to-b from-black/60 via-black/45 to-black/30" aria-hidden="true" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-end items-start px-4 sm:px-8 md:px-16 lg:px-24 pb-8 md:pb-12 hero-content">
            <div className="max-w-4xl px-4 sm:px-0 space-y-6">
              <FadeIn delay={0.5} duration={1.2} direction="up">
                <RestaurantHeroHeading className="text-white drop-shadow-lg mb-4 max-w-xs md:max-w-none">
                  Business lunch in Laakdal
                </RestaurantHeroHeading>
              </FadeIn>
              <FadeIn delay={0.8} duration={1} direction="up">
                <p className="typography-body text-white/95 drop-shadow-lg mb-6 max-w-xs md:max-w-2xl">
                  Twee gangen, daarna koffie of thee met een friandise. €{businessLunch.price} per persoon.
                </p>
              </FadeIn>
              <FadeIn delay={1.1} duration={0.8} direction="up">
                <ActionButton
                  onClick={open}
                  variant="hero-menu"
                  className="mt-4 mb-8"
                  ariaLabel="Open reserveringswidget"
                  dataZcAction="open"
                >
                  Reserveer een tafel
                </ActionButton>
              </FadeIn>
            </div>
          </div>
        </section>
      </div>

      {/* Menu */}
      <section id="menu" aria-labelledby="menu-title" className="bg-white py-16 md:py-24">
        <div className="container-dh">
          <div className="max-w-4xl mx-auto px-4 md:px-0">
            <header className="mb-12 text-center">
              <h2 id="menu-title" className="text-suisse-h2 font-serif text-black mb-6 md:mb-8">
                Nu op het menu
              </h2>
              <p className="typography-body-large text-gray-600 max-w-3xl mx-auto">
                De chef kookt met wat het seizoen te bieden heeft. Daarom wisselt de business lunch regelmatig.
              </p>
            </header>

            <div className="border border-gray-100 rounded-xl p-6 py-12 md:p-12 md:py-16 bg-white shadow-sm text-center">
              <ul className="space-y-10">
                {businessLunch.courses.map((course) => (
                  <li key={course.name}>
                    <h3 className="typography-h4 text-black">{course.name}</h3>
                    <p className="typography-body text-gray-600 mt-2">{course.description}</p>
                  </li>
                ))}
              </ul>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto my-10" aria-hidden="true" />
              <p className="font-serif text-4xl text-black">
                €{businessLunch.price} <span className="typography-small text-gray-600">per persoon</span>
              </p>
            </div>

            <div className="mt-12 text-center border-t border-gray-200 pt-8">
              <div className="flex flex-col sm:flex-row button-tight-spacing justify-center">
                <ActionButton href="/menu" variant="menu" className="px-8 py-3">
                  Bekijk de menukaart
                </ActionButton>
                <ActionButton
                  onClick={open}
                  variant="reserve"
                  className="px-8 py-3"
                  ariaLabel="Open reserveringswidget"
                  dataZcAction="open"
                >
                  Reserveer een tafel
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Goed om te weten - same box as "Onze werkwijze" on Over ons */}
      <section className="bg-white pb-16 md:pb-24">
        <div className="container-dh">
          <div className="max-w-4xl mx-auto px-4 md:px-0">
            <div className="bg-gray-50 p-12 rounded-lg">
              <h2 className="typography-h3 text-black mb-12 text-center">
                Goed om te weten
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="typography-h4 text-black mb-3">Vaste prijs</h3>
                  <p className="typography-small text-gray-600">
                    €{businessLunch.price} per persoon voor twee gangen en koffie of thee. Ook als het menu wisselt.
                  </p>
                </div>
                <div>
                  <h3 className="typography-h4 text-black mb-3">Op uw tempo</h3>
                  <p className="typography-small text-gray-600">
                    Moet u om twee uur terug op kantoor? Zeg het bij het reserveren, dan houden we er rekening mee.
                  </p>
                </div>
                <div>
                  <h3 className="typography-h4 text-black mb-3">Lunch tot 17u</h3>
                  <p className="typography-small text-gray-600">
                    Van woensdag tot en met zondag, vanaf 12u. Maandag en dinsdag zijn we gesloten.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location - same layout as the chef section on the homepage */}
      <section className="relative bg-white pb-16 md:pb-24">
        <div className="container-dh">
          <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div className="px-4 md:px-0 text-center lg:text-left space-y-6">
              <RestaurantSectionHeading className="text-black max-w-3xl mx-auto mb-6 lg:mx-0 lg:text-left">
                Vlak bij Geel en Westerlo
              </RestaurantSectionHeading>
              <p className="typography-body-large text-gray-600 max-w-2xl mx-auto lg:mx-0">
                U vindt ons aan de Verboekt 121 in Laakdal. Ook vanuit Diest, Mol of Herentals rijdt u zo tot bij ons. Parkeren kan gratis voor de deur.
              </p>
              <ActionButton href={ROUTE_URL} variant="menu" className="mt-6 mx-auto lg:mx-0">
                Plan uw route
              </ActionButton>
            </div>

            <div className="px-4 md:px-0">
              <div className="relative mx-auto max-w-md lg:max-w-lg">
                <div className="relative aspect-[2/3] min-h-[420px] lg:min-h-[520px] overflow-hidden ring-1 ring-black/5">
                  <OptimizedImageNext
                    src="/images/hero/hero.jpeg"
                    alt="Gevel van Bistro Bert aan de Verboekt in Laakdal"
                    fill
                    className="object-cover"
                    style={{ objectPosition: '62% center' }}
                    quality={85}
                    sizes="(max-width: 1023px) 80vw, 420px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-title" className="bg-white pb-20 md:pb-24">
        <div className="container-dh">
          <div className="max-w-4xl mx-auto px-4 md:px-0">
            <h2 id="faq-title" className="text-suisse-h2 font-serif text-black mb-12 text-center">
              Vragen over de business lunch
            </h2>
            <FaqList items={businessLunchFaqs} />
          </div>
        </div>
      </section>

      {/* Call to Action - same block as the homepage */}
      <section className="py-16 md:py-32 bg-black text-white">
        <div className="container-dh">
          <div className="max-w-4xl mx-auto text-center px-4 md:px-0 space-y-8">
            <RestaurantSectionHeading className="text-white leading-[0.9] mb-6 md:mb-8 text-center">
              Reserveer een tafel
            </RestaurantSectionHeading>
            <p className="typography-body-large text-white/90 mb-8 md:mb-12 max-w-lg md:max-w-2xl mx-auto">
              Reserveer online of bel ons op{' '}
              <a href="tel:+3213480139" className="underline decoration-white/40 underline-offset-4 hover:decoration-white">
                +32 13 48 01 39
              </a>
              .
            </p>
            <ActionButton
              onClick={open}
              variant="cta"
              ariaLabel="Open reserveringswidget"
              dataZcAction="open"
            >
              Reserveer een tafel
            </ActionButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
