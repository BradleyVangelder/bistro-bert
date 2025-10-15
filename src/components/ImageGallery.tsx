'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { GalleryImage } from '@/data/images'
import { TouchInteraction } from '@/components/ui/TouchInteraction'
import { ImageSkeleton } from '@/components/ui/LoadingState'
import { RemoveScroll } from 'react-remove-scroll'

interface ImageGalleryProps {
  images: GalleryImage[]
  className?: string
  enableLightbox?: boolean
}

export default function ImageGallery({
  images,
  className = '',
  enableLightbox = true
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const scrollPositionRef = useRef(0)
  const galleryRef = useRef<HTMLDivElement>(null)

  const handleImageClick = (image: GalleryImage, index: number) => {
    if (enableLightbox) {
      setSelectedImage(image)
      setSelectedIndex(index)
    }
  }

  const handleImageLoad = (imageId: string) => {
    console.log(`[ImageGallery] 📷 Image loaded: ${imageId}`);
    setLoadedImages(prev => {
      const newSet = new Set(prev).add(imageId);
      console.log(`[ImageGallery] 📊 Loaded images count: ${newSet.size}/${images.length}`);
      
      // Check if all images are loaded
      if (newSet.size === images.length) {
        console.log('[ImageGallery] ✅ All images loaded - applying overflow fix');
        
        // Fix nested scroll issue by ensuring container has proper overflow
        setTimeout(() => {
          const galleryContainer = document.querySelector('.mobile-gallery')?.closest('.container-dh') as HTMLElement;
          const gallerySection = galleryContainer?.closest('section') as HTMLElement;
          
          if (galleryContainer) {
            console.log('[ImageGallery] 🔧 Applying overflow fix to gallery container');
            galleryContainer.style.overflow = 'visible';
            galleryContainer.style.overflowY = 'visible';
            galleryContainer.style.height = 'auto';
            galleryContainer.style.maxHeight = 'none';
            galleryContainer.setAttribute('data-gallery-fixed', 'true');
          }
          
          if (gallerySection) {
            console.log('[ImageGallery] 🔧 Applying overflow fix to gallery section');
            gallerySection.style.overflow = 'visible';
            gallerySection.style.overflowY = 'visible';
            gallerySection.setAttribute('data-gallery-section', 'true');
          }
          
          // Verify the fix was applied
          if (galleryContainer) {
            const finalStyles = window.getComputedStyle(galleryContainer);
            console.log('[ImageGallery] ✅ Final container overflow:', finalStyles.overflow);
          }
        }, 100);
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

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    if (selectedImage) {
      console.log('[ImageGallery] ⚠️ Lightbox opening - applying scroll lock');
      
      // Store current scroll position
      scrollPositionRef.current = window.pageYOffset || document.documentElement.scrollTop
      
      // Add keyboard event listener
      window.addEventListener('keydown', handleKeyDown)
      
      console.log('[ImageGallery] Scroll position stored:', scrollPositionRef.current);
    } else {
      console.log('[ImageGallery] ✅ Lightbox closing - restoring scroll');
      
      // Restore scroll position
      window.scrollTo(0, scrollPositionRef.current)
      
      // Remove keyboard event listener
      window.removeEventListener('keydown', handleKeyDown)
      
      console.log('[ImageGallery] Scroll position restored to:', scrollPositionRef.current);
    }

    return () => {
      console.log('[ImageGallery] 🧹 Cleanup - ensuring scroll is restored');
      // Ensure cleanup restores scrolling and removes event listener
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedImage, handleKeyDown])

  return (
    <>
      {/* Gallery Grid - 2 columns, no rounded borders */}
      <div
        ref={galleryRef}
        className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}
        style={{
          overflow: 'visible'
        }}
      >
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            className="relative border-0 cursor-pointer group focus-within:ring-2 focus-within:ring-burgundy focus-within:ring-offset-2 rounded"
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
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 rounded">
              {!loadedImages.has(image.id) && (
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
        {enableLightbox && selectedImage && (
          <RemoveScroll>
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
              onWheel={(e) => e.preventDefault()}
              style={{ touchAction: 'pan-y' }}
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
              touchAction="pan-y"
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
          </RemoveScroll>
        )}
      </AnimatePresence>
    </>
  )
}