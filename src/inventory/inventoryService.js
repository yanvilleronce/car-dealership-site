/**
 * inventoryService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all inventory operations.
 *
 * Architecture:
 *   inventory.json  →  inventoryService  →  useInventory hook  →  components
 *
 * Storage strategy:
 *   - Source of truth: inventory.json (deployed with the site, version-controlled)
 *   - Runtime overrides: localStorage key "ar_inventory" (edits made in admin panel)
 *   - Priority: localStorage > inventory.json
 *   - Staff workflow: edit in admin panel → changes persist in browser localStorage
 *     → when ready to publish permanently, export JSON and replace inventory.json
 *
 * This keeps the architecture zero-backend while remaining fully functional
 * for daily staff use. A future backend (Supabase / Firebase) can replace
 * localStorage with a real API by swapping this service only.
 */

import seedData from './inventory.json'

// ─── Constants ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'ar_inventory'

export const VEHICLE_STATUSES = {
  AVAILABLE: 'available',
  SOLD:      'sold',
  RESERVED:  'reserved',
  HIDDEN:    'hidden',
}

export const VEHICLE_TYPES = {
  NEW:  'new',
  USED: 'used',
}

export const FUEL_OPTIONS   = ['Essence', 'Diesel', 'Électrique', 'Hybride', 'Hybride rechargeable']
export const TRANS_OPTIONS  = ['Automatique', 'Manuelle', 'PDK', 'DCT 8', 'Tiptronic S 8', 'AMG Speedshift', 'M Steptronic 8', 'ZF 8', 'CVT']
export const STATUS_LABELS  = { available: 'Disponible', sold: 'Vendu', reserved: 'Réservé', hidden: 'Masqué' }
export const STATUS_COLORS  = { available: 'text-green-400', sold: 'text-red-400', reserved: 'text-yellow-400', hidden: 'text-text-muted' }

// ─── Storage helpers ──────────────────────────────────────────────────────────
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveToStorage(vehicles) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles))
    return true
  } catch {
    console.error('[inventoryService] Failed to save to localStorage')
    return false
  }
}

// ─── Core read ────────────────────────────────────────────────────────────────

/** Returns the full vehicle array from localStorage (if staff has edited)
 *  or falls back to the JSON seed file. */
export function getAllVehicles() {
  const stored = loadFromStorage()
  return stored ?? seedData.vehicles
}

/** Returns only vehicles with status === 'available' (shown on the public site) */
export function getAvailableVehicles() {
  return getAllVehicles().filter(v => v.status === VEHICLE_STATUSES.AVAILABLE)
}

export function getVehicleById(id) {
  return getAllVehicles().find(v => v.id === id) ?? null
}

export function getNewVehicles() {
  return getAvailableVehicles().filter(v => v.type === VEHICLE_TYPES.NEW)
}

export function getUsedVehicles() {
  return getAvailableVehicles().filter(v => v.type === VEHICLE_TYPES.USED)
}

export function getFeaturedNew() {
  return getNewVehicles().filter(v => v.featured)
}

export function getFeaturedUsed() {
  return getUsedVehicles().filter(v => v.featured)
}

// ─── Search & filter ──────────────────────────────────────────────────────────

/**
 * filterVehicles({ type, status, fuel, minPrice, maxPrice, query })
 * All params optional. Returns matching vehicles sorted by addedDate desc.
 */
export function filterVehicles({ type, status, fuel, minPrice, maxPrice, query } = {}) {
  let list = getAllVehicles()

  if (type)      list = list.filter(v => v.type === type)
  if (status)    list = list.filter(v => v.status === status)
  if (fuel)      list = list.filter(v => v.fuel === fuel)
  if (minPrice)  list = list.filter(v => v.price >= Number(minPrice))
  if (maxPrice)  list = list.filter(v => v.price <= Number(maxPrice))

  if (query) {
    const q = query.toLowerCase().trim()
    list = list.filter(v =>
      [v.make, v.model, v.trim, v.color, v.year?.toString(), v.shortDesc]
        .join(' ').toLowerCase().includes(q)
    )
  }

  return list.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
}

// ─── Stats ────────────────────────────────────────────────────────────────────
export function getInventoryStats() {
  const all = getAllVehicles()
  return {
    total:     all.length,
    available: all.filter(v => v.status === 'available').length,
    sold:      all.filter(v => v.status === 'sold').length,
    reserved:  all.filter(v => v.status === 'reserved').length,
    hidden:    all.filter(v => v.status === 'hidden').length,
    newCount:  all.filter(v => v.type === 'new' && v.status === 'available').length,
    usedCount: all.filter(v => v.type === 'used' && v.status === 'available').length,
  }
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Add a brand-new vehicle. Auto-generates id and addedDate. */
export function addVehicle(vehicleData) {
  const vehicles = getAllVehicles()
  const newVehicle = {
    ...createEmptyVehicle(),
    ...vehicleData,
    id: generateId(vehicleData.make, vehicleData.model, vehicleData.year),
    addedDate: new Date().toISOString().slice(0, 10),
    soldDate: null,
    status: vehicleData.status ?? VEHICLE_STATUSES.AVAILABLE,
  }
  const updated = [newVehicle, ...vehicles]
  saveToStorage(updated)
  return newVehicle
}

/** Update any fields of an existing vehicle by id. */
export function updateVehicle(id, patch) {
  const vehicles = getAllVehicles()
  const idx = vehicles.findIndex(v => v.id === id)
  if (idx === -1) return null
  const updated = [...vehicles]
  updated[idx] = { ...vehicles[idx], ...patch }
  saveToStorage(updated)
  return updated[idx]
}

/** Toggle sold status. Sets soldDate automatically. */
export function markAsSold(id) {
  return updateVehicle(id, {
    status: VEHICLE_STATUSES.SOLD,
    featured: false,
    soldDate: new Date().toISOString().slice(0, 10),
  })
}

/** Restore a sold/hidden vehicle to available. */
export function markAsAvailable(id) {
  return updateVehicle(id, {
    status: VEHICLE_STATUSES.AVAILABLE,
    soldDate: null,
  })
}

/** Soft-hide a vehicle from public site without deleting. */
export function toggleVisibility(id) {
  const vehicle = getVehicleById(id)
  if (!vehicle) return null
  const newStatus = vehicle.status === VEHICLE_STATUSES.HIDDEN
    ? VEHICLE_STATUSES.AVAILABLE
    : VEHICLE_STATUSES.HIDDEN
  return updateVehicle(id, { status: newStatus })
}

/** Permanently delete a vehicle. Returns remaining vehicles. */
export function deleteVehicle(id) {
  const vehicles = getAllVehicles()
  const updated = vehicles.filter(v => v.id !== id)
  saveToStorage(updated)
  return updated
}

/** Replace full inventory (used after CSV import). */
export function replaceInventory(vehicles) {
  saveToStorage(vehicles)
  return vehicles
}

/** Merge imported vehicles with existing (by id — existing vehicles are preserved). */
export function mergeInventory(incoming) {
  const existing = getAllVehicles()
  const existingIds = new Set(existing.map(v => v.id))
  const merged = [
    ...existing,
    ...incoming.filter(v => !existingIds.has(v.id)),
  ]
  saveToStorage(merged)
  return merged
}

/** Reset to the seed JSON (wipes localStorage overrides). */
export function resetToSeed() {
  localStorage.removeItem(STORAGE_KEY)
  return seedData.vehicles
}

/** Export current inventory as a JSON string (for download). */
export function exportInventoryJSON() {
  const vehicles = getAllVehicles()
  const payload = {
    meta: {
      ...seedData.meta,
      lastUpdated: new Date().toISOString().slice(0, 10),
      version: seedData.meta.version,
    },
    vehicles,
  }
  return JSON.stringify(payload, null, 2)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateId(make = '', model = '', year = '') {
  const base = `${make}-${model}-${year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  // Append 4-char suffix to avoid collisions
  const suffix = Math.random().toString(36).slice(2, 6)
  return `${base}-${suffix}`
}

export function createEmptyVehicle() {
  return {
    id: '',
    status: VEHICLE_STATUSES.AVAILABLE,
    type: VEHICLE_TYPES.USED,
    featured: false,
    year: new Date().getFullYear(),
    make: '',
    model: '',
    trim: '',
    price: 0,
    priceOnRequest: false,
    mileage: 0,
    fuel: 'Essence',
    transmission: 'Automatique',
    power: '',
    doors: 4,
    color: '',
    colorHex: '#888888',
    certified: false,
    images: [],
    shortDesc: '',
    fullDesc: '',
    options: [],
    vin: '',
    registration: '',
    addedDate: new Date().toISOString().slice(0, 10),
    soldDate: null,
  }
}

// ─── Formatters (used throughout the app) ─────────────────────────────────────
export const formatPrice = (price, onRequest = false) => {
  if (onRequest) return 'Prix sur demande'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price)
}

export const formatMileage = (km) =>
  km === 0 ? '0 km' : `${new Intl.NumberFormat('fr-FR').format(km)} km`

export const getBadgeLabel = (vehicle) => {
  if (vehicle.status === 'sold')     return 'Vendu'
  if (vehicle.status === 'reserved') return 'Réservé'
  if (vehicle.type === 'new')        return 'Nouveau'
  if (vehicle.certified)             return 'Certifié'
  return 'Occasion'
}

// ─── Contact helpers (dealership constants) ───────────────────────────────────
export const PHONE_NUMBER    = '+33780940002'
export const PHONE_DISPLAY   = '+33 7 80 94 00 02'
export const EMAIL           = 'contact@automobile-rennais.fr'
export const ADDRESS         = '7 Rue des Sillons, 35850 Parthenay-de-Bretagne'
export const DEALERSHIP_NAME = 'AUTOMOBILE RENNAIS'
