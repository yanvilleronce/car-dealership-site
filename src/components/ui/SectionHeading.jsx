import { motion } from 'framer-motion'

/**
 * SectionHeading — reusable section title with optional subtitle and gold underline
 *
 * Props:
 *   label     — small uppercase eyebrow text (optional)
 *   title     — main heading (required)
 *   subtitle  — paragraph below heading (optional)
 *   center    — boolean, centers text (default false)
 *   light     — boolean, uses lighter heading variant (default false)
 */
export default function SectionHeading({ label, title, subtitle, center = false, light = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={center ? 'text-center' : ''}
    >
      {label && (
        <p className="text-gold text-xs font-sans font-semibold tracking-[0.2em] uppercase mb-3">
          {label}
        </p>
      )}
      <h2
        className={`font-serif text-display-sm sm:text-display-md leading-tight mb-4 gold-underline${center ? ' gold-underline-center' : ''} ${
          light ? 'text-text-primary' : 'text-white'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`text-text-muted font-sans text-base leading-relaxed mt-6 max-w-2xl${center ? ' mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
