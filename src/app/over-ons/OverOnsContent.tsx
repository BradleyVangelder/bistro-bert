'use client'

import { motion } from 'framer-motion'
import Footer from '@/components/layout/Footer'
import { Leaf, ChefHat, Wheat } from 'lucide-react'
import ReviewSchema from '@/components/ui/ReviewSchema'
import BreadcrumbSchema from '@/components/ui/BreadcrumbSchema'
import {
  StaggeredContainer,
  StaggeredCard,
  ScrollTriggeredStagger,
  LuxuryStaggeredReveal
} from '@/components/ui/StaggeredAnimations'
import { useStaggeredAnimation } from '@/hooks/animations/useStaggeredAnimation'
import ActionButton from '@/components/ui/ActionButton'
import { spotlightReviews } from '@/data/reviews'
import { useReservation } from '@/contexts/ReservationContext'

export default function OverOnsContent() {
  const { open } = useReservation()
  const breadcrumbItems = [
    { name: 'Home', url: 'https://www.bistro-bert.be' },
    { name: 'Over Ons', url: 'https://www.bistro-bert.be/over-ons' },
  ]

  const handleReserveClick = () => {
    open()
  }

  // Custom staggered animations for different sections
  const headerAnimation = useStaggeredAnimation({
    staggerDelay: 200,
    direction: 'up',
    threshold: 0.1,
    enablePerformanceMonitoring: true
  })

  const philosophyAnimation = useStaggeredAnimation({
    staggerDelay: 300,
    direction: 'up',
    threshold: 0.2,
    enablePerformanceMonitoring: true
  })

  const threeColumnAnimation = useStaggeredAnimation({
    staggerDelay: 150,
    direction: 'up',
    threshold: 0.1,
    enablePerformanceMonitoring: true
  })

  const workingMethodAnimation = useStaggeredAnimation({
    staggerDelay: 200,
    direction: 'fade',
    threshold: 0.2,
    enablePerformanceMonitoring: true
  })

  const ctaAnimation = useStaggeredAnimation({
    staggerDelay: 250,
    direction: 'scale',
    threshold: 0.2,
    enablePerformanceMonitoring: false
  })

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <ReviewSchema reviews={spotlightReviews} />

      <div className="min-h-screen bg-white">
        {/* Main Content */}
        <main id="main-content" role="main">
          {/* Header Section with staggered animations */}
          <section className="min-h-screen bg-white navbar-spacer py-40">
            <div className="container-dh">
              <div className="max-w-6xl mx-auto">
                <motion.div
                  ref={headerAnimation.containerProps.ref as any}
                  variants={headerAnimation.containerProps.variants}
                  initial={headerAnimation.containerProps.initial}
                  animate={headerAnimation.containerProps.animate}
                  onAnimationComplete={headerAnimation.containerProps.onAnimationComplete}
                  className="max-w-4xl mx-auto"
                >
                  {/* Page Title with staggered reveal */}
                  <ScrollTriggeredStagger
                    staggerDelay={200}
                    direction="up"
                    className="text-center mb-24"
                  >
                    <div className="space-y-6">
                      <h1 className="typography-h1 mb-6 md:mb-8">
                        Over Bistro Bert
                      </h1>
                      <p className="typography-body-large text-gray-600 max-w-3xl mx-auto">
                        We koken Belgische klassiekers met een moderne toets, pure smaken uit eigen keuken en lokale seizoensproducten.
                      </p>
                    </div>
                  </ScrollTriggeredStagger>

                  {/* Culinary Philosophy Section with luxury reveal */}
                  <motion.div
                    ref={philosophyAnimation.containerProps.ref as any}
                    variants={philosophyAnimation.containerProps.variants}
                    initial={philosophyAnimation.containerProps.initial}
                    animate={philosophyAnimation.containerProps.animate}
                    onAnimationComplete={philosophyAnimation.containerProps.onAnimationComplete}
                    className="mb-24"
                  >
                    <LuxuryStaggeredReveal
                      delay={200}
                      className="space-y-6"
                    >
                      <h2 className="typography-h2 text-black mb-6 md:mb-8 text-center">
                        Onze Keukenfilosofie
                      </h2>
                      <div className="w-32 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto" />
                    </LuxuryStaggeredReveal>
                  </motion.div>

                {/* Three Column Approach with staggered cards */}
                <StaggeredContainer
                  staggerDelay={150}
                  direction="up"
                  className="grid md:grid-cols-3 gap-12 mb-24"
                >
                  {/* Seasonal Ingredients */}
                  <StaggeredCard className="text-center">
                    <motion.div
                      className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Leaf className="w-8 h-8 text-gray-600" />
                    </motion.div>
                    <h3 className="typography-h3 text-black mb-4">
                      Puur Smaak & Textuur
                    </h3>
                    <p className="typography-body text-gray-600">
                      Balans en precisie. Onze keuken viert de essentie van het product. We zoeken naar een perfecte balans tussen smaak en textuur, waarbij elk ingrediënt zorgvuldig is gekozen om een harmonieus en verfijnd gerecht te creëren.
                    </p>
                  </StaggeredCard>

                  {/* Classic & Gastronomic */}
                  <StaggeredCard className="text-center">
                    <motion.div
                      className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChefHat className="w-8 h-8 text-gray-600" />
                    </motion.div>
                    <h3 className="typography-h3 text-black mb-4">
                      Ambacht & Traditie
                    </h3>
                    <p className="typography-body text-gray-600">
                      We omarmen klassieke kooktechnieken en eerbiedigen de traditie, maar altijd met een moderne twist. Elk gerecht wordt met de grootste zorg en respect voor het product bereid, wat resulteert in diepe en authentieke smaken.
                    </p>
                  </StaggeredCard>

                  {/* Flexible Approach */}
                  <StaggeredCard className="text-center">
                    <motion.div
                      className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Wheat className="w-8 h-8 text-gray-600" />
                    </motion.div>
                    <h3 className="typography-h3 text-black mb-4">
                      Flexibel
                    </h3>
                    <p className="typography-body text-gray-600">
                      Zakenlunch? We stemmen het tempo af. Vegetarisch of lactosevrij? We voorzien een doordachte variant.
                    </p>
                  </StaggeredCard>
                </StaggeredContainer>

                {/* Our Working Method with staggered animations */}
                <motion.div
                  ref={workingMethodAnimation.containerProps.ref as any}
                  variants={workingMethodAnimation.containerProps.variants}
                  initial={workingMethodAnimation.containerProps.initial}
                  animate={workingMethodAnimation.containerProps.animate}
                  onAnimationComplete={workingMethodAnimation.containerProps.onAnimationComplete}
                  className="bg-gray-50 p-12 rounded-lg mb-16"
                >
                  <ScrollTriggeredStagger
                    staggerDelay={200}
                    direction="up"
                    className="space-y-6"
                  >
                    <h3 className="typography-h3 text-black mb-6 text-center">
                      Onze Werkwijze
                    </h3>
                    <StaggeredContainer
                      staggerDelay={100}
                      direction="up"
                      className="grid md:grid-cols-3 gap-8"
                    >
                      <StaggeredCard>
                        <h4 className="typography-h4 text-black mb-3">
                          Puur in Smaak
                        </h4>
                        <p className="typography-small text-gray-600">
                          We werken met dagverse ingrediënten en seizoensgebonden producten, geserveerd met heldere, lichte sauzen die de natuurlijke smaken versterken.
                        </p>
                      </StaggeredCard>
                      <StaggeredCard>
                        <h4 className="typography-h4 text-black mb-3">
                          Ambacht aan de bron
                        </h4>
                        <p className="typography-small text-gray-600">
                          Producenten die we vertrouwen; kwaliteit proef je in elk bord.
                        </p>
                      </StaggeredCard>
                      <StaggeredCard>
                        <h4 className="typography-h4 text-black mb-3">
                          Presentatie
                        </h4>
                        <p className="typography-small text-gray-600">
                          Zuiver, ingetogen plating die smaak ondersteunt.
                        </p>
                      </StaggeredCard>
                    </StaggeredContainer>
                  </ScrollTriggeredStagger>
                </motion.div>

                {/* Service-notitie */}
                <motion.div
                  ref={ctaAnimation.containerProps.ref as any}
                  variants={ctaAnimation.containerProps.variants}
                  initial={ctaAnimation.containerProps.initial}
                  animate={ctaAnimation.containerProps.animate}
                  onAnimationComplete={ctaAnimation.containerProps.onAnimationComplete}
                  className="text-center mb-8"
                >
                  <p className="typography-body text-gray-600 max-w-2xl mx-auto">
                    Discrete, attente bediening. Wijnsuggesties op maat. Transparante allergeneninformatie.
                  </p>
                </motion.div>

                {/* Call to Action with luxury staggered reveal */}
                <motion.div
                  className="text-center border-t border-gray-200 pt-8"
                >
                   <div className="flex flex-col sm:flex-row button-tight-spacing justify-center">
                     <ActionButton
                       href="/menu"
                       variant="menu"
                       className="px-8 py-3"
                     >
                       Bekijk de menukaart
                     </ActionButton>
                     <ActionButton
                       onClick={handleReserveClick}
                       variant="reserve"
                       className="px-8 py-3"
                       ariaLabel="Open reserveringswidget"
                       dataZcAction="open"
                     >
                       Reserveer een tafel
                     </ActionButton>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

          {/* Footer */}
          <Footer />
        </main>
      </div>
    </>
  )
}
