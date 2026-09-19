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
        name: "Arancini chorizo",
        description: "Risotto, chilimayonaise",
        price: "18,00"
      },
      {
        name: "Brioche ganzenlever",
        description: "Appel, karamel",
        price: "24,00"
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
        name: "Mechelse koekkoek",
        description: "Saus van morilles, slahart",
        price: "30,00"
      },
      {
        name: "Tomahawk van Brasvar",
        description: "Blackwell, witloof, gele courgette",
        price: "34,00"
      },
      {
        name: "Pasta truffel",
        description: "Zwarte herfsttruffel, parmezaan",
        price: "30,00"
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
    id: "starters",
    name: "Voorgerechten",
    items: [
      {
        name: "Tataki tonijn",
        description: "Sesam, munt, crème van erwt, sojasaus",
        price: "22,00"
      },
      {
        name: "Zalm tartaar",
        description: "Bieslook, dillecrème, kroepoek, dragonolie",
        price: "20,00"
      },
      {
        name: "Vitello tonnato",
        description: "Kappertjes, tomaat, parmezaan",
        price: "20,00"
      },
      {
        name: "Steak tartare",
        description: "Uitjes, kappertjes, worcester, tabasco",
        price: "20,00"
      },
      {
        name: "Carpaccio venkel",
        description: "Pijnboompitten, gemarineerde komkommer",
        price: "18,00"
      },
      {
        name: "Gamba's à la plancha",
        description: "Kruidenboter, optie: spicy",
        price: "20,00"
      },
      {
        name: "Kaaskroket",
        description: "Peterselie, citroen",
        price: "10,00 - 18,00"
      },
      {
        name: "Garnaalkroket",
        description: "Grijze Noordzeegarnalen, peterselie, citroen",
        price: "12,00 - 23,00"
      },
      {
        name: "Duo van kroketten",
        description: "Grijze Noordzeegarnalen, peterselie, citroen",
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
        price: "25,00"
      },
      {
        name: "Geitenkaas",
        description: "Witloof, vijgen, granaatappel, honing, spek",
        price: "25,00"
      },
      {
        name: "Scampi",
        description: "Granny Smith, zongedroogde tomaat, spek",
        price: "28,00"
      },
      {
        name: "Thai beef salad",
        description: "Rosbief, sojascheuten, koriander, chili",
        price: "27,00"
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
        description: "Salade, frietjes of kroketjes, saus naar keuze",
        price: "30,00"
      },
      {
        name: "Filet pur",
        description: "Salade, frietjes of kroketjes, saus naar keuze",
        price: "43,00"
      },
      {
        name: "Entrecôte",
        description: "Salade, frietjes of kroketjes, saus naar keuze",
        price: "39,00"
      },
      {
        name: "Steak tartare",
        description: "Salade, frietjes",
        price: "30,00"
      },
      {
        name: "Parelhoenfilet",
        description: "Boschampignons, rode wijn, frietjes of kroketjes",
        price: "31,00"
      },
      {
        name: "Catch of the day",
        description: "Vis volgens marktaanbod, frietjes, kroketjes of puree",
        price: "33,00"
      },
      {
        name: "Zeetong à la meunière",
        description: "Tartaar, salade, frietjes of puree",
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
        price: "32,00"
      },
      {
        name: "Vispannetje",
        description: "Noordzeevis, bisque, frietjes, kroketjes of puree",
        price: "29,00"
      },
      {
        name: "Vol-au-vent",
        description: "Salade, frietjes, kroketjes of puree",
        price: "28,00"
      },
      {
        name: "Varkenswangen",
        description: "Salade, frietjes of kroketjes, Tripel d'Anvers",
        price: "32,00"
      },
      {
        name: "Krokante vis",
        description: "Tartaar, salade, frietjes, kroketjes of puree",
        price: "26,00"
      },
      {
        name: "Vegetarische curry",
        description: "Kikkererwten, groenten, kruiden",
        price: "28,00"
      },
      {
        name: "Linguine diabolique",
        description: "Scampi, paprika, tomaat",
        price: "28,00"
      },
      {
        name: "Fusili feta courgette",
        description: "Pijnboompitten, rucola, tomaat",
        price: "25,00"
      }
    ]
  },
  {
    id: "small-dishes",
    name: "Kleine gerechten",
    items: [
      {
        name: "Mini steak",
        description: "Salade, frietjes of kroketjes, saus naar keuze",
        price: "22,00"
      },
      {
        name: "Mini vol-au-vent",
        description: "Salade, frietjes, kroketjes of puree",
        price: "17,00"
      },
      {
        name: "Mini krokante vis",
        description: "Tartaar, salade, frietjes, kroketjes of puree",
        price: "17,00"
      },
      {
        name: "Mini kipfilet",
        description: "Salade, frietjes of kroketjes, saus naar keuze",
        price: "19,00"
      }
    ]
  },
  {
    id: "extras",
    name: "Extra's",
    items: [
      { name: "Gratin", price: "5,00" },
      { name: "Friet, kroketjes, puree of pasta", price: "4,00" },
      { name: "Extra brood en boter", price: "2,50" },
      { name: "Gemengde sla", price: "4,00" },
      { name: "Witloofsla", price: "4,00" }
    ]
  }
];

export const visibleMenuSections = menuSections;
