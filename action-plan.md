Bistro Bert — Developer Action Plan

Constraints respected:

✅ Keep the current menu slider (no redesign, no HTML menu replacement).

✅ Do not mention dish names or promise specific items.

✅ Improve copy, UX, accessibility, performance, and SEO around the current implementation.

P0 — High-impact improvements (1–2 days)
1) Reserveer UX (one-tap everywhere)

 Add a sticky “Reserveer” button:

Desktop: top-right header CTA.

Mobile: small bottom sticky bar.

Target: /contact#reserveer.

 On /contact put two primary buttons above the fold:

BEL DIRECT → tel:+3213480139

E-MAIL → mailto:info@bistro-bert.be?subject=Reservatie

 Helper line under buttons:
We denken graag mee over allergenen, wijn en timing.

2) Hero readability (no visual overhaul)

 Add a soft dark gradient behind hero text to meet contrast ≥ 4.5:1.

 Keep subtitle to one concise line.

Home hero copy (safe & generic)

Title: Bistro Bert • Laakdal

Subtitle: Luxe Belgisch genieten — klassiekers met finesse, dagvers en seizoensgebonden.

CTA: Ontdek de menukaart

3) Navigation clarity & a11y

 Header links: Menukaart, Over Ons, Reserveringen, Reserveer (CTA).

 Mobile menu closes on link click; focus is trapped while open.

 Add a skip link for screen readers:
<a href="#main" class="sr-only focus:not-sr-only">Ga naar inhoud</a>

P0 — Keep the slider, make it robust

No structural change to the slider UI. Add semantics, keyboard support, and deep-linking.

4) Slider semantics & keyboard

 Wrap slider container with:

role="region", aria-label="Menukaart carrousel", aria-roledescription="carousel", aria-live="polite".

 Keyboard support: ArrowLeft / ArrowRight / Home / End.

 Mark active slide with aria-current="true".

 If autoplay exists: off by default; add Play/Pause button (aria-pressed).

Example (minimal)

<div
  role="region"
  aria-label="Menukaart carrousel"
  aria-roledescription="carousel"
  aria-live="polite"
  tabIndex={0}
  onKeyDown={handleKeys}
>
  {/* slides */}
</div>

5) Alt-text, captions & deep-linking (no dish names)

 Each slide image gets descriptive but generic alt:
alt="Menukaart — pagina 1" (use the current index).

 Small caption under slides:
Pagina X van Y (optional) or section labels like “Menukaart”.

 Deep-linking so people can share a specific page:

Support /menu?slide=3 or /menu#p3 and initialize the slider to that index.

Init index (example)

const params = new URLSearchParams(location.search);
const initialSlide = Number(params.get("slide") ?? 0);

6) Performance for the slider (Core Web Vitals)

 Use next/image (or equivalent) with intrinsic sizes for all slide images.

 Preload current & next slide, lazy-load the rest (IntersectionObserver).

 Ensure width/height (or aspect ratio) is set to avoid CLS.

 Target mobile: LCP < 2.5s, CLS < 0.05, TBT < 200 ms.

Image example

<Image
  src={src}
  alt={`Menukaart — pagina ${index + 1}`}
  fill
  priority={index <= 1}
  sizes="(max-width: 768px) 100vw, 1200px"
/>

7) Optional: High-contrast toggle (keeps slider, no dish text)

 Add a “Hoge-contrast” toggle that overlays a subtle white/black filter to improve legibility of the photographed menu pages, without adding textual dishes.

P1 — Copy updates (generic, no dish names)
Home — “Verfijnde Belgische Keuken”

Replace paragraph with:
Klassiekers met schwung: precies bereid, seizoensgebonden en dagvers. Altijd verfijnd, zonder poeha.

Over Ons — Intro

Replace with:
Ontdek ons verhaal: Belgische klassiekers, precies bereid, met service die het eenvoudig maakt. Laakdal is ons thuis: rustig, bereikbaar en met parkeerplek in de buurt.

“Wat je mag verwachten”

Lunch & Diner: Heldere keuzes voor elke gelegenheid: snelle zakenlunch, ontspannen lunch of uitgebreid diner.

Seizoensgebonden: Met het seizoen mee, met respect voor het product.

Belgische Klassiekers: Onze basis: vertrouwd en verfijnd, met lichte, frisse accenten.

Contact — Openingstijden (confirm; adjust if needed)

Dinsdag t/m zondag: 18:00–22:00

Lunch vrij & zat: 12:00–14:00 (Pas aan indien anders.)

Maandag: gesloten

Footer tagline

Belgische traditie met moderne finesse — serieuze keuken, zonder zwaar te worden.

P1 — Accessibility (WCAG 2.1 AA)

 Contrast: ensure text on photos (hero/slider captions) meets ≥ 4.5:1 (use gradient overlays).

 Headings: one H1 per page; consistent H2/H3 order.

 Focus: visible focus ring on all interactive elements.

 Link purpose: icon-only links (phone/mail) require aria-label.

 Images: generic but meaningful alt text (no dish names, e.g., “Menukaart — pagina X”).

P1 — SEO (compatible with the slider)

 <html lang="nl">

 Unique title & meta description per page:

Home Title: Bistro Bert Laakdal — Luxe Belgisch genieten

Home Description: Belgische klassiekers met finesse. Dagvers, seizoensgebonden. Reserveer voor lunch, zakenlunch of diner in Laakdal.

 Canonical URLs, robots.txt, sitemap.xml.

 JSON-LD: Restaurant + Menu (sections only; no dish list).

Restaurant JSON-LD

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


Menu JSON-LD (no items, only sections)

export function MenuJsonLd() {
  return (
    <Script id="ld-menu" type="application/ld+json" dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context":"https://schema.org",
        "@type":"Menu",
        "hasMenuSection":[
          {"@type":"MenuSection","name":"Voorgerechten"},
          {"@type":"MenuSection","name":"Zakenlunch"},
          {"@type":"MenuSection","name":"Hoofdgerechten"},
          {"@type":"MenuSection","name":"Suggesties"},
          {"@type":"MenuSection","name":"Desserts"},
          {"@type":"MenuSection","name":"Wijn"}
        ]
      })
    }} />
  );
}

P2 — Error pages (small but helpful)

 Custom 404 with two buttons: Menukaart, Reserveer.

 Custom 500 with a short apology and phone number visible.

Files

/app/not-found.tsx
/app/error.tsx

QA checklist (before shipping)

Content & SEO

 Titles, meta descriptions, Open Graph image set.

 Restaurant/Menu JSON-LD passes validation.

 Sitemap/robots deployed.

A11y

 Full keyboard nav for slider (Left/Right/Home/End).

 Autoplay paused by default (if present); Play/Pause button works.

 All interactive elements have visible focus.

 All images have generic but meaningful alt.

Performance

 Lighthouse (mobile) ≥ 90.

 LCP < 2.5s (hero/first slide optimized).

 CLS < 0.05 (all images reserve space).

Reservations

 Sticky CTA visible (desktop/mobile).

 /contact shows BEL DIRECT and E-MAIL first.

Notes to dev

Do not change or replace the current menu slider.

Avoid any copy that mentions specific dishes. Keep language generic (klassiekers, dagvers, seizoensgebonden, verfijnd).

If you add a high-contrast toggle, keep it purely visual (no new dish text).