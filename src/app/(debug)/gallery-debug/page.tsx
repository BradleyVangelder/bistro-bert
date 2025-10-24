'use client'

import { useState } from 'react'
import ImageGalleryDebug from '@/components/ImageGalleryDebug'
import { galleryImages } from '@/data/images'

export default function GalleryDebugPage() {
  const [testMode, setTestMode] = useState<'none' | 'no-lightbox' | 'no-skeleton' | 'no-aspect-ratio' | 'fixed-height'>('none')

  return (
    <div className="min-h-screen bg-white">
      <div className="container-dh py-8">
        <h1 className="typography-h1 mb-8">Image Gallery Debug Test</h1>
        
        {/* Test Controls */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="typography-h2 mb-4">Test Controls</h2>
          <p className="typography-body mb-4">
            Select different test modes to isolate the root cause of the nested scroll container issue:
          </p>
          
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="none"
                checked={testMode === 'none'}
                onChange={(e) => setTestMode(e.target.value as typeof testMode)}
                className="mr-2"
              />
              <span className="typography-body">Normal Gallery (Baseline)</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                value="no-lightbox"
                checked={testMode === 'no-lightbox'}
                onChange={(e) => setTestMode(e.target.value as typeof testMode)}
                className="mr-2"
              />
              <span className="typography-body">No Lightbox (Tests if lightbox scroll lock is the cause)</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                value="no-skeleton"
                checked={testMode === 'no-skeleton'}
                onChange={(e) => setTestMode(e.target.value as typeof testMode)}
                className="mr-2"
              />
              <span className="typography-body">No Loading Skeleton (Tests if skeleton loading is the cause)</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                value="no-aspect-ratio"
                checked={testMode === 'no-aspect-ratio'}
                onChange={(e) => setTestMode(e.target.value as typeof testMode)}
                className="mr-2"
              />
              <span className="typography-body">No Aspect Ratio (Tests if aspect ratio containers are the cause)</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                value="fixed-height"
                checked={testMode === 'fixed-height'}
                onChange={(e) => setTestMode(e.target.value as typeof testMode)}
                className="mr-2"
              />
              <span className="typography-body">Fixed Height (Tests if height constraints are the cause)</span>
            </label>
          </div>
        </div>

        {/* Test Instructions */}
        <div className="mb-8 p-6 bg-blue-50 rounded-lg">
          <h2 className="typography-h2 mb-4">How to Test</h2>
          <ol className="list-decimal list-inside space-y-2 typography-body">
            <li>Open browser developer tools and check the console for debug output</li>
            <li>Start with &quot;Normal Gallery&quot; to establish a baseline</li>
            <li>Test each mode systematically to isolate the issue</li>
            <li>Look for console logs indicating scrollable elements or overflow issues</li>
            <li>Check if the nested scroll issue occurs during initial page load</li>
            <li>Test with and without opening the lightbox</li>
          </ol>
        </div>

        {/* Gallery Section */}
        <section 
          className="min-h-[80vh] bg-white py-16 md:py-32"
          ref={(el) => {
            if (el) {
              console.log('[GalleryDebugPage] Gallery section mounted:', el);
            }
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="typography-h2 text-black mb-6 md:mb-8">
                Debug Gallery Test
              </h2>
              <p className="typography-body text-gray-600 max-w-lg md:max-w-2xl mx-auto">
                Testing different scenarios to identify the root cause of nested scroll containers.
              </p>
            </div>

            <ImageGalleryDebug
              images={galleryImages.slice(0, 8)}
              className="w-full"
              enableLightbox={true}
              testMode={testMode}
            />
          </div>
        </section>
      </div>
    </div>
  )
}