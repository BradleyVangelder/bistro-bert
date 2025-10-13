'use client'

import { useSmartTruncate } from '@/hooks/useSmartTruncate'

interface SmartTextProps {
  text: string
  maxWords?: number
  maxLines?: number
  className?: string
  showTooltip?: boolean
  children?: React.ReactNode
}

export default function SmartText({
  text,
  maxWords = 4,
  maxLines = 2,
  className = '',
  showTooltip = false,
  children
}: SmartTextProps) {
  const {
    isTruncated,
    shouldConsiderTruncation,
    getTextProps,
    wordCount
  } = useSmartTruncate(text, { maxWords, maxLines })

  // If text has fewer words than threshold, render normally
  if (!shouldConsiderTruncation) {
    return (
      <span className={className}>
        {text}
        {children}
      </span>
    )
  }

  // Render with smart truncation
  return (
    <span {...getTextProps()} className={`${getTextProps().className} ${className}`}>
      {text}
      {children}
      {isTruncated && showTooltip && (
        <span className="sr-only"> (Click to expand)</span>
      )}
    </span>
  )
}

// Example usage component
export function SmartNavigationItem({
  text,
  href,
  isActive = false
}: {
  text: string
  href: string
  isActive?: boolean
}) {
  const { getTextProps, isTruncated } = useSmartTruncate(text, { maxWords: 4 })

  return (
    <a
      href={href}
      className={`nav-truncate ${isActive ? 'text-burgundy' : 'text-rich-black'}`}
      {...getTextProps()}
    >
      {text}
      {isTruncated && (
        <span className="ml-1 text-xs text-gray-400">...</span>
      )}
    </a>
  )
}

// Example menu item component
export function SmartMenuItem({
  title,
  description
}: {
  title: string
  description?: string
}) {
  const titleProps = useSmartTruncate(title, { maxWords: 3 })
  const descProps = useSmartTruncate(description || '', { maxWords: 8, maxLines: 2 })

  return (
    <div className="menu-item-truncate">
      <h4 {...titleProps.getTextProps()} className="font-semibold">
        {title}
      </h4>
      {description && (
        <p {...descProps.getTextProps()} className="text-sm text-gray-600 mt-1">
          {description}
        </p>
      )}
    </div>
  )
}