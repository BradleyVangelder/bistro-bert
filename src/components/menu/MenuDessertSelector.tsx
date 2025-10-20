'use client'

import { motion } from 'framer-motion'

interface MenuDessertSelectorProps {
  selectedType: 'menu' | 'dessert'
  onTypeChange: (type: 'menu' | 'dessert') => void
}

export default function MenuDessertSelector({ selectedType, onTypeChange }: MenuDessertSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex justify-center mb-8 md:mb-12"
    >
      <div className="inline-flex rounded-sm border border-black overflow-hidden">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onTypeChange('menu')}
          className={`px-6 py-2.5 text-sm font-medium transition-all duration-200 ${
            selectedType === 'menu'
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-gray-50'
          }`}
        >
          Menukaart
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onTypeChange('dessert')}
          className={`px-6 py-2.5 text-sm font-medium transition-all duration-200 border-l border-black ${
            selectedType === 'dessert'
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-gray-50'
          }`}
        >
          Desserts
        </motion.button>
      </div>
    </motion.div>
  )
}