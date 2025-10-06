import { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/layout/Footer'
import ContactInfo from '@/components/contact/ContactInfo'
import BreadcrumbSchema from '@/components/ui/BreadcrumbSchema'
import EventSchema from '@/components/ui/EventSchema'

export const metadata: Metadata = {
  title: "Reserveer Tafel | Bistro Bert Laakdal",
  description: "Reserveer uw tafel bij Bistro Bert in Laakdal. Belgische klassiekers met finesse. Dagvers, seizoensgebonden. Reserveer voor lunch, zakenlunch of diner.",
  keywords: [
    "Bistro Bert reserveren",
    "restaurant reserveren Laakdal",
    "luxe restaurant reserveren",
    "fine dining reserveren",
    "tafel reserveren",
    "restaurant België",
    "culinaire ervaring",
    "culinaire reis",
    "expressieve",
    "Belgische keuken",
    "Laakdal"
  ],
  openGraph: {
    title: "Reserveer Tafel | Bistro Bert Laakdal",
    description: "Reserveer uw tafel bij Bistro Bert in Laakdal. Belgische klassiekers met finesse. Dagvers, seizoensgebonden.",
    url: "https://www.bistro-bert.be/contact",
    images: [
      {
        url: "/images/restaurant/dining-room.jpg",
        width: 1200,
        height: 630,
        alt: "Bistro Bert Dining Room",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/restaurant/dining-room.jpg"],
    title: "Reserveer Tafel | Bistro Bert Laakdal",
    description: "Reserveer uw tafel bij Bistro Bert in Laakdal. Belgische klassiekers met finesse. Dagvers, seizoensgebonden.",
  },
  alternates: {
    canonical: "https://www.bistro-bert.be/contact",
  },
  other: {
    'script:ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: 'Bistro Bert',
      description: 'Luxe restaurant met verfijnde Belgische keuken in Laakdal',
      url: 'https://www.bistro-bert.be/contact',
      telephone: '013 480 139',
      email: 'info@bistro-bert.be',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Verboekt 121',
        addressLocality: 'Laakdal',
        postalCode: '2430',
        addressCountry: 'BE',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '51.0843463',
        longitude: '5.0996063',
      },
      openingHours: [
        'Tuesday-Sunday 10:00-22:00',
      ],
      priceRange: '€€€',
      image: [
        'https://www.bistro-bert.be/images/restaurant/dining-room.jpg',
      ],
      acceptsReservations: 'True',
      reservationUrl: 'https://www.bistro-bert.be/contact',
    }),
  },
}

// Sample events for structured data
const sampleEvents = [
  {
    name: 'Kerstdiner bij Bistro Bert',
    description: 'Ervaar een magisch kerstdiner met een speciaal samengesteld menu van onze chef-kok.',
    startDate: '2024-12-24T18:00:00',
    endDate: '2024-12-24T23:00:00',
    location: 'Bistro Bert, Verboekt 121, 2430 Laakdal',
    price: '€125'
  },
  {
    name: 'Nieuwjaarsgaladiner',
    description: 'Start het nieuwe jaar met een exclusief galadiner en feestelijke ambiance.',
    startDate: '2024-12-31T20:00:00',
    endDate: '2025-01-01T01:00:00',
    location: 'Bistro Bert, Verboekt 121, 2430 Laakdal',
    price: '€175'
  }
]

const breadcrumbItems = [
  { name: 'Home', url: 'https://www.bistro-bert.be' },
  { name: 'Reserveren', url: 'https://www.bistro-bert.be/contact' },
]

export default function ContactPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <EventSchema events={sampleEvents} />
      
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="navbar-spacer pt-32 pb-20 bg-gradient-to-b from-ivory/50 to-white">
          <div className="container-dh">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="typography-h1 mb-6 md:mb-8">
                Reserveer uw tafel
              </h1>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-burgundy to-transparent mx-auto mb-8" />
              <p className="typography-body-large text-gray-600">
                Verfijnde keuken met een uitgebreide wijnkaart in Laakdal. Reserveer voor lunch, zakenlunch of diner.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-full">
                <a
                  href="tel:+3213480139"
                  className="inline-block px-8 py-4 bg-black text-white hover:bg-gray-800 transition-colors typography-button w-full sm:w-auto text-center min-w-0"
                  aria-label="Bel Bistro Bert direct: +32 13 48 01 39"
                >
                  Bel direct: +32 13 48 01 39
                </a>
                <a
                  href="mailto:info@bistro-bert.be?subject=Reservatie"
                  className="inline-block px-8 py-4 bg-black text-white hover:bg-gray-800 transition-colors typography-button w-full sm:w-auto text-center min-w-0"
                  aria-label="Stuur e-mail naar Bistro Bert: info@bistro-bert.be"
                >
                  E-MAIL
                </a>
              </div>
              <p className="mt-4 text-center text-gray-600 typography-body-small">
                We denken graag mee over allergenen, wijn en timing.
              </p>
            </div>
          </div>
        </section>

        {/* Reservation Information Section */}
        <section className="section-dh py-20 bg-white">
          <div className="container-dh">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-24">
                <h2 className="typography-h2 mb-6 md:mb-8">Reserveringsinformatie</h2>
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-burgundy to-transparent mx-auto" />
                <p className="typography-body text-gray-600 max-w-2xl mx-auto">
                  Hier vind je praktische info voor je reservatie: lunch- en dineruren, parkeren en allergenen.
                </p>
              </div>

              <div className="bg-gray-50 p-6 md:p-8 rounded-lg overflow-hidden max-w-2xl mx-auto">
                <h3 className="typography-h3 mb-4">Openingstijden</h3>
                <p className="typography-body text-gray-600 mb-4">
                  <strong>Dinsdag t/m zondag:</strong> 10:00–22:00
                </p>
                <p className="typography-body text-gray-600 mb-4">
                  <strong>Maandag:</strong> gesloten
                </p>
                <p className="typography-small text-gray-500">
                  Reserveer tijdig—zeker in het weekend en op feestdagen. Groepen vanaf 6: graag even bellen.
                </p>
              </div>

              <div className="mt-12 bg-gray-50 p-6 md:p-8 rounded-lg overflow-hidden">
                <h3 className="typography-h3 mb-6 text-center">Wat je mag verwachten</h3>
                <p className="typography-body text-gray-600 text-center">
                  Verfijnde gerechten bereid met moderne precisie, perfect gecombineerd met onze uitgebreide wijnselectie. Van seizoensgerechten tot dagverse vis, elke maaltijd is een harmonieuze ervaring.
                </p>
                <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                  <div className="text-center p-4">
                    <h4 className="typography-h4 mb-4">Lunch & Diner</h4>
                    <p className="typography-small text-gray-600">Menuopties voor elke gelegenheid: van lichte zakelijke lunches tot uitgebreide diners. Elk gerecht wordt bereid met dezelfde toewijding aan kwaliteit en presentatie.</p>
                  </div>
                  <div className="text-center p-4">
                    <h4 className="typography-h4 mb-4">Seizoensgebonden</h4>
                    <p className="typography-small text-gray-600">We vieren de seizoenen met ingrediënten op hun piek van versheid. Van lente asperges tot herfst paddenstoelen, elk gerecht vertelt een verhaal van tijd en plaats.</p>
                  </div>
                  <div className="text-center p-4">
                    <h4 className="typography-h4 mb-4">Wijnselectie</h4>
                    <p className="typography-small text-gray-600">Een zorgvuldig samengestelde wijnkaart met klassieke en eigentijdse wijnen. Perfect gecombineerd met onze gerechten voor een harmonieuze ervaring.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="section-dh">
          <div className="container-dh">
            <ContactInfo />
          </div>
        </section>

        {/* Map Section */}
        <section className="relative h-96 bg-gray-100 overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2521.2846153846154!2d5.0996063!3d51.0843463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3a4b7e3e3e3e3%3A0x4c3e5b5e5e5e5e5!2sVerboekt%20121%2C%202430%20Laakdal%2C%20Belgium!5e0!3m2!1sen!2sbe!4v1234567890!5m2!1sen!2sbe"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bistro Bert Locatie in Laakdal"
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        </section>

        {/* Internal Links Section */}
        <section className="py-12 md:py-20 bg-white overflow-hidden">
          <div className="container-dh">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="typography-h2 mb-6 md:mb-8">Ontdek meer van Bistro Bert</h2>
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <a
                  href="/menu"
                  className="block p-6 md:p-8 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg overflow-hidden"
                >
                  <h3 className="typography-h3 mb-4">Onze menukaart</h3>
                  <p className="typography-body text-gray-600 mb-4">
                    Ontdek onze à la carte menukaart met verfijnde gerechten en seizoensgebonden creaties. Perfect gecombineerd met onze uitgebreide wijnselectie.
                  </p>
                  <span className="typography-small text-black">Bekijk menu →</span>
                </a>
                <Link
                  href="/"
                  className="block p-6 md:p-8 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg overflow-hidden"
                >
                  <h3 className="typography-h3 mb-4">Ons restaurant</h3>
                  <p className="typography-body text-gray-600 mb-4">
                    Ontdek het verhaal van Bistro Bert, waar Belgische culinaire tradities samenkomen met moderne gastronomie. Een intieme eetkamer waar gastvrijheid centraal staat.
                  </p>
                  <span className="typography-small text-black">Meer informatie →</span>
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