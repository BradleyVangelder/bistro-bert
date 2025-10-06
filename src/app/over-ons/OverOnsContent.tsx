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

export default function OverOnsContent() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://bistrobert.be' },
    { name: 'Over Ons', url: 'https://bistrobert.be/over-ons' },
  ]

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
      <ReviewSchema reviews={sampleReviews} />

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
                        Welkom bij Bistro Bert, waar de rijke tapestry van Belgische culinaire tradities wordt geweven met de innovatieve geest van moderne gastronomie, alles in de hartelijke omgeving van Laakdal. Ons restaurant, gevestigd in een historisch pand dat de architectonële charmer van de Antwerpse Kempen weerspiegelt, is meer dan een eetgelegenheid—it is een viering van Belgische culinaire erfenis. Hier, in de rustige groene omgeving van Laakdal, dicht genoeg aan Antwerp voor toegankelijkheid yet ver genoeg voor een ontsnapping aan de stadsdrukte, hebben we een toevluchtsoord gecreëerd voor liefhebbers van verfijnde Belgische keuken. Met ruime parkeergelegenheid en een sfeer die zowel exclusief als gastvrij is, nodigen we u uit om het verhaal te ontdekken dat in elke schotel wordt verteld—een verhaal van passie, traditie, en de onvermoeibare achtervolging van culinaire perfectie.
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
                      <p className="typography-body-large text-gray-600 max-w-3xl mx-auto text-center">
                        In het hart van onze keukenfilosofie ligt een diep respect voor het Belgische culinaire ambacht—een erfenis die generaties teruggaat en die we met trots doorgeven en vernieuwen. Onze sauzen, de ziel van elke schotel, worden bereid volgens traditionele methoden waarbij we uren nemen om de complexe smaken te ontwikkelen die alleen geduld en toewijding kunnen brengen. We beginnen met huisgemaakte fonds die de basis vormen voor alles van de klassieke bearnaise tot onze innovatieve seizoensgebonden creaties. Belgische klassiekers worden behandeld met de eerbied die ze verdienen, yet we voegen lichte, eigentijdse accenten die de traditionele smaken versterken zonder te overstemmen. Onze ingrediënten, zorgvuldig geselecteerd van lokale boeren en producenten in de Antwerpse Kempen, vertellen het verhaal van onze regio—van de vruchtbare grond die onze groenten voedt tot de zuivere wateren die onze vis levert. Of u nu kiest uit onze à la carte menukaart of zich laat verrassen door onze dagsuggesties, elke ervaring is een uitnodiging om de essentie van Belgische culinaire excellentie te proeven.
                      </p>
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
                      Puur in Smaak & Textuur
                    </h3>
                    <p className="typography-body text-gray-600">
                      Culinaire perfectie manifesteert zich in de delicate balans tussen temperatuur, textuur en smaak—een harmonie die we in elke schotel nastreven. Neem onze lauwwarme witte asperges uit de Mechelse velden, precies gegaard tot ze een zachte beet behouden, bedekt met een zijdezachte beurre blanc whose subtle acidity enhances the natural sweetness of the asparagus. In één hap ervaart u de tegenstelling tussen de knapperige topping van geroosterde amandelen en de romige zachtheid van het eronderliggende gerecht. Onze steak tartaar wordt handgesneden tot de perfecte grootte, gemengd met kruiden die de smaak versterken zonder te overheersen, en geserveerd op een gekoeld bord met een warme, geroosterde ciabatta—the ultimate temperature contrast that elevates the dining experience. Elke textuur is zorgvuldig overwogen, elke temperatuur precies gekalibreerd, en elke smaak in balans gebracht om een multisensorische ervaring te creëren die zowel verfijnd als bevredigend is.
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
                      De Belgische culinaire traditie is een rijk tapestry van technieken die generaties lang zijn verfijnd—technieken die we met eerbied en precisie toepassen in onze keuken. Het langzaam garen van vlees tot het zo mals is dat het van het bot valt, een methode die teruggaat tot de middeleeuwse herbergen waar stoofschotels uren boven open vuren sudderden. Het bakken van vis op de graat, een techniek die de natuurlijke sappen en smaken behoudt die anders verloren zouden gaan. Onze huisgerookte zalm, gerookt boven een zorgvuldig geselecteerde mix van Belgisch hout, draagt de rokerige essentie van onze traditionele rookhuizen. Deze tijdloze methoden, gecombineerd met moderne inzichten in voeding en presentatie, creëren gerechten die zowel vertrouwd als verrassend zijn. We respecteren elke ingrediënt door het te behandelen met de techniek die zijn natuurlijke kwaliteiten het beste tot hun recht laat komen—een filosofie die diep geworteld is in de Belgische culinaire wijsheid dat de beste gerechten ontstaan uit respect voor het product en de traditie.
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
                      Flexibiliteit
                    </h3>
                    <p className="typography-body text-gray-600">
                      Bij Bistro Bert begrijpen we dat elke dining ervaring uniek is, en we passen ons graag aan aan uw specifieke behoeften en voorkeuren. Voor zakelijke lunches bieden we een service die zowel efficiënt als verfijnd is—met zorgvuldig getimede gangen die een vlotte vergadering mogelijk maken zonder concessies te doen aan culinaire kwaliteit. Onze vegetarische gerechten zijn een eerbetoon aan de rijke traditie van Belgische groentegerechten, van klassieke witloofrolletjes tot innovatieve creaties met seizoensgroenten van lokale boeren. Voor gasten met dieetbeperkingen—of het nu gluten, lactose of andere allergenen betreft—creëren we alternatieven die dezelfde aandacht voor smaak en presentatie krijgen als onze reguliere menukaart. Deze flexibiliteit komt voort uit onze overtuiging dat verfijnde dining voor iedereen toegankelijk moet zijn, ongeacht dieetvoorkeuren of tijdsbeperkingen. Het is deze gastgerichte aanpak, gecombineerd met onze onwrikbare toewijding aan kwaliteit, die Bistro Bert maakt tot de ideale keuze voor elke gelegenheid.
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
                      className="grid md:grid-cols-2 gap-8"
                    >
                      <StaggeredCard>
                        <h4 className="typography-h4 text-black mb-3">
                          Pure Smaakervaring
                        </h4>
                        <p className="typography-small text-gray-600">
                          In onze keuken is puurheid van smaak de heilige graal—een filosofie die begint met de onwrikbare overtuiging dat de beste ingrediënten minimale interventie vereisen om te schitteren. Neem onze dagverse Noordzeevis, binnen 24 uur na vangst bij ons afgeleverd, whose delicate sweetness and subtle brininess we versterken met een lichte, heldere saus gemaakt van witte wijn, verse kruiden uit onze tuin, en een vleugje citroen. De vis wordt gepresenteerd op een bed van seizoensgroenten die kort geblancheerd zijn om hun natuurlijke knapperigheid en voedingswaarde te behouden. Elke component op het bord heeft een doel—elke smaak is bewust gekozen om een harmonieus geheel te creëren waarin geen enkel ingrediënt de anderen overheerst. Deze aanpak, geworteld in de Belgische traditie van respect voor het product, resulteert in gerechten die niet alleen heerlijk zijn maar ook eerlijk—gerechten die de ware essentie van hun ingrediënten communiceren en de smaakpapillen prikkelen zonder te overweldigen.
                        </p>
                      </StaggeredCard>
                      <StaggeredCard>
                        <h4 className="typography-h4 text-black mb-3">
                          Ambacht op Niveau
                        </h4>
                        <p className="typography-small text-gray-600">
                          Ambacht op niveau begint bij de bron—de zorgvuldige selectie van producenten die dezelfde toewijding aan kwaliteit en ethiek delen als wij. Onze vlees komt van biologische boerderijen in de Antwerpse Kempen, waar dieren met respect worden behandeld en grazen op de vruchtbare grond die onze regio zo bijzonder maakt. De vis die we serveren wordt dagelijks aangeleverd door de vertrouwde vismijn in Zeebrugge, whose reputation for versheid en kwaliteit onberispelijk is. Onze groenten en fruit worden geoogst door lokale boeren die traditionele teeltmethoden combineren met duurzame praktijken, ensuring that each ingredient carries the essence of our terroir. Deze relaties met onze leveranciers zijn gebouwd op jarenlange samenwerking en wederzijds respect—resultaten in een consistentieniveau dat u in elke hap proeft. Van de romige boter van een lokale zuivelfabriek tot de artisanale kazen die we rijpen in onze eigen kelder, elke ingrediënt vertelt een verhaal van herkomst, vakmanschap en toewijding aan excellentie.
                        </p>
                      </StaggeredCard>
                      <StaggeredCard>
                        <h4 className="typography-h4 text-black mb-3">
                          Verfijnde Presentatie
                        </h4>
                        <p className="typography-small text-gray-600">
                          Verfijnde presentatie is de visuele vertaling van onze culinaire filosofie—een kunstvorm waarbij esthetiek en smaak samensmelten om een complete zintuiglijke ervaring te creëren. Elk bord is een canvas waarop we met precisie en creativiteit werken, waarbij kleur, textuur en vorm zorgvuldig worden gecomposeerd om zowel het oog als het palate te plezieren. Onze benadering is geïnspireerd door de Belgische traditie van elegante eenvoud—strak, verzorgd bordwerk dat de natuurlijke schoonheid van de ingrediënten benadrukt zonder te overdrijven. De placement van elke component is doordacht: een spiraal van saus die het bord omkadert, een toren van groenten die structuur en hoogte toevoegt, een garnering van verse kruiden die zowel kleur als aroma bijdraagt. Deze aandacht voor detail gaat verder dan alleen esthetiek—het versterkt de smaakervaring door visuele aanwijzingen te geven over wat komen gaat. Het resultaat is een presentatie die niet alleen visueel verbluffend is maar ook functioneel, waarbij elk element bijdraagt aan de algehele harmonie van het gerecht.
                        </p>
                      </StaggeredCard>
                      <StaggeredCard>
                        <h4 className="typography-h4 text-black mb-3">
                          Persoonlijke Service
                        </h4>
                        <p className="typography-small text-gray-600">
                          Persoonlijke service bij Bistro Bert is een kunstvorm die evenveel toewijding vereist als de keuken zelf—een delicate balans tussen professionaliteit en warmte, tussen attentie en onopvallendheid. Ons team is getraind in de subtiele kunst van het anticiperen op behoeften voordat ze worden uitgesproken, het herkennen van non-verbale signalen, en het aanpassen van de service aan de unieke dynamiek van elke tafel. Wijnsuggesties worden niet alleen geselecteerd op basis van technische perfectie maar ook op persoonlijke voorkeuren en het verhaal achter elke fles—van de kleine, familiegerunde wijngaarden in Bourgondogne tot de opkomende Belgische wijnproducenten die onze lokale terroir weerspiegelen. Allergenenadvies wordt verstrekt met de zorgvuldigheid van een specialist, ensuring that dietary restrictions become opportunities for culinary creativity rather than limitations. Het tempo van de service wordt intuïtief aangepast—energiek en efficiënt voor zakelijke lunches, ontspannen en sfeervol voor romantische diners, flexibel en speels voor speciale gelegenheden. Deze benadering, geworteld in de Belgische traditie van gastvrijheid, transformeert een maaltijd in een gedenkwaardige ervaring.
                        </p>
                      </StaggeredCard>
                    </StaggeredContainer>
                  </ScrollTriggeredStagger>
                </motion.div>

                {/* Call to Action with luxury staggered reveal */}
                <motion.div
                  ref={ctaAnimation.containerProps.ref as any}
                  variants={ctaAnimation.containerProps.variants}
                  initial={ctaAnimation.containerProps.initial}
                  animate={ctaAnimation.containerProps.animate}
                  onAnimationComplete={ctaAnimation.containerProps.onAnimationComplete}
                  className="text-center border-t border-gray-200 pt-8"
                >
                  <LuxuryStaggeredReveal
                    delay={200}
                    className="space-y-6"
                  >
                    <p className="typography-body text-gray-600 mb-4">
                      Geïnspireerd door onze keuken?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <motion.a
                        href="/menu"
                        className="inline-block px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors typography-button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Bekijk onze kaart
                      </motion.a>
                      <motion.a
                        href="/contact"
                        className="inline-block px-8 py-3 border border-black text-black hover:bg-black hover:text-white transition-colors typography-button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Reserveer voor lunch of zakenlunch
                      </motion.a>
                    </div>
                  </LuxuryStaggeredReveal>
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