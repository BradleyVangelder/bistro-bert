'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export interface MenuImagePage {
  src: string
  alt: string
  width: number
  height: number
}

interface ResponsiveMenuViewerProps {
  pages: MenuImagePage[]
}

export default function ResponsiveMenuViewer({ pages }: ResponsiveMenuViewerProps) {
  const [pageIndex, setPageIndex] = useState(0)
  const currentPage = pages[pageIndex]
  const hasPagination = pages.length > 1

  useEffect(() => {
    setPageIndex(0)
  }, [pages])

  const showPreviousPage = () => {
    setPageIndex((currentIndex) => Math.max(0, currentIndex - 1))
  }

  const showNextPage = () => {
    setPageIndex((currentIndex) => Math.min(pages.length - 1, currentIndex + 1))
  }

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 180, damping: 26 }}
      className="monochrome-pdf-viewer responsive-menu-viewer"
      role="region"
      aria-label="Menukaart"
    >
      {hasPagination && (
        <div className="monochrome-pdf-controls">
          <button
            type="button"
            onClick={showPreviousPage}
            disabled={pageIndex === 0}
            className="monochrome-pdf-button"
            aria-label="Vorige pagina"
          >
            <ArrowLeft size={18} strokeWidth={1.5} />
            <span>Vorige</span>
          </button>

          <p className="monochrome-pdf-indicator" aria-live="polite">
            {pageIndex + 1} / {pages.length}
          </p>

          <button
            type="button"
            onClick={showNextPage}
            disabled={pageIndex === pages.length - 1}
            className="monochrome-pdf-button"
            aria-label="Volgende pagina"
          >
            <span>Volgende</span>
            <ArrowRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      )}

      <div
        className="responsive-menu-stage"
        style={{ aspectRatio: `${currentPage.width} / ${currentPage.height}` }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={currentPage.src}
            src={currentPage.src}
            alt={currentPage.alt}
            width={currentPage.width}
            height={currentPage.height}
            draggable={false}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="responsive-menu-image"
          />
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
