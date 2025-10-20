"use client"

// Utility functions for Zenchef widget interaction

declare global {
  interface Window {
    zenchef?: {
      showWidget?: () => void
      openWidget?: () => void
      widget?: {
        show?: () => void
        open?: () => void
      }
      [key: string]: any
    }
    Zenchef?: {
      showWidget?: () => void
      openWidget?: () => void
      widget?: {
        show?: () => void
        open?: () => void
      }
    }
  }
}

/**
 * Opens the Zenchef reservation widget
 * Uses the standard Zenchef SDK API methods
 */
export function openZenchefWidget(): boolean {
  try {
    // Wait a bit for the SDK to be fully loaded
    if (!window.zenchef) {
      console.warn('Zenchef SDK not loaded yet')
      return false
    }

    // Standard Zenchef SDK method - openWidget()
    if (typeof window.zenchef.openWidget === 'function') {
      window.zenchef.openWidget()
      return true
    }

    // Alternative method - showWidget()
    if (typeof window.zenchef.showWidget === 'function') {
      window.zenchef.showWidget()
      return true
    }

    // Try using the widget.open() method
    if (window.zenchef.widget && typeof window.zenchef.widget.open === 'function') {
      window.zenchef.widget.open()
      return true
    }

    // Try using the widget.show() method
    if (window.zenchef.widget && typeof window.zenchef.widget.show === 'function') {
      window.zenchef.widget.show()
      return true
    }

    // If no methods are available, the widget might auto-initialize
    // Try to find and click the widget trigger
    const widgetTrigger = document.querySelector('.zc-widget-trigger') ||
                         document.querySelector('[data-zenchef-open]') ||
                         document.querySelector('.zenchef-open-trigger')

    if (widgetTrigger) {
      (widgetTrigger as HTMLElement).click()
      return true
    }

    console.warn('No Zenchef widget opening method found')
    return false
  } catch (error) {
    console.error('Error opening Zenchef widget:', error)
    return false
  }
}

/**
 * Checks if the Zenchef widget is available
 */
export function isZenchefWidgetAvailable(): boolean {
  return !!(window.zenchef || window.Zenchef || document.querySelector('.zc-widget-config'))
}

/**
 * Fallback function to navigate to contact page if widget fails
 */
export function fallbackToContactPage(): void {
  window.location.href = '/contact'
}