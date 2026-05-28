'use client'

import { motion } from 'framer-motion'

interface MenuDessertSelectorProps {
  selectedType: 'menu' | 'dessert' | 'wine' | 'valentine'
  onTypeChange: (type: 'menu' | 'dessert' | 'wine' | 'valentine') => void
}

// Set to end of February 15th (23:59:59) in local time
const VALENTINE_END_DATE = new Date(2026, 1, 15, 23, 59, 59)

export default function MenuDessertSelector({ selectedType, onTypeChange }: MenuDessertSelectorProps) {
  const now = new Date()
  const isValentineActive = now <= VALENTINE_END_DATE

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
          onClick={() => onTypeChange('dessert')}
          aria-pressed={selectedType === 'dessert'}
          className={`monochrome-pdf-button menu-toggle-button${selectedType === 'dessert' ? ' menu-toggle-button--active' : ''
            }`}
        >
          Desserts
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => onTypeChange('wine')}
          aria-pressed={selectedType === 'wine'}
          className={`monochrome-pdf-button menu-toggle-button${selectedType === 'wine' ? ' menu-toggle-button--active' : ''
            }`}
        >
          Wijn
        </motion.button>
        {isValentineActive && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => onTypeChange('valentine')}
            aria-pressed={selectedType === 'valentine'}
            className={`monochrome-pdf-button menu-toggle-button${selectedType === 'valentine' ? ' menu-toggle-button--active' : ''
              }`}
          >
            Valentijn
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
