import emailjs from '@emailjs/browser'

export const SERVICE_ID       = import.meta.env.VITE_EMAILJS_SERVICE_ID
export const DEALER_TEMPLATE  = import.meta.env.VITE_EMAILJS_TEMPLATE_DEALER
export const CUSTOMER_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_CUSTOMER
export const PUBLIC_KEY       = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export const EMAILJS_CONFIGURED = !!(SERVICE_ID && DEALER_TEMPLATE && CUSTOMER_TEMPLATE && PUBLIC_KEY)

export const DEALERSHIP_NAME = 'AUTOMOBILE RENNAIS'
export const DEALERSHIP_EMAIL = 'contact@automobile-rennais.fr'
export const DEALERSHIP_PHONE = '+33 7 80 94 00 02'

function buildDealerParams({ type, contact, vehicle }) {
  const now = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return {
    form_type: type,
    dealership_name: DEALERSHIP_NAME,
    submission_date: now,
    contact_name: contact?.name || '',
    contact_phone: contact?.phone || '',
    contact_email: contact?.email || '',
    contact_message: contact?.message || '',
    contact_vehicle: contact?.vehicle || '',
    customer_name: contact?.name || '',
    customer_phone: contact?.phone || '',
    customer_email: contact?.email || '',
    vehicle_make: vehicle?.make || '',
    vehicle_model: vehicle?.model || '',
    vehicle_year: vehicle?.year?.toString() || '',
    vehicle_trim: vehicle?.trim || '',
    vehicle_price: vehicle?.priceFormatted || '',
    appointment_date: contact?.date || 'Non spécifié',
    financing_needed: contact?.financing || 'Non spécifié',
    customer_note: contact?.note || 'Aucune note',
    dealership_email: DEALERSHIP_EMAIL,
    dealership_phone: DEALERSHIP_PHONE,
  }
}

function buildCustomerParams({ type, contact, vehicle }) {
  return {
    to_email: contact?.email || '',
    customer_email: contact?.email || '',
    form_type: type,
    customer_name: contact?.name || '',
    vehicle_make: vehicle?.make || '',
    vehicle_model: vehicle?.model || '',
    vehicle_year: vehicle?.year?.toString() || '',
    vehicle_price: vehicle?.priceFormatted || '',
    appointment_date: contact?.date || 'Non spécifié',
    dealership_name: DEALERSHIP_NAME,
    dealership_email: DEALERSHIP_EMAIL,
    dealership_phone: DEALERSHIP_PHONE,
  }
}

function logSend(label, ok) {
  const masked = SERVICE_ID?.length > 9
    ? SERVICE_ID.slice(0, 8) + '…'
    : SERVICE_ID
  if (ok) {
    console.log(`[EmailJS] ${label} OK — service:${masked}`)
  } else {
    console.warn(`[EmailJS] ${label} FAILED — service:${masked}`)
  }
}

export async function sendDealerNotification(params) {
  if (!EMAILJS_CONFIGURED) {
    console.warn('[EmailJS] Skipped dealer notification — not configured')
    return false
  }
  try {
    await emailjs.send(SERVICE_ID, DEALER_TEMPLATE, buildDealerParams(params), PUBLIC_KEY)
    logSend('sendDealerNotification', true)
    return true
  } catch (error) {
    console.error('[EmailJS] sendDealerNotification error:', error)
    logSend('sendDealerNotification', false)
    return false
  }
}

export async function sendCustomerConfirmation(params) {
  if (!EMAILJS_CONFIGURED) {
    console.warn('[EmailJS] Skipped customer confirmation — not configured')
    return false
  }
  try {
    await emailjs.send(SERVICE_ID, CUSTOMER_TEMPLATE, buildCustomerParams(params), PUBLIC_KEY)
    logSend('sendCustomerConfirmation', true)
    return true
  } catch (error) {
    console.error('[EmailJS] sendCustomerConfirmation error:', error)
    logSend('sendCustomerConfirmation', false)
    return false
  }
}
