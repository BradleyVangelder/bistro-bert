import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Over Ons | Bistro Bert Laakdal",
  description: "Leer meer over Bistro Bert in Laakdal. Belgische klassiekers met finesse, dagvers en seizoensgebonden. Onze keukenfilosofie en werkwijze.",
  openGraph: {
    title: "Over Ons | Bistro Bert Laakdal",
    description: "Leer meer over Bistro Bert in Laakdal. Belgische klassiekers met finesse, dagvers en seizoensgebonden.",
    url: "https://www.bistro-bert.be/over-ons",
  },
  twitter: {
    card: "summary_large_image",
    title: "Over Ons | Bistro Bert Laakdal",
    description: "Leer meer over Bistro Bert in Laakdal. Belgische klassiekers met finesse, dagvers en seizoensgebonden.",
  },
  alternates: {
    canonical: "https://www.bistro-bert.be/over-ons",
  },
}

export default function OverOnsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}