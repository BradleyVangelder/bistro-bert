# Bistro Bert On-Page SEO Optimization Plan

## Executive Summary

This comprehensive on-page optimization plan is designed to enhance Bistro Bert's search engine visibility and user experience. As a luxury restaurant in Laakdal, Belgium, the website needs to effectively target both Dutch and French-speaking customers while maintaining its sophisticated brand identity.

## 1. Meta Tags Optimization

### 1.1 Title Tag Optimization

#### Homepage
**Current:** `Bistro Bert | Fine Dining Experience`
**Recommended:** `Bistro Bert Laakdal | Luxe Restaurant & Fine Dining | Antwerpse Kempen`

**Implementation:**
```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: "Bistro Bert Laakdal | Luxe Restaurant & Fine Dining | Antwerpse Kempen",
    template: "%s | Bistro Bert Laakdal"
  },
  description: "Ervaar culinaire excellentie in een sfeer van verfijnde elegantie. Bistro Bert in Laakdal, waar passie en precisie samenkomen op elk bord.",
  // Additional meta tags will be added below
};
```

#### Menu Page
**Current:** `Reserveer Uw Tafel | Bistro Bert`
**Recommended:** `À La Carte Menu | Bistro Bert Laakdal | Verfijnde Belgische Keuken`

**Implementation:**
```typescript
// src/app/menu/page.tsx
export const metadata: Metadata = {
  title: "À La Carte Menu | Bistro Bert Laakdal | Verfijnde Belgische Keuken",
  description: "Ontdek onze verfijnde à la carte menukaart met seizoensgebonden gerechten. Ambachtelijke Belgische keuken in het hart van Laakdal, Antwerpse Kempen.",
  openGraph: {
    title: "À La Carte Menu | Bistro Bert Laakdal",
    description: "Verfijnde Belgische keuken met seizoensgebonden ingrediënten",
    images: [
      {
        url: "/images/restaurant/cuisine.jpg",
        width: 1200,
        height: 630,
        alt: "Bistro Bert Cuisine",
      },
    ],
  },
};
```

#### Contact Page
**Current:** `Reserveer Uw Tafel | Bistro Bert`
**Recommended:** `Reserveer Tafel | Bistro Bert Laakdal | Luxe Restaurant Reserveringen`

**Implementation:**
```typescript
// src/app/contact/page.tsx
export const metadata: Metadata = {
  title: "Reserveer Tafel | Bistro Bert Laakdal | Luxe Restaurant Reserveringen",
  description: "Reserveer uw tafel bij Bistro Bert in Laakdal voor een exclusieve fine dining ervaring. Eenvoudig online reserveren voor een onvergetelijke culinaire avond.",
  openGraph: {
    title: "Reserveer Tafel | Bistro Bert Laakdal",
    description: "Exclusieve fine dining reserveringen in Laakdal",
    images: [
      {
        url: "/images/restaurant/dining-room.jpg",
        width: 1200,
        height: 630,
        alt: "Bistro Bert Dining Room",
      },
    ],
  },
};
```

### 1.2 Meta Description Optimization

#### Homepage
**Current:** "Experience culinary excellence in an atmosphere of sophisticated elegance. Where passion meets precision on every plate."
**Recommended:** "Ervaar culinaire excellentie bij Bistro Bert in Laakdal. Verfijnde Belgische keuken in een sfeer van elegante luxe. Perfect voor speciale gelegenheden en zakelijke diners. Reserveer nu!"

#### Menu Page
**Recommended:** "Ontdek onze verfijnde à la carte menukaart met seizoensgebonden gerechten. Ambachtelijke Belgische keuken bereid met passie en precisie. Bekijk ons menu en reserveer uw tafel."

#### Contact Page
**Recommended:** "Reserveer uw tafel bij Bistro Bert in Laakdal voor een exclusieve fine dining ervaring. Eenvoudig online reserveren of bel +32 14 12 34 56. Perfect voor romantische diners en zakelijke afspraken."

### 1.3 Open Graph Tags Implementation

**Implementation for all pages:**
```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  // ... existing metadata
  openGraph: {
    title: "Bistro Bert Laakdal | Luxe Restaurant & Fine Dining",
    description: "Ervaar culinaire excellentie in een sfeer van verfijnde elegantie. Bistro Bert in Laakdal, waar passie en precisie samenkomen op elk bord.",
    url: "https://bistrobert.be",
    siteName: "Bistro Bert",
    locale: "nl_BE",
    type: "website",
    images: [
      {
        url: "/images/restaurant/hero-moody-wine-bar.jpg",
        width: 1200,
        height: 630,
        alt: "Bistro Bert Luxury Dining",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/restaurant/hero-moody-wine-bar.jpg"],
    title: "Bistro Bert Laakdal | Luxe Restaurant & Fine Dining",
    description: "Ervaar culinaire excellentie in een sfeer van verfijnde elegantie.",
  },
};
```

### 1.4 Twitter Card Implementation

**Implementation:**
```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  // ... existing metadata
  twitter: {
    card: "summary_large_image",
    site: "@bistrobert",
    creator: "@bistrobert",
    images: ["/images/restaurant/hero-moody-wine-bar.jpg"],
    title: "Bistro Bert Laakdal | Luxe Restaurant & Fine Dining",
    description: "Ervaar culinaire excellentie in een sfeer van verfijnde elegantie.",
  },
};
```

### 1.5 Canonical Tag Implementation

**Implementation:**
```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  // ... existing metadata
  alternates: {
    canonical: "https://bistrobert.be",
  },
};
```

### 1.6 Hreflang Tags for Dutch/French Language Support

**Implementation:**
```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  // ... existing metadata
  alternates: {
    canonical: "https://bistrobert.be",
    languages: {
      "nl-BE": "https://bistrobert.be/nl",
      "fr-BE": "https://bistrobert.be/fr",
    },
  },
};
```

## 2. Header Tag Structure

### 2.1 H1, H2, H3 Hierarchy Optimization

#### Homepage
**Current Issues:**
- Single H1 tag is properly used
- H2 tags are missing in some sections
- Inconsistent heading hierarchy

**Recommended Structure:**
```html
<!-- Homepage -->
<h1>Bistro Bert</h1>
<h2>Ervaar Culinaire Excellentie in Laakdal</h2>
<h3>Verfijnde Belgische Keuken</h3>
<h3>Seizoensgebonden Ingredienten</h3>
<h3>Exclusieve Sfeer</h3>

<h2>Onze Culinaire Filosofie</h2>
<h3>Passie voor Perfectie</h3>
<h3>Lokale Producten</h3>
<h3>Ambachtelijke Bereiding</h3>

<h2>Restaurant Galerie</h2>
<h3>Eetzaal</h3>
<h3>Keuken</h3>
<h3>Wijnkelder</h3>
```

#### Menu Page
**Recommended Structure:**
```html
<!-- Menu Page -->
<h1>Verfijnde À La Carte</h1>
<h2>Onze Culinaire Filosofie</h2>
<h3>Seizoensgebonden Ingredienten</h3>
<h3>Ambacht & Traditie</h3>
<h3>Flexibiliteit</h3>

<h2>Onze Werkwijze</h2>
<h3>Pure Smaakervaring</h3>
<h3>Lokale Partnerschappen</h3>
<h3>Verfijnde Presentatie</h3>
<h3>Persoonlijke Service</h3>

<h2>Seizoenshoogtepunten</h2>
```

#### Contact Page
**Recommended Structure:**
```html
<!-- Contact Page -->
<h1>Reserveer Uw Tafel</h1>
<h2>Gastvrijheid</h2>
<h3>Adres</h3>
<h3>Exclusieve Reserveringen</h3>
<h3>E-mail</h3>
<h3>Openingsuren</h3>
```

### 2.2 Keyword Integration in Headings

**Primary Keywords to Include:**
- Brand + Location: "Bistro Bert Laakdal"
- Luxury: "Luxe Restaurant", "Fine Dining", "Verfijnde"
- Cuisine: "Belgische Keuken", "Culinaire", "À La Carte"
- Service: "Reserveringen", "Gastvrijheid", "Exclusieve"

### 2.3 Proper Semantic HTML Structure

**Implementation Example:**
```typescript
// src/app/page.tsx - Hero Section
<section className="relative h-screen w-full overflow-hidden">
  <h1 className="text-[3.5rem] md:text-[4rem] font-light text-white leading-[0.9] tracking-[-0.015em] drop-shadow-lg font-serif mb-4">
    Bistro Bert Laakdal
  </h1>
  <p className="text-[1.2rem] text-white/90 leading-relaxed drop-shadow-lg font-luxury mb-6 max-w-2xl">
    Ervaar culinaire excellentie in een sfeer van verfijnde elegantie
  </p>
</section>

// src/app/page.tsx - Menu Section
<section id="menu" className="min-h-screen bg-white py-40">
  <div className="max-w-5xl mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
      <div className="space-y-16">
        <h2 className="text-[6rem] md:text-[7rem] font-light text-black leading-[0.85] tracking-[-0.015em] font-serif">
          Verfijnde Belgische Keuken
        </h2>
        <h3 className="text-[2rem] font-light text-black mb-4 font-serif">
          Seizoensgebonden Excellentie
        </h3>
        <p className="text-[1.3rem] text-gray-600 leading-relaxed mt-16 max-w-md font-luxury">
          Bij Bistro Bert maken we gerechten waar we zelf van zouden houden. Met aandacht voor verse seizoensproducten en een passie voor smaak die je proeft.
        </p>
      </div>
    </div>
  </div>
</section>
```

## 3. Content Optimization

### 3.1 Homepage Content Optimization

**Current Content Issues:**
- Limited text content for SEO
- Missing keyword integration
- No clear value proposition

**Recommended Content Structure:**
```html
<!-- Hero Section -->
<section>
  <h1>Bistro Bert Laakdal</h1>
  <p>Ervaar culinaire excellentie in een sfeer van verfijnde elegantie. Ons luxe restaurant in het hart van Laakdal biedt een unieke fine dining ervaring met de beste Belgische keuken.</p>
</section>

<!-- About Section -->
<section>
  <h2>Onze Culinaire Filosofie</h2>
  <p>Bistro Bert is meer dan een restaurant; het is een bestemming waar passie voor koken samenkomen met verfijnde gastvrijheid. Gelegen in Laakdal, in de prachtige Antwerpse Kempen, bieden wij een unieke eetervaring die zowel locals als bezoekers betovert.</p>
  
  <h3>Passie voor Perfectie</h3>
  <p>Onze chef-kok combineert traditionele Belgische recepten met moderne technieken, waarbij elk gerecht een verhaal vertelt van vakmanschap en toewijding.</p>
  
  <h3>Lokale Seizoensproducten</h3>
  <p>Wij werken exclusief met lokale leveranciers uit de Antwerpse Kempen, die ons voorzien van de meest verse seizoensgebonden ingrediënten. Van verse vis tot biologische groenten, elk product wordt met zorg geselecteerd.</p>
  
  <h3>Exclusieve Sfeer</h3>
  <p>Ons restaurant biedt een intieme en verfijnde sfeer, perfect voor romantische diners, zakelijke afspraken of speciale gelegenheden. Met aandacht voor elk detail creëren wij een onvergetelijke ervaring.</p>
</section>

<!-- Unique Selling Points -->
<section>
  <h2>Waarom Kiezen voor Bistro Bert?</h2>
  <ul>
    <li><strong>Michelin-waardige keuken</strong> - Verfijnde gerechten bereid met passie en precisie</li>
    <li><strong>Lokale ingrediënten</strong> - Verse producten uit de Antwerpse Kempen</li>
    <li><strong>Uitgebreide wijnkaart</strong> - Carefully geselecteerde wijnen die perfect complementeren onze gerechten</li>
    <li><strong>Persoonlijke service</strong> - Attente bediening die uw dinerervaring compleet maakt</li>
    <li><strong>Exclusieve ambiance</strong> - Verfijnde sfeer perfect voor speciale gelegenheden</li>
  </ul>
</section>
```

### 3.2 Menu Page Optimization

**Recommended Content Structure:**
```html
<!-- Menu Introduction -->
<section>
  <h1>Verfijnde À La Carte Menu</h1>
  <p>Ontdek onze uitgebreide à la carte menukaart, waar elk gerecht een viering is van de Belgische culinaire traditie. Onze chef-kok creëert met passie gerechten die zowel visueel verbluffend als culinair uitmuntend zijn.</p>
  
  <h2>Seizoensgebonden Excellentie</h2>
  <p>Onze menukaart verandert met de seizoenen, zodat wij altijd de meest verse en smaakvolle ingrediënten kunnen serveren. Van lente groenten tot winterse wildgerechten, elk seizoen brengt nieuwe culinaire hoogtepunten.</p>
</section>

<!-- Menu Categories -->
<section>
  <h2>Onze Culinaire Aanbod</h2>
  
  <h3>Voorgerechten</h3>
  <p>Onze voorgerechten introduceren u in de wereld van verfijnde smaken. Van klassieke Belgische amuses tot innovatieve creaties, elk gerecht is een perfecte start van uw culinaire reis.</p>
  
  <h3>Hoofdgerechten</h3>
  <p>Onze hoofdgerechten tonen het vakmanschap van onze chef-kok. Van perfect bereide vis tot mals vlees, elk hoofdgerecht wordt geserveerd met zorgvuldig geselecteerde bijgerechten die de smaakervaring completeren.</p>
  
  <h3>Nagerechten</h3>
  <p>Onze nagerechten zijn een feest voor de smaakpapillen. Van klassieke Belgische desserts tot moderne creaties, elk dessert is een perfecte afsluiting van uw dinerervaring.</p>
  
  <h3>Wijnkaart</h3>
  <p>Onze uitgebreide wijnkaart biedt een zorgvuldige selectie van wijnen uit België en daarbuiten. Onze sommelier adviseert u graag over de perfecte wijn-spijs combinaties.</p>
</section>

<!-- Dietary Options -->
<section>
  <h2>Dieetopties en Allergieën</h2>
  <p>Bij Bistro Bert begrijpen wij dat elke gast unieke behoeften heeft. Wij bieden diverse opties voor gasten met dieetwensen of allergieën, waaronder vegetarische, veganistische en glutenvrije gerechten. Gelieve ons bij uw reservering te informeren over eventuele dieetbeperkingen.</p>
</section>
```

### 3.3 Contact Page Optimization

**Recommended Content Structure:**
```html
<!-- Contact Introduction -->
<section>
  <h1>Reserveer Uw Tafel bij Bistro Bert</h1>
  <p>Ervaar culinaire excellentie in het hart van Laakdal. Wij nodigen u uit om uw tafel te reserveren voor een exclusieve fine dining ervaring waar verfijnde Belgische keuken en uitzonderlijke service samenkomen.</p>
  
  <h2>Uw Culinaire Reis Begint Hier</h2>
  <p>Of u nu een romantisch diner voor twee plant, een zakelijke afspraak heeft, of een speciale gelegenheid viert, Bistro Bert biedt de perfecte setting voor een onvergetelijke ervaring. Ons team staat klaar om u te verwelkomen en u te begeleiden door een culinaire reis die uw verwachtingen zal overtreffen.</p>
</section>

<!-- Reservation Information -->
<section>
  <h2>Reserveringsinformatie</h2>
  
  <h3>Openingstijden</h3>
  <p>Wij zijn geopend van dinsdag tot en met zondag, van 18:00 tot 22:00 uur. Op maandagen zijn wij gesloten. Wij raden aan om tijdig te reserveren, vooral in het weekend en tijdens feestdagen.</p>
  
  <h3>Reserveringsbeleid</h3>
  <p>Wij accepteren reserveringen tot maximaal 2 maanden vooraf. Voor groepen groter dan 8 personen verzoeken wij u contact met ons op te nemen voor speciale arrangementen. Annuleringen zijn mogelijk tot 24 uur voorafgaand aan uw reservering.</p>
  
  <h3>Dresscode</h3>
  <p>Bij Bistro Bert hanteren wij een smart casual dresscode. Wij vragen onze gasten om met respect voor de verfijnde sfeer van ons restaurant gekleed te gaan.</p>
</section>

<!-- Location Information -->
<section>
  <h2>Locatie en Bereikbaarheid</h2>
  <p>Bistro Bert is gelegen in het hart van Laakdal, in de prachtige Antwerpse Kempen. Ons restaurant is gemakkelijk bereikbaar met zowel auto als openbaar vervoer. Voor gasten die met de auto komen, bieden wij gratis parkeergelegenheid.</p>
  
  <h3>Adres</h3>
  <p>Verboekt 121, 2430 Laakdal, België</p>
  
  <h3>Routebeschrijving</h3>
  <p>Vanuit Antwerpen: Neem de E313 richting Hasselt en neem afslag 24 Laakdal. Volg de borden naar het centrum van Laakdal. Ons restaurant bevindt zich aan de Verboekt 121.</p>
</section>
```

### 3.4 Keyword Density and Natural Integration

**Primary Keywords:**
- Bistro Bert Laakdal: 3-4% density
- Luxe restaurant: 2-3% density
- Fine dining: 2-3% density
- Belgische keuken: 2-3% density
- Culinaire ervaring: 2-3% density
- Reserveren: 1-2% density

**Secondary Keywords:**
- Seizoensgebonden gerechten: 1-2% density
- Verfijnde sfeer: 1-2% density
- Antwerpse Kempen: 1-2% density
- Lokale producten: 1-2% density
- Exclusieve service: 1-2% density

### 3.5 Content Length and Depth Recommendations

**Homepage:**
- Minimum: 800-1000 words
- Recommended: 1200-1500 words
- Focus areas: Restaurant philosophy, unique selling points, chef introduction, ambiance description

**Menu Page:**
- Minimum: 600-800 words
- Recommended: 800-1000 words
- Focus areas: Menu philosophy, seasonal ingredients, dietary options, wine selection

**Contact Page:**
- Minimum: 500-700 words
- Recommended: 700-900 words
- Focus areas: Reservation process, location details, special occasions, accessibility

### 3.6 Internal Linking Structure

**Recommended Internal Links:**

**Homepage:**
- Link to menu page with anchor text: "Bekijk onze à la carte menukaart"
- Link to contact page with anchor text: "Reserveer uw tafel"
- Link to gallery section with anchor text: "Ontdek onze restaurant ambiance"

**Menu Page:**
- Link to homepage with anchor text: "Terug naar Bistro Bert home"
- Link to contact page with anchor text: "Reserveer nu voor een culinaire ervaring"
- Link to seasonal specials with anchor text: "Ontdek onze seizoensgebonden gerechten"

**Contact Page:**
- Link to homepage with anchor text: "Meer over Bistro Bert"
- Link to menu page with anchor text: "Bekijk onze menukaart"
- Link to special events with anchor text: "Vier uw speciale gelegenheid bij ons"

## 4. Image Optimization

### 4.1 Alt Text Optimization

**Current Issues:**
- Generic alt text
- Missing keywords
- Inconsistent descriptions

**Recommended Alt Text:**

**Homepage Images:**
```html
<!-- Hero Image -->
<img src="/images/restaurant/hero-moody-wine-bar.jpg" 
     alt="Bistro Bert Laakdal - Luxe restaurant met verfijnde sfeer en fine dining ambiance in de Antwerpse Kempen">

<!-- Chef Portrait -->
<img src="/images/restaurant/chef-portrait.jpg" 
     alt="Chef-kok van Bistro Bert - Meester in de Belgische culinaire kunst met passie voor seizoensgebonden gerechten">

<!-- Dining Room -->
<img src="/images/restaurant/dining-room.jpg" 
     alt="Eetzaal van Bistro Bert - Verfijnde inrichting perfect voor romantische diners en zakelijke afspraken">

<!-- Cuisine -->
<img src="/images/restaurant/cuisine.jpg" 
     alt="Culinaire hoogstandjes van Bistro Bert - Ambachtelijke Belgische keuken met moderne presentatie">

<!-- Ambiance -->
<img src="/images/restaurant/ambiance.jpg" 
     alt="Exclusieve ambiance van Bistro Bert - Intieme sfeer met aandacht voor detail en verfijnde gastvrijheid">

<!-- Service -->
<img src="/images/restaurant/service.jpg" 
     alt="Uitzonderlijke service bij Bistro Bert - Attente bediening die uw fine dining ervaring compleet maakt">
```

**Menu Page Images:**
```html
<!-- Menu Hero -->
<img src="/images/restaurant/cuisine.jpg" 
     alt="À la carte menu van Bistro Bert - Verfijnde Belgische gerechten met seizoensgebonden ingrediënten">

<!-- Seasonal Ingredients -->
<img src="/images/dining/cuisine.svg" 
     alt="Seizoensgebonden ingrediënten bij Bistro Bert - Verse lokale producten uit de Antwerpse Kempen">

<!-- Culinary Philosophy -->
<img src="/images/experience/cuisine-detail.svg" 
     alt="Culinaire filosofie van Bistro Bert - Passie voor perfectie in de Belgische keuken">
```

**Contact Page Images:**
```html
<!-- Contact Hero -->
<img src="/images/restaurant/dining-room.jpg" 
     alt="Reserveer uw tafel bij Bistro Bert - Luxe restaurant in Laakdal perfect voor speciale gelegenheden">

<!-- Location -->
<img src="/images/restaurant/ambiance.jpg" 
     alt="Bistro Bert locatie in Laakdal - Verfijnd restaurant in de prachtige Antwerpse Kempen">
```

### 4.2 File Naming Conventions

**Current Issues:**
- Generic file names
- Missing keywords
- Inconsistent structure

**Recommended File Naming:**
```
/images/restaurant/bistro-bert-hero-luxury-dining.jpg
/images/restaurant/bistro-bert-chef-culinary-expert.jpg
/images/restaurant/bistro-bert-dining-room-elegant.jpg
/images/restaurant/bistro-bert-cuisine-belgian.jpg
/images/restaurant/bistro-bert-ambiance-luxury.jpg
/images/restaurant/bistro-bert-service-excellent.jpg
/images/restaurant/bistro-bert-exterior-entrance.jpg
/images/restaurant/bistro-bert-wine-cellar-selection.jpg
/images/restaurant/bistro-bert-kitchen-culinary.jpg
/images/restaurant/bistro-bert-terrace-outdoor.jpg
```

### 4.3 Image Compression and Format Recommendations

**Next.js Image Component Optimization:**
```typescript
// src/components/ui/OptimizedImage.tsx
import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  quality?: number;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  quality = 85,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        className={`
          duration-700 ease-in-out
          ${isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'}
        `}
        onLoadingComplete={() => setIsLoading(false)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
```

**Image Format Recommendations:**
- Use WebP format for all images (Next.js automatically converts)
- Use AVIF format for supported browsers (Next.js automatically handles)
- Maintain JPEG as fallback for older browsers
- Use PNG for transparent images only
- Consider SVG for icons and simple graphics

### 4.4 Lazy Loading Implementation

**Implementation:**
```typescript
// src/components/ui/LazyImage.tsx
import Image from 'next/image';
import { useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder = 'blur',
  blurDataURL,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        className={`
          transition-opacity duration-500
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
        `}
        onLoadingComplete={() => setIsLoaded(true)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
}
```

### 4.5 Schema Markup for Images

**Implementation:**
```typescript
// src/components/ui/ImageWithSchema.tsx
import Image from 'next/image';

interface ImageWithSchemaProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  caption?: string;
  isMenuItem?: boolean;
  isEstablishmentImage?: boolean;
}

export default function ImageWithSchema({
  src,
  alt,
  width,
  height,
  className = '',
  caption,
  isMenuItem = false,
  isEstablishmentImage = false,
}: ImageWithSchemaProps) {
  const imageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: `https://bistrobert.be${src}`,
    name: alt,
    caption: caption || alt,
    width: width,
    height: height,
    ...(isMenuItem && {
      isPartOf: {
        '@type': 'Menu',
        name: 'Bistro Bert À La Carte Menu',
      },
    }),
    ...(isEstablishmentImage && {
      representsOf: {
        '@type': 'Restaurant',
        name: 'Bistro Bert',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Verboekt 121',
          addressLocality: 'Laakdal',
          postalCode: '2430',
          addressCountry: 'BE',
        },
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageSchema) }}
      />
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      {caption && (
        <figcaption className="text-sm text-gray-600 mt-2 text-center">
          {caption}
        </figcaption>
      )}
    </>
  );
}
```

## 5. Structured Data Implementation

### 5.1 LocalBusiness Schema for Restaurant Information

**Implementation:**
```typescript
// src/app/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  // ... existing metadata
  other: {
    'script:ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Bistro Bert',
      description: 'Luxe restaurant met verfijnde Belgische keuken in Laakdal',
      url: 'https://bistrobert.be',
      telephone: '+32 14 12 34 56',
      email: 'info@bistrobert.be',
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
        'https://bistrobert.be/images/restaurant/hero-moody-wine-bar.jpg',
        'https://bistrobert.be/images/restaurant/dining-room.jpg',
        'https://bistrobert.be/images/restaurant/cuisine.jpg',
      ],
      sameAs: [
        'https://instagram.com/bistrobert',
      ],
      servesCuisine: 'Belgian',
      acceptsReservations: 'True',
    }),
  },
};
```

### 5.2 Restaurant Schema for Menu and Offerings

**Implementation:**
```typescript
// src/app/menu/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  // ... existing metadata
  other: {
    'script:ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: 'Bistro Bert',
      description: 'Verfijnde Belgische keuken met seizoensgebonden ingrediënten',
      url: 'https://bistrobert.be/menu',
      telephone: '+32 14 12 34 56',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Verboekt 121',
        addressLocality: 'Laakdal',
        postalCode: '2430',
        addressCountry: 'BE',
      },
      servesCuisine: [
        'Belgian',
        'French',
        'European',
      ],
      hasMenu: 'https://bistrobert.be/menu',
      menu: {
        '@type': 'Menu',
        name: 'À La Carte Menu',
        description: 'Verfijnde Belgische keuken met seizoensgebonden ingrediënten',
        hasMenuSection: [
          {
            '@type': 'MenuSection',
            name: 'Voorgerechten',
            description: 'Verfijnde voorgerechten met lokale ingrediënten',
          },
          {
            '@type': 'MenuSection',
            name: 'Hoofdgerechten',
            description: 'Ambachtelijke hoofdgerechten uit de Belgische keuken',
          },
          {
            '@type': 'MenuSection',
            name: 'Nagerechten',
            description: 'Huisgemaakte desserts met seizoensgebonden vruchten',
          },
        ],
      },
      priceRange: '€€€',
      image: [
        'https://bistrobert.be/images/restaurant/cuisine.jpg',
      ],
    }),
  },
};
```

### 5.3 Review Schema for Customer Testimonials

**Implementation:**
```typescript
// src/components/ui/ReviewSchema.tsx
interface ReviewSchemaProps {
  reviews: Array<{
    author: string;
    rating: number;
    date: string;
    content: string;
  }>;
}

export default function ReviewSchema({ reviews }: ReviewSchemaProps) {
  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Bistro Bert',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length,
      reviewCount: reviews.length,
    },
    review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      datePublished: review.date,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
      },
      reviewBody: review.content,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
    />
  );
}
```

### 5.4 Event Schema for Special Occasions

**Implementation:**
```typescript
// src/components/ui/EventSchema.tsx
interface EventSchemaProps {
  events: Array<{
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    price?: string;
  }>;
}

export default function EventSchema({ events }: EventSchemaProps) {
  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Bistro Bert',
    location: {
      '@type': 'PostalAddress',
      streetAddress: 'Verboekt 121',
      addressLocality: 'Laakdal',
      postalCode: '2430',
      addressCountry: 'BE',
    },
    event: events.map(event => ({
      '@type': 'FoodEvent',
      name: event.name,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      location: {
        '@type': 'Place',
        name: 'Bistro Bert',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Verboekt 121',
          addressLocality: 'Laakdal',
          postalCode: '2430',
          addressCountry: 'BE',
        },
      },
      offers: event.price ? {
        '@type': 'Offer',
        price: event.price,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
      } : undefined,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
    />
  );
}
```

### 5.5 Breadcrumb Schema for Navigation

**Implementation:**
```typescript
// src/components/ui/BreadcrumbSchema.tsx
interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export default function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}
```

## 6. URL Structure Optimization

### 6.1 Clean, Keyword-Rich URLs

**Current URL Structure:**
- Homepage: `/`
- Menu Page: `/menu`
- Contact Page: `/contact`

**Recommended URL Structure:**
- Homepage: `/` (keep as is)
- Menu Page: `/menu/ala-carte` (more descriptive)
- Contact Page: `/contact/reserveren` (more descriptive)

**Implementation:**
```typescript
// src/app/menu/ala-carte/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "À La Carte Menu | Bistro Bert Laakdal | Verfijnde Belgische Keuken",
  description: "Ontdek onze verfijnde à la carte menukaart met seizoensgebonden gerechten. Ambachtelijke Belgische keuken in het hart van Laakdal, Antwerpse Kempen.",
};

export default function ALaCartePage() {
  // Menu page content
}
```

```typescript
// src/app/contact/reserveren/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Reserveer Tafel | Bistro Bert Laakdal | Luxe Restaurant Reserveringen",
  description: "Reserveer uw tafel bij Bistro Bert in Laakdal voor een exclusieve fine dining ervaring. Eenvoudig online reserveren voor een onvergetelijke culinaire avond.",
};

export default function ReserverenPage() {
  // Contact page content
}
```

### 6.2 URL Hierarchy Recommendations

**Recommended URL Structure:**
```
/ (homepage)
/menu/ala-carte (menu page)
/menu/seizoensgerechten (seasonal specials)
/menu/wijnkaart (wine list)
/contact/reserveren (reservations)
/contact/locatie (location)
/contact/openingsuren (opening hours)
/over-ons/verhaal (our story)
/over-ons/chef (chef profile)
/galerij/restaurant (restaurant gallery)
/galerij/keuken (kitchen gallery)
```

### 6.3 Redirect Strategy

**Implementation in Next.js:**
```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/menu',
        destination: '/menu/ala-carte',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/contact/reserveren',
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: process.cwd(),
  },
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
```

### 6.4 URL Parameters Handling

**Implementation:**
```typescript
// src/app/menu/ala-carte/page.tsx
import { Metadata } from 'next';

interface PageProps {
  searchParams: {
    lang?: 'nl' | 'fr';
    category?: 'voorgerechten' | 'hoofdgerechten' | 'nagerechten';
  };
}

export const metadata: Metadata = {
  title: "À La Carte Menu | Bistro Bert Laakdal | Verfijnde Belgische Keuken",
  description: "Ontdek onze verfijnde à la carte menukaart met seizoensgebonden gerechten. Ambachtelijke Belgische keuken in het hart van Laakdal, Antwerpse Kempen.",
  alternates: {
    canonical: '/menu/ala-carte',
  },
};

export default function ALaCartePage({ searchParams }: PageProps) {
  const { lang = 'nl', category } = searchParams;
  
  // Handle language and category filtering
  return (
    <div>
      {/* Page content */}
    </div>
  );
}
```

## 7. Mobile Optimization

### 7.1 Mobile-Specific Meta Tags

**Implementation:**
```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  // ... existing metadata
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Bistro Bert',
  },
};
```

### 7.2 Responsive Design Optimization

**Implementation:**
```typescript
// src/components/ui/ResponsiveContainer.tsx
import { ReactNode } from 'react';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
}

export default function ResponsiveContainer({ children, className = '' }: ResponsiveContainerProps) {
  return (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
```

**Mobile-First CSS:**
```css
/* src/app/globals.css */
/* Mobile-first approach */
.responsive-text {
  font-size: 1rem; /* Base size for mobile */
  line-height: 1.5;
}

@media (min-width: 640px) {
  .responsive-text {
    font-size: 1.125rem; /* Slightly larger for tablets */
  }
}

@media (min-width: 1024px) {
  .responsive-text {
    font-size: 1.25rem; /* Larger for desktop */
  }
}

/* Mobile-optimized spacing */
.responsive-spacing {
  padding: 1rem;
}

@media (min-width: 640px) {
  .responsive-spacing {
    padding: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .responsive-spacing {
    padding: 2rem;
  }
}
```

### 7.3 Mobile Content Prioritization

**Implementation:**
```typescript
// src/components/ui/MobilePriorityContent.tsx
import { ReactNode } from 'react';

interface MobilePriorityContentProps {
  primary: ReactNode;
  secondary?: ReactNode;
  tertiary?: ReactNode;
}

export default function MobilePriorityContent({ 
  primary, 
  secondary, 
  tertiary 
}: MobilePriorityContentProps) {
  return (
    <div className="space-y-4">
      {/* Primary content - always visible */}
      <div className="order-1">
        {primary}
      </div>
      
      {/* Secondary content - visible on medium screens and up */}
      {secondary && (
        <div className="hidden md:block order-2">
          {secondary}
        </div>
      )}
      
      {/* Tertiary content - visible on large screens only */}
      {tertiary && (
        <div className="hidden lg:block order-3">
          {tertiary}
        </div>
      )}
    </div>
  );
}
```

### 7.4 Touch-Friendly Elements

**Implementation:**
```typescript
// src/components/ui/TouchFriendlyButton.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface TouchFriendlyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
}

export default function TouchFriendlyButton({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  className = '',
  ...props 
}: TouchFriendlyButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-black text-white hover:bg-gray-800 focus:ring-black',
    secondary: 'bg-white text-black border border-black hover:bg-gray-100 focus:ring-gray-500',
  };
  
  const sizeClasses = {
    small: 'px-4 py-2 text-sm min-h-[44px]', // Minimum touch target size
    medium: 'px-6 py-3 text-base min-h-[48px]',
    large: 'px-8 py-4 text-lg min-h-[52px]',
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

**Mobile-Optimized Navigation:**
```typescript
// src/components/layout/MobileNavigation.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const pathname = usePathname();
  
  const navItems = [
    { label: 'Home', href: '/', icon: '🏠' },
    { label: 'Menu', href: '/menu/ala-carte', icon: '📋' },
    { label: 'Reserveren', href: '/contact/reserveren', icon: '📞' },
    { label: 'Locatie', href: '/contact/locatie', icon: '📍' },
  ];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 25 }}
      className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl z-50"
    >
      <div className="p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
          aria-label="Close menu"
        >
          ✕
        </button>
        
        <nav className="mt-8">
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center space-x-3 p-4 rounded-lg text-lg font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Quick contact info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Direct Contact</h3>
          <a 
            href="tel:+3214123456" 
            className="block text-lg font-medium text-black hover:text-gray-700 mb-2"
          >
            +32 14 12 34 56
          </a>
          <a 
            href="mailto:info@bistrobert.be" 
            className="block text-black hover:text-gray-700"
          >
            info@bistrobert.be
          </a>
        </div>
      </div>
    </motion.div>
  );
}
```

## Implementation Priority and Timeline

### Phase 1: Immediate Fixes (Week 1-2)
1. Meta tags optimization (title, description, Open Graph)
2. Header tag structure optimization
3. Image alt text optimization
4. Basic structured data implementation (LocalBusiness, Restaurant)

### Phase 2: Content Enhancement (Week 3-4)
1. Content expansion and keyword integration
2. Internal linking structure implementation
3. URL structure optimization with redirects
4. Mobile optimization basics

### Phase 3: Advanced Optimization (Week 5-6)
1. Advanced structured data (Reviews, Events, Breadcrumbs)
2. Image optimization (compression, lazy loading)
3. Mobile-specific enhancements
4. Performance monitoring and refinement

## Monitoring and Success Metrics

### Key Performance Indicators
1. Organic search traffic growth
2. Keyword ranking improvements for target keywords
3. Click-through rate improvements in search results
4. Mobile usability scores
5. Page load times
6. Conversion rate from organic traffic

### Monitoring Tools
1. Google Search Console
2. Google Analytics 4
3. PageSpeed Insights
4. Mobile-Friendly Test
5. Schema Markup Validator

## Conclusion

This comprehensive on-page optimization plan provides a roadmap for enhancing Bistro Bert's search engine visibility and user experience. By implementing these recommendations systematically, the restaurant website will achieve better rankings for target keywords, improved user engagement, and increased reservation conversions.

The plan focuses on both technical SEO elements and content optimization, ensuring that the website not only ranks well but also provides an exceptional user experience that reflects the luxury positioning of Bistro Bert.