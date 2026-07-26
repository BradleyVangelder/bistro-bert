'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import {
  Worker,
  Viewer,
  SpecialZoomLevel,
  ScrollMode,
  ViewMode
} from '@react-pdf-viewer/core'
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation'
import '@react-pdf-viewer/core/lib/styles/index.css'

interface MinimalistPDFViewerProps {
  pdfUrl: string
  className?: string
}

interface PageSize {
  width: number
  height: number
}

export default function MinimalistPDFViewer({ pdfUrl, className = '' }: MinimalistPDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSizes, setPageSizes] = useState<PageSize[]>([])
  const [isDocumentLoading, setIsDocumentLoading] = useState(true)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Replace isUpdatingFromUrl with a more robust mechanism
  const [updateSource, setUpdateSource] = useState<'url' | 'viewer' | 'button' | null>(null)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const pageNavigationPluginInstance = pageNavigationPlugin()
  const { jumpToPage } = pageNavigationPluginInstance
  const urlUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastUpdateTimeRef = useRef(0)
  const isTestEnvironment = useRef(typeof window !== 'undefined' && window.location.search.includes('test=true'))

  const isFirstPage = pageNumber <= 1
  const isLastPage = numPages ? pageNumber >= numPages : true
  const isLoading = isDocumentLoading || isPageLoading
  const currentPageSize = pageSizes[pageNumber - 1]


  useEffect(() => {
    setIsClient(true)
  }, [])

  // Reset page number when PDF URL changes
  useEffect(() => {
    if (!isClient) return

    // Reset to page 1 when PDF URL changes
    setPageNumber(1)
    setPageSizes([])
    setError(null)
    setIsPageLoading(false)

    // Clear URL slide parameter to ensure clean state
    try {
      const url = new URL(window.location.href)
      url.searchParams.delete("slide")
      window.history.replaceState({}, "", url.toString())
    } catch (error) {
      console.warn('Failed to clear URL parameters:', error)
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[PDF DEBUG] PDF URL changed, reset to page 1')
    }
  }, [pdfUrl, isClient])

  // Simplified page change function - button clicks should be immediate
  const changePage = useCallback((newPageNumber: number, source: 'url' | 'viewer' | 'button') => {
    const now = Date.now()

    // For button clicks, be more responsive - only prevent truly rapid clicks
    const MIN_UPDATE_DELAY = source === 'button' ? 50 : 200

    if (now - lastUpdateTimeRef.current < MIN_UPDATE_DELAY) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[PDF DEBUG] Skipping rapid update from ${source}: ${newPageNumber} (last update: ${now - lastUpdateTimeRef.current}ms ago)`)
      }
      return
    }

    lastUpdateTimeRef.current = now
    setUpdateSource(source)
    setPageNumber(newPageNumber)
    setError(null)

    if (source !== 'url') {
      try {
        const url = new URL(window.location.href)
        url.searchParams.set("slide", newPageNumber.toString())
        window.history.replaceState({}, "", url.toString())
      } catch (error) {
        console.warn('Failed to update URL:', error)
      }
    }

    if (source !== 'viewer') {
      jumpToPage(newPageNumber - 1)
      setIsPageLoading(true)

      setTimeout(() => {
        setIsPageLoading(false)
      }, 1800)
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[PDF DEBUG] Page changed to ${newPageNumber} from source: ${source}`)
    }
  }, [jumpToPage])

  // Initialize from URL parameters
  useEffect(() => {
    if (!isClient || updateSource === 'url') return

    try {
      const params = new URLSearchParams(window.location.search)
      const slideParam = params.get("slide")
      const hashSlide = window.location.hash.match(/^#p(\d+)$/)
      
      let initialSlide = 0
      if (slideParam) {
        initialSlide = Number(slideParam) - 1
      } else if (hashSlide) {
        initialSlide = Number(hashSlide[1]) - 1
      }
      
      if (initialSlide >= 0) {
        const newPageNumber = initialSlide + 1
        if (newPageNumber !== pageNumber) {
          changePage(newPageNumber, 'url')
        }
      }
    } catch (error) {
      console.warn('Failed to parse URL parameters:', error)
    }
  }, [isClient, updateSource, pageNumber, changePage])

  // Update URL when page changes (only for viewer-initiated changes)
  useEffect(() => {
    if (!isClient || !pageNumber || updateSource === 'url') return

    // URL updates are now handled in the changePage function
    // This effect is kept for compatibility but does nothing
  }, [pageNumber, isClient, updateSource])

  const handlePreviousPage = useCallback(() => {
    // Be more permissive with button clicks - don't wait for loading to complete
    if (pageNumber > 1) {
      const newPage = pageNumber - 1
      changePage(newPage, 'button')
    }
  }, [pageNumber, changePage])

  const handleNextPage = useCallback(() => {
    // Be more permissive with button clicks - don't wait for loading to complete
    if (numPages && pageNumber < numPages) {
      const newPage = pageNumber + 1
      changePage(newPage, 'button')
    }
  }, [pageNumber, numPages, changePage])

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      handlePreviousPage()
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      handleNextPage()
    }
    if (event.key === 'Home') {
      event.preventDefault()
      changePage(1, 'button')
    }
    if (event.key === 'End') {
      event.preventDefault()
      if (numPages) {
        changePage(numPages, 'button')
      }
    }
  }, [handleNextPage, handlePreviousPage, changePage, numPages])

  useEffect(() => {
    if (!isClient) return

    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        handlePreviousPage()
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        handleNextPage()
      }
      if (event.key === 'Home') {
        event.preventDefault()
        changePage(1, 'button')
      }
      if (event.key === 'End') {
        event.preventDefault()
        if (numPages) {
          changePage(numPages, 'button')
        }
      }
    }

    try {
      window.addEventListener('keydown', handleGlobalKeyDown)
      return () => window.removeEventListener('keydown', handleGlobalKeyDown)
    } catch (error) {
      console.warn('Failed to set up keyboard event listeners:', error)
    }
  }, [handleNextPage, handlePreviousPage, changePage, numPages, isClient])

  useEffect(() => {
    if (!containerRef.current) return

    const preventScroll = (event: WheelEvent) => {
      // Only prevent horizontal scrolling that could interfere with PDF navigation
      // Allow all vertical scrolling to ensure page can be scrolled normally
      if (containerRef.current?.contains(event.target as Node)) {
        // Only prevent if it's primarily horizontal scroll (deltaX > deltaY)
        const isHorizontalScroll = Math.abs(event.deltaX) > Math.abs(event.deltaY)

        if (isHorizontalScroll && Math.abs(event.deltaX) > 10) {
          event.preventDefault()
        }
        // Allow all vertical scrolling to propagate to the page
      }
    }

    const preventTouchScroll = (event: TouchEvent) => {
      // Only prevent horizontal touch movements that could interfere with PDF navigation
      if (containerRef.current?.contains(event.target as Node) && event.touches.length === 1) {
        // Store the initial touch position to determine scroll direction
        const touch = event.touches[0]

        if (!(event as any).initialTouch) {
          ;(event as any).initialTouch = { clientX: touch.clientX, clientY: touch.clientY }
          ;(event as any).hasMoved = false
          return
        }

        const initialTouch = (event as any).initialTouch
        const deltaX = Math.abs(touch.clientX - initialTouch.clientX)
        const deltaY = Math.abs(touch.clientY - initialTouch.clientY)

        // Only prevent if it's clearly horizontal movement and has moved significantly
        if (deltaX > deltaY && deltaX > 30 && !(event as any).hasMoved) {
          ;(event as any).hasMoved = true
          event.preventDefault()
        }
      }
    }

    const element = containerRef.current
    element.addEventListener('wheel', preventScroll, { passive: false })
    element.addEventListener('touchmove', preventTouchScroll, { passive: false })
    element.addEventListener('touchstart', (e) => {
      // Reset initial touch position on touch start
      delete (e as any).initialTouch
      delete (e as any).hasMoved
    }, { passive: true })

    return () => {
      element.removeEventListener('wheel', preventScroll)
      element.removeEventListener('touchmove', preventTouchScroll)
      element.removeEventListener('touchstart', () => {})
    }
  }, [isClient])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (urlUpdateTimeoutRef.current) {
        clearTimeout(urlUpdateTimeoutRef.current)
      }
    }
  }, [])

  const navigationControls = numPages && numPages > 1 ? (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="monochrome-pdf-controls"
    >
      <button
        type="button"
        onClick={handlePreviousPage}
        disabled={isFirstPage || isDocumentLoading}
        className="monochrome-pdf-button"
        aria-label="Vorige pagina"
        aria-current={isFirstPage ? "true" : undefined}
      >
        <ArrowLeft size={18} strokeWidth={1.5} />
        <span>Vorige</span>
      </button>

      <p className="monochrome-pdf-indicator" aria-live="polite">
        {pageNumber} / {numPages}
      </p>

      <button
        type="button"
        onClick={handleNextPage}
        disabled={isLastPage || isDocumentLoading}
        className="monochrome-pdf-button"
        aria-label="Volgende pagina"
        aria-current={isLastPage ? "true" : undefined}
      >
        <span>Volgende</span>
        <ArrowRight size={18} strokeWidth={1.5} />
      </button>
    </motion.div>
  ) : null


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

      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 180, damping: 26 }}
        ref={containerRef}
        className="monochrome-pdf-container"
        style={{
          aspectRatio: currentPageSize
            ? `${currentPageSize.width} / ${currentPageSize.height}`
            : '1 / 1.414'
        }}
        role="region"
        aria-label="Menukaart carrousel"
        aria-roledescription="carousel"
        aria-live="polite"
        tabIndex={0}
        onKeyDown={handleKeyDown}
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
              defaultScale={SpecialZoomLevel.PageWidth}
              scrollMode={ScrollMode.Page}
              viewMode={ViewMode.SinglePage}
              onDocumentLoad={(event) => {
                setNumPages(event.doc.numPages)
                setIsDocumentLoading(false)
                setIsPageLoading(false)
                setError(null)

                void Promise.all(
                  Array.from({ length: event.doc.numPages }, async (_, index) => {
                    const page = await event.doc.getPage(index + 1)
                    const viewport = page.getViewport({ scale: 1 })

                    return {
                      width: viewport.width,
                      height: viewport.height
                    }
                  })
                ).then(setPageSizes).catch((pageSizeError) => {
                  console.warn('[PDF DEBUG] Failed to read PDF page sizes:', pageSizeError)
                })
                
                // Container dimension validation
                if (containerRef.current) {
                  const { width, height } = containerRef.current.getBoundingClientRect()
                  if (width < 100 || height < 100) {
                    console.warn('[PDF DEBUG] Container dimensions too small:', { width, height })
                  }
                }
                
                // Test detection mechanism with fallback timeout
                if (isTestEnvironment.current) {
                  // Set a fallback timeout for document loading in tests
                  setTimeout(() => {
                    if (isDocumentLoading) {
                      console.warn('[PDF DEBUG] Document loading timeout in test environment')
                      setIsDocumentLoading(false)
                      setIsPageLoading(false)
                    }
                  }, 5000) // 5 second timeout for tests
                }
              }}
            />
          </Worker>
          
        </motion.div>
      </motion.div>
    </div>
  )
}
