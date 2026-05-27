export function track(event, data = {}) {
  const payload = { event, data, timestamp: new Date().toISOString() }
  console.log(`[Track] ${event}`, data)
  window.dispatchEvent(new CustomEvent('ar_track', { detail: payload }))
}
