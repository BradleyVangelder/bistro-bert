'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function DebugImagesPage() {
  const [errors, setErrors] = useState<string[]>([])
  const [successes, setSuccesses] = useState<string[]>([])

  const testImages = [
    '/images/restaurant/hero-moody-wine-bar.jpg',
    '/images/restaurant/chef-portrait.jpg',
    '/images/restaurant/cuisine.jpg',
    '/images/restaurant/dining-room.jpg',
    '/images/restaurant/hero-elegant-fine-dining.jpg',
    '/bistro-bert-logo.png'
  ]

  const handleImageError = (src: string) => {
    setErrors(prev => [...prev, src])
    console.error(`Failed to load image: ${src}`)
  }

  const handleImageLoad = (src: string) => {
    setSuccesses(prev => [...prev, src])
    console.log(`Successfully loaded image: ${src}`)
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-8">Image Loading Debug Page</h1>
      
      {/* Status */}
      <div className="mb-8 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-4">Loading Status:</h2>
        <p className="text-green-600">✅ Loaded: {successes.length}</p>
        <p className="text-red-600">❌ Failed: {errors.length}</p>
      </div>

      {/* Test Regular img tags */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Test 1: Regular img tags</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testImages.map((src, index) => (
            <div key={`regular-${index}`} className="border p-4">
              <p className="text-sm mb-2">Regular img: {src}</p>
              <img
                src={src}
                alt={`Test image ${index + 1}`}
                className="w-full h-32 object-cover"
                onError={() => handleImageError(`regular-${src}`)}
                onLoad={() => handleImageLoad(`regular-${src}`)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Test Next.js Image component */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Test 2: Next.js Image Component</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testImages.map((src, index) => (
            <div key={`nextjs-${index}`} className="border p-4">
              <p className="text-sm mb-2">Next.js Image: {src}</p>
              <div className="relative w-full h-32">
                <Image
                  src={src}
                  alt={`Test image ${index + 1}`}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(`nextjs-${src}`)}
                  onLoad={() => handleImageLoad(`nextjs-${src}`)}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Error List */}
      {errors.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Failed Images:</h2>
          <ul className="list-disc pl-6">
            {errors.map((error, index) => (
              <li key={index} className="text-red-600">{error}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Success List */}
      {successes.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-green-600">Successful Images:</h2>
          <ul className="list-disc pl-6">
            {successes.map((success, index) => (
              <li key={index} className="text-green-600">{success}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Network Information */}
      <section className="bg-blue-50 p-4 rounded">
        <h2 className="text-lg font-semibold mb-4">Debug Information:</h2>
        <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Loading...'}</p>
        <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent : 'Loading...'}</p>
        <p><strong>Dev Tools:</strong> Open browser dev tools and check Network tab for failed requests</p>
      </section>
    </div>
  )
}