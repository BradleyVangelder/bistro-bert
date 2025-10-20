import Script from "next/script";

export function RestaurantJsonLd() {
  return (
    <Script id="ld-restaurant" type="application/ld+json" dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": "Bistro Bert",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Verboekt 121",
          "addressLocality": "Laakdal",
          "postalCode": "2430",
          "addressCountry": "BE"
        },
        "telephone": "+32 13 48 01 39",
        "servesCuisine": "Belgian",
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