import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatPrice } from '../../inventory/inventoryService'
import { addReservation } from '../../inventory/reservationService'
import {
  EMAILJS_CONFIGURED,
  sendDealerNotification,
  sendCustomerConfirmation,
} from '../../inventory/emailService'

export default function ReservationModal({ vehicle, open, onClose }) {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', date: '', financing: '', note: '', _hp: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [emailResult, setEmailResult] = useState(null)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const resetForm = () => {
    setForm({ name: '', phone: '', email: '', date: '', financing: '', note: '', _hp: '' })
    setSubmitted(false)
    setSending(false)
    setEmailResult(null)
  }

  const handleClose = () => {
    onClose()
    setTimeout(resetForm, 300)
  }

  const persistReservation = () => {
    return addReservation({
      vehicle: { id: vehicle.id, make: vehicle.make, model: vehicle.model, year: vehicle.year, trim: vehicle.trim, price: vehicle.price, priceOnRequest: vehicle.priceOnRequest },
      name: form.name,
      phone: form.phone,
      email: form.email,
      date: form.date,
      financing: form.financing,
      note: form.note,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form._hp || sending) return

    setSending(true)
    persistReservation()

    try {
      const vehicleData = {
        make: vehicle.make, model: vehicle.model, year: vehicle.year,
        trim: vehicle.trim, priceFormatted: formatPrice(vehicle.price, vehicle.priceOnRequest),
      }
      const contact = { name: form.name, phone: form.phone, email: form.email, date: form.date, financing: form.financing, note: form.note }
      const emailParams = { type: 'reservation', contact, vehicle: vehicleData }

      if (EMAILJS_CONFIGURED) {
        const [dealerOk, customerOk] = await Promise.all([
          sendDealerNotification(emailParams),
          sendCustomerConfirmation(emailParams),
        ])
        setEmailResult(dealerOk || customerOk ? 'sent' : 'failed')
      }
    } catch {
      setEmailResult('failed')
    } finally {
      setSending(false)
      setSubmitted(true)
    }
  }

  if (!vehicle) return null

  const { year, make, model, trim, price, priceOnRequest, images } = vehicle
  const image = images?.[0]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="reservation-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/80 backdrop-blur-sm overflow-y-auto"
          onClick={handleClose}
        >
          <motion.div
            key="reservation-modal"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl mx-4 my-8 bg-surface-1 border border-border rounded-sm shadow-card overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
              <h2 className="font-serif text-lg text-white">Réserver ce véhicule</h2>
              <button
                onClick={handleClose}
                className="text-text-muted hover:text-white transition-colors p-1"
                aria-label="Fermer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {!submitted ? (
              <div className="p-4 sm:p-6">
                {/* Vehicle summary */}
                <div className="flex gap-3 sm:gap-4 mb-6 p-3 sm:p-4 bg-surface-2 border border-border rounded-sm">
                  <div className="w-20 sm:w-24 h-16 sm:h-18 shrink-0 rounded-sm overflow-hidden bg-black">
                    {image && (
                      <img src={image} alt={`${make} ${model}`} className="w-full h-full object-cover" width={96} height={72} loading="lazy" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-text-muted font-sans mb-0.5">{year}</p>
                    <p className="font-serif text-white text-sm sm:text-base leading-tight">{make} {model}</p>
                    {trim && <p className="text-text-muted text-xs font-sans mt-0.5 truncate">{trim}</p>}
                    <p className="text-gold font-sans font-bold text-sm sm:text-base mt-1">{formatPrice(price, priceOnRequest)}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                  <input type="text" name="_hp" value={form._hp} onChange={handleChange} tabIndex={-1} className="hidden" aria-hidden="true" />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="res-name" className="block text-xs font-sans font-medium text-text-secondary mb-1.5">Nom complet *</label>
                      <input id="res-name" name="name" type="text" required placeholder="Jean Dupont" value={form.name} onChange={handleChange} className="input-base" />
                    </div>
                    <div>
                      <label htmlFor="res-phone" className="block text-xs font-sans font-medium text-text-secondary mb-1.5">Téléphone *</label>
                      <input id="res-phone" name="phone" type="tel" required placeholder="+33 6 XX XX XX XX" value={form.phone} onChange={handleChange} className="input-base" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="res-email" className="block text-xs font-sans font-medium text-text-secondary mb-1.5">Adresse email *</label>
                    <input id="res-email" name="email" type="email" required placeholder="jean@email.com" value={form.email} onChange={handleChange} className="input-base" />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="res-date" className="block text-xs font-sans font-medium text-text-secondary mb-1.5">Date de rendez-vous souhaitée</label>
                      <input id="res-date" name="date" type="date" value={form.date} onChange={handleChange} className="input-base" min={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div>
                      <label htmlFor="res-financing" className="block text-xs font-sans font-medium text-text-secondary mb-1.5">Financement nécessaire ? *</label>
                      <select id="res-financing" name="financing" required value={form.financing} onChange={handleChange} className="input-base cursor-pointer">
                        <option value="">Sélectionnez…</option>
                        <option value="Oui">Oui</option>
                        <option value="Non">Non</option>
                        <option value="À discuter">À discuter</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="res-note" className="block text-xs font-sans font-medium text-text-secondary mb-1.5">Note (optionnelle)</label>
                    <textarea
                      id="res-note"
                      name="note"
                      rows={3}
                      placeholder="Vos questions, préférences, disponibilités…"
                      value={form.note}
                      onChange={handleChange}
                      className="input-base resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending || !form.name || !form.phone || !form.email || !form.financing}
                    className="btn-primary w-full justify-center py-3 text-sm mt-1 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                        </svg>
                        Envoi en cours…
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        Envoyer la demande
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-10 sm:py-14 px-6 gap-5"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 border border-gold/30">
                  <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl text-white">Demande envoyée !</h3>
                <div className="text-text-muted font-sans text-sm leading-relaxed max-w-sm space-y-3">
                  <p>
                    Votre demande de réservation a été transmise. Vous allez recevoir un e-mail de confirmation dans quelques instants.
                  </p>
                  <p>
                    Notre équipe vous recontactera sous 24 heures ouvrées pour confirmer le rendez-vous.
                  </p>
                  <p>
                    Pour finaliser la réservation, veuillez accepter le devis et régler l'acompte. Votre véhicule sera marqué comme indisponible sur nos plateformes et réservé dès réception du paiement.
                  </p>
                  <p>
                    Ce versement n'implique aucune obligation d'achat. En cas de rétractation, l'acompte vous sera intégralement remboursé.
                  </p>
                </div>
                {emailResult === 'failed' && (
                  <p className="text-amber-400 font-sans text-xs max-w-xs">
                    L'envoi automatique a rencontré un problème. Utilisez le lien ci-dessous pour nous contacter directement.
                  </p>
                )}
                <div className="flex flex-col gap-2 mt-1 w-full max-w-xs">
                  <button
                    onClick={handleClose}
                    className="btn-primary w-full justify-center text-sm py-2.5"
                  >
                    OK
                  </button>
                  <a
                    href="mailto:contact@automobile-rennais.fr"
                    className="btn-ghost w-full justify-center text-sm py-2"
                  >
                    Nous contacter
                  </a>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
