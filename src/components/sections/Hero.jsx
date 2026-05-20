import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { buildWhatsAppUrl } from '../../inventory/inventoryService'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1920&q=85'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
}

const itemVariants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

export default function Hero() {
  const waUrl = buildWhatsAppUrl('Bonjour, je souhaite réserver un essai sur l\'un de vos véhicules.')

  return (
    <section
      aria-label="Bannière principale"
      className="relative w-full min-h-[100dvh] flex items-center overflow-hidden bg-black"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Porsche 911 — AUTOMOBILE RENNAIS"
          width={1920}
          height={1080}
          className="w-full h-full object-cover object-center"
          fetchpriority="high"
        />
        {/* Layered gradients for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      </div>

      {/* Gold accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: 'left' }}
        className="absolute left-0 top-0 w-1 h-full bg-gold-gradient z-10"
      />

      {/* Content */}
      <div className="relative z-10 container-max px-6 sm:px-8 lg:px-12 pt-28 sm:pt-32 pb-24 sm:pb-28 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          {/* Eyebrow */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-gold" />
            <span className="text-gold text-xs font-sans font-semibold tracking-[0.22em] uppercase">
              Concessionnaire Premium · Bretagne
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-serif text-4xl sm:text-5xl lg:text-display-xl text-white leading-[1.07] mb-6"
          >
            Les Plus Beaux{' '}
            <em className="not-italic text-gold">Automobiles</em>
            <br />
            À Votre Portée
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={itemVariants}
            className="text-text-secondary font-sans text-base sm:text-lg leading-relaxed mb-8 max-w-lg"
          >
            Véhicules neufs et d'occasion de prestige — Porsche, Ferrari,
            Lamborghini, Mercedes-AMG et plus. Financement flexible,
            livraison partout en France.
          </motion.p>

          {/* Stats row */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-x-8 gap-y-3 mb-10"
          >
            {[
              { value: '500+', label: 'Ventes réalisées' },
              { value: '4.9/5', label: 'Note client' },
              { value: '15 ans', label: "D'expérience" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col">
                <span className="text-gold font-serif font-bold text-2xl leading-none">{value}</span>
                <span className="text-text-muted text-xs font-sans mt-1">{label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-3"
          >
            <Link to="/neufs" className="btn-primary px-7 py-3.5 text-sm sm:text-base">
              Voir l'inventaire
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline px-7 py-3.5 text-sm sm:text-base"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Réserver un essai
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2"
      >
        <span className="text-text-muted text-[10px] font-sans tracking-[0.2em] uppercase">Découvrir</span>
        <div className="w-5 h-8 border border-text-muted/40 rounded-full flex justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-1.5 bg-gold rounded-full"
          />
        </div>
      </motion.div>
    </section>
  )
}
