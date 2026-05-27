import { useState, useEffect, lazy, Suspense } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import {
  getVehicleById,
  formatPrice,
  formatMileage,
  getBadgeLabel,
} from '../inventory/inventoryService'
import { track } from '../utils/track'

const ReservationModal = lazy(() => import('../components/sections/ReservationModal'))

const badgeStyles = {
  'Nouveau':  'bg-gold text-black',
  'Certifié': 'bg-white/10 text-white border border-white/20',
  'Occasion': 'bg-surface-3 text-text-secondary border border-border',
  'Vendu':    'bg-red-500/80 text-white',
  'Réservé':  'bg-yellow-500/80 text-black',
}

export default function VehicleDetail() {
  const { id } = useParams()
  const location = useLocation()
  const vehicle = getVehicleById(id)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showReservation, setShowReservation] = useState(false)

  useEffect(() => {
    const imgs = vehicle?.images
    if (!imgs || imgs.length <= 1) return
    const preload = (src) => { const img = new Image(); img.src = src }
    preload(imgs[(selectedImage + 1) % imgs.length])
    preload(imgs[(selectedImage - 1 + imgs.length) % imgs.length])
  }, [selectedImage, vehicle])

  useEffect(() => {
    if (!vehicle) return
    track('page_view', {
      vehicleId: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      pathname: location.pathname,
    })
  }, [vehicle, location.pathname])

  if (!vehicle) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gold font-sans text-xs font-semibold tracking-[0.2em] uppercase mb-4">Non trouvé</p>
          <h1 className="font-serif text-display-md text-white mb-4">Véhicule introuvable</h1>
          <p className="text-text-muted font-sans text-sm mb-6">Ce véhicule n'existe pas ou a été retiré.</p>
          <Link to="/" className="btn-primary text-sm py-2.5 px-5">
            Retour à l'accueil
          </Link>
        </div>
      </main>
    )
  }

  const { year, make, model, trim, price, priceOnRequest, mileage, fuel, transmission,
          power, doors, color, colorHex, images, shortDesc, fullDesc, options, status, certified } = vehicle
  const badge = getBadgeLabel(vehicle)
  const isSold = status === 'sold'
  const allImages = images?.length > 0 ? images : ['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80']

  const specs = [
    { label: 'Année', value: year },
    { label: 'Carburant', value: fuel },
    { label: 'Transmission', value: transmission },
    { label: 'Puissance', value: power },
    { label: 'Kilométrage', value: formatMileage(mileage) },
    { label: 'Portes', value: doors },
    { label: 'Couleur', value: color },
  ]

  return (
    <main className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid lg:grid-cols-5 gap-6 sm:gap-10">
          {/* ── Gallery ─────────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            <div className="relative overflow-hidden rounded-sm bg-surface-2 aspect-[16/10]">
              {isSold && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="bg-red-500/90 text-white font-sans font-bold text-sm sm:text-base tracking-[0.15em] px-8 sm:px-12 py-2 sm:py-3 rotate-[-20deg] shadow-lg">
                    VENDU
                  </span>
                </div>
              )}
              <img
                src={allImages[selectedImage]}
                alt={`${make} ${model} ${year}`}
                className="w-full h-full object-cover transition-opacity duration-300"
                decoding="async"
                fetchpriority="high"
                width={1200}
                height={750}
              />
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-20 h-14 rounded-sm overflow-hidden border-2 transition-colors ${
                      i === selectedImage ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" width={160} height={112} loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Details ──────────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            {/* Title */}
            <div className="mb-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-sans font-semibold tracking-wide ${badgeStyles[badge] || badgeStyles['Occasion']}`}>
                      {badge}
                    </span>
                    {certified && (
                      <span className="text-gold text-xs font-sans font-medium">
                        Certifié
                      </span>
                    )}
                  </div>
                  <p className="text-text-muted text-xs font-sans font-medium tracking-wide mb-0.5">{year}</p>
                  <h1 className="font-serif text-2xl sm:text-3xl text-white leading-tight">
                    {make} {model}
                  </h1>
                  {trim && (
                    <p className="text-text-muted text-sm font-sans mt-0.5">{trim}</p>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="mt-4 p-4 bg-surface-1 border border-border rounded-sm">
                <p className="text-gold font-sans font-bold text-2xl sm:text-3xl">
                  {formatPrice(price, priceOnRequest)}
                </p>
                {mileage === 0 && !priceOnRequest && (
                  <p className="text-text-muted text-xs font-sans mt-0.5">Prix TTC — Véhicule neuf</p>
                )}
                {mileage > 0 && !priceOnRequest && (
                  <p className="text-text-muted text-xs font-sans mt-0.5">Prix TTC — {formatMileage(mileage)}</p>
                )}
              </div>
            </div>

            {/* Description */}
            {shortDesc && (
              <p className="text-text-secondary font-sans text-sm leading-relaxed mb-5">
                {shortDesc}
              </p>
            )}

            {fullDesc && (
              <p className="text-text-muted font-sans text-sm leading-relaxed mb-5">
                {fullDesc}
              </p>
            )}

            {/* Specs */}
            <div className="bg-surface-1 border border-border rounded-sm p-4 sm:p-5 mb-5">
              <h2 className="font-serif text-white text-base mb-3">Caractéristiques</h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                {specs.map(({ label, value }) => (
                  value != null && value !== '' && (
                    <div key={label} className="flex justify-between items-center py-1 border-b border-border/50 last:border-0">
                      <span className="text-text-muted font-sans text-xs">{label}</span>
                      <span className="text-text-primary font-sans text-sm font-medium text-right">{value}</span>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Options */}
            {options?.length > 0 && (
              <div className="bg-surface-1 border border-border rounded-sm p-4 sm:p-5 mb-5">
                <h2 className="font-serif text-white text-base mb-3">Équipements</h2>
                <ul className="flex flex-col gap-2">
                  {options.map((opt) => (
                    <li key={opt} className="flex items-center gap-2 text-sm font-sans text-text-secondary">
                      <svg className="w-3.5 h-3.5 text-gold shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {opt}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Color swatch */}
            {color && (
              <div className="flex items-center gap-2 mb-6">
                <span className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: colorHex || '#888' }} />
                <span className="text-text-muted font-sans text-xs">{color}</span>
              </div>
            )}

            {/* ── CTAs ──────────────────────────────────────────── */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { track('click_reserve', { vehicleId: vehicle.id, make: vehicle.make, model: vehicle.model }); setShowReservation(true) }}
                className="btn-primary w-full justify-center py-3 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Réserver ce véhicule
              </button>

              <Link
                to="/#financement"
                onClick={() => track('click_financing', { vehicleId: vehicle.id, make: vehicle.make, model: vehicle.model })}
                className="btn-outline w-full justify-center py-3 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
                Demander un financement
              </Link>

              <Link
                to="/#contact"
                onClick={() => track('click_contact')}
                className="btn-outline w-full justify-center py-3 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={null}><ReservationModal vehicle={vehicle} open={showReservation} onClose={() => setShowReservation(false)} /></Suspense>
    </main>
  )
}
