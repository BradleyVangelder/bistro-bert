'use client'

import { useCallback } from 'react'
import type { FaqItem } from '@/data/faqs'
import { useReservation } from '@/contexts/ReservationContext'

interface FaqListProps {
  items: FaqItem[]
}

export function FaqList({ items }: FaqListProps) {
  const { open } = useReservation()

  const handleInlineReserve = useCallback(() => {
    open()
  }, [open])

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isReservationQuestion = item.question === 'Kan ik online een tafel reserveren?'

        return (
          <details key={item.question} className="group border border-gray-100 rounded-xl p-6 bg-white shadow-sm">
            <summary className="flex justify-between items-center cursor-pointer">
              <span className="text-left text-lg font-medium text-black group-open:text-[#38644B]">
                {item.question}
              </span>
              <span className="ml-4 text-[#38644B] group-open:rotate-45 transition-transform duration-200" aria-hidden="true">
                +
              </span>
            </summary>

            <p className="typography-body text-gray-600 mt-4">
              {isReservationQuestion ? (
                <>
                  Ja, u kunt{' '}
                  <button
                    type="button"
                    onClick={handleInlineReserve}
                    className="underline decoration-[#38644B] decoration-2 underline-offset-4 text-[#38644B] hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38644B] focus-visible:ring-offset-2"
                  >
                    hier
                  </button>{' '}
                  reserveren via onze widget. Liever telefonisch contact? Bel ons op{' '}
                  <a href="tel:+3213480139" className="underline decoration-dotted">
                    +32 13 48 01 39
                  </a>
                  .
                </>
              ) : (
                item.answer
              )}
            </p>
          </details>
        )
      })}
    </div>
  )
}
