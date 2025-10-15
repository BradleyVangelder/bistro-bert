'use client'

import { useSmartTruncate } from '@/hooks/useSmartTruncate'

interface SmartHeadingProps {
  children: React.ReactNode
  level?: 1 | 2 | 3 | 4 | 5 | 6
  maxWords?: number
  maxLines?: number
  className?: string
  showTooltip?: boolean
}

export default function SmartHeading({
  children,
  level = 2,
  maxWords,
  maxLines,
  className = '',
  showTooltip = false
}: SmartHeadingProps) {
  const text = typeof children === 'string' ? children : String(children)

  // Set default word thresholds based on heading level
  const defaultMaxWords = {
    1: 5, // H1: truncate after 5 words
    2: 6, // H2: truncate after 6 words
    3: 7, // H3: truncate after 7 words
    4: 8, // H4: truncate after 8 words
    5: 9, // H5: truncate after 9 words
    6: 10 // H6: truncate after 10 words
  }

  const defaultMaxLines = {
    1: 2, // H1: max 2 lines
    2: 2, // H2: max 2 lines
    3: 3, // H3: max 3 lines
    4: 3, // H4: max 3 lines
    5: 4, // H5: max 4 lines
    6: 4  // H6: max 4 lines
  }

  const wordThreshold = maxWords || defaultMaxWords[level]
  const lineThreshold = maxLines || defaultMaxLines[level]

  const { getTextProps, isTruncated, shouldConsiderTruncation } = useSmartTruncate(text, {
    maxWords: wordThreshold,
    maxLines: lineThreshold
  })

  const baseClasses = {
    1: 'heading-serif-large text-4xl md:text-5xl',
    2: 'text-suisse-h2 tracking-tight',
    3: 'text-suisse-h3',
    4: 'text-suisse-h4',
    5: 'typography-h5',
    6: 'typography-h6'
  }

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements

  if (!shouldConsiderTruncation) {
    return (
      <HeadingTag className={`${baseClasses[level]} ${className}`}>
        {children}
      </HeadingTag>
    )
  }

  return (
    <HeadingTag
      className={`${baseClasses[level]} ${className}`}
      {...getTextProps()}
      title={showTooltip && isTruncated ? text : undefined}
    >
      {text}
    </HeadingTag>
  )
}

// Specialized heading components for different contexts
export function SmartH1(props: Omit<SmartHeadingProps, 'level'>) {
  return <SmartHeading {...props} level={1} />
}

export function SmartH2(props: Omit<SmartHeadingProps, 'level'>) {
  return <SmartHeading {...props} level={2} />
}

export function SmartH3(props: Omit<SmartHeadingProps, 'level'>) {
  return <SmartHeading {...props} level={3} />
}

export function SmartH4(props: Omit<SmartHeadingProps, 'level'>) {
  return <SmartHeading {...props} level={4} />
}

// Restaurant-specific heading components
export function RestaurantHeroHeading({ children, className = '', ...props }: SmartHeadingProps) {
  return (
    <h1
      className={`text-luxury-hero font-serif text-white mb-6 ${className}`}
      {...props}
    >
      {children}
    </h1>
  )
}

export function RestaurantSectionHeading({ children, className = '', ...props }: SmartHeadingProps) {
  return (
    <h2
      className={`text-suisse-h2 font-serif mb-8 ${className}`}
      {...props}
    >
      {children}
    </h2>
  )
}

export function RestaurantSubsectionHeading({ children, className = '', ...props }: SmartHeadingProps) {
  return (
    <h3
      className={`text-suisse-h3 font-serif mb-4 ${className}`}
      {...props}
    >
      {children}
    </h3>
  )
}

export function MenuCategoryHeading({ children, className = '', ...props }: SmartHeadingProps) {
  return (
    <SmartH2
      {...props}
      maxWords={4}
      maxLines={1}
      className={`text-suisse-h2 mb-2 tracking-tight ${className}`}
    >
      {children}
    </SmartH2>
  )
}

export function NavigationHeading({ children, className = '', ...props }: SmartHeadingProps) {
  return (
    <SmartH2
      {...props}
      maxWords={3}
      maxLines={1}
      className={`text-suisse-h2 tracking-tight ${className}`}
    >
      {children}
    </SmartH2>
  )
}