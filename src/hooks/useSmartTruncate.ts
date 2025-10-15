'use client'

import { useState, useRef, useEffect } from 'react'

interface UseSmartTruncateOptions {
  maxWords?: number
  maxLines?: number
}

export function useSmartTruncate(text: string, options: UseSmartTruncateOptions = {}) {
  const { maxWords = 4, maxLines = 2 } = options
  const [isTruncated, setIsTruncated] = useState(false)
  const [needsTruncation, setNeedsTruncation] = useState(false)
  const [showFullText, setShowFullText] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)

  // Count words in text
  const wordCount = text.trim().split(/\s+/).length
  const shouldConsiderTruncation = wordCount > maxWords

  useEffect(() => {
    if (textRef.current && shouldConsiderTruncation) {
      // Check if text actually overflows
      const element = textRef.current
      const isOverflowing = element.scrollHeight > element.clientHeight ||
                           element.scrollWidth > element.clientWidth

      setNeedsTruncation(isOverflowing)
      setIsTruncated(isOverflowing)
    }
  }, [text, maxWords, shouldConsiderTruncation])

  const toggleTruncation = () => {
    setShowFullText(!showFullText)
  }

  // Determine CSS class based on maxLines
  const getTruncateClass = () => {
    if (!shouldConsiderTruncation || !needsTruncation || showFullText) {
      return ''
    }

    switch (maxLines) {
      case 1:
        return 'smart-truncate-short'
      case 2:
        return 'smart-truncate-medium'
      case 3:
        return 'smart-truncate-long'
      default:
        return 'smart-truncate-medium'
    }
  }

  // Get props for the text element
  const getTextProps = () => ({
    ref: textRef,
    className: getTruncateClass(),
    title: isTruncated && !showFullText ? text : undefined
  })

  return {
    isTruncated,
    needsTruncation,
    shouldConsiderTruncation,
    showFullText,
    toggleTruncation,
    getTextProps,
    wordCount
  }
}