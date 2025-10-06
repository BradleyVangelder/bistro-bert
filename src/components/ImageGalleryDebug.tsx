'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { GalleryImage } from '@/data/images'
import { TouchInteraction } from '@/components/ui/TouchInteraction'
import { ImageSkeleton } from '@/components/ui/LoadingState'

interface ImageGalleryDebugProps {
  images: GalleryImage[]
  className?: string
  enableLightbox?: boolean
  testMode?: 'none' | 'no-lightbox' | 'no-skeleton' | 'no-aspect-ratio' | 'fixed-height'
}

export default function ImageGalleryDebug({
  images,
  className = '',
  enableLightbox = true,
  testMode = 'none'
}: ImageGalleryDebugProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const galleryRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  // Enhanced debugging function
  const debugScrollState = useCallback((label: string) => {
    console.log(`\n=== ${label} Debug Info ===`);
    
    // Check body and html
    const bodyStyle = window.getComputedStyle(document.body);
    const htmlStyle = window.getComputedStyle(document.documentElement);
    console.log(`[DEBUG] Body overflow: ${bodyStyle.overflow}`);
    console.log(`[DEBUG] Body position: ${bodyStyle.position}`);
    console.log(`[DEBUG] HTML overflow: ${htmlStyle.overflow}`);
    
    // Check gallery section
    if (sectionRef.current) {
      const sectionStyle = window.getComputedStyle(sectionRef.current);
      console.log(`[DEBUG] Section overflow: ${sectionStyle.overflow}`);
      console.log(`[DEBUG] Section overflowY: ${sectionStyle.overflowY}`);
      console.log(`[DEBUG] Section height: ${sectionStyle.height}`);
      console.log(`[DEBUG] Section minHeight: ${sectionStyle.minHeight}`);
      console.log(`[DEBUG] Section scrollHeight: ${sectionRef.current.scrollHeight}`);
      console.log(`[DEBUG] Section clientHeight: ${sectionRef.current.clientHeight}`);
      
      if (sectionRef.current.scrollHeight > sectionRef.current.clientHeight) {
        console.log(`[DEBUG] ⚠️ Section IS scrollable! Difference: ${sectionRef.current.scrollHeight - sectionRef.current.clientHeight}px`);
      }
    }
    
    // Check gallery grid
    if (galleryRef.current) {
      const gridStyle = window.getComputedStyle(galleryRef.current);
      console.log(`[DEBUG] Grid overflow: ${gridStyle.overflow}`);
      console.log(`[DEBUG] Grid scrollHeight: ${galleryRef.current.scrollHeight}`);
      console.log(`[DEBUG] Grid clientHeight: ${galleryRef.current.clientHeight}`);
      
      // Check for nested scrollable elements
      const scrollableElements = galleryRef.current.querySelectorAll('*');
      let nestedScrollFound = false;
      scrollableElements.forEach((el, index) => {
        const elStyle = window.getComputedStyle(el);
        if (elStyle.overflow === 'auto' || elStyle.overflow === 'scroll' ||
            elStyle.overflowY === 'auto' || elStyle.overflowY === 'scroll') {
          if ((el as HTMLElement).scrollHeight > (el as HTMLElement).clientHeight) {
            console.log(`[DEBUG] ⚠️ Nested scrollable element:`, el, `classes: ${el.className}`);
            nestedScrollFound = true;
          }
        }
      });
      
      if (!nestedScrollFound) {
        console.log(`[DEBUG] ✅ No nested scrollable elements in grid`);
      }
    }
    
    console.log(`=== End ${label} Debug ===\n`);
  }, []);

  const handleImageClick = (image: GalleryImage, index: number) => {
    if (enableLightbox && testMode !== 'no-lightbox') {
      setSelectedImage(image)
      setSelectedIndex(index)
    }
  }

  const handleImageLoad = (imageId: string) => {
    console.log(`[ImageGalleryDebug] 📷 Image loaded: ${imageId}`);
    setLoadedImages(prev => {
      const newSet = new Set(prev).add(imageId);
      console.log(`[ImageGalleryDebug] 📊 Loaded images count: ${newSet.size}/${images.length}`);
      
      // Check for scroll issues after all images are loaded
      if (newSet.size === images.length) {
        console.log('[ImageGalleryDebug] ✅ All images loaded - checking for scroll issues');
        setTimeout(() => debugScrollState('[ALL IMAGES LOADED]'), 100);
      }
      
      return newSet;
    });
  }

  const closeLightbox = useCallback(() => {
    setSelectedImage(null)
  }, [])

  const goToPrevious = useCallback(() => {
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : images.length - 1
    setSelectedIndex(newIndex)
    setSelectedImage(images[newIndex])
  }, [selectedIndex, images])

  const goToNext = useCallback(() => {
    const newIndex = selectedIndex < images.length - 1 ? selectedIndex + 1 : 0
    setSelectedIndex(newIndex)
    setSelectedImage(images[newIndex])
  }, [selectedIndex, images])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!selectedImage) return

    switch (e.key) {
      case 'Escape':
        closeLightbox()
        break
      case 'ArrowLeft':
        goToPrevious()
        break
      case 'ArrowRight':
        goToNext()
        break
      default:
        break
    }
  }, [selectedImage, closeLightbox, goToPrevious, goToNext])

  // Check scroll state on mount and during loading
  useEffect(() => {
    debugScrollState('[INITIAL MOUNT]');
    
    const timer1 = setTimeout(() => debugScrollState('[DURING LOADING]'), 1000);
    const timer2 = setTimeout(() => debugScrollState('[AFTER LOADING]'), 3000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [debugScrollState]);

  // Scroll lock effect for lightbox
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    if (selectedImage) {
      console.log('[ImageGalleryDebug] ⚠️ Lightbox opening - applying scroll lock');
      debugScrollState('[BEFORE SCROLL LOCK]');
      
      // Prevent scrolling on both body and html elements
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = '0'
      document.documentElement.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
      
      debugScrollState('[AFTER SCROLL LOCK]');
    } else {
      console.log('[ImageGalleryDebug] ✅ Lightbox closing - restoring scroll');
      debugScrollState('[BEFORE SCROLL RESTORE]');
      
      // Restore scrolling
      document.body.style.overflow = 'auto'
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
      
      debugScrollState('[AFTER SCROLL RESTORE]');
    }

    return () => {
      console.log('[ImageGalleryDebug] 🧹 Cleanup - ensuring scroll is restored');
      // Ensure cleanup restores scrolling
      document.body.style.overflow = 'auto'
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedImage, handleKeyDown, debugScrollState])

  // Determine container styles based on test mode
  const getContainerStyles = () => {
    switch (testMode) {
      case 'fixed-height':
        return { minHeight: '400px', height: '400px', overflow: 'hidden' };
      default:
        return { overflow: 'visible' };
    }
  };

  // Determine image container styles
  const getImageContainerStyles = () => {
    switch (testMode) {
      case 'no-aspect-ratio':
        return { className: "relative overflow-hidden border-0 cursor-pointer group" };
      case 'fixed-height':
        return { className: "relative overflow-hidden border-0 cursor-pointer group", style: { height: '200px' } };
      default:
        return { className: "relative aspect-[4/3] overflow-hidden border-0 cursor-pointer group" };
    }
  };

  return (
    <>
      {/* Debug Info Panel */}
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-bold text-yellow-800 mb-2">Debug Info:</h3>
        <p className="text-sm text-yellow-700">Test Mode: {testMode}</p>
        <p className="text-sm text-yellow-700">Images Loaded: {loadedImages.size}/{images.length}</p>
        <p className="text-sm text-yellow-700">Lightbox Enabled: {enableLightbox && testMode !== 'no-lightbox' ? 'Yes' : 'No'}</p>
        <button 
          onClick={() => debugScrollState('[MANUAL CHECK]')}
          className="mt-2 px-3 py-1 bg-yellow-200 text-yellow-800 rounded text-sm"
        >
          Check Scroll State
        </button>
      </div>

      {/* Gallery Grid */}
      <div
        ref={galleryRef}
        className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}
        {...getContainerStyles()}
      >
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            {...getImageContainerStyles()}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: index * 0.1,
              ease: [0.23, 1, 0.32, 1]
            }}
            viewport={{ once: true, margin: "-50px", amount: 0.1 }}
            onClick={() => handleImageClick(image, index)}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            tabIndex={0}
            role="button"
            aria-label={`Bekijk afbeelding: ${image.alt}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleImageClick(image, index)
              }
            }}
          >
            {/* Image Container */}
            <div className="relative overflow-hidden bg-gray-100">
              {testMode !== 'no-skeleton' && !loadedImages.has(image.id) && (
                <ImageSkeleton
                  className="absolute inset-0 z-10"
                  aspectRatio="aspect-[4/3]"
                />
              )}
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                  loadedImages.has(image.id) ? 'opacity-100' : 'opacity-0'
                }`}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={image.priority}
                onLoad={() => handleImageLoad(image.id)}
              />
            </div>

            {/* Minimal overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {enableLightbox && testMode !== 'no-lightbox' && selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            onWheel={(e) => e.preventDefault()}
            onTouchMove={(e) => e.preventDefault()}
            style={{ touchAction: 'none' }}
          >
            {/* Close Button */}
            <motion.button
              className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50"
              onClick={closeLightbox}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              aria-label="Sluit afbeelding weergave"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <motion.button
                  className="absolute left-6 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToPrevious()
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  aria-label="Vorige afbeelding"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>

                <motion.button
                  className="absolute right-6 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToNext()
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  aria-label="Volgende afbeelding"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </>
            )}

            {/* Main Image */}
            <TouchInteraction
              onSwipeLeft={goToPrevious}
              onSwipeRight={goToNext}
              touchAction="none"
              disabled={false}
              className="relative max-w-6xl max-h-[85vh] mx-auto px-4"
            >
              <motion.div
                className="relative h-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  width={1600}
                  height={1200}
                  className="max-w-full max-h-full object-contain"
                  priority
                />

              {/* Image Info */}
              {selectedImage.title && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-white text-xl font-light">
                    {selectedImage.title}
                  </h3>
                </motion.div>
              )}
              </motion.div>
            </TouchInteraction>

            {/* Image Counter */}
            {images.length > 1 && (
              <motion.div
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/70 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {selectedIndex + 1} / {images.length}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}