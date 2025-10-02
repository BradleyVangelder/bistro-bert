'use client'

interface ImageSkeletonProps {
  className?: string
}

export default function ImageSkeleton({ className = '' }: ImageSkeletonProps) {
  return (
    <div className={`bg-gray-200 animate-pulse ${className}`}>
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    </div>
  )
}