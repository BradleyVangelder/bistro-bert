import Script from "next/script";

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