import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { formatPrice, formatMileage, getBadgeLabel } from '../../inventory/inventoryService'
import ReservationModal from '../sections/ReservationModal'

const badgeStyles = {
  'Nouveau':  'bg-gold text-black',
  'Certifié': 'bg-white/10 text-white border border-white/20',
  'Occasion': 'bg-surface-3 text-text-secondary border border-border',
  'Vendu':    'bg-red-500/80 text-white',
  'Réservé':  'bg-yellow-500/80 text-black',
}

const fuelIcons = {
  'Essence':              '⛽',
  'Diesel':               '⛽',
  'Électrique':           '⚡',
  'Hybride':              '🔋',
  'Hybride rechargeable': '🔋',
}

export default function VehicleCard({ vehicle, index = 0 }) {
  const [showReservation, setShowReservation] = useState(false)
  const {
    year, make, model, trim, price, priceOnRequest, mileage, fuel, transmission,
    power, images, shortDesc, certified, status,
  } = vehicle

  const badge = getBadgeLabel(vehicle)
  const image = images?.[0]
  const isSold = status === 'sold'

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="card-base group flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[16/10] bg-surface-2">
        <img
          src={image}
          alt={`${year} ${make} ${model}`}
          loading="lazy"
          width={800}
          height={500}
          className={`w-full h-full object-cover transition-transform duration-700 ease-expo group-hover:scale-105 ${isSold ? 'grayscale opacity-60' : ''}`}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80'
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* SOLD diagonal banner */}
        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-red-500/90 text-white font-sans font-bold text-sm tracking-[0.15em] px-8 py-2 rotate-[-20deg] shadow-lg">
              VENDU
            </span>
          </div>
        )}

        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-sans font-semibold tracking-wide ${badgeStyles[badge] || badgeStyles['Occasion']}`}>
            {badge}
          </span>
        </div>

        {/* Price on image — mobile only */}
        <div className="absolute bottom-3 right-3 sm:hidden">
          <span className="bg-black/80 backdrop-blur-sm text-gold font-sans font-bold text-sm px-3 py-1 rounded-sm">
            {formatPrice(price, priceOnRequest)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 gap-3">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-text-muted text-xs font-sans font-medium tracking-wide mb-0.5">{year}</p>
            <h3 className="font-serif text-white text-lg leading-tight">
              {make} {model}
            </h3>
            {trim && (
              <p className="text-text-muted text-xs font-sans mt-0.5 truncate">{trim}</p>
            )}
          </div>
          {/* Price — hidden on mobile (shown on image) */}
          <div className="hidden sm:block text-right shrink-0">
            <p className="text-gold font-sans font-bold text-lg">{formatPrice(price, priceOnRequest)}</p>
            {mileage === 0 && !priceOnRequest && (
              <p className="text-text-muted text-xs font-sans">Prix TTC</p>
            )}
          </div>
        </div>

        {/* Short description */}
        <p className="text-text-muted text-sm font-sans leading-relaxed line-clamp-2">
          {shortDesc}
        </p>

        {/* Specs chips */}
        <div className="flex flex-wrap gap-1.5">
          <Chip icon={fuelIcons[fuel] || '⛽'} label={fuel} />
          <Chip icon="⚙️" label={transmission} />
          {power && <Chip icon="💪" label={power} />}
          {mileage > 0 && <Chip icon="📍" label={formatMileage(mileage)} />}
        </div>

        {/* Certified badge */}
        {certified && (
          <div className="flex items-center gap-1.5 text-xs text-text-secondary font-sans">
            <svg className="w-3.5 h-3.5 text-gold shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Véhicule certifié · Historique complet
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-1">
          <button
            onClick={() => setShowReservation(true)}
            className="btn-primary flex-1 text-xs sm:text-sm py-2.5"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            Réserver
          </button>
          <Link
            to={`/vehicule/${vehicle.id}`}
            className="btn-ghost flex-1 text-xs sm:text-sm py-2.5"
          >
            Voir détails
          </Link>
        </div>
      </div>

      <ReservationModal vehicle={vehicle} open={showReservation} onClose={() => setShowReservation(false)} />
    </motion.article>
  )
}

function Chip({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1 bg-surface-2 border border-border rounded-sm px-2 py-0.5 text-xs font-sans text-text-secondary">
      <span className="text-[10px]">{icon}</span>
      {label}
    </span>
  )
}
