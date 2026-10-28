import type { Metadata } from 'next'
import BreadcrumbSchema from '@/components/ui/BreadcrumbSchema'
import { RESTAURANT_ID } from '@/components/ui/RestaurantJsonLd'
import { businessLunch, businessLunchFaqs } from '@/data/businessLunch'
import BusinessLunchContent from './BusinessLunchContent'

const PAGE_URL = 'https://www.bistro-bert.be/business-lunch'
const TITLE = 'Business lunch in Laakdal: 2 gangen voor €39'
const DESCRIPTION =
  'Zakenlunch in Laakdal: twee gangen met koffie en friandise voor €39 p.p. Wisselend seizoensmenu, vlak bij Geel en Westerlo. Gratis parking.'
const IMAGE = '/images/restaurant/chef.jpg'

const breadcrumbItems = [
  { name: 'Home', url: 'https://www.bistro-bert.be' },
  { name: 'Business lunch', url: PAGE_URL },
]

const menuStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Menu',
  '@id': `${PAGE_URL}/#menu`,
  name: 'Business lunch',
  inLanguage: 'nl',
  url: PAGE_URL,
  isPartOf: { '@id': RESTAURANT_ID },
  about: { '@id': RESTAURANT_ID },
  hasMenuSection: [
    {
      '@type': 'MenuSection',
      name: 'Business lunch',
      description: 'Twee gangen, daarna koffie of thee met een friandise.',
      offers: {
        '@type': 'Offer',
        price: `${businessLunch.price}.00`,
        priceCurrency: 'EUR',
      },
      hasMenuItem: businessLunch.courses.map((course) => ({
        '@type': 'MenuItem',
        name: course.name,
        description: course.description,
      })),
    },
  ],
} as const

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: businessLunchFaqs.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
} as const

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: `${TITLE} | Bistro Bert`,
    description: DESCRIPTION,
    url: PAGE_URL,
    images: [{ url: IMAGE, alt: 'Borden worden afgewerkt in de keuken van Bistro Bert' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} | Bistro Bert`,
    description: DESCRIPTION,
    images: [IMAGE],
  },
}

export default function BusinessLunchPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <BusinessLunchContent />
    </>
  )
}
