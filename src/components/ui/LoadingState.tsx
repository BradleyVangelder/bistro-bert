'use client'

import { motion } from 'framer-motion'

interface LoadingStateProps {
  type?: 'spinner' | 'skeleton' | 'pulse' | 'dots'
  size?: 'sm' | 'md' | 'lg'
  textSize?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
  style?: React.CSSProperties
}

export function LoadingState({
  type = 'spinner',
  size = 'md',
  textSize = 'md',
  text,
  className = '',
  style
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  switch (type) {
    case 'skeleton':
      return (
        <div className={`animate-pulse ${className}`} style={style}>
          <div className={`h-4 bg-gray-200 rounded ${sizeClasses[size]} mb-2`} />
          {text && <div className={`h-3 bg-gray-200 rounded w-3/4 ${textSizes[textSize]}`} />}
        </div>
      )

    case 'pulse':
      return (
        <div className={`flex items-center justify-center ${className}`} style={style}>
          <div className={`${sizeClasses[size]} bg-burgundy rounded-full animate-pulse`} />
          {text && (
            <span className={`ml-2 ${textSizes[textSize]} text-gray-600 animate-pulse`}>
              {text}
            </span>
          )}
        </div>
      )

    case 'dots':
      return (
        <div className={`flex items-center space-x-2 ${className}`} style={style}>
            {[1, 2, 3].map((dot) => (
              <motion.div
                key={dot}
                className={`${sizeClasses[size]} bg-burgundy rounded-full`}
                initial={{ scale: 0.8, opacity: 0.4 }}
                animate={{
                  scale: [0.8, 1, 0.8],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: dot * 0.2,
                }}
              />
            ))}
          </div>
      )

    case 'spinner':
    default:
      return (
        <div className={`flex flex-col items-center justify-center ${className}`} style={style}>
          <motion.div
            className={`${sizeClasses[size]} border-2 border-gray-300 border-t-burgundy rounded-full`}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          {text && (
            <span className={`mt-3 ${textSizes[textSize]} text-gray-600`}>
              {text}
            </span>
          )}
        </div>
      )
  }
}

export function PageLoading({
  text = "Laden..."
}: {
  text?: string
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingState type="pulse" size="lg" text={text} />
    </div>
  )
}

export function ImageSkeleton({
  className = '',
  aspectRatio = 'aspect-video'
}: {
  className?: string
  aspectRatio?: string
}) {
  return (
    <div className={`${aspectRatio} bg-gray-200 animate-pulse ${className}`} />
  )
}

export function TextSkeleton({
  lines = 3,
  className = ''
}: {
  lines?: number
  className?: string
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gray-200 rounded animate-pulse ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  )
}