'use client'

import { useState, useRef, useEffect } from 'react'

interface SmartTruncateProps {
  text: string
  maxWords?: number
  maxLines?: number
  className?: string
  showTooltip?: boolean
  children?: React.ReactNode
}

export default function SmartTruncate({
  text,
  maxWords = 4,
  maxLines = 2,
  className = '',
  showTooltip = false,
  children
}: SmartTruncateProps) {
  const [isTruncated, setIsTruncated] = useState(false)
  const [needsTruncation, setNeedsTruncation] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)

  // Count words in text
  const wordCount = text.trim().split(/\s+/).length

  useEffect(() => {
    if (textRef.current) {
      // Check if text actually overflows
      const element = textRef.current
      const isOverflowing = element.scrollHeight > element.clientHeight ||
                           element.scrollWidth > element.clientWidth

      setNeedsTruncation(isOverflowing)
      setIsTruncated(wordCount > maxWords && isOverflowing)
    }
  }, [text, maxWords])

  // If text has fewer words than maxWords, don't truncate
  if (wordCount <= maxWords) {
    return (
      <span ref={textRef} className={className}>
        {text}
        {children}
      </span>
    )
  }

  // If text has many words but doesn't overflow, don't truncate
  if (!needsTruncation) {
    return (
      <span ref={textRef} className={className}>
        {text}
        {children}
      </span>
    )
  }

  // Apply truncation for text with many words that overflows
  const truncateClass = maxLines === 1 ? 'smart-truncate-short' :
                        maxLines === 2 ? 'smart-truncate-medium' :
                        'smart-truncate-long'

  return (
    <span
      ref={textRef}
      className={`${truncateClass} ${className}`}
      title={showTooltip && isTruncated ? text : undefined}
    >
      {text}
      {children}
    </span>
  )
}