'use client'

import { useEffect, useRef } from 'react'
import LuxuryModal from '@/components/ui/LuxuryModal'

interface ReservationModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function ReservationModal({ isOpen, onClose }: ReservationModalProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isOpen) document.body.dataset.reservationModalOpen = 'true'
        else delete document.body.dataset.reservationModalOpen

        if (isOpen && containerRef.current) {
            // Clear previous content
            containerRef.current.innerHTML = ''

            const globalWidgetContainer = document.querySelector(
                'body > [id^="easybooker-widget-container"]'
            ) as HTMLElement | null
            const previousWidgetZIndex = globalWidgetContainer?.style.zIndex
            const previousWidgetPointerEvents = globalWidgetContainer?.style.pointerEvents
            if (globalWidgetContainer) {
                globalWidgetContainer.style.zIndex = '0'
                globalWidgetContainer.style.pointerEvents = 'none'
            }

            // Create the widget container div
            const widgetDiv = document.createElement('div')
            widgetDiv.id = 'easybooker-inlineform'
            widgetDiv.style.width = '100%'
            widgetDiv.style.maxWidth = '400px'
            widgetDiv.style.margin = '0 auto'
            widgetDiv.style.position = 'relative'
            widgetDiv.style.zIndex = '1'
            widgetDiv.style.boxSizing = 'border-box'
            widgetDiv.style.overflow = 'hidden'
            containerRef.current.appendChild(widgetDiv)

            // Create a style tag to override any conflicting styles from the widget
            const style = document.createElement('style')
            style.textContent = `
                #easybooker-inlineform {
                    position: relative !important;
                    margin: 0 auto !important;
                    max-width: 400px !important;
                    width: 100% !important;
                    transform: none !important;
                    top: auto !important;
                    left: auto !important;
                    right: auto !important;
                    bottom: auto !important;
                    display: block !important;
                    float: none !important;
                    clear: both !important;
                }
                #easybooker-inlineform * {
                    box-sizing: border-box !important;
                }
                #easybooker-inlineform form,
                #easybooker-inlineform div,
                #easybooker-inlineform iframe {
                    max-width: 100% !important;
                    margin: 0 auto !important;
                    position: relative !important;
                }
            `
            document.head.appendChild(style)

            // Create the script element
            const script = document.createElement('script')
            script.src = 'https://formv2.easybooker.be/widget.js'
            script.dataset.businessId = '694'
            script.dataset.widgetType = 'inline'
            script.dataset.baseUrl = 'https://formv2.easybooker.be'
            script.dataset.element = 'easybooker-inlineform'

            // Append script to container to execute it
            containerRef.current.appendChild(script)

            // Cleanup function
            return () => {
                if (globalWidgetContainer) {
                    globalWidgetContainer.style.zIndex = previousWidgetZIndex || ''
                    globalWidgetContainer.style.pointerEvents = previousWidgetPointerEvents || ''
                }

                if (document.head.contains(style)) {
                    document.head.removeChild(style)
                }
            }
        }

        return () => {
            delete document.body.dataset.reservationModalOpen
        }
    }, [isOpen])

    return (
        <LuxuryModal
            isOpen={isOpen}
            onClose={onClose}
            size="medium"
            backdropVariant="fade"
            backdropOpacity={0.75}
            backdropColor="rgba(0, 0, 0, 0.75)"
            title="Reserveer een tafel"
            showCloseButton={true}
            modalClassName="border border-gray-200/80 shadow-2xl"
        >
            <div
                ref={containerRef}
                className="w-full flex justify-center items-center relative"
                style={{
                    minHeight: '450px',
                    padding: '20px 0'
                }}
            >
                {/* Widget will be injected here */}
            </div>
        </LuxuryModal>
    )
}
