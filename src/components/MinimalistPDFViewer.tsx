'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import {
  Worker,
  Viewer,
  SpecialZoomLevel,
  ScrollMode,
  ViewMode,
  type RenderPageProps
} from '@react-pdf-viewer/core'
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation'
import '@react-pdf-viewer/core/lib/styles/index.css'

interface MinimalistPDFViewerProps {
  pdfUrl: string
  className?: string
}

export default function MinimalistPDFViewer({ pdfUrl, className = '' }: MinimalistPDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [isDocumentLoading, setIsDocumentLoading] = useState(true)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const pageNavigationPluginInstance = pageNavigationPlugin()
  const { jumpToPage } = pageNavigationPluginInstance

  const isFirstPage = pageNumber <= 1
  const isLastPage = numPages ? pageNumber >= numPages : true
  const isLoading = isDocumentLoading || isPageLoading

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handlePreviousPage = useCallback(() => {
    if (pageNumber > 1 && !isPageLoading) {
      setError(null)
      const newPage = pageNumber - 1
      setPageNumber(newPage)
      jumpToPage(newPage - 1)
    }
  }, [pageNumber, isPageLoading, jumpToPage])

  const handleNextPage = useCallback(() => {
    if (numPages && pageNumber < numPages && !isPageLoading) {
      setError(null)
      const newPage = pageNumber + 1
      setPageNumber(newPage)
      jumpToPage(newPage - 1)
    }
  }, [pageNumber, numPages, isPageLoading, jumpToPage])

  useEffect(() => {
    if (!isClient) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        handlePreviousPage()
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        handleNextPage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNextPage, handlePreviousPage, isClient])

  useEffect(() => {
    if (!containerRef.current) return

    const preventScroll = (event: WheelEvent) => {
      event.preventDefault()
    }

    const preventTouchScroll = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        event.preventDefault()
      }
    }

    const element = containerRef.current
    element.addEventListener('wheel', preventScroll, { passive: false })
    element.addEventListener('touchmove', preventTouchScroll, { passive: false })

    return () => {
      element.removeEventListener('wheel', preventScroll)
      element.removeEventListener('touchmove', preventTouchScroll)
    }
  }, [isClient])

  const renderPage = useCallback((props: RenderPageProps) => {
    const { canvasLayer, pageIndex, markRendered } = props

    // Mark the page as rendered when it's ready
    if (typeof window !== 'undefined') {
      Promise.resolve().then(() => {
        markRendered(pageIndex)
        // Stop page loading once the page is fully rendered
        setIsPageLoading(false)
        setError(null)
      })
    }

    const canvasAttrs = canvasLayer.attrs ?? {}

    return (
      <div
        {...canvasAttrs}
        className={[canvasAttrs.className, 'monochrome-pdf-sheet'].filter(Boolean).join(' ')}
      >
        {canvasLayer.children}
      </div>
    )
  }, [])

  const navigationControls = (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="monochrome-pdf-controls"
    >
      <button
        type="button"
        onClick={handlePreviousPage}
        disabled={isFirstPage}
        className="monochrome-pdf-button"
        aria-label="Vorige pagina"
      >
        <ArrowLeft size={18} strokeWidth={1.5} />
        <span>Vorige pagina</span>
      </button>

      <AnimatePresence mode="wait">
        <motion.span
          key={pageNumber}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="monochrome-pdf-indicator"
          aria-live="polite"
        >
          Pagina {pageNumber}{numPages ? ` / ${numPages}` : ''}
        </motion.span>
      </AnimatePresence>

      <button
        type="button"
        onClick={handleNextPage}
        disabled={isLastPage}
        className="monochrome-pdf-button"
        aria-label="Volgende pagina"
      >
        <span>Volgende pagina</span>
        <ArrowRight size={18} strokeWidth={1.5} />
      </button>
    </motion.div>
  )

  const rootClassName = ['monochrome-pdf-viewer', className].filter(Boolean).join(' ')

  if (!isClient) {
    return (
      <div className={rootClassName}>
        {navigationControls}
        <div className="monochrome-pdf-container" aria-hidden>
          <div className="monochrome-pdf-placeholder">
            <span>Menukaart wordt geladen…</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={rootClassName}>
      {navigationControls}

      <div
        ref={containerRef}
        className="monochrome-pdf-container"
      >
        <AnimatePresence mode="wait">
          {(isLoading || error) && (
            <motion.div
              key={error ? 'error' : 'loading'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="monochrome-pdf-overlay"
              role="status"
              aria-live="polite"
            >
              {!error && isDocumentLoading && (
                <>
                  <div className="monochrome-pdf-spinner" />
                  <p className="monochrome-pdf-loading-text">Menukaart wordt geladen…</p>
                </>
              )}
              {!error && !isDocumentLoading && isPageLoading && (
                <>
                  <div className="monochrome-pdf-spinner" />
                  <p className="monochrome-pdf-loading-text">Pagina wordt geladen…</p>
                </>
              )}
              {error && (
                <div className="text-center">
                  <p className="monochrome-pdf-loading-text text-red-600 mb-4">{error}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setError(null)
                      setIsPageLoading(false)
                    }}
                    className="monochrome-pdf-button"
                  >
                    Probeer opnieuw
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="monochrome-pdf-stage"
        >
          <Worker workerUrl="/pdf.worker.min.js">
            <Viewer
              fileUrl={pdfUrl}
              plugins={[pageNavigationPluginInstance]}
              defaultScale={SpecialZoomLevel.PageFit}
              scrollMode={ScrollMode.Page}
              viewMode={ViewMode.SinglePage}
              onPageChange={(event) => {
                setPageNumber(event.currentPage + 1)
                setError(null)
                // Start page loading when navigation begins
                setIsPageLoading(true)

                // Set a fallback timeout to ensure loading state doesn't get stuck
                setTimeout(() => {
                  setIsPageLoading(false)
                }, 1000)
              }}
              onDocumentLoad={(event) => {
                setNumPages(event.doc.numPages)
                setIsDocumentLoading(false)
                setIsPageLoading(false)
                setError(null)
              }}
              renderPage={renderPage}
            />
          </Worker>
        </motion.div>
      </div>

      <p className="monochrome-pdf-hint">Gebruik de pijltjestoetsen of knoppen om te navigeren</p>
    </div>
  )
}
