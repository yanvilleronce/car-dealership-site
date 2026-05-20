/**
 * useInventory.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Reactive hook that gives any component access to inventory data.
 * Components never import from inventoryService directly — they use this hook.
 *
 * Usage:
 *   const { newVehicles, usedVehicles, featuredNew, featuredUsed } = useInventory()
 *   const { vehicles, stats, mutate } = useInventory({ admin: true })
 *
 * The hook subscribes to a custom 'inventoryUpdated' DOM event so that
 * changes made in the admin panel instantly reflect in other open tabs/components
 * without a page refresh.
 */

import { useState, useEffect, useCallback } from 'react'
import {
  getAllVehicles,
  getAvailableVehicles,
  getNewVehicles,
  getUsedVehicles,
  getFeaturedNew,
  getFeaturedUsed,
  getInventoryStats,
  filterVehicles,
  addVehicle,
  updateVehicle,
  markAsSold,
  markAsAvailable,
  toggleVisibility,
  deleteVehicle,
  replaceInventory,
  mergeInventory,
  resetToSeed,
} from '../inventory/inventoryService'

const INVENTORY_EVENT = 'inventoryUpdated'

/** Fire this after any mutation so all hook instances re-render */
export function notifyInventoryUpdate() {
  window.dispatchEvent(new CustomEvent(INVENTORY_EVENT))
}

// ─── Public-facing hook (read only, available vehicles only) ──────────────────
export function useInventory() {
  const [tick, setTick] = useState(0)
  const refresh = useCallback(() => setTick(t => t + 1), [])

  useEffect(() => {
    window.addEventListener(INVENTORY_EVENT, refresh)
    return () => window.removeEventListener(INVENTORY_EVENT, refresh)
  }, [refresh])

  return {
    allAvailable:  getAvailableVehicles(),
    newVehicles:   getNewVehicles(),
    usedVehicles:  getUsedVehicles(),
    featuredNew:   getFeaturedNew(),
    featuredUsed:  getFeaturedUsed(),
    stats:         getInventoryStats(),
    // Read helpers
    filterVehicles,
  }
}

// ─── Admin hook (full CRUD + all statuses) ────────────────────────────────────
export function useAdminInventory() {
  const [tick, setTick] = useState(0)
  const [filters, setFilters] = useState({})

  const refresh = useCallback(() => {
    setTick(t => t + 1)
    notifyInventoryUpdate()
  }, [])

  useEffect(() => {
    window.addEventListener(INVENTORY_EVENT, () => setTick(t => t + 1))
    return () => window.removeEventListener(INVENTORY_EVENT, () => {})
  }, [])

  // Wrapped mutations — each calls refresh after the operation
  const mutate = {
    add: (data) => { const v = addVehicle(data); refresh(); return v },
    update: (id, patch) => { const v = updateVehicle(id, patch); refresh(); return v },
    markSold: (id) => { const v = markAsSold(id); refresh(); return v },
    markAvailable: (id) => { const v = markAsAvailable(id); refresh(); return v },
    toggleVisibility: (id) => { const v = toggleVisibility(id); refresh(); return v },
    delete: (id) => { deleteVehicle(id); refresh() },
    replaceAll: (vehicles) => { replaceInventory(vehicles); refresh() },
    merge: (incoming) => { const v = mergeInventory(incoming); refresh(); return v },
    reset: () => { resetToSeed(); refresh() },
  }

  const filtered = filterVehicles(filters)

  return {
    vehicles: getAllVehicles(),         // all statuses (for admin)
    filtered,                           // filtered by current admin filters
    stats: getInventoryStats(),
    filters,
    setFilters,
    mutate,
    refresh,
  }
}
