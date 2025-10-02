import { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/layout/Footer'
import ContactInfo from '@/components/contact/ContactInfo'
import BreadcrumbSchema from '@/components/ui/BreadcrumbSchema'
import EventSchema from '@/components/ui/EventSchema'

export const metadata: Metadata = {
  title: "Reserveer Tafel | Bistro Bert Laakdal | Luxe Restaurant Reserveringen",
  description: "Reserveer uw tafel bij Bistro Bert in Laakdal voor een exclusieve fine dining ervaring. Eenvoudig online reserveren voor een onvergetelijke culinaire avond.",
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
    description: "Exclusieve fine dining reserveringen in Laakdal",
    url: "https://bistrobert.be/contact",
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
    description: "Exclusieve fine dining reserveringen in Laakdal",
  },
  alternates: {
    canonical: "https://bistrobert.be/contact",
  },
  other: {
    'script:ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: 'Bistro Bert',
      description: 'Luxe restaurant met verfijnde Belgische keuken in Laakdal',
      url: 'https://bistrobert.be/contact',
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
        'Tuesday-Sunday 18:00-22:00',
      ],
      priceRange: '€€€',
      image: [
        'https://bistrobert.be/images/restaurant/dining-room.jpg',
      ],
      acceptsReservations: 'True',
      reservationUrl: 'https://bistrobert.be/contact',
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
  { name: 'Home', url: 'https://bistrobert.be' },
  { name: 'Reserveren', url: 'https://bistrobert.be/contact' },
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
              <h1 className="typography-h1 mb-6">
                Reserveer uw tafel — Lunch, Zakenlunch & Diner in Laakdal
              </h1>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-burgundy to-transparent mx-auto mb-8" />
              <p className="typography-body-large text-gray-600">
                Bel of reserveer voor lunch, zakenlunch of diner. We helpen met allergenen, timing en een stille tafel indien gewenst.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-full">
                <a
                  href="tel:013480139"
                  className="inline-block px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors typography-button w-full sm:w-auto text-center min-w-0"
                >
                  Bel direct: +32 13 48 01 39
                </a>
                <button
                  className="inline-block px-6 py-3 border border-black text-black hover:bg-black hover:text-white transition-colors typography-button w-full sm:w-auto text-center min-w-0 cursor-not-allowed opacity-75"
                  disabled
                >
                  Online reserveren
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Reservation Information Section */}
        <section className="section-dh py-20 bg-white">
          <div className="container-dh">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="typography-h1 mb-4">Reserveringsinformatie</h2>
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-burgundy to-transparent mx-auto mb-8" />
                <p className="typography-body text-gray-600 max-w-2xl mx-auto">
                  Hier vind je praktische info voor je reservatie: lunch- en dineruren, parkeren en allergenen.
                </p>
              </div>

              <div className="bg-gray-50 p-6 md:p-8 rounded-lg overflow-hidden max-w-2xl mx-auto">
                <h3 className="typography-h2 mb-4">Openingstijden</h3>
                <p className="typography-body text-gray-600 mb-4">
                  <strong>Dinsdag t/m zondag:</strong> 18:00–22:00. Lunch vrij & zat: 12:00–14:00. (Pas aan indien anders.)
                </p>
                <p className="typography-body text-gray-600 mb-4">
                  <strong>Maandag:</strong> gesloten
                </p>
                <p className="typography-small text-gray-500">
                  Reserveer tijdig—zeker in het weekend en op feestdagen. Groepen vanaf 6: graag even bellen.
                </p>
              </div>

              <div className="mt-12 bg-gray-50 p-6 md:p-8 rounded-lg overflow-hidden">
                <h3 className="typography-h2 mb-4 text-center">Wat je mag verwachten</h3>
                <p className="typography-body text-gray-600 mb-6 text-center">
                  Wat je mag verwachten: Belgische klassiekers met moderne precisie. Voorbeeld? Vol-au-vent met rijke, heldere saus of dagvis op de graat met seizoensgroenten.
                </p>
                <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                  <div className="text-center p-4">
                    <h4 className="typography-h4 mb-2">Lunch & Diner</h4>
                    <p className="typography-small text-gray-600">Heldere keuzes voor elke gelegenheid: snelle zakenlunch, ontspannen lunch of uitgebreid diner.</p>
                  </div>
                  <div className="text-center p-4">
                    <h4 className="typography-h4 mb-2">Seizoensgebonden</h4>
                    <p className="typography-small text-gray-600">Met het seizoen mee, met respect voor het product. Voorbeeld: hoevekip met zachte jus en knapperige groenten.</p>
                  </div>
                  <div className="text-center p-4">
                    <h4 className="typography-h4 mb-2">Belgische Klassiekers</h4>
                    <p className="typography-small text-gray-600">Onze basis: Belgische klassiekers zoals vol-au-vent of stoofvlees, met lichte, frisse accenten.</p>
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
              <h2 className="typography-h1 mb-6 md:mb-8">Ontdek meer van Bistro Bert</h2>
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <a
                  href="/menu"
                  className="block p-6 md:p-8 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg overflow-hidden"
                >
                  <h3 className="typography-h3 mb-4">Onze menukaart</h3>
                  <p className="typography-body text-gray-600 mb-4">
                    Ontdek onze à la carte menukaart met seizoensklassiekers en dagsuggesties—precies bereid, fris gepresenteerd.
                  </p>
                  <span className="typography-small text-black">Bekijk menu →</span>
                </a>
                <Link
                  href="/"
                  className="block p-6 md:p-8 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg overflow-hidden"
                >
                  <h3 className="typography-h3 mb-4">Ons restaurant</h3>
                  <p className="typography-body text-gray-600 mb-4">
                    Leer meer over onze keuken, chef en de unieke sfeer van Bistro Bert in Laakdal.
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