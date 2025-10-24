import { Metadata } from 'next'
import BreadcrumbSchema from '@/components/ui/BreadcrumbSchema'
import EventSchema from '@/components/ui/EventSchema'
import ClientContact from './ClientContact'

export const metadata: Metadata = {
  title: "Contact & Reserveren | Bistro Bert Laakdal",
  description: "Reserveer uw tafel voor lunch of diner. Wij stemmen alles af op uw wensen — timing, dieet, sfeer.",
  keywords: [
    "Bistro Bert contact",
    "Bistro Bert reserveren",
    "restaurant contact Laakdal",
    "restaurant reserveren Laakdal",
    "luxe restaurant contact",
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
    title: "Contact & Reserveren | Bistro Bert Laakdal",
    description: "Neem contact op of reserveer direct online voor lunch of diner. We stemmen tempo en dieetwensen met plezier af in Laakdal.",
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
    title: "Contact & Reserveren | Bistro Bert Laakdal",
    description: "Neem contact op of reserveer direct online voor lunch of diner. We stemmen tempo en dieetwensen met plezier af in Laakdal.",
  },
  alternates: {
    canonical: "https://www.bistro-bert.be/contact",
  },
  other: {
    'script:ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: 'Bistro Bert',
      description: 'Belgische klassiekers met finesse in Laakdal, Antwerpse Kempen. Dagvers en seizoensgebonden.',
      url: 'https://www.bistro-bert.be/contact',
      telephone: '+32 13 48 01 39',
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
        'Tuesday-Sunday 10:00-23:00',
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
  { name: 'Contact & Reserveren', url: 'https://www.bistro-bert.be/contact' },
]

export default function ContactPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <EventSchema events={sampleEvents} />
      <ClientContact />
    </>
  )
}
