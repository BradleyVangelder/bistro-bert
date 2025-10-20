"use client"

import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

export default function ZenchefWidget() {
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if Zenchef SDK is loaded and initialize the widget
    const initializeWidget = () => {
      if (window.zenchef && widgetRef.current) {
        // The widget should be automatically initialized by the SDK
        // when it finds the div with the zc-widget-config class
        console.log('Zenchef SDK loaded and widget configured')
      }
    }

    // Try immediately in case SDK is already loaded
    initializeWidget()

    // Also try after a short delay in case SDK is still loading
    const timeout = setTimeout(initializeWidget, 1000)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <>
      {/* Zenchef Widget Configuration */}
      <div
        ref={widgetRef}
        className="zc-widget-config"
        data-restaurant="379271"
        data-open="2000"
        data-primary-color="38644B"
        data-lang="nl"
        style={{ display: 'none' }}
      />
      </>
  )
}

// Add TypeScript declaration for the Zenchef SDK
declare global {
  interface Window {
    zenchef?: any
  }
}