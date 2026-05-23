import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const DEALER_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_DEALER
const CUSTOMER_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_CUSTOMER
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const DEALERSHIP_NAME = 'AUTOMOBILE RENNAIS'
const DEALERSHIP_EMAIL = 'contact@automobile-rennais.fr'
const DEALERSHIP_PHONE = '+33 7 80 94 00 02'

export const EMAILJS_CONFIGURED = !!(SERVICE_ID && DEALER_TEMPLATE_ID && CUSTOMER_TEMPLATE_ID && PUBLIC_KEY)

function buildDealerParams({ type, contact, vehicle }) {
  const now = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  const base = {
    form_type: type,
    dealership_name: DEALERSHIP_NAME,
    submission_date: now,
    contact_name: contact.name || '',
    contact_phone: contact.phone || '',
    contact_email: contact.email || '',
    contact_message: contact.message || '',
    contact_vehicle: contact.vehicle || '',
    customer_name: contact.name || '',
    customer_phone: contact.phone || '',
    customer_email: contact.email || '',
    vehicle_make: vehicle?.make || '',
    vehicle_model: vehicle?.model || '',
    vehicle_year: vehicle?.year?.toString() || '',
    vehicle_trim: vehicle?.trim || '',
    vehicle_price: vehicle?.priceFormatted || '',
    appointment_date: contact.date || 'Non spécifié',
    financing_needed: contact.financing || 'Non spécifié',
    customer_note: contact.note || 'Aucune note',
    dealership_email: DEALERSHIP_EMAIL,
    dealership_phone: DEALERSHIP_PHONE,
  }

  return base
}

function buildCustomerParams({ type, contact, vehicle }) {
  return {
    to_email: contact.email || '',
    customer_email: contact.email || '',
    form_type: type,
    customer_name: contact.name || '',
    vehicle_make: vehicle?.make || '',
    vehicle_model: vehicle?.model || '',
    vehicle_year: vehicle?.year?.toString() || '',
    vehicle_price: vehicle?.priceFormatted || '',
    appointment_date: contact.date || 'Non spécifié',
    dealership_name: DEALERSHIP_NAME,
    dealership_email: DEALERSHIP_EMAIL,
    dealership_phone: DEALERSHIP_PHONE,
  }
}

export async function sendDealerNotification(params) {
  if (!EMAILJS_CONFIGURED) return false
  try {
    await emailjs.send(SERVICE_ID, DEALER_TEMPLATE_ID, buildDealerParams(params), PUBLIC_KEY)
    return true
  } catch (error) {
  console.error('Dealer email error:', error)
  return false
  }
}

export async function sendCustomerConfirmation(params) {
  if (!EMAILJS_CONFIGURED) return false
  try {
    await emailjs.send(SERVICE_ID, CUSTOMER_TEMPLATE_ID, buildCustomerParams(params), PUBLIC_KEY)
    return true
  } catch (error) {
  console.error('Customer email error:', error)
  return false
  }
}
