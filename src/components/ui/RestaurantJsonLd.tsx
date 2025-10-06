import Script from "next/script";

export function RestaurantJsonLd() {
  return (
    <Script id="ld-restaurant" type="application/ld+json" dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context":"https://schema.org",
        "@type":"Restaurant",
        "name":"Bistro Bert",
        "url":"https://www.bistro-bert.be",
        "telephone":"+32 13 48 01 39",
        "address":{
          "@type":"PostalAddress",
          "streetAddress":"Verboeket 121",
          "postalCode":"2430",
          "addressLocality":"Laakdal",
          "addressCountry":"BE"
        },
        "menu":"https://www.bistro-bert.be/menu"
      })
    }} />
  );
}