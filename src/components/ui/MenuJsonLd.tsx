import Script from "next/script";

import { visibleMenuSections } from "@/data/menu";

import { RESTAURANT_ID } from "./RestaurantJsonLd";

const MENU_ID = "https://www.bistro-bert.be/menu/#menu";

const restrictedDietMap: Record<string, string> = {
  Vegetarisch: "https://schema.org/VegetarianDiet",
  Veganistisch: "https://schema.org/VeganDiet",
  Glutenvrij: "https://schema.org/GlutenFreeDiet",
};

export function MenuJsonLd() {
  const structuredMenu = {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": MENU_ID,
    inLanguage: "nl",
    name: "Menukaart Bistro Bert",
    description:
      "Seizoensgebonden, dagvers en precies bereid—dagsuggesties naast onze klassiekers.",
    url: "https://www.bistro-bert.be/menu",
    isPartOf: {
      "@id": RESTAURANT_ID
    },
    about: {
      "@id": RESTAURANT_ID
    },
    hasMenuSection: visibleMenuSections.map((section) => ({
      "@type": "MenuSection",
      name: section.name,
      description: section.description,
      hasMenuItem: section.items.map((item) => ({
        "@type": "MenuItem",
        name: item.name,
        description: item.description,
        suitableForDiet: item.dietary?.map((diet) => restrictedDietMap[diet] ?? diet)
      }))
    }))
  } as const;

  return (
    <Script
      id="ld-menu"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredMenu) }}
    />
  );
}

export { MENU_ID };
