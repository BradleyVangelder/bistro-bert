import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond, Montserrat } from "next/font/google";
import Header from "@/components/layout/Header";
import MainContent from "@/components/layout/MainContent";
import SkipLinks from "@/components/ui/SkipLinks";
import WebVitalsMonitor from "@/components/performance/WebVitalsMonitor";
import PerformanceOptimizer from "@/components/performance/PerformanceOptimizer";
import { HighContrastProvider } from "@/contexts/HighContrastContext";
import { RestaurantJsonLd } from "@/components/ui/RestaurantJsonLd";
import ZenchefWidget from "@/components/ui/ZenchefWidget";
import "./globals.css";

const inter = Inter({
  variable: "--font-suisse",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false, // Load on demand
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-elegant",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false, // Load on demand
});

const montserrat = Montserrat({
  variable: "--font-luxury",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
  display: "swap",
  preload: false, // Load on demand
});

export const metadata: Metadata = {
  title: {
    default: "Bistro Bert Laakdal — Seizoenskeuken",
    template: "%s | Bistro Bert Laakdal"
  },
  description: "Belgische klassiekers met finesse in Laakdal, Antwerpse Kempen. Dagvers en seizoensgebonden. Reserveer voor lunch of diner.",
  icons: {
    icon: "/bistro-bert-logo.png",
    shortcut: "/bistro-bert-logo.png",
    apple: "/bistro-bert-logo.png",
  },
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
  metadataBase: new URL("https://www.bistro-bert.be"),
  alternates: {
    canonical: "https://www.bistro-bert.be",
    languages: {
      "nl-BE": "https://www.bistro-bert.be/nl",
    },
  },
  openGraph: {
    title: "Bistro Bert Laakdal — Seizoenskeuken",
    description: "Belgische klassiekers met finesse in Laakdal, Antwerpse Kempen. Dagvers en seizoensgebonden. Reserveer voor lunch of diner.",
    url: "https://www.bistro-bert.be",
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
    title: "Bistro Bert Laakdal — Seizoenskeuken",
    description: "Belgische klassiekers met finesse in Laakdal, Antwerpse Kempen. Dagvers en seizoensgebonden. Reserveer voor lunch of diner.",
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Bistro Bert',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head>
        <link rel="alternate" hrefLang="nl-BE" href="https://www.bistro-bert.be" />
        <link rel="alternate" hrefLang="x-default" href="https://www.bistro-bert.be" />
        <RestaurantJsonLd />
        {/* Zenchef Widget SDK */}
        <script
          dangerouslySetInnerHTML={{
            __html: `;(function (d, s, id) {const el = d.getElementsByTagName(s)[0]; if (d.getElementById(id) || el.parentNode == null) {return;} var js = d.createElement(s);  js.id = id; js.async = true; js.src = 'https://sdk.zenchef.com/v1/sdk.min.js';  el.parentNode.insertBefore(js, el); })(document, 'script', 'zenchef-sdk')`
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable} ${montserrat.variable} font-suisse antialiased`}
      >
        <HighContrastProvider>
          <SkipLinks />
          <Header />
          <MainContent>{children}</MainContent>

          {/* Zenchef Widget - available on all pages */}
          <ZenchefWidget />

          {/* Performance Monitoring */}
          <WebVitalsMonitor />
          <PerformanceOptimizer />
        </HighContrastProvider>
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