import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { PHONE_NUMBER } from '../../inventory/inventoryService'

// ─── Mobile Sticky CTA Bar ─────────────────────────────────────────────────────
export function MobileCTA() {
  const [visible, setVisible] = useState(true)

  // Hide after user scrolls back to very top (hero has its own CTAs)
  useEffect(() => {
    const dismissed = sessionStorage.getItem('mobileCTAdismissed')
    if (dismissed) setVisible(false)
  }, [])

  const dismiss = () => {
    setVisible(false)
    sessionStorage.setItem('mobileCTAdismissed', '1')
  }

  if (!visible) return null

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ delay: 2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      <div className="bg-surface-1/95 backdrop-blur-md border-t border-border flex items-stretch">
        {/* Call button */}
        <a
          href={`tel:${PHONE_NUMBER}`}
          className="flex flex-1 items-center justify-center gap-2 py-3.5 text-text-primary font-sans font-semibold text-sm transition-colors active:bg-surface-2"
        >
          <svg className="w-4 h-4 text-gold shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Appeler
        </a>

        {/* Divider */}
        <div className="w-px bg-border self-stretch" />

        {/* Nous contacter link */}
        <a
          href="mailto:contact@automobile-rennais.fr"
          className="flex flex-1 items-center justify-center gap-2 py-3.5 text-gold font-sans font-semibold text-sm transition-colors active:bg-surface-2"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          Nous contacter
        </a>

        {/* Dismiss */}
        <button
          onClick={dismiss}
          aria-label="Fermer"
          className="flex items-center justify-center px-3 text-text-muted hover:text-text-secondary transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </motion.div>
  )
}
