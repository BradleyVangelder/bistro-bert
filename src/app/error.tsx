'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center max-w-lg mx-auto px-6">
        <h1 className="typography-h1 text-black mb-6">Er is iets misgegaan</h1>
        <p className="typography-body text-gray-600 mb-8">
          Onze oprechte excuses voor het ongemak. Er is een onverwachte fout opgetreden, maar we werken eraan om dit zo snel mogelijk op te lossen.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <p className="typography-body text-gray-700 mb-4">
            Voor directe hulp of reserveringen, neem alstublieft contact met ons op:
          </p>
          <div className="flex flex-col sm:flex-row button-tight-spacing justify-center items-center">
            <a
              href="tel:+3213480139"
              className="flex items-center gap-2 text-burgundy font-medium hover:underline"
              aria-label="Bel Bistro Bert op +32 13 48 01 39"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              +32 13 48 01 39
            </a>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row button-tight-spacing justify-center mb-8">
          <button
            onClick={reset}
            className="btn-dh min-w-[160px]"
            aria-label="Probeer opnieuw"
          >
            Probeer opnieuw
          </button>
          <Link
            href="/"
            className="btn-dh-secondary min-w-[160px]"
            aria-label="Ga naar de homepagina"
          >
            Homepagina
          </Link>
        </div>
        
        <div className="mt-8">
          <Link
            href="/contact#reserveer"
            className="link-dh-minimal typography-small"
            aria-label="Reserveer een tafel bij Bistro Bert"
          >
            Of reserveer direct een tafel →
          </Link>
        </div>
      </div>
    </div>
  )
}