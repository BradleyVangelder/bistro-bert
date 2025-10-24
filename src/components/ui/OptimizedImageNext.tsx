'use client'

import Image, { type StaticImageData } from 'next/image'
import { useState, useCallback } from 'react'
import { cn } from '@/utils/cn'

interface OptimizedImageNextProps {
  src: string | StaticImageData
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  style?: React.CSSProperties
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  loading?: 'lazy' | 'eager'
  onLoad?: () => void
  onError?: () => void
  unoptimized?: boolean
}

export default function OptimizedImageNext({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  style,
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  loading,
  onLoad,
  onError,
  unoptimized = false,
}: OptimizedImageNextProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = useCallback(() => {
    setIsLoading(false)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setHasError(true)
    setIsLoading(false)
    onError?.()
  }, [onError])

  // Generate low-quality blur placeholder
  const generateBlurDataURL = () => {
    if (blurDataURL) return blurDataURL
    
    // Generate a simple placeholder data URL
    return `data:image/svg+xml;base64,${btoa(
      `<svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="sans-serif">
          Loading...
        </text>
      </svg>`
    )}`
  }

  if (hasError) {
    return (
      <div className={cn(
        'flex items-center justify-center bg-gray-100 text-gray-400',
        className
      )}>
        <span className="text-sm">Failed to load image</span>
      </div>
    )
  }

  // For fill images, we need to return the Image directly without a wrapper
  // to maintain proper positioning context
  if (fill) {
    return (
      <>
        {isLoading && placeholder === 'blur' && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse z-0">
            <Image
              src={generateBlurDataURL()}
              alt=""
              fill
              className="object-cover blur-2xl scale-110"
              sizes={sizes}
            />
          </div>
        )}
        
        <Image
          src={src}
          alt={alt}
          fill={fill}
          quality={quality}
          priority={priority}
          loading={loading || (priority ? 'eager' : 'lazy')}
          placeholder={placeholder}
          blurDataURL={placeholder === 'blur' ? generateBlurDataURL() : undefined}
          unoptimized={unoptimized}
          className={cn(
            className,
            'duration-700 ease-in-out',
            isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'
          )}
          style={style}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
        />
      </>
    )
  }

  // For non-fill images, use the wrapper div
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {isLoading && placeholder === 'blur' && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse">
          <Image
            src={generateBlurDataURL()}
            alt=""
            fill
            className="object-cover blur-2xl scale-110"
            sizes={sizes}
          />
        </div>
      )}
      
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        loading={loading || (priority ? 'eager' : 'lazy')}
        placeholder={placeholder}
        blurDataURL={placeholder === 'blur' ? generateBlurDataURL() : undefined}
        unoptimized={unoptimized}
        className={cn(
          'duration-700 ease-in-out',
          isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'
        )}
        style={style}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}
