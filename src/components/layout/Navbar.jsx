import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Véhicules Neufs', href: '/vehicules/neufs' },
  { label: 'Occasion', href: '/vehicules/occasion' },
  { label: 'Financement', href: '#financement' },
  { label: 'Contact', href: '#contact' },
]

const drawerVariants = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit:   { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close drawer on route change
  useEffect(() => setMenuOpen(false), [location])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleAnchorClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      if (location.pathname === '/') {
        const el = document.querySelector(href)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      } else {
        navigate('/#' + href.slice(1))
      }
      setMenuOpen(false)
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled || menuOpen
            ? 'bg-black/90 backdrop-blur-xl border-b border-border shadow-card'
            : 'bg-transparent'
        }`}
      >
        <div className="container-max flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex flex-col leading-none shrink-0" aria-label="AUTOMOBILE RENNAIS — Accueil">
            <span className="font-serif text-base sm:text-lg font-bold text-white tracking-[0.06em]">
              AUTOMOBILE
            </span>
            <span className="font-serif text-base sm:text-lg font-bold text-gold tracking-[0.18em] -mt-0.5">
              RENNAIS
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navigation principale">
            {navLinks.map(({ label, href }) => (
              href.startsWith('#') ? (
                <a
                  key={label}
                  href={href}
                  onClick={(e) => handleAnchorClick(e, href)}
                  className="px-4 py-2 text-sm font-sans font-medium text-text-secondary hover:text-white transition-colors duration-200"
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={label}
                  to={href}
                  className={`px-4 py-2 text-sm font-sans font-medium transition-colors duration-200 ${
                    location.pathname === href ? 'text-gold' : 'text-text-secondary hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              )
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="#contact"
              onClick={(e) => handleAnchorClick(e, '#contact')}
              className="btn-outline text-xs py-2 px-4"
            >
              Prendre rendez-vous
            </a>
            <Link to="/inventaire" className="btn-primary text-xs py-2 px-4">
              Voir l'inventaire
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-sm hover:bg-surface-2 transition-colors"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              className="w-5 h-px bg-white origin-center block"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.25 }}
              className="w-5 h-px bg-white block"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              className="w-5 h-px bg-white origin-center block"
            />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 top-16 sm:top-20 z-30 bg-black/95 backdrop-blur-xl lg:hidden flex flex-col"
          >
            <nav className="flex flex-col p-6 gap-1 flex-1" aria-label="Menu mobile">
              {navLinks.map(({ label, href }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  {href.startsWith('#') ? (
                    <a
                      href={href}
                      onClick={(e) => handleAnchorClick(e, href)}
                      className="block py-3.5 px-4 text-lg font-sans font-medium text-text-secondary hover:text-white border-b border-border/50 transition-colors"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      to={href}
                      className={`block py-3.5 px-4 text-lg font-sans font-medium border-b border-border/50 transition-colors ${
                        location.pathname === href ? 'text-gold' : 'text-text-secondary hover:text-white'
                      }`}
                    >
                      {label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </nav>

            {/* Mobile drawer CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.3 }}
              className="p-6 pb-8 flex flex-col gap-3 border-t border-border"
            >
              <Link to="/inventaire" className="btn-primary w-full justify-center py-3.5 text-base">
                Voir l'inventaire
              </Link>
              <a
                href="#contact"
                onClick={(e) => handleAnchorClick(e, '#contact')}
                className="btn-outline w-full justify-center py-3.5 text-base"
              >
                Prendre rendez-vous
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
