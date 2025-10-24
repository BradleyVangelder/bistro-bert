import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  title: 'Experiment | Bistro Bert (niet geïndexeerd)',
}

export default function DebugLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

