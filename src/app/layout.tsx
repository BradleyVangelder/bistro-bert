import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import MainContent from "@/components/layout/MainContent";
import SkipLinks from "@/components/ui/SkipLinks";
import WebVitalsMonitor from "@/components/performance/WebVitalsMonitor";
import { WebVitalsDebug } from "@/components/performance/WebVitalsMonitor";
import PerformanceOptimizer from "@/components/performance/PerformanceOptimizer";
import { PerformanceDebug } from "@/components/performance/PerformanceOptimizer";
import "./fonts.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-suisse",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Bistro Bert Laakdal | Luxe Restaurant & Fine Dining | Antwerpse Kempen",
    template: "%s | Bistro Bert Laakdal"
  },
  description: "Ervaar culinaire excellentie in een sfeer van verfijnde elegantie. Bistro Bert in Laakdal, waar passie en precisie samenkomen op elk bord.",
  keywords: [
    "Bistro Bert Laakdal",
    "luxe restaurant",
    "fine dining",
    "Belgische keuken",
    "culinaire ervaring",
    "restaurant Laakdal",
    "Antwerpse Kempen",
    "reserveren",
    "expressieve gerechten",
    "verfijnde sfeer"
  ],
  authors: [{ name: "Bistro Bert" }],
  creator: "Bistro Bert",
  publisher: "Bistro Bert",
  formatDetection: {
    email: true,
    telephone: true,
    address: true,
  },
  metadataBase: new URL("https://bistrobert.be"),
  alternates: {
    canonical: "https://bistrobert.be",
    languages: {
      "nl-BE": "https://bistrobert.be/nl",
      "fr-BE": "https://bistrobert.be/fr",
    },
  },
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
    site: "@bistrobert",
    creator: "@bistrobert",
    images: ["/images/restaurant/hero-moody-wine-bar.jpg"],
    title: "Bistro Bert Laakdal | Luxe Restaurant & Fine Dining",
    description: "Ervaar culinaire excellentie in een sfeer van verfijnde elegantie.",
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Bistro Bert',
  },
  other: {
    'script:ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Bistro Bert',
      description: 'Luxe restaurant met verfijnde Belgische keuken in Laakdal',
      url: 'https://bistrobert.be',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl-BE">
      <head>
        <link rel="alternate" hrefLang="nl-BE" href="https://bistrobert.be" />
        <link rel="alternate" hrefLang="fr-BE" href="https://bistrobert.be/fr" />
        <link rel="alternate" hrefLang="x-default" href="https://bistrobert.be" />
      </head>
      <body
        className={`${inter.variable} font-suisse antialiased`}
      >
        <SkipLinks />
        <Header />
        <MainContent>{children}</MainContent>

        {/* Performance Monitoring */}
        <WebVitalsMonitor />
        <PerformanceOptimizer />

        {/* Debug Components (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <>
            <WebVitalsDebug />
            <PerformanceDebug />
          </>
        )}
      </body>
    </html>
  );
}


export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};