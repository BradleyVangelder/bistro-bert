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
    id: "suggestions",
    name: "Suggesties",
    description: "Seizoensgebonden suggesties van de chef.",
    items: [
      {
        name: "Bruschetta pomodoro (5 stuks)",
        description: "Tomaat, basilicum, look",
        price: "18,00"
      },
      {
        name: "Steak tartare - brioche",
        description: "Rode ui, zure room, bieslook",
        price: "22,00"
      },
      {
        name: "Tomaat - burrata",
        description: "Pesto, Serranoham",
        price: "19,00"
      },
      {
        name: "Carpaccio",
        description: "Pecorino, kappertjes, basilicum piccolino",
        price: "21,00"
      },
      {
        name: "Coquilles",
        description: "Salie beurre blanc, lente-ui",
        price: "23,00"
      },
      {
        name: "Wilde tarbot",
        description: "Dijonaise, spinazie, aardappel",
        price: "59,00"
      },
      {
        name: "Tomaat garnaal",
        description: "Sla, ei, grijze Noordzeegarnalen",
        price: "31,00"
      },
      {
        name: "Mosselen natuur (800 g - 1,2 kg)",
        description: "Zeeuwse Goudmerk, frietjes, mosselsaus",
        price: "25,00 - 30,00"
      },
      {
        name: "Mosselen witte wijn of look-room (800 g - 1,2 kg)",
        description: "Zeeuwse Goudmerk, frietjes, mosselsaus",
        price: "27,00 - 32,00"
      },
      {
        name: "Tagliatelle mosselen",
        description: "Nduja, witte wijn",
        price: "30,00"
      },
      {
        name: "Rib-eye",
        description: "Salade van venkel en witloof",
        price: "41,00"
      },
      {
        name: "Tagliata di Manzo 600 g (2 p.)",
        description: "Rucola, kerstomaat, parmezaan, balsamico",
        price: "62,00"
      },
      {
        name: "Scroppino",
        description: "Citroensorbet, limoncello, prosecco",
        price: "12,00"
      }
    ]
  },
  {
    id: "pasta",
    name: "Pasta",
    items: [
      {
        name: "Spaghetti bolognaise",
        description: "Onze klassieke bolognaise",
        price: "20,00"
      },
      {
        name: "Spaghetti carbonara",
        description: "Pancetta, ei, parmezaan, peterselie",
        price: "21,00"
      },
      {
        name: "Linguine diabolique",
        description: "Scampi, paprika, tomaat",
        price: "23,00"
      },
      {
        name: "Fusili feta courgette",
        description: "Pijnboompitten, rucola, tomaat",
        price: "21,00"
      }
    ]
  },
  {
    id: "salads",
    name: "Salades",
    items: [
      {
        name: "Caesar salad",
        description: "Romeinse sla, kip, ei, parmezaan, dressing",
        price: "23,00"
      },
      {
        name: "Geitenkaas",
        description: "Witloof, vijgen, granaatappel, honing, spek",
        price: "23,00"
      },
      {
        name: "Scampi",
        description: "Granny Smith, zongedroogde tomaat, spek",
        price: "24,00"
      },
      {
        name: "Thai beef salad",
        description: "Rosbief, sojascheuten, koriander, chili",
        price: "24,00"
      }
    ]
  },
  {
    id: "starters",
    name: "Voorgerechten",
    items: [
      {
        name: "Tataki tonijn",
        description: "Sesam, munt, crème van erwt, sojasaus",
        price: "20,00"
      },
      {
        name: "Zalm tartaar",
        description: "Bieslook, dillecrème, kroepoek, dragonolie",
        price: "18,00"
      },
      {
        name: "Vitello tonnato",
        description: "Kappertjes, tomaat, parmezaan, zwarte look",
        price: "18,00"
      },
      {
        name: "Steak tartare",
        description: "Uitjes, kappertjes, worcester, tabasco",
        price: "18,00"
      },
      {
        name: "Carpaccio venkel",
        description: "Pijnboompitten, gemarineerde komkommer",
        price: "16,00"
      },
      {
        name: "Gamba's à la plancha",
        description: "Kruidenboter, optie: spicy",
        price: "20,00"
      },
      {
        name: "Kaaskroket",
        description: "Peterselie, citroen",
        price: "9,00 - 17,00"
      },
      {
        name: "Garnaalkroket",
        description: "Grijze Noordzeegarnalen, peterselie, cocktailsaus",
        price: "11,00 - 21,00"
      },
      {
        name: "Duo van kroketten",
        description: "Peterselie, citroen, cocktailsaus",
        price: "19,00"
      }
    ]
  },
  {
    id: "mains",
    name: "Hoofdgerechten",
    description: "Met frietjes, kroketjes, puree of pasta waar aangeduid.",
    items: [
      {
        name: "Steak",
        description: "Salade, bijgerecht en saus naar keuze",
        price: "30,00"
      },
      {
        name: "Filet pur",
        description: "Salade, bijgerecht en saus naar keuze",
        price: "40,00"
      },
      {
        name: "Entrecôte",
        description: "Salade, bijgerecht en saus naar keuze",
        price: "38,00"
      },
      {
        name: "Steak tartare",
        description: "Salade, frietjes",
        price: "29,00"
      },
      {
        name: "Parelhoenfilet",
        description: "Boschampignons, rode wijn en bijgerecht",
        price: "30,00"
      },
      {
        name: "Catch of the day",
        description: "Vis volgens marktaanbod en bijgerecht",
        price: "30,00"
      },
      {
        name: "Zeetong à la meunière",
        description: "Tartaar, salade en bijgerecht",
        price: "59,00"
      },
      {
        name: "Risotto zeebaars",
        description: "Champignons, spinazie, bisque",
        price: "30,00"
      },
      {
        name: "Gamba's à la plancha",
        description: "Fijne brunoise, kruidenboter, look, optie: spicy",
        price: "30,00"
      },
      {
        name: "Vispannetje",
        description: "Noordzeevis, bisque en bijgerecht",
        price: "27,00"
      },
      {
        name: "Vol-au-vent",
        description: "Bijgerecht, salade",
        price: "26,00"
      },
      {
        name: "Varkenswangen",
        description: "Triple d'Anvers, salade en bijgerecht",
        price: "29,00"
      },
      {
        name: "Krokante vis",
        description: "Tartaar, salade en bijgerecht",
        price: "25,00"
      },
      {
        name: "Vegetarische curry",
        description: "Kikkererwten, groenten, kruiden",
        price: "25,00"
      }
    ]
  },
  {
    id: "extras",
    name: "Extra's",
    items: [
      { name: "Gemengde sla", price: "4,00" },
      { name: "Witloofsla", price: "4,00" },
      { name: "Gratin", price: "5,00" },
      { name: "Friet, kroketjes, puree of pasta", price: "4,00" },
      { name: "Extra brood en boter", price: "2,50" }
    ]
  },
  {
    id: "small-dishes",
    name: "Kleine gerechten",
    items: [
      { name: "Mini bolognaise", price: "14,00" },
      { name: "Mini vol-au-vent", price: "15,00" },
      { name: "Mini steak", price: "20,00" },
      { name: "Krokant visje", price: "15,00" }
    ]
  }
];

export const visibleMenuSections = menuSections;
