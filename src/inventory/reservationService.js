const STORAGE_KEY = 'ar_reservations'

export const RESERVATION_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const RESERVATION_STATUS_LABELS = {
  new: 'Nouvelle',
  contacted: 'Contacté',
  completed: 'Terminée',
  cancelled: 'Annulée',
}

function loadReservations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveReservations(reservations) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations))
    return true
  } catch {
    return false
  }
}

export function addReservation(data) {
  const reservations = loadReservations()
  const reservation = {
    id: `res-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    status: RESERVATION_STATUS.NEW,
    createdAt: new Date().toISOString(),
    vehicle: {
      id: data.vehicle.id,
      make: data.vehicle.make,
      model: data.vehicle.model,
      year: data.vehicle.year,
      trim: data.vehicle.trim || '',
      price: data.vehicle.price,
      priceOnRequest: data.vehicle.priceOnRequest,
    },
    customer: {
      name: data.name,
      phone: data.phone,
      email: data.email,
    },
    appointmentDate: data.date || '',
    financingNeeded: data.financing || '',
    note: data.note || '',
  }
  const updated = [reservation, ...reservations]
  saveReservations(updated)
  notifyReservationUpdate()
  return reservation
}

export function getAllReservations() {
  return loadReservations()
}

export function updateReservationStatus(id, status) {
  const reservations = loadReservations()
  const idx = reservations.findIndex(r => r.id === id)
  if (idx === -1) return null
  reservations[idx].status = status
  saveReservations(reservations)
  return reservations[idx]
}

const RESERVATION_EVENT = 'reservationUpdated'

export function notifyReservationUpdate() {
  window.dispatchEvent(new CustomEvent(RESERVATION_EVENT))
}

export function getReservationStats() {
  const all = loadReservations()
  return {
    total: all.length,
    new: all.filter(r => r.status === RESERVATION_STATUS.NEW).length,
    contacted: all.filter(r => r.status === RESERVATION_STATUS.CONTACTED).length,
    completed: all.filter(r => r.status === RESERVATION_STATUS.COMPLETED).length,
    cancelled: all.filter(r => r.status === RESERVATION_STATUS.CANCELLED).length,
  }
}
