import { motion } from 'framer-motion'
import { formatPrice, formatMileage, buildWhatsAppUrl, buildVehicleWhatsAppMessage, getBadgeLabel } from '../../inventory/inventoryService'

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
  const {
    year, make, model, trim, price, priceOnRequest, mileage, fuel, transmission,
    power, images, shortDesc, certified, status,
  } = vehicle

  const badge = getBadgeLabel(vehicle)
  const image = images?.[0]
  const isSold = status === 'sold'
  const whatsappUrl = buildWhatsAppUrl(buildVehicleWhatsAppMessage(vehicle))

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
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex-1 text-xs sm:text-sm py-2.5"
          >
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
          <button className="btn-ghost flex-1 text-xs sm:text-sm py-2.5">
            Voir détails
          </button>
        </div>
      </div>
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
