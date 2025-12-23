'use client'

import { useEffect, useState } from 'react'
import { getCurrentHolidayClosing } from '@/data/closingDates'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ClosingBanner() {
  const [closingInfo, setClosingInfo] = useState<ReturnType<typeof getCurrentHolidayClosing>>(null)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    setClosingInfo(getCurrentHolidayClosing())
  }, [])

  if (!closingInfo || isDismissed) {
    return null
  }

  // Format the reopen date (e.g., "zaterdag 27 december")
  const reopenDate = new Date(closingInfo.reopenDate)
  const reopenDay = reopenDate.toLocaleDateString('nl-BE', { weekday: 'long', day: 'numeric', month: 'long' })

  // Format the closing end date (e.g., "26 december")
  const closingEndDate = new Date(closingInfo.end)
  const closingEndDay = closingEndDate.toLocaleDateString('nl-BE', { day: 'numeric', month: 'long' })

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-[80] bg-red-600 text-white"
      >
        <div className="max-w-screen-xl mx-auto px-4 py-2 flex items-center justify-center gap-4 text-sm font-medium">
          <span>
            {closingInfo.message}: gesloten van 23 tot en met {closingEndDay} — Weer open {reopenDay}
          </span>
          <button
            onClick={() => setIsDismissed(true)}
            className="flex-shrink-0 p-1 hover:bg-red-700 rounded-full transition-colors focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600"
            aria-label="Sluit melding"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
