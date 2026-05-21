import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatPrice } from '../../inventory/inventoryService'
import {
  getAllReservations,
  updateReservationStatus,
  getReservationStats,
  RESERVATION_STATUS_LABELS,
} from '../../inventory/reservationService'

const STATUS_COLORS = {
  new: { dot: 'bg-gold', bg: 'bg-gold/10 border-gold/20', label: 'text-gold' },
  contacted: { dot: 'bg-blue-400', bg: 'bg-blue-400/10 border-blue-400/20', label: 'text-blue-400' },
  completed: { dot: 'bg-green-400', bg: 'bg-green-400/10 border-green-400/20', label: 'text-green-400' },
  cancelled: { dot: 'bg-red-400', bg: 'bg-red-400/10 border-red-400/20', label: 'text-red-400' },
}

const RESERVATION_EVENT = 'reservationUpdated'

export default function ReservationList({ onBack }) {
  const [reservations, setReservations] = useState(() => getAllReservations())
  const [expanded, setExpanded] = useState(null)
  const [filter, setFilter] = useState('all')

  const refresh = useCallback(() => setReservations(getAllReservations()), [])

  useEffect(() => {
    window.addEventListener(RESERVATION_EVENT, refresh)
    return () => window.removeEventListener(RESERVATION_EVENT, refresh)
  }, [refresh])

  const stats = getReservationStats()

  const filtered = filter === 'all'
    ? reservations
    : reservations.filter(r => r.status === filter)

  const handleStatusChange = (id, status) => {
    updateReservationStatus(id, status)
    refresh()
  }

  const formatDate = (iso) => {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div>
      {/* Back */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-text-muted hover:text-gold transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="font-serif text-xl text-white">Réservations clients</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatsCard value={stats.new} label="Nouvelles" color="gold" />
        <StatsCard value={stats.contacted} label="Contactées" color="blue" />
        <StatsCard value={stats.completed} label="Terminées" color="green" />
        <StatsCard value={stats.cancelled} label="Annulées" color="red" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 overflow-x-auto scrollbar-hide">
        {[
          { value: 'all', label: `Toutes (${stats.total})` },
          { value: 'new', label: `Nouvelles (${stats.new})` },
          { value: 'contacted', label: `Contactées (${stats.contacted})` },
          { value: 'completed', label: `Terminées (${stats.completed})` },
          { value: 'cancelled', label: `Annulées (${stats.cancelled})` },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-3 py-1.5 rounded-sm text-xs font-sans font-medium transition-colors whitespace-nowrap ${
              filter === value
                ? 'bg-gold text-black'
                : 'bg-surface-2 text-text-muted hover:text-text-secondary border border-border'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-muted font-sans text-sm">Aucune réservation trouvée.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((res) => {
            const colors = STATUS_COLORS[res.status] || STATUS_COLORS.new
            const isExpanded = expanded === res.id

            return (
              <div
                key={res.id}
                className="bg-surface-1 border border-border rounded-sm overflow-hidden"
              >
                {/* Summary row */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : res.id)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-surface-2 transition-colors"
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${colors.dot}`} />
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-sm text-white font-medium truncate">
                      {res.customer.name}
                    </p>
                    <p className="font-sans text-xs text-text-muted mt-0.5 truncate">
                      {res.vehicle.make} {res.vehicle.model} {res.vehicle.year}
                    </p>
                  </div>
                  <div className="text-right shrink-0 hidden sm:block">
                    <p className="font-sans text-xs text-text-muted">{formatDate(res.createdAt)}</p>
                  </div>
                  <span className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded-sm border ${colors.bg} ${colors.label}`}>
                    {RESERVATION_STATUS_LABELS[res.status]}
                  </span>
                  <svg className={`w-4 h-4 text-text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expanded details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border px-4 py-4 flex flex-col gap-4">
                        {/* Vehicle info */}
                        <div>
                          <p className="text-xs font-sans text-text-muted mb-1">Véhicule</p>
                          <p className="text-sm font-sans text-white">{res.vehicle.make} {res.vehicle.model} {res.vehicle.year}</p>
                          {res.vehicle.trim && <p className="text-xs font-sans text-text-muted">{res.vehicle.trim}</p>}
                          <p className="text-xs font-sans text-gold mt-0.5">{formatPrice(res.vehicle.price, res.vehicle.priceOnRequest)}</p>
                        </div>

                        {/* Contact */}
                        <div className="grid sm:grid-cols-3 gap-3">
                          <div>
                            <p className="text-xs font-sans text-text-muted mb-1">Nom</p>
                            <p className="text-sm font-sans text-white">{res.customer.name}</p>
                          </div>
                          <div>
                            <p className="text-xs font-sans text-text-muted mb-1">Téléphone</p>
                            <a href={`tel:${res.customer.phone}`} className="text-sm font-sans text-gold hover:underline">{res.customer.phone}</a>
                          </div>
                          <div>
                            <p className="text-xs font-sans text-text-muted mb-1">Email</p>
                            <a href={`mailto:${res.customer.email}`} className="text-sm font-sans text-gold hover:underline break-all">{res.customer.email}</a>
                          </div>
                        </div>

                        {/* Appointment & financing */}
                        {res.appointmentDate && (
                          <div>
                            <p className="text-xs font-sans text-text-muted mb-1">Rendez-vous souhaité</p>
                            <p className="text-sm font-sans text-white">{new Date(res.appointmentDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                          </div>
                        )}

                        <div>
                          <p className="text-xs font-sans text-text-muted mb-1">Financement nécessaire</p>
                          <p className="text-sm font-sans text-white">{res.financingNeeded || 'Non spécifié'}</p>
                        </div>

                        {res.note && (
                          <div>
                            <p className="text-xs font-sans text-text-muted mb-1">Note client</p>
                            <p className="text-sm font-sans text-text-secondary bg-surface-2 rounded-sm p-3 leading-relaxed">{res.note}</p>
                          </div>
                        )}

                        <div>
                          <p className="text-xs font-sans text-text-muted mb-1">Soumis le</p>
                          <p className="text-sm font-sans text-text-secondary">{formatDate(res.createdAt)}</p>
                        </div>

                        {/* Status actions */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                          {res.status !== 'contacted' && (
                            <button
                              onClick={() => handleStatusChange(res.id, 'contacted')}
                              className="inline-flex items-center gap-1.5 text-xs font-sans text-blue-400 hover:text-blue-300 border border-blue-400/30 hover:border-blue-400/50 rounded-sm px-3 py-1.5 transition-colors"
                            >
                              Marquer contacté
                            </button>
                          )}
                          {res.status !== 'completed' && (
                            <button
                              onClick={() => handleStatusChange(res.id, 'completed')}
                              className="inline-flex items-center gap-1.5 text-xs font-sans text-green-400 hover:text-green-300 border border-green-400/30 hover:border-green-400/50 rounded-sm px-3 py-1.5 transition-colors"
                            >
                              Marquer terminée
                            </button>
                          )}
                          {res.status !== 'cancelled' && (
                            <button
                              onClick={() => handleStatusChange(res.id, 'cancelled')}
                              className="inline-flex items-center gap-1.5 text-xs font-sans text-red-400/60 hover:text-red-400 border border-red-500/20 hover:border-red-500/40 rounded-sm px-3 py-1.5 transition-colors"
                            >
                              Annuler
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function StatsCard({ value, label, color }) {
  const colors = { gold: 'text-gold', blue: 'text-blue-400', green: 'text-green-400', red: 'text-red-400', muted: 'text-text-muted' }
  return (
    <div className="bg-surface-1 border border-border rounded-sm p-4">
      <p className={`font-serif text-2xl font-bold ${colors[color] || colors.muted}`}>{value}</p>
      <p className="text-text-primary font-sans text-sm font-semibold mt-0.5">{label}</p>
    </div>
  )
}
