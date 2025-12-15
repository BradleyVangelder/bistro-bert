"use client"

// Utility functions for Easybooker widget interaction

/**
 * Opens the Easybooker reservation widget by expanding its container height.
 * 
 * The widget is a cross-origin iframe, but its container div is in our DOM.
 * - Closed state: height: 130px
 * - Opened state: height: 450px
 */
export async function openEasybookerWidget(): Promise<boolean> {
  console.log('[Easybooker] Starting widget open attempt...')

  // Find the Easybooker widget container (it has a dynamic ID starting with "easybooker-widget-container-")
  const container = document.querySelector('[id^="easybooker-widget-container"]') as HTMLElement

  if (container) {
    console.log('[Easybooker] Found widget container:', container)

    // Open the widget by setting height to 450px
    container.style.height = '450px'

    console.log('[Easybooker] Widget opened (height set to 450px)')
    return true
  }

  console.warn('[Easybooker] Widget container not found')
  return false
}

/**
 * Closes the Easybooker reservation widget
 */
export function closeEasybookerWidget(): boolean {
  const container = document.querySelector('[id^="easybooker-widget-container"]') as HTMLElement

  if (container) {
    container.style.height = '130px'
    console.log('[Easybooker] Widget closed')
    return true
  }
  return false
}

/**
 * Checks if the Easybooker widget is available
 */
export function isEasybookerWidgetAvailable(): boolean {
  return !!document.querySelector('[id^="easybooker-widget-container"]')
}

/**
 * Fallback function to navigate to contact page if widget fails
 */
export function fallbackToContactPage(): void {
  window.location.href = '/contact'
}
