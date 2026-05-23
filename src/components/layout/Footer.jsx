import { Link } from 'react-router-dom'
import { DEALERSHIP_NAME, ADDRESS, PHONE_DISPLAY, EMAIL } from '../../inventory/inventoryService'

const quickLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Véhicules Neufs', href: '/neufs' },
  { label: 'Véhicules d\'Occasion', href: '/occasion' },
  { label: 'Financement', href: '/#financement' },
  { label: 'Contact', href: '/#contact' },
]

const vehicleTypes = [
  { label: 'Voitures de Sport', href: '/occasion' },
  { label: 'SUV Luxe', href: '/occasion' },
  { label: 'Berlines Prestige', href: '/occasion' },
  { label: 'Véhicules Électriques', href: '/neufs' },
  { label: 'Certifiés Occasion', href: '/occasion' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-surface-1 border-t border-border" aria-label="Pied de page">
      {/* Main footer content */}
      <div className="container-max px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Col 1 — Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex flex-col leading-none mb-5" aria-label="Accueil">
              <span className="font-serif text-xl font-bold text-white tracking-[0.06em]">AUTOMOBILE</span>
              <span className="font-serif text-xl font-bold text-gold tracking-[0.18em] -mt-0.5">RENNAIS</span>
            </Link>
            <p className="text-text-muted font-sans text-sm leading-relaxed mb-6 max-w-xs">
              Votre spécialiste en véhicules de luxe neufs et d'occasion en Bretagne. Qualité, transparence et passion depuis 2009.
            </p>

            {/* Social */}
            <div className="flex gap-3">
              <SocialLink href="#" label="Facebook" icon={
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              } />
              <SocialLink href="#" label="Instagram" icon={
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              } />
              <SocialLink href="#" label="LinkedIn" icon={
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              } />
            </div>
          </div>

          {/* Col 2 — Quick links */}
          <div>
            <h3 className="font-sans font-semibold text-text-primary text-sm tracking-wide mb-5">Navigation</h3>
            <ul className="flex flex-col gap-3">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-text-muted font-sans text-sm hover:text-gold transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Vehicle types */}
          <div>
            <h3 className="font-sans font-semibold text-text-primary text-sm tracking-wide mb-5">Nos Véhicules</h3>
            <ul className="flex flex-col gap-3">
              {vehicleTypes.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-text-muted font-sans text-sm hover:text-gold transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h3 className="font-sans font-semibold text-text-primary text-sm tracking-wide mb-5">Contact</h3>
            <ul className="flex flex-col gap-4">
              <li>
                <p className="text-text-muted font-sans text-xs mb-0.5">Adresse</p>
                <address className="not-italic text-text-secondary font-sans text-sm leading-relaxed">
                  7 Rue des Sillons<br />
                  35850 Parthenay-de-Bretagne
                </address>
              </li>
              <li>
                <p className="text-text-muted font-sans text-xs mb-0.5">Téléphone</p>
                <a href="tel:+33780940002" className="text-text-secondary font-sans text-sm hover:text-gold transition-colors">
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <p className="text-text-muted font-sans text-xs mb-0.5">Email</p>
                <a href={`mailto:${EMAIL}`} className="text-text-secondary font-sans text-sm hover:text-gold transition-colors break-all">
                  {EMAIL}
                </a>
              </li>
              <li>
                <p className="text-text-muted font-sans text-xs mb-0.5">Horaires</p>
                <p className="text-text-secondary font-sans text-sm">Lun – Sam : 9h00 – 19h00</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container-max px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-text-muted font-sans text-xs">
            © {year} {DEALERSHIP_NAME}. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/mentions-legales" className="text-text-muted font-sans text-xs hover:text-gold transition-colors">Mentions légales</Link>
            <span className="text-border">·</span>
            <Link to="/politique-confidentialite" className="text-text-muted font-sans text-xs hover:text-gold transition-colors">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ href, label, icon }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex items-center justify-center w-8 h-8 rounded-sm bg-surface-2 border border-border text-text-muted hover:text-gold hover:border-gold/40 transition-all duration-200"
    >
      {icon}
    </a>
  )
}
