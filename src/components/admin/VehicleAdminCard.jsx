/**
 * VehicleAdminCard.jsx
 * Compact admin card showing key vehicle info with one-click actions:
 *   - Mark as sold / restore
 *   - Toggle hidden/visible
 *   - Edit
 *   - Delete (with confirmation)
 */
import { useState } from 'react'
import { formatPrice, formatMileage, STATUS_LABELS, STATUS_COLORS } from '../../inventory/inventoryService'

const statusBg = {
  available: 'border-green-500/30 bg-green-500/5',
  sold:      'border-red-500/30 bg-red-500/5',
  reserved:  'border-yellow-500/30 bg-yellow-500/5',
  hidden:    'border-border bg-surface-2/50',
}

export default function VehicleAdminCard({ vehicle, onEdit, onDelete, onMarkSold, onMarkAvailable, onToggleVisibility }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const {
    id, make, model, year, trim, price, priceOnRequest,
    mileage, fuel, status, type, featured, certified, images,
  } = vehicle

  const image = images?.[0]
  const isSold = status === 'sold'
  const isHidden = status === 'hidden'

  return (
    <article className={`rounded-sm border overflow-hidden flex flex-col sm:flex-row gap-0 transition-all ${statusBg[status] ?? 'border-border'}`}>
      {/* Thumbnail */}
      <div className="relative sm:w-36 shrink-0 bg-surface-2 aspect-[16/9] sm:aspect-auto overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={`${year} ${make} ${model}`}
            className={`w-full h-full object-cover ${isSold || isHidden ? 'opacity-40 grayscale' : ''}`}
            loading="lazy"
            decoding="async"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted">
            <svg className="w-8 h-8 opacity-30" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* Type badge */}
        <span className={`absolute top-1.5 left-1.5 text-[10px] font-sans font-bold px-1.5 py-0.5 rounded-sm ${type === 'new' ? 'bg-gold text-black' : 'bg-surface-1 text-text-secondary border border-border'}`}>
          {type === 'new' ? 'NEUF' : 'OCCASION'}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 p-3 sm:p-4 flex flex-col justify-between gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-sans font-semibold text-text-primary text-sm">
                {year} {make} {model}
              </h3>
              {trim && <span className="text-text-muted text-xs font-sans truncate">{trim}</span>}
            </div>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="font-sans font-bold text-gold text-sm">
                {formatPrice(price, priceOnRequest)}
              </span>
              <span className="text-text-muted text-xs font-sans">{formatMileage(mileage)}</span>
              <span className="text-text-muted text-xs font-sans">{fuel}</span>
            </div>
          </div>

          {/* Status badge */}
          <span className={`text-xs font-sans font-semibold shrink-0 ${STATUS_COLORS[status] ?? 'text-text-muted'}`}>
            {STATUS_LABELS[status]}
          </span>
        </div>

        {/* Flags row */}
        <div className="flex flex-wrap gap-2">
          {featured && <Flag label="En avant" color="gold" />}
          {certified && <Flag label="Certifié" color="white" />}
          {images?.length > 0 && <Flag label={`${images.length} photo${images.length > 1 ? 's' : ''}`} color="muted" />}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-border/50">
          {/* Edit */}
          <ActionBtn onClick={() => onEdit(vehicle)} title="Modifier">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Modifier
          </ActionBtn>

          {/* Sold / Restore */}
          {isSold ? (
            <ActionBtn onClick={() => onMarkAvailable(id)} title="Remettre disponible" variant="green">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Remettre dispo
            </ActionBtn>
          ) : (
            <ActionBtn onClick={() => onMarkSold(id)} title="Marquer vendu" variant="orange">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Marquer vendu
            </ActionBtn>
          )}

          {/* Hide / Show */}
          <ActionBtn onClick={() => onToggleVisibility(id)} title={isHidden ? 'Afficher' : 'Masquer'}>
            {isHidden ? (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            )}
            {isHidden ? 'Afficher' : 'Masquer'}
          </ActionBtn>

          {/* Delete */}
          {confirmDelete ? (
            <div className="flex items-center gap-1.5">
              <span className="text-red-400 text-xs font-sans">Confirmer ?</span>
              <button
                type="button"
                onClick={() => onDelete(id)}
                className="text-xs font-sans font-semibold text-red-400 hover:text-red-300 transition-colors"
              >
                Oui, supprimer
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-xs font-sans text-text-muted hover:text-text-secondary transition-colors"
              >
                Annuler
              </button>
            </div>
          ) : (
            <ActionBtn onClick={() => setConfirmDelete(true)} title="Supprimer" variant="danger">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Supprimer
            </ActionBtn>
          )}
        </div>
      </div>
    </article>
  )
}

function Flag({ label, color }) {
  const cls = {
    gold:  'bg-gold/10 text-gold border-gold/20',
    white: 'bg-white/5 text-text-secondary border-border',
    muted: 'bg-surface-2 text-text-muted border-border',
  }
  return (
    <span className={`text-[10px] font-sans font-semibold px-1.5 py-0.5 rounded-sm border ${cls[color] ?? cls.muted}`}>
      {label}
    </span>
  )
}

function ActionBtn({ onClick, title, variant = 'default', children }) {
  const variants = {
    default: 'text-text-muted hover:text-text-primary border-border hover:border-border-light',
    green:   'text-green-400 hover:text-green-300 border-green-500/30 hover:border-green-500/50',
    orange:  'text-yellow-400 hover:text-yellow-300 border-yellow-500/30 hover:border-yellow-500/50',
    danger:  'text-red-400/70 hover:text-red-400 border-red-500/20 hover:border-red-500/40',
  }
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`inline-flex items-center gap-1 text-xs font-sans px-2 py-1 rounded-sm border transition-colors ${variants[variant]}`}
    >
      {children}
    </button>
  )
}
