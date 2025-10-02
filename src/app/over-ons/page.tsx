'use client'

import { motion } from 'framer-motion'
import Footer from '@/components/layout/Footer'
import { Leaf, ChefHat, Wheat } from 'lucide-react'
import ReviewSchema from '@/components/ui/ReviewSchema'
import BreadcrumbSchema from '@/components/ui/BreadcrumbSchema'

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

export default function OverOnsPage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://bistrobert.be' },
    { name: 'Over Ons', url: 'https://bistrobert.be/over-ons' },
  ]

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <ReviewSchema reviews={sampleReviews} />

      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <section className="min-h-screen bg-white navbar-spacer py-40">
          <div className="container-dh">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto"
              >
                {/* Page Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-16"
                >
                  <h1 className="typography-h1 mb-8">
                    Over Bistro Bert
                  </h1>
                  <p className="typography-body-large text-gray-600 max-w-3xl mx-auto">
                    Ontdek ons verhaal: Belgische klassiekers, precies bereid, met service die het eenvoudig maakt. Laakdal is ons thuis: rustig, bereikbaar en met parkeerplek in de buurt.
                  </p>
                </motion.div>

                {/* Culinary Philosophy Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-24"
                >
                  <h2 className="typography-h2 text-black mb-8 text-center">
                    Onze Keukenfilosofie
                  </h2>
                  <p className="typography-body-large text-gray-600 mb-12 max-w-3xl mx-auto text-center">
                    Ambacht eerst: huisgemaakte fonds en sauzen, klassiekers met lichte accenten en seizoensproducten van dichtbij. À la carte of dagsuggesties.
                  </p>
                  <div className="w-32 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto" />
                </motion.div>

                {/* Three Column Approach */}
                <div className="grid md:grid-cols-3 gap-12 mb-24">
                  {/* Seasonal Ingredients */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Leaf className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="typography-h3 text-black mb-4">
                      Puur in Smaak & Textuur
                    </h3>
                    <p className="typography-body text-gray-600">
                      Balans in temperatuur en textuur: denk aan lauwwarme asperges met beurre blanc, krokant en romig in één hap.
                    </p>
                  </motion.div>

                  {/* Classic & Gastronomic */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ChefHat className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="typography-h3 text-black mb-4">
                      Ambacht & Traditie
                    </h3>
                    <p className="typography-body text-gray-600">
                      Traditie met vakmanschap: traag gegaard, op de graat gebakken, soms huisgerookt—altijd respect voor het product.
                    </p>
                  </motion.div>

                  {/* Flexible Approach */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Wheat className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="typography-h3 text-black mb-4">
                      Flexibiliteit
                    </h3>
                    <p className="typography-body text-gray-600">
                      Zakenlunch? We serveren vlot en rustig op verzoek. Vegetarisch of lactosevrij? We voorzien graag een alternatief.
                    </p>
                  </motion.div>
                </div>

                {/* Our Working Method */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="bg-gray-50 p-12 rounded-lg mb-16"
                >
                  <h3 className="typography-h2 text-black mb-6 text-center">
                    Onze Werkwijze
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="typography-h4 text-black mb-3">
                        Pure Smaakervaring
                      </h4>
                      <p className="typography-small text-gray-600">
                        Pure smaken staan centraal. Een voorbeeld: dagverse Noordzeevis met een lichte, heldere saus en seizoensgroenten.
                      </p>
                    </div>
                    <div>
                      <h4 className="typography-h4 text-black mb-3">
                        Ambacht op Niveau
                      </h4>
                      <p className="typography-small text-gray-600">
                        We werken met betrouwbare producenten en vismijn—kwaliteit die je proeft in elk bord.
                      </p>
                    </div>
                    <div>
                      <h4 className="typography-h4 text-black mb-3">
                        Verfijnde Presentatie
                      </h4>
                      <p className="typography-small text-gray-600">
                        Strak en verzorgd bordwerk dat de smaak versterkt. Onze beelden vertellen de rest.
                      </p>
                    </div>
                    <div>
                      <h4 className="typography-h4 text-black mb-3">
                        Persoonlijke Service
                      </h4>
                      <p className="typography-small text-gray-600">
                        Attente bediening met oog voor detail: wijnsuggesties, allergenenadvies en een tempo dat past bij jouw lunch of diner.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="text-center border-t border-gray-200 pt-8"
                >
                  <p className="typography-body text-gray-600 mb-4">
                    Geïnspireerd door onze keuken?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="/menu"
                      className="inline-block px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors typography-button"
                    >
                      Bekijk onze kaart
                    </a>
                    <a
                      href="/contact"
                      className="inline-block px-8 py-3 border border-black text-black hover:bg-black hover:text-white transition-colors typography-button"
                    >
                      Reserveer voor lunch of zakenlunch
                    </a>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  )
}