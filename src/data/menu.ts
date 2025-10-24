export interface MenuItem {
  name: string;
  description?: string;
  price?: string;
  dietary?: string[];
}

export interface MenuSection {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

export const menuSections: MenuSection[] = [
  {
    id: "starters",
    name: "Voorgerechten",
    description: "Een selectie van verfijnde amuses en koude voorgerechten om de toon te zetten.",
    items: [
      {
        name: "Amuses van de chef",
        description: "Drie dagelijkse hapjes"
      },
      {
        name: "Handgesneden tonijntartaar",
        description: "Avocado, citrus, sesam"
      },
      {
        name: "Gebakken foie gras",
        description: "Vijgencompote, brioche"
      }
    ]
  },
  {
    id: "mains",
    name: "Hoofdgerechten",
    description: "Klassiekers met seizoensproducten en moderne afwerking.",
    items: [
      {
        name: "Rundertournedos 'Rossini'",
        description: "Truffelsaus, foie gras, seizoensgroenten"
      },
      {
        name: "Zeebaars uit de Middellandse Zee",
        description: "Saffraanrisotto, venkelconfijt"
      },
      {
        name: "Botergegaarde kreeft",
        description: "Groenten met vanilleglans, koraalsaus"
      },
      {
        name: "Risotto met wilde paddenstoelen",
        description: "Truffelolie, oude kaas",
        dietary: ["Vegetarisch"]
      }
    ]
  },
  {
    id: "desserts",
    name: "Desserts",
    description: "Zoete afsluiters met verfijnde texturen.",
    items: [
      {
        name: "Grand Marnier-soufflé",
        description: "Crème anglaise"
      },
      {
        name: "Chocoladedessert",
        description: "Pure chocolademousse, hazelnootkrokant"
      },
      {
        name: "Belgische cheesecake",
        description: "Bessencompote, basilicumijs"
      }
    ]
  }
];

const hiddenMenuSectionIds = new Set<MenuSection['id']>([
  "starters",
  "mains",
]);

export const visibleMenuSections = menuSections.filter(
  (section) => !hiddenMenuSectionIds.has(section.id)
);
