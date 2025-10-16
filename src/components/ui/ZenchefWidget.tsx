"use client"

import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

export default function ZenchefWidget() {
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize the Zenchef widget if the SDK is available
    if (window.zenchef && widgetRef.current) {
      // The widget should be automatically initialized by the SDK
      // when it finds the div with the zc-widget-config class
    }
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
        style={{ display: 'none' }}
      />

      {/* Fallback message if widget doesn't load */}
      <motion.div
        className="w-full max-w-2xl mx-auto py-8 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <p className="text-gray-600">
          Reserveer direct via onze online reserveringstool of neem contact op via e-mail of telefoon.
        </p>
      </motion.div>
    </>
  )
}

// Add TypeScript declaration for the Zenchef SDK
declare global {
  interface Window {
    zenchef?: any
  }
}