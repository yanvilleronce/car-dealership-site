import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'


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
          loading="eager"
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
            <Link to="/inventaire" className="btn-primary px-7 py-3.5 text-sm sm:text-base">
              Voir l'inventaire
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link to="/#contact" className="btn-outline px-7 py-3.5 text-sm sm:text-base">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Réserver un essai
            </Link>
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
