import Script from "next/script";

export function MenuJsonLd() {
  return (
    <Script id="ld-menu" type="application/ld+json" dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Menu",
        "inLanguage": "nl",
        "name": "Menukaart Bistro Bert",
        "description": "Seizoensgebonden, dagvers en precies bereid—dagsuggesties naast onze klassiekers.",
        "hasMenuSection": [
          {
            "@type": "MenuSection",
            "name": "Voorgerechten",
            "hasMenuItem": [
              {
                "@type": "MenuItem",
                "name": "Amuses van de chef",
                "description": "Drie dagelijkse hapjes"
              },
              {
                "@type": "MenuItem",
                "name": "Handgesneden tonijntartaar",
                "description": "Avocado, citrus, sesam"
              },
              {
                "@type": "MenuItem",
                "name": "Gebakken foie gras",
                "description": "Vijgencompote, brioche"
              }
            ]
          },
          {
            "@type": "MenuSection",
            "name": "Hoofdgerechten",
            "hasMenuItem": [
              {
                "@type": "MenuItem",
                "name": "Rundertournedos 'Rossini'",
                "description": "Truffelsaus, foie gras, seizoensgroenten"
              },
              {
                "@type": "MenuItem",
                "name": "Zeebaars uit de Middellandse Zee",
                "description": "Saffraanrisotto, venkelconfijt"
              },
              {
                "@type": "MenuItem",
                "name": "Botergegaarde kreeft",
                "description": "Groenten met vanilleglans, koraalsaus"
              },
              {
                "@type": "MenuItem",
                "name": "Risotto met wilde paddenstoelen",
                "description": "Truffelolie, oude kaas"
              }
            ]
          },
          {
            "@type": "MenuSection",
            "name": "Desserts",
            "hasMenuItem": [
              {
                "@type": "MenuItem",
                "name": "Grand Marnier-soufflé",
                "description": "Crème anglaise"
              },
              {
                "@type": "MenuItem",
                "name": "Chocoladedessert",
                "description": "Pure chocolademousse, hazelnootkrokant"
              },
              {
                "@type": "MenuItem",
                "name": "Belgische cheesecake",
                "description": "Bessencompote, basilicumijs"
              }
            ]
          }
        ]
      })
    }} />
  );
}