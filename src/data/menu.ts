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
        description: "Drie dagelijkse hapjes",
        price: "18,00"
      },
      {
        name: "Handgesneden tonijntartaar",
        description: "Avocado, citrus, sesam",
        price: "22,00"
      },
      {
        name: "Gebakken foie gras",
        description: "Vijgencompote, brioche",
        price: "24,00"
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
        description: "Truffelsaus, foie gras, seizoensgroenten",
        price: "48,00"
      },
      {
        name: "Zeebaars uit de Middellandse Zee",
        description: "Saffraanrisotto, venkelconfijt",
        price: "38,00"
      },
      {
        name: "Botergegaarde kreeft",
        description: "Groenten met vanilleglans, koraalsaus",
        price: "58,00"
      },
      {
        name: "Risotto met wilde paddenstoelen",
        description: "Truffelolie, oude kaas",
        dietary: ["Vegetarisch"],
        price: "28,00"
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
        description: "Crème anglaise",
        price: "16,00"
      },
      {
        name: "Chocoladedessert",
        description: "Pure chocolademousse, hazelnootkrokant",
        price: "14,00"
      },
      {
        name: "Belgische cheesecake",
        description: "Bessencompote, basilicumijs",
        price: "15,00"
      }
    ]
  },
  {
    id: "suggestions",
    name: "Suggesties",
    description: "Seizoensgebonden suggesties van de chef.",
    items: [
      {
        name: "Wildkroketjes Chili",
        price: "14,00"
      },
      {
        name: "Foie gras, Brioche",
        description: "appel, karamel",
        price: "22,00"
      },
      {
        name: "Filet van eend",
        description: "witloof, pastinaak, appel",
        price: "29,00"
      },
      {
        name: "Hertenfilet",
        description: "schorseneren, flower sprouts, pastinaak",
        price: "29,00"
      },
      {
        name: "Biscuit, crème pâtissière",
        description: "appel, vanille, peer, Calvados",
        price: "13,00"
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
