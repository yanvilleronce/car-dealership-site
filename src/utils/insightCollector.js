export const STORAGE_KEY = 'ar_insights'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function save(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    /* storage full — silently ignore */
  }
}

function seed() {
  return {
    counts: {},
    vehicles: {},
    inquiries: [],
    firstEvent: null,
    lastEvent: null,
  }
}

function vehicleKey(detail) {
  const d = detail?.data
  if (d?.vehicleId) return d.vehicleId
  if (d?.make && d?.model) return `${d.make}-${d.model}`.toLowerCase().replace(/\s+/g, '-')
  return null
}

export function initInsightCollector() {
  let data = load() || seed()

  const handler = (e) => {
    const ev = e.detail
    if (!ev?.event) return

    const { event, data: payload, timestamp } = ev
    const now = timestamp || new Date().toISOString()

    data.counts[event] = (data.counts[event] || 0) + 1
    if (!data.firstEvent || now < data.firstEvent) data.firstEvent = now
    if (!data.lastEvent || now > data.lastEvent) data.lastEvent = now

    if (['page_view', 'click_reserve', 'click_financing'].includes(event)) {
      const key = vehicleKey(ev)
      if (key) {
        if (!data.vehicles[key]) {
          data.vehicles[key] = { make: '', model: '', views: 0, reserve_clicks: 0, financing_clicks: 0 }
        }
        const v = data.vehicles[key]
        if (payload?.make) v.make = payload.make
        if (payload?.model) v.model = payload.model
        if (event === 'page_view') v.views++
        else if (event === 'click_reserve') v.reserve_clicks++
        else if (event === 'click_financing') v.financing_clicks++
      }
    }

    if (event === 'form_inquiry_success') {
      data.inquiries.push({ vehicle: payload?.vehicle || '', timestamp: now })
    }

    save(data)
  }

  window.addEventListener('ar_track', handler)
  return () => window.removeEventListener('ar_track', handler)
}

export function getInsights() {
  return load() || seed()
}

export function resetInsights() {
  localStorage.removeItem(STORAGE_KEY)
}
