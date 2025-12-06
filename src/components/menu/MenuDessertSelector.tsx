'use client'

import { motion } from 'framer-motion'

interface MenuDessertSelectorProps {
  selectedType: 'menu' | 'dessert' | 'suggestions'
  onTypeChange: (type: 'menu' | 'dessert' | 'suggestions') => void
}

export default function MenuDessertSelector({ selectedType, onTypeChange }: MenuDessertSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex justify-center mb-8 md:mb-12"
    >
      <div className="flex flex-wrap justify-center gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => onTypeChange('menu')}
          aria-pressed={selectedType === 'menu'}
          className={`monochrome-pdf-button menu-toggle-button${selectedType === 'menu' ? ' menu-toggle-button--active' : ''
            }`}
        >
          Lunch & diner
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => onTypeChange('suggestions')}
          aria-pressed={selectedType === 'suggestions'}
          className={`monochrome-pdf-button menu-toggle-button${selectedType === 'suggestions' ? ' menu-toggle-button--active' : ''
            }`}
        >
          Suggesties
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => onTypeChange('dessert')}
          aria-pressed={selectedType === 'dessert'}
          className={`monochrome-pdf-button menu-toggle-button${selectedType === 'dessert' ? ' menu-toggle-button--active' : ''
            }`}
        >
          Desserts
        </motion.button>
      </div>
    </motion.div>
  )
}
