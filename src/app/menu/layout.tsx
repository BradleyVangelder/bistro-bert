import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Menukaart | Bistro Bert Laakdal",
  description: "Ontdek onze menukaart met Belgische klassiekers. Dagvers, seizoensgebonden en precies bereid. Perfect voor lunch, zakenlunch of diner in Laakdal.",
  openGraph: {
    title: "Menukaart | Bistro Bert Laakdal",
    description: "Ontdek onze menukaart met Belgische klassiekers. Dagvers, seizoensgebonden en precies bereid.",
    url: "https://www.bistro-bert.be/menu",
  },
  twitter: {
    card: "summary_large_image",
    title: "Menukaart | Bistro Bert Laakdal",
    description: "Ontdek onze menukaart met Belgische klassiekers. Dagvers, seizoensgebonden en precies bereid.",
  },
  alternates: {
    canonical: "https://www.bistro-bert.be/menu",
  },
}

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
