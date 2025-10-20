'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, Variants, MotionProps } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import useDropdown, { DropdownVariant, DropdownPosition } from '@/hooks/animations/useDropdown'
import AnimatedOverlay from './AnimatedOverlay'
import { 
  ANIMATION_DURATIONS, 
  ANIMATION_DELAYS, 
  EASING, 
  ANIMATION_STATES 
} from '@/utils/animations/constants'
import { 
  performanceMonitor, 
  HardwareAccelerationHelper 
} from '@/utils/animations/performance'
import { 
  AccessibilityAnimationAdapter,
  createSafeAnimationProps,
  getSafeAnimationDuration
} from '@/utils/animations/accessibility'

// Dropdown item interface
export interface DropdownItem {
  id: string
  label: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  disabled?: boolean
  divider?: boolean
  onClick?: () => void
}

// Dropdown props interface
export interface LuxuryDropdownProps extends Omit<MotionProps, 'variants' | 'initial' | 'animate' | 'exit'> {
  // Core props
  items: DropdownItem[]
  placeholder?: string
  selectedValue?: string | number
  
  // Variant props
  variant?: DropdownVariant
  position?: DropdownPosition
  
  // Animation props
  duration?: number
  enablePerformanceMonitoring?: boolean
  respectReducedMotion?: boolean
  
  // Visual props
  showBackdrop?: boolean
  backdropVariant?: 'blur' | 'vignette' | 'fade' | 'gradient'
  backdropOpacity?: number
  showChevron?: boolean
  maxHeight?: number
  
  // Interaction props
  closeOnSelect?: boolean
  closeOnOutsideClick?: boolean
  closeOnEscape?: boolean
  
  // Accessibility props
  ariaLabel?: string
  ariaDescribedBy?: string
  
  // Styling props
  className?: string
  triggerClassName?: string
  dropdownClassName?: string
  itemClassName?: string
  
  // Callbacks
  onSelect?: (item: DropdownItem) => void
  onOpen?: () => void
  onClose?: () => void
  onAnimationStart?: () => void
  onAnimationComplete?: () => void
}

// Create dropdown variants based on variant type
const createDropdownVariants = (
  variant: DropdownVariant,
  duration: number
): Variants => {
  const baseTransition = {
    duration: duration / 1000,
    ease: EASING.luxury as any,
  }

  switch (variant) {
    case 'elegant':
      return {
        initial: { 
          opacity: 0, 
          scale: 0.95, 
          y: -10,
        },
        animate: { 
          opacity: 1, 
          scale: 1, 
          y: 0,
          transition: baseTransition
        },
        exit: { 
          opacity: 0, 
          scale: 0.95, 
          y: -10,
          transition: { ...baseTransition, duration: (duration / 1000) * 0.8 }
        },
      }

    case 'slide':
      return {
        initial: { 
          opacity: 0, 
          y: -20,
        },
        animate: { 
          opacity: 1, 
          y: 0,
          transition: { ...baseTransition, ease: EASING.graceful as any }
        },
        exit: { 
          opacity: 0, 
          y: -20,
          transition: { ...baseTransition, duration: (duration / 1000) * 0.7 }
        },
      }

    case 'scale':
      return {
        initial: { 
          opacity: 0, 
          scale: 0.8,
          transformOrigin: 'top',
        },
        animate: { 
          opacity: 1, 
          scale: 1,
          transformOrigin: 'top',
          transition: { ...baseTransition, ease: EASING.responsive as any }
        },
        exit: { 
          opacity: 0, 
          scale: 0.8,
          transformOrigin: 'top',
          transition: { ...baseTransition, duration: (duration / 1000) * 0.6 }
        },
      }

    default:
      return createDropdownVariants('elegant', duration)
  }
}

// Create item variants for staggered animations
const createItemVariants = (duration: number): Variants => {
  return {
    initial: { 
      opacity: 0, 
      x: -10,
    },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: duration / 1000,
        ease: EASING.refined as any,
      }
    },
    exit: { 
      opacity: 0, 
      x: -10,
      transition: {
        duration: (duration / 1000) * 0.5,
        ease: EASING.refined as any,
      }
    },
  }
}

export function LuxuryDropdown({
  items,
  placeholder = 'Select an option',
  selectedValue,
  variant = 'elegant',
  position = 'bottom-left',
  duration = ANIMATION_DURATIONS.fast,
  enablePerformanceMonitoring = true,
  respectReducedMotion = true,
  showBackdrop = false,
  backdropVariant = 'blur',
  backdropOpacity = 0.3,
  showChevron = true,
  maxHeight = 300,
  closeOnSelect = true,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  ariaLabel,
  ariaDescribedBy,
  className,
  triggerClassName,
  dropdownClassName,
  itemClassName,
  onSelect,
  onOpen,
  onClose,
  onAnimationStart,
  onAnimationComplete,
  ...motionProps
}: LuxuryDropdownProps) {
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(
    items.find(item => item.value === selectedValue) || null
  )
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Use dropdown hook
  const {
    state,
    open,
    close,
    toggle,
    getDropdownProps,
    getItemsProps,
    getBackdropProps,
    getPosition,
    updatePosition,
    getAnimationVariants,
  } = useDropdown({
    variant,
    position,
    enablePerformanceMonitoring,
    enableAccessibility: respectReducedMotion,
    closeOnEscape,
    closeOnOutsideClick,
    animationDuration: duration,
    onOpen,
    onClose,
    onAnimationStart,
    onAnimationComplete,
  })

  // Create animation variants
  const dropdownVariants = createDropdownVariants(variant, duration)
  const itemVariants = createItemVariants(duration)

  // Create accessible variants
  const safeDropdownVariants = createSafeAnimationProps(
    { variants: dropdownVariants },
    { respectReducedMotion }
  ).variants as Variants

  const safeItemVariants = createSafeAnimationProps(
    { variants: itemVariants },
    { respectReducedMotion }
  ).variants as Variants

  // Get dropdown position
  const positionStyle = getPosition()

  // Handle item selection
  const handleItemClick = useCallback((item: DropdownItem) => {
    if (item.disabled) return

    setSelectedItem(item)
    onSelect?.(item)

    if (closeOnSelect) {
      close()
    }
  }, [onSelect, closeOnSelect, close])

  // Handle trigger click
  const handleTriggerClick = useCallback(() => {
    toggle(triggerRef.current || undefined)
  }, [toggle])

  // Update position when open
  useEffect(() => {
    if (state.isOpen) {
      updatePosition()
    }
  }, [state.isOpen, updatePosition])

  // Performance monitoring
  useEffect(() => {
    if (!enablePerformanceMonitoring || !state.isOpen) return

    performanceMonitor.startMonitoring('luxury-dropdown', 'important')

    return () => {
      const metrics = performanceMonitor.stopMonitoring('luxury-dropdown')
      if (metrics && metrics.frameRate < 30) {
        console.warn('Low frame rate detected in luxury dropdown:', metrics)
      }
    }
  }, [enablePerformanceMonitoring, state.isOpen])

  // Hardware acceleration
  useEffect(() => {
    if (dropdownRef.current) {
      HardwareAccelerationHelper.applyHardwareAcceleration(dropdownRef.current)
    }

    return () => {
      if (dropdownRef.current) {
        HardwareAccelerationHelper.removeHardwareAcceleration(dropdownRef.current)
      }
    }
  }, [])

  return (
    <div className={`relative inline-block ${className || ''}`}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleTriggerClick}
        className={`
          flex items-center justify-between w-full px-4 py-3
          bg-white border border-gray-200 rounded-lg
          shadow-sm hover:shadow-md transition-shadow duration-200
          focus:outline-none focus:ring-2 focus:ring-burgundy focus:ring-offset-2
          ${triggerClassName || ''}
        `}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-expanded={state.isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-left">
          {selectedItem ? selectedItem.label : placeholder}
        </span>
        
        {showChevron && (
          <motion.div
            animate={{ rotate: state.isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-2"
          >
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </motion.div>
        )}
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {state.isOpen && showBackdrop && (
          <AnimatedOverlay
            isOpen={state.isOpen}
            onClose={close}
            variant={backdropVariant}
            opacity={backdropOpacity}
            closeOnClick={closeOnOutsideClick}
            closeOnEscape={false}
            preventInteraction={false}
            duration={duration}
            respectReducedMotion={respectReducedMotion}
          />
        )}
      </AnimatePresence>

      {/* Dropdown */}
      <AnimatePresence>
        {state.isOpen && positionStyle && (
          <motion.div
            ref={dropdownRef}
            {...motionProps}
            variants={safeDropdownVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              position: 'fixed',
              left: positionStyle.x,
              top: positionStyle.y,
              zIndex: 50,
              minWidth: triggerRef.current?.offsetWidth || 200,
              ...motionProps.style,
            }}
            className={`
              bg-white border border-gray-200 rounded-lg shadow-xl
              backdrop-blur-sm overflow-hidden
              ${dropdownClassName || ''}
            `}
            role="listbox"
            aria-labelledby={ariaLabel}
          >
            <div
              className="overflow-auto"
              style={{ maxHeight }}
            >
              <motion.div
                variants={safeItemVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="py-1"
              >
                {items.map((item, index) => (
                  <div key={item.id}>
                    {item.divider && (
                      <div className="px-4 py-2">
                        <div className="border-t border-gray-200" />
                      </div>
                    )}
                    
                    {!item.divider && (
                      <motion.button
                        type="button"
                        variants={safeItemVariants}
                        custom={index}
                        whileHover={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleItemClick(item)}
                        disabled={item.disabled}
                        className={`
                          w-full px-4 py-3 text-left flex items-center gap-3
                          transition-colors duration-200
                          ${item.disabled 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:bg-gray-50 cursor-pointer'
                          }
                          ${selectedItem?.value === item.value 
                            ? 'bg-[#0F3B2F]/5 text-[#0F3B2F]' 
                            : 'text-gray-900'
                          }
                          ${itemClassName || ''}
                        `}
                        role="option"
                        aria-selected={selectedItem?.value === item.value}
                      >
                        {item.icon && (
                          <div className="flex-shrink-0">
                            {item.icon}
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm leading-tight">
                            {item.label}
                          </div>
                          {item.description && (
                            <div className="text-xs text-gray-500 mt-1 leading-relaxed">
                              {item.description}
                            </div>
                          )}
                        </div>
                        
                        {selectedItem?.value === item.value && (
                          <div className="flex-shrink-0 w-2 h-2 bg-[#D4AF37] rounded-full" />
                        )}
                      </motion.button>
                    )}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Luxury Accent Border */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
              <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/30 to-transparent" />
              <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/30 to-transparent" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LuxuryDropdown