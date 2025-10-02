'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCursor } from './CursorProvider'

interface SophisticatedImageProps {
  src: string
  alt: string
  className?: string
  overlay?: boolean
  shimmer?: boolean
  aspectRatio?: 'square' | 'portrait' | 'landscape'
  priority?: boolean
}

export function SophisticatedImage({
  src,
  alt,
  className = '',
  overlay = true,
  shimmer = true,
  aspectRatio = 'landscape'
}: SophisticatedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)
  const { setCursorVariant } = useCursor()

  const aspectClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[16/9]'
  }

  return (
    <motion.div
      className={`relative overflow-hidden group ${aspectClasses[aspectRatio]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px", amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseEnter={() => setCursorVariant('hover')}
      onMouseLeave={() => setCursorVariant('default')}
    >
      {/* Loading State */}
      {!isLoaded && !error && (
        <motion.div
          className="absolute inset-0 bg-[#E9ECEB]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          {shimmer && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full animate-shimmer" />
          )}
        </motion.div>
      )}

      {/* Main Image */}
      <motion.img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-1000 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}

        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 bg-[#E9ECEB] flex items-center justify-center">
          <span className="text-[#0F3B2F]/30 font-inter text-sm">Image not available</span>
        </div>
      )}

      {/* Sophisticated Overlay */}
      {overlay && isLoaded && !error && (
        <>
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Edge vignette */}
          <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(15,59,47,0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Top light sweep */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent transform -translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
        </>
      )}

      {/* Sophisticated border */}
      <div className="absolute inset-0 border border-[#E9ECEB]/20 pointer-events-none" />
    </motion.div>
  )
}

interface GalleryImageProps {
  images: string[]
  alt: string
  className?: string
}

export function GalleryImage({ images, alt, className = '' }: GalleryImageProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { setCursorVariant } = useCursor()

  return (
    <motion.div
      className={`relative overflow-hidden group ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px", amount: 0.3 }}
      transition={{ duration: 0.8 }}
      onMouseEnter={() => setCursorVariant('hover')}
      onMouseLeave={() => setCursorVariant('default')}
    >
      {images.map((src, index) => (
        <motion.img
          key={src}
          src={src}
          alt={`${alt} ${index + 1}`}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{
            opacity: index === currentIndex ? 1 : 0,
            scale: index === currentIndex ? 1 : 1.1
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      ))}

      {/* Image counter */}
      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
        <span className="text-white font-inter text-xs">
          {currentIndex + 1} / {images.length}
        </span>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white scale-125' : 'bg-white/30'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      {/* Auto-cycle indicator */}
      <motion.div
        className="absolute top-4 right-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
      </motion.div>
    </motion.div>
  )
}