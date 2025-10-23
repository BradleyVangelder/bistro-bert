import type { Metadata } from 'next'
import BreadcrumbSchema from '@/components/ui/BreadcrumbSchema'
import Footer from '@/components/layout/Footer'
import { faqItems } from '@/data/faqs'
import { FaqList } from './FaqList'
import { FaqReserveButton } from './FaqReserveButton'

const breadcrumbItems = [
  { name: 'Home', url: 'https://www.bistro-bert.be' },
  { name: 'Veelgestelde vragen', url: 'https://www.bistro-bert.be/faq' },
]

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
} as const

export const metadata: Metadata = {
  title: 'Veelgestelde vragen | Bistro Bert Laakdal',
  description: 'Antwoorden op de meest gestelde vragen over Bistro Bert in Laakdal: reserveren, parkeren, dieetwensen en openingstijden.',
  alternates: {
    canonical: 'https://www.bistro-bert.be/faq',
  },
}

export default function FaqPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <div className="min-h-screen bg-white">
        <section className="navbar-spacer pt-32 pb-20 md:pt-36 md:pb-24">
          <div className="container-dh">
            <div className="max-w-4xl mx-auto px-4 md:px-0">
              <header className="mb-12 text-center">
                <h1 className="text-suisse-h2 font-serif text-black mb-6 md:mb-8">
                  Veelgestelde vragen over Bistro Bert
                </h1>
                <p className="typography-body-large text-gray-600">
                  Alles wat u wilt weten over ons restaurant in Laakdal: reserveringen, dieetvoorkeuren, parking en praktische tips voor een zorgeloze culinaire ervaring.
                </p>
              </header>

              <FaqList items={faqItems} />

              <div className="mt-16 text-center">
                <FaqReserveButton />
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
