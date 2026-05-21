/**
 * AdminPanel.jsx — /admin
 * ─────────────────────────────────────────────────────────────────────────────
 * Lightweight inventory management UI for non-technical dealership staff.
 *
 * Features:
 *   ✓ Live inventory stats bar
 *   ✓ Search + filter (type, status)
 *   ✓ Add vehicle (form modal/drawer)
 *   ✓ Edit vehicle (same form, pre-filled)
 *   ✓ Mark as sold / restore
 *   ✓ Toggle visibility (hide/show)
 *   ✓ Delete with confirmation
 *   ✓ CSV bulk upload (merge or replace)
 *   ✓ Export CSV (for Excel/Sheets editing)
 *   ✓ Export JSON (to update inventory.json in the codebase)
 *   ✓ Reset to seed data
 *
 * No authentication — this is a frontend-only admin panel.
 * Add a password gate here when you're ready (or use Vercel password protection).
 */
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAdminInventory } from '../../hooks/useInventory'
import VehicleAdminCard from './VehicleAdminCard'
import VehicleForm from './VehicleForm'
import CSVUploader from './CSVUploader'
import ReservationList from './ReservationList'
import {
  exportInventoryJSON,
  STATUS_LABELS,
} from '../../inventory/inventoryService'
import { exportToCSV as csvExport, downloadCSV, downloadJSON } from '../../inventory/csvUtils'

// Re-export for convenience
const exportCSV = (vehicles) => downloadCSV(csvExport(vehicles), 'inventaire-automobile-rennais.csv')
const exportJSON = () => downloadJSON(exportInventoryJSON(), 'inventory.json')

export default function AdminPanel({ onLogout }) {
  const { vehicles, filtered, stats, filters, setFilters, mutate } = useAdminInventory()

  // UI state
  const [view, setView] = useState('list')   // 'list' | 'form' | 'csv' | 'reservations'
  const [editing, setEditing] = useState(null)  // null = add new, vehicle = edit
  const [search, setSearch] = useState('')
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [toast, setToast] = useState(null)

  const notify = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Derived list — apply search on top of hook filters
  const displayList = search.trim()
    ? filtered.filter(v =>
        [v.make, v.model, v.trim, v.year?.toString(), v.color, v.shortDesc]
          .join(' ').toLowerCase().includes(search.toLowerCase())
      )
    : filtered

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSave = (data) => {
    if (editing?.id) {
      mutate.update(editing.id, data)
      notify('Véhicule modifié avec succès.')
    } else {
      mutate.add(data)
      notify('Véhicule ajouté à l\'inventaire.')
    }
    setView('list')
    setEditing(null)
  }

  const handleCSVImport = (incoming, mode) => {
    if (mode === 'replace') mutate.replaceAll(incoming)
    else mutate.merge(incoming)
    notify(`${incoming.length} véhicule(s) importé(s) avec succès.`)
    setView('list')
  }

  const handleReset = () => {
    mutate.reset()
    setShowResetConfirm(false)
    notify('Inventaire réinitialisé aux données de départ.')
  }

  const openEdit = (vehicle) => { setEditing(vehicle); setView('form') }
  const openAdd  = () => { setEditing(null); setView('form') }

  return (
    <div className="min-h-screen bg-black">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-surface-1 border-b border-border sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a href="/" className="text-text-muted hover:text-gold transition-colors" title="Retour au site">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </a>
            <div className="w-px h-5 bg-border" />
            <span className="font-serif text-sm text-white font-semibold tracking-wide">
              AUTOMOBILE RENNAIS
            </span>
            <span className="text-text-muted font-sans text-xs hidden sm:block">— Gestion du stock</span>
          </div>
          <div className="flex items-center gap-2">
            <StatPill label="Dispo" value={stats.available} color="green" />
            <StatPill label="Vendus" value={stats.sold} color="red" />
            <StatPill label="Total" value={stats.total} color="gold" />
            <div className="w-px h-5 bg-border mx-1" />
            <button
              onClick={() => setView(view === 'reservations' ? 'list' : 'reservations')}
              className={`text-xs font-sans font-medium transition-colors px-2 py-1 rounded-sm ${
                view === 'reservations' ? 'text-gold bg-gold/10' : 'text-text-muted hover:text-gold'
              }`}
            >
              Réservations
            </button>
            <div className="w-px h-5 bg-border mx-1" />
            <button
              onClick={onLogout}
              title="Déconnexion"
              className="text-text-muted hover:text-red-400 transition-colors p-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* ── View: LIST ─────────────────────────────────────────────────── */}
        {view === 'list' && (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <StatsCard value={stats.available} label="Disponibles" sub={`${stats.newCount} neufs · ${stats.usedCount} occasion`} color="green" />
              <StatsCard value={stats.sold}      label="Vendus"      sub="Ce mois" color="red" />
              <StatsCard value={stats.reserved}  label="Réservés"    sub="En attente" color="yellow" />
              <StatsCard value={stats.hidden}    label="Masqués"     sub="Non publiés" color="muted" />
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              {/* Search */}
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher marque, modèle, couleur…"
                  className="input-base pl-9 text-sm"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2 flex-wrap">
                <FilterSelect
                  value={filters.type ?? ''}
                  onChange={v => setFilters(f => ({ ...f, type: v || undefined }))}
                  options={[{ value: '', label: 'Tous types' }, { value: 'new', label: 'Neufs' }, { value: 'used', label: 'Occasion' }]}
                />
                <FilterSelect
                  value={filters.status ?? ''}
                  onChange={v => setFilters(f => ({ ...f, status: v || undefined }))}
                  options={[
                    { value: '', label: 'Tous statuts' },
                    ...Object.entries(STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }))
                  ]}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                <button onClick={openAdd} className="btn-primary text-sm py-2 px-4 whitespace-nowrap">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter
                </button>
                <button onClick={() => setView('csv')} className="btn-outline text-sm py-2 px-3 whitespace-nowrap">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  Importer CSV
                </button>
              </div>
            </div>

            {/* Export/Reset bar */}
            <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-border">
              <button
                onClick={() => exportCSV(vehicles)}
                className="inline-flex items-center gap-1.5 text-xs font-sans text-text-muted hover:text-text-secondary border border-border hover:border-border-light rounded-sm px-3 py-1.5 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Exporter CSV (Excel)
              </button>
              <button
                onClick={exportJSON}
                className="inline-flex items-center gap-1.5 text-xs font-sans text-text-muted hover:text-text-secondary border border-border hover:border-border-light rounded-sm px-3 py-1.5 transition-colors"
                title="Télécharger inventory.json pour remplacer le fichier source"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Exporter JSON (déploiement)
              </button>
              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-sans text-red-400/60 hover:text-red-400 border border-red-500/20 hover:border-red-500/40 rounded-sm px-3 py-1.5 transition-colors"
                >
                  Réinitialiser aux données de départ
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs font-sans">
                  <span className="text-red-400">Confirmer la réinitialisation ?</span>
                  <button onClick={handleReset} className="text-red-400 hover:text-red-300 font-semibold transition-colors">Oui</button>
                  <button onClick={() => setShowResetConfirm(false)} className="text-text-muted hover:text-text-secondary transition-colors">Non</button>
                </div>
              )}
            </div>

            {/* Results count */}
            <p className="text-text-muted font-sans text-xs mb-4">
              {displayList.length} véhicule{displayList.length !== 1 ? 's' : ''}
              {(filters.type || filters.status || search) && ' (filtrés)'}
            </p>

            {/* Vehicle list */}
            {displayList.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-text-muted font-sans text-sm">Aucun véhicule trouvé.</p>
                <button onClick={openAdd} className="btn-primary text-sm py-2 px-5 mt-4">
                  Ajouter le premier véhicule
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {displayList.map(v => (
                  <VehicleAdminCard
                    key={v.id}
                    vehicle={v}
                    onEdit={openEdit}
                    onDelete={(id) => { mutate.delete(id); notify('Véhicule supprimé.', 'info') }}
                    onMarkSold={(id) => { mutate.markSold(id); notify('Marqué comme vendu.') }}
                    onMarkAvailable={(id) => { mutate.markAvailable(id); notify('Remis en stock disponible.') }}
                    onToggleVisibility={(id) => { mutate.toggleVisibility(id); notify('Visibilité mise à jour.') }}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── View: FORM ─────────────────────────────────────────────────── */}
        {view === 'form' && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => { setView('list'); setEditing(null) }}
                className="text-text-muted hover:text-gold transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h2 className="font-serif text-xl text-white">
                {editing ? `Modifier — ${editing.make} ${editing.model} ${editing.year}` : 'Ajouter un véhicule'}
              </h2>
            </div>
            <div className="bg-surface-1 border border-border rounded-sm p-5 sm:p-7">
              <VehicleForm
                initial={editing}
                onSave={handleSave}
                onCancel={() => { setView('list'); setEditing(null) }}
              />
            </div>
          </div>
        )}

        {/* ── View: RESERVATIONS ──────────────────────────────────────────── */}
        {view === 'reservations' && (
          <ReservationList onBack={() => setView('list')} />
        )}

        {/* ── View: CSV ──────────────────────────────────────────────────── */}
        {view === 'csv' && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setView('list')} className="text-text-muted hover:text-gold transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h2 className="font-serif text-xl text-white">Importer un fichier CSV</h2>
            </div>
            <div className="bg-surface-1 border border-border rounded-sm p-5 sm:p-7">
              <CSVUploader
                onImport={handleCSVImport}
                onCancel={() => setView('list')}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Toast notification ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-surface-1 border border-border rounded-sm px-4 py-3 shadow-card flex items-center gap-2.5 min-w-[220px]"
          >
            <div className={`w-2 h-2 rounded-full shrink-0 ${toast.type === 'success' ? 'bg-green-400' : toast.type === 'info' ? 'bg-gold' : 'bg-red-400'}`} />
            <p className="text-text-primary font-sans text-sm">{toast.msg}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Small UI helpers ─────────────────────────────────────────────────────────
function StatPill({ label, value, color }) {
  const colors = { green: 'text-green-400', red: 'text-red-400', gold: 'text-gold', muted: 'text-text-muted' }
  return (
    <span className="font-sans text-xs flex items-center gap-1">
      <span className={`font-bold ${colors[color]}`}>{value}</span>
      <span className="text-text-muted hidden sm:inline">{label}</span>
    </span>
  )
}

function StatsCard({ value, label, sub, color }) {
  const colors = { green: 'text-green-400', red: 'text-red-400', yellow: 'text-yellow-400', muted: 'text-text-muted' }
  return (
    <div className="bg-surface-1 border border-border rounded-sm p-4">
      <p className={`font-serif text-2xl font-bold ${colors[color]}`}>{value}</p>
      <p className="text-text-primary font-sans text-sm font-semibold mt-0.5">{label}</p>
      <p className="text-text-muted font-sans text-xs mt-0.5">{sub}</p>
    </div>
  )
}

function FilterSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="input-base text-sm py-2 pr-7 min-w-[130px] cursor-pointer"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}
