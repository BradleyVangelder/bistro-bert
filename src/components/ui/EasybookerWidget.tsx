"use client"

import { useEffect } from 'react'

export default function EasybookerWidget() {
  useEffect(() => {
    // Load the Easybooker widget script
    const script = document.createElement('script')
    script.src = 'https://formv2.easybooker.be/widget.js'
    script.async = true
    script.setAttribute('data-widget-type', 'widget')
    script.setAttribute('data-business-id', '694')
    script.setAttribute('data-base-url', 'https://formv2.easybooker.be/')
    
    document.body.appendChild(script)

    return () => {
      // Clean up the script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  return null // This component doesn't render anything visible
}
