# Bistro Bert Website - Copy Mapping Analysis

This document provides a comprehensive mapping between the hardcoded copy in the codebase and the corresponding entries in the JSON copy file.

## Overview
The website contains hardcoded Dutch copy across multiple components that need to be replaced with the new copy from the JSON file. Each section below identifies the file locations and maps them to the appropriate pageId and sectionId from the JSON structure.

---

## 1. Home Page (src/app/page.tsx)

### JSON pageId: "home"

| Line(s) | Current Hardcoded Copy | JSON sectionId | JSON Content |
|---------|------------------------|---------------|--------------|
| 89 | `Bistro Bert Laakdal` | hero-headline | `Bistro Bert • Laakdal` |
| 92 | `Waar culinaire poëzie tot leven komt in elke schotel` | hero-tagline | `Luxe Belgisch genieten in Laakdal — klassiekers met finesse, dagvers en seizoensgebonden.` |
| 102 | `Onze Kaart` | hero-cta | `Ontdek de menukaart` |
| 119-122 | `Verfijnde<br/>Belgische Keuken` | cuisine-headline | `Verfijnde Belgische Keuken — Lunch, Zakenlunch & Diner` |
| 124-125 | `Hedendaagse interpretaties van klassieke meesterwerken, waar ambacht en innovatie samenkomen in een viering van authentieke smaken.` | cuisine-description | `Klassiekers met schwung: garnaalkroketten met citroenmayonaise, steak tartaar aan tafel afgewerkt en dagverse Noordzeevis met lichte saus. Altijd seizoensgebonden, altijd precies bereid.` |
| 130 | `Bekijk Onze Kaart` | cuisine-cta | `Bekijk onze kaart` |
| 156 | `Het Concept van Bistro Bert` | concept-headline | `Wat je mag verwachten` |
| 165 | `Ons Verhaal` | story-subheading | `Ons Verhaal` |
| 168-169 | `In onze keuken waar traditie en innovatie dansen, creëren we momenten die blijven nazinderen. Elke avond schrijven we een nieuw verhaal van culinaire verbeelding, technische perfectie en onverwachte smaakcombinaties.` | story-description | `Van traag gegaarde sauzen tot kraakverse garnalen: we koken met twee voeten in de Belgische traditie—licht, precies en vol smaak. Intiem, warm en zonder poeha.` |
| 175 | `Evolutieve Keuken` | evolution-subheading | `Seizoensgebonden & fris` |
| 178-179 | `We vieren de evolutie van smaak. Van verfijnde texturen tot krachtige contrasten, subtiele aroma's tot expressieve presentaties. Elke creatie brengt haar eigen karakter en verhaal naar uw bord.` | evolution-description | `Met het seizoen mee: asperges in het voorjaar, hoevekip en Noordzeevis doorheen het jaar, wild wanneer het zover is. Kraakvers, zuiver van smaak, elegant gepresenteerd.` |
| 185 | `Intieme Sfeer` | ambiance-subheading | `Intieme, stijlvolle sfeer` |
| 188-191 | `Zachte verlichting, subtiele muziek en een interieur waar elk detail vertelt van verfijnde smaak. Hier voelt elke gast zich exclusief en speciaal, in een omgeving die uitnodigt tot ongedwongen gesprekken.` | ambiance-description | `Zachte verlichting, warme materialen en comfortabele stoelen. Ongeveer 40 couverts, genoeg ruimte voor een rustig zaken- of romantisch diner.` |
| 197 | `Passie Team` | team-subheading | `Ons Team` |
| 200-203 | `Ons team deelt één visie: elke gast een onvergetelijke ervaring bieden. Van de chef-kok die elke schotel tot kunstwerk verheft, tot de serveerders die warmte en professionaliteit combineren tot een service die blijft imponeren.` | team-description | `Chef Bert focust op precisie en sauswerk; in de zaal helpen we graag met wijnsuggesties, allergenenadvies en timing voor een vlotte zakenlunch.` |
| 218-221 | `Smaakvolle Verhalen<br/>Onvergetelijke Momenten` | stories-headline | `Smaakvolle Verhalen — Onvergetelijke Momenten` |
| 223-224 | `Een exclusieve blik achter de schermen, waar elke beeld een moment van pure verfijning vastlegt. Van de stille concentratie in onze keuken tot de elegante serene sfeer in de zaal.` | stories-description | `Een blik achter de schermen: mise-en-place, het afwerken aan tafel en de sfeer in de zaal. Volg ons op Instagram voor dagelijkse stories.` |
| 242-243 | `Aan Tafel Bij Bert` | reservation-headline | `Aan Tafel bij Bert — Reserveer vandaag` |
| 245 | `Ervaar de warmte van onze keuken en de gezelligheid van onze zaak. Een plek waar eten en samenzijn samenkomen.` | reservation-description | `Zin in lunch, zakenlunch of diner in Laakdal? Bel of reserveer eenvoudig—we denken graag mee over allergenen, wijn en timing.` |
| 252 | `Reserveer Je Tafel` | reservation-cta | `Reserveer voor lunch of zakenlunch` |

---

## 2. About Page (src/app/over-ons/page.tsx)

### JSON pageId: "over-ons"

| Line(s) | Current Hardcoded Copy | JSON sectionId | JSON Content |
|---------|------------------------|---------------|--------------|
| 55 | `Over Bistro Bert` | page-headline | `Over Bistro Bert` |
| 58 | `Ontdek het verhaal achter onze passie voor verfijnde Belgische keuken en onze toewijding aan culinaire excellentie.` | page-description | `Ontdek ons verhaal: Belgische klassiekers, precies bereid, met service die het eenvoudig maakt. Laakdal is ons thuis: rustig, bereikbaar en met parkeerplek in de buurt.` |
| 70 | `Onze Culinaire Filosofie` | philosophy-headline | `Onze Keukenfilosofie` |
| 73-74 | `Bij Bistro Bert geloven we in de kunst van culinaire storytelling. Onze à la carte menukaart biedt u de vrijheid om uw eigen smaakavontuur te creëren, met gerechten waar techniek en creativiteit samensmelten tot onvergetelijke ervaringen.` | philosophy-description | `Ambacht eerst: huisgemaakte fonds en sauzen, klassiekers met lichte accenten en seizoensproducten van dichtbij. À la carte of dagsuggesties.` |
| 91 | `Sensorische Perfectie` | perfection-heading | `Puur in Smaak & Textuur` |
| 94 | `Zorgvuldige balancering van texturen, temperaturen en smaakdimensies, gekozen voor hun harmonieuze interactie op het bord.` | perfection-description | `Balans in temperatuur en textuur: denk aan lauwwarme asperges met beurre blanc, krokant en romig in één hap.` |
| 109 | `Ambacht & Traditie` | tradition-heading | `Ambacht & Traditie` |
| 112 | `Eerlijke bereidingswijzen, waar traditionele technieken en respect voor ingrediënten centraal staan in onze Belgische keuken.` | tradition-description | `Traditie met vakmanschap: traag gegaard, op de graat gebakken, soms huisgerookt—altijd respect voor het product.` |
| 127 | `Flexibiliteit` | flexibility-heading | `Flexibiliteit` |
| 130 | `De vrijheid van à la carte dineren, met aandacht voor persoonlijke wensen en dieetvoorkeuren bij Bistro Bert.` | flexibility-description | `Zakenlunch? We serveren vlot en rustig op verzoek. Vegetarisch of lactosevrij? We voorzien graag een alternatief.` |
| 143 | `Onze Werkwijze` | method-headline | `Onze Werkwijze` |
| 148 | `Pure Smaakervaring` | taste-heading | `Pure Smaakervaring` |
| 151 | `Elk gerecht is een gebalanceerde samensmelting van authentieke smaken, waar de pure essentie van elke ingrediënt tot zijn recht komt.` | taste-description | `Pure smaken staan centraal. Een voorbeeld: dagverse Noordzeevis met een lichte, heldere saus en seizoensgroenten.` |
| 156 | `Artisanale Excellentie` | excellence-heading | `Ambacht op Niveau` |
| 159 | `Duurzame relaties met meesterlijke producenten die onze visie delen, die ons voorzien van uitzonderlijke grondstoffen met verhaal.` | excellence-description | `We werken met betrouwbare producenten en vismijn—kwaliteit die je proeft in elk bord.` |
| 164 | `Verfijnde Presentatie` | presentation-heading | `Verfijnde Presentatie` |
| 167 | `Gerechten die met aandacht voor detail worden gepresenteerd, waar visuele harmonie de smaakervaring complementeert bij Bistro Bert.` | presentation-description | `Strak en verzorgd bordwerk dat de smaak versterkt. Onze beelden vertellen de rest.` |
| 172 | `Persoonlijke Service` | service-heading | `Persoonlijke Service` |
| 175 | `Attente bediening die de perfecte begeleiding vormt voor uw culinaire reis door onze menukaart.` | service-description | `Attente bediening met oog voor detail: wijnsuggesties, allergenenadvies en een tempo dat past bij jouw lunch of diner.` |
| 189 | `Geïnspireerd door onze culinaire filosofie?` | inspiration-question | `Geïnspireerd door onze keuken?` |
| 196 | `Bekijk Onze Menukaart` | menu-cta | `Bekijk onze kaart` |
| 202 | `Reserveer Uw Tafel` | reservation-cta | `Reserveer voor lunch of zakenlunch` |

---

## 3. Menu Page (src/app/menu/page.tsx)

### JSON pageId: "menu"

| Line(s) | Current Hardcoded Copy | JSON sectionId | JSON Content |
|---------|------------------------|---------------|--------------|
| 54 | `Onze Artistieke Menukaart` | page-headline | `Onze Menukaart` |
| 62 | `Onze chef creërt dagelijks een nieuwe menukaart als een culinair canvas. Geniet van expressieve gerechten waar techniek, passie en verbeelding samensmelten.` | page-description | `Dagvers, seizoensgebonden en precies bereid—met dagsuggesties naast onze klassiekers. Perfect voor lunch, zakenlunch of diner.` |
| 88 | `Klaar om onze culinaire creaties te proeven?` | ready-question | `Klaar voor lunch of diner?` |
| 94 | `Reserveer Nu Uw Tafel` | reservation-cta | `Reserveer voor lunch of zakenlunch` |

---

## 4. Contact Page (src/app/contact/page.tsx)

### JSON pageId: "contact"

| Line(s) | Current Hardcoded Copy | JSON sectionId | JSON Content |
|---------|------------------------|---------------|--------------|
| 117 | `Reserveer Uw Tafel` | page-headline | `Reserveer uw tafel — Lunch, Zakenlunch & Diner in Laakdal` |
| 121-122 | `Uw culinaire reis begint hier bij Bistro Bert. Wij nodigen u uit om uw tafel te reserveren voor een transformerende ervaring waar gastronomische kunst en persoonlijke service samensmelten.` | page-description | `Bel of reserveer voor lunch, zakenlunch of diner. We helpen met allergenen, timing en een stille tafel indien gewenst.` |
| 128 | `Bel Direct: 013 480 139` | phone-cta | `Bel direct: +32 13 48 01 39` |
| 134 | `Online Reserveren (Binnenkort)` | online-cta | `Online reserveren` |
| 146 | `Reserveringsinformatie` | info-headline | `Reserveringsinformatie` |
| 149-151 | `Bij Bistro Bert in Laakdal streven wij ernaar uw culinaire ervaring onvergetelijk te maken. Hier vindt u alle informatie die u nodig heeft voor uw reservering.` | info-description | `Hier vind je praktische info voor je reservatie: lunch- en dineruren, parkeren en allergenen.` |
| 155 | `Openingstijden` | hours-headline | `Openingstijden` |
| 157 | `Dinsdag - Zondag: 18:00 - 22:00` | hours-description | `Dinsdag t/m zondag: 18:00–22:00. Lunch vrij & zat: 12:00–14:00. (Pas aan indien anders.)` |
| 160 | `Maandag: Gesloten` | closed-info | `Maandag: gesloten` |
| 163 | `Wij raden aan om tijdig te reserveren, vooral in het weekend en tijdens feestdagen.` | reservation-advice | `Reserveer tijdig—zeker in het weekend en op feestdagen. Groepen vanaf 6: graag even bellen.` |
| 168 | `Onze Culinaire Reis` | journey-headline | `Wat je mag verwachten` |
| 170-171 | `Bij Bistro Bert nodigen we u uit op een culinaire ontdekkingstocht. Elke dag een viering van smaak, waar verfijnde technieken en zorgvuldig geselecteerde ingrediënten samenkomen in expressieve gerechten die verrassen en betoveren.` | journey-description | `Wat je mag verwachten: Belgische klassiekers met moderne precisie. Voorbeeld? Vol-au-vent met rijke, heldere saus of dagvis op de graat met seizoensgroenten.` |
| 174 | `Tussendoor & Avonds` | dining-heading | `Lunch & Diner` |
| 175 | `Verfijnde lunch en diner voor elk moment` | dining-description | `Heldere keuzes voor elke gelegenheid: snelle zakenlunch, ontspannen lunch of uitgebreid diner.` |
| 178 | `Expressief` | expressive-heading | `Seizoensgebonden` |
| 179 | `Proef de evolutie van smaak in elke creatie` | expressive-description | `Met het seizoen mee, met respect voor het product. Voorbeeld: hoevekip met zachte jus en knapperige groenten.` |
| 182 | `Belgische Erfenis` | heritage-heading | `Belgische Klassiekers` |
| 183 | `Eerlijke keuken met respect voor traditie` | heritage-description | `Onze basis: Belgische klassiekers zoals vol-au-vent of stoofvlees, met lichte, frisse accenten.` |
| 218 | `Ontdek Meer Van Bistro Bert` | discover-headline | `Ontdek meer van Bistro Bert` |
| 224 | `Onze Menukaart` | menu-link-heading | `Onze menukaart` |
| 226 | `Ontdek onze expressieve à la carte menukaart met creatieve gerechten die traditie en innovatie in perfecte harmonie verenigen.` | menu-link-description | `Ontdek onze à la carte menukaart met seizoensklassiekers en dagsuggesties—precies bereid, fris gepresenteerd.` |
| 228 | `Bekijk Menu →` | menu-link-text | `Bekijk menu →` |
| 234 | `Ons Restaurant` | restaurant-link-heading | `Ons restaurant` |
| 236 | `Leer meer over onze culinaire filosofie, chef-kok en de unieke sfeer van Bistro Bert in Laakdal.` | restaurant-link-description | `Leer meer over onze keuken, chef en de unieke sfeer van Bistro Bert in Laakdal.` |
| 238 | `Meer Informatie →` | restaurant-link-text | `Meer informatie →` |

---

## 5. Contact Info Component (src/components/contact/ContactInfo.tsx)

### JSON pageId: "contact"

| Line(s) | Current Hardcoded Copy | JSON sectionId | JSON Content |
|---------|------------------------|---------------|--------------|
| 15 | `Culinaire Verfijning` | refinement-heading | `Moderne Verfijning` |
| 18 | `Welkom bij Bistro Bert. Waar Belgische culinaire traditie en moderne verfijning samenkomen. Hier serveren we eerlijke, expressieve gerechten die culinaire kunst belichamen.` | refinement-description | `Belgische traditie met moderne finesse—serieuze keuken, zonder zwaar te worden.` |
| 34 | `Waar we zitten` | location-heading | `Locatie` |
| 35-36 | `Verboekt 121<br/>2430 Laakdal, België` | location-address | `Verboekt 121, 2430 Laakdal, België` |
| 45 | `Reserveer uw tafel` | reservation-heading | `Reserveer uw tafel` |
| 46 | `013 480 139` | reservation-phone | `+32 13 48 01 39` |
| 47 | `Reserveer voor een onvergetelijke culinaire ervaring` | reservation-note | `Reserveer voor lunch, zakenlunch of diner—wij regelen de rest.` |
| 63 | `Stuur ons een e-mail` | email-heading | `Stuur ons een e-mail` |
| 64 | `info@bistro-bert.be` | email-address | `info@bistro-bert.be` |
| 65 | `We beantwoorden uw bericht met zorg` | email-note | `We antwoorden doorgaans binnen 24 uur.` |
| 74 | `Openingstijden` | hours-contact-heading | `Openingstijden` |
| 75 | `Dinsdag t/m zondag: 18:00 - 22:00` | hours-contact-info | `Dinsdag t/m zondag: 18:00–22:00. Lunch vrij & zat: 12:00–14:00. (Pas aan indien anders.)` |
| 76 | `Maandag: gesloten` | closed-contact-info | `Maandag: gesloten` |

---

## 6. Header Component (src/components/layout/Header.tsx)

### JSON pageId: "contact" (for contact information)

| Line(s) | Current Hardcoded Copy | JSON sectionId | JSON Content |
|---------|------------------------|---------------|--------------|
| 224 | `013 480 139` | reservation-phone | `+32 13 48 01 39` |
| 228 | `info@bistro-bert.be` | email-address | `info@bistro-bert.be` |
| 232 | `Tue-Sun: 18:00-22:00` | hours-contact-info | `Dinsdag t/m zondag: 18:00–22:00. Lunch vrij & zat: 12:00–14:00. (Pas aan indien anders.)` |
| 236 | `Verboekt 121, 2430 Laakdal` | location-address | `Verboekt 121, 2430 Laakdal, België` |

---

## 7. Footer Component (src/components/layout/Footer.tsx)

### JSON pageId: "contact" (for contact information)

| Line(s) | Current Hardcoded Copy | JSON sectionId | JSON Content |
|---------|------------------------|---------------|--------------|
| 33 | `Waar culinaire verfijning en gastvrijheid samenkomen tot een onvergetelijke ervaring. Een oase van rust en schoonheid, waar elk bezoek een viering van de kunst van het leven wordt.` | refinement-description | `Belgische traditie met moderne finesse—serieuze keuken, zonder zwaar te worden.` |
| 64 | `Verboekt 121, 2430 Laakdal` | location-address | `Verboekt 121, 2430 Laakdal, België` |
| 73 | `013 480 139` | reservation-phone | `+32 13 48 01 39` |
| 82 | `info@bistro-bert.be` | email-address | `info@bistro-bert.be` |

---

## Summary of Required Changes

1. **Home Page (src/app/page.tsx)**: 19 sections need updating
2. **About Page (src/app/over-ons/page.tsx)**: 18 sections need updating
3. **Menu Page (src/app/menu/page.tsx)**: 4 sections need updating
4. **Contact Page (src/app/contact/page.tsx)**: 22 sections need updating
5. **Contact Info Component (src/components/contact/ContactInfo.tsx)**: 11 sections need updating
6. **Header Component (src/components/layout/Header.tsx)**: 4 sections need updating
7. **Footer Component (src/components/layout/Footer.tsx)**: 4 sections need updating

**Total: 82 sections** across 7 files need to be updated with the new copy from the JSON file.

## Implementation Notes

1. The JSON structure is well-organized with clear pageId and sectionId mappings
2. Most copy sections have direct equivalents in the current code
3. Some sections in the JSON don't have current equivalents (e.g., lunch hours in contact page)
4. Phone number format needs to be standardized to "+32 13 48 01 39" format
5. Some sections may need minor layout adjustments to accommodate longer/shorter text
6. The tone of the new copy is more direct, concise, and focused on practical information