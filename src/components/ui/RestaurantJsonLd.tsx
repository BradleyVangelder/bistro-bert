import Script from "next/script";

export const RESTAURANT_ID = "https://www.bistro-bert.be/#restaurant";

export function RestaurantJsonLd() {
  const restaurantStructuredData = {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "LocalBusiness"],
    "@id": RESTAURANT_ID,
    name: "Bistro Bert",
    description:
      "Seizoensgebonden Belgische keuken in Laakdal. Dagverse klassiekers met moderne verfijning en passie voor service.",
    url: "https://www.bistro-bert.be",
    telephone: "+32 13 48 01 39",
    priceRange: "€€-€€€",
    servesCuisine: ["Belgian", "Seasonal"],
    image: [
      "https://www.bistro-bert.be/images/restaurant/hero-moody-wine-bar.jpg",
      "https://www.bistro-bert.be/images/restaurant/dining-room.jpg",
      "https://www.bistro-bert.be/images/restaurant/cuisine.jpg"
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Verboekt 121",
      addressLocality: "Laakdal",
      postalCode: "2430",
      addressCountry: "BE"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 51.0843,
      longitude: 5.0996
    },
    sameAs: ["https://www.instagram.com/bistrobert"],
    areaServed: {
      "@type": "Place",
      name: "Laakdal"
    },
    hasMenu: {
      "@id": "https://www.bistro-bert.be/menu/#menu"
    },
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.bistro-bert.be/contact",
        actionPlatform: [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform"
        ]
      },
      result: {
        "@type": "Reservation",
        name: "Tafel reserveren bij Bistro Bert"
      }
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        opens: "11:00",
        closes: "23:00"
      }
    ]
  } as const;

  return (
    <Script
      id="ld-restaurant"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantStructuredData) }}
    />
  );
}
