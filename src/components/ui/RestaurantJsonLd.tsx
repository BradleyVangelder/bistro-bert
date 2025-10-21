import Script from "next/script";

export function RestaurantJsonLd() {
  return (
    <Script id="ld-restaurant" type="application/ld+json" dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": ["Restaurant", "LocalBusiness"],
        "name": "Bistro Bert",
        "description": "Seizoensgebonden Belgische keuken in Laakdal. Dagverse klassiekers met moderne verfijning en passie voor service.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Verboekt 121",
          "addressLocality": "Laakdal",
          "postalCode": "2430",
          "addressCountry": "BE"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 51.0843,
          "longitude": 5.0996
        },
        "areaServed": {
          "@type": "Place",
          "name": "Laakdal"
        },
        "telephone": "+32 13 48 01 39",
        "url": "https://www.bistro-bert.be",
        "menu": "https://www.bistro-bert.be/menukaart",
        "sameAs": ["https://www.instagram.com/bistrobert"],
        "openingHoursSpecification": [{
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
          "opens": "10:00",
          "closes": "22:00"
        }],
        "servesCuisine": "Seizoensgebonden keuken",
        "priceRange": "€€-€€€",
        "url": "https://www.bistro-bert.be",
        "menu": "https://www.bistro-bert.be/menukaart",
        "sameAs": ["https://www.instagram.com/bistrobert"],
        "openingHoursSpecification": [{
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
          "opens": "10:00",
          "closes": "22:00"
        }]
      })
    }} />
  );
}