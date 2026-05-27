import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { EMAIL, PHONE_DISPLAY } from '../../constants'
import { track } from '../../utils/track'
import {
  EMAILJS_CONFIGURED,
  sendDealerNotification,
  sendCustomerConfirmation,
} from '../../config/emailjs'

export default function InquiryForm() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', vehicle: '', message: '', _hp: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [emailResult, setEmailResult] = useState(null)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form._hp || sending) return

    setSending(true)

    try {
      const contact = { name: form.name, phone: form.phone, email: form.email, message: form.message, vehicle: form.vehicle }
      const emailParams = { type: 'contact', contact }

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
      track('form_inquiry_success', { vehicle: form.vehicle })
    }
  }

  return (
    <section id="contact" aria-labelledby="heading-inquiry" className="section-padding bg-black">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Left — info */}
          <div>
            <SectionHeading
              label="Nous contacter"
              title="Trouvez Votre Prochain Véhicule"
              subtitle="Vous avez un véhicule en tête ? Une question sur notre stock ou nos services ? Notre équipe vous répond rapidement."
            />

            <div className="mt-8 flex flex-col gap-5">
              <ContactInfo
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                }
                label="Notre adresse"
                value="7 Rue des Sillons, 35850 Parthenay-de-Bretagne"
              />
              <ContactInfo
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                }
                label="Téléphone"
                value={PHONE_DISPLAY}
                href={`tel:+33780940002`}
              />
              <ContactInfo
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                }
                label="Email"
                value={EMAIL}
                href={`mailto:${EMAIL}`}
              />
              <ContactInfo
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                label="Horaires"
                value="Lun–Sam : 9h00 – 19h00"
              />
            </div>
          </div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-surface-1 border border-border rounded-sm p-6 sm:p-8"
          >
            {!submitted ? (
              <>
                <h3 className="font-serif text-xl text-white mb-1">Envoyez-nous un message</h3>
                <p className="text-text-muted font-sans text-sm mb-6">
                  Notre équipe vous répond sous 24 heures ouvrées.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                  {/* Honeypot */}
                  <input type="text" name="_hp" value={form._hp} onChange={handleChange} tabIndex={-1} className="hidden" aria-hidden="true" />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="inq-name" className="block text-xs font-sans font-medium text-text-secondary mb-1.5">Nom complet *</label>
                      <input id="inq-name" name="name" type="text" required placeholder="Jean Dupont" value={form.name} onChange={handleChange} className="input-base" />
                    </div>
                    <div>
                      <label htmlFor="inq-phone" className="block text-xs font-sans font-medium text-text-secondary mb-1.5">Téléphone</label>
                      <input id="inq-phone" name="phone" type="tel" required placeholder="+33 6 XX XX XX XX" value={form.phone} onChange={handleChange} className="input-base" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="inq-email" className="block text-xs font-sans font-medium text-text-secondary mb-1.5">Adresse email *</label>
                    <input id="inq-email" name="email" type="email" required placeholder="jean@email.com" value={form.email} onChange={handleChange} className="input-base" />
                  </div>

                  <div>
                    <label htmlFor="inq-vehicle" className="block text-xs font-sans font-medium text-text-secondary mb-1.5">Véhicule souhaité</label>
                    <input id="inq-vehicle" name="vehicle" type="text" placeholder="ex: Porsche 911, Lamborghini Urus…" value={form.vehicle} onChange={handleChange} className="input-base" />
                  </div>

                  <div>
                    <label htmlFor="inq-message" className="block text-xs font-sans font-medium text-text-secondary mb-1.5">Message</label>
                    <textarea
                      id="inq-message"
                      name="message"
                      rows={4}
                      placeholder="Décrivez vos besoins, questions, critères de recherche…"
                      value={form.message}
                      onChange={handleChange}
                      className="input-base resize-none"
                    />
                  </div>

                  <div className="flex flex-col mt-1">
                    <button
                      type="submit"
                      disabled={!form.name || !form.phone || !form.email || sending}
                      className="btn-primary w-full justify-center py-3.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {sending ? 'Envoi en cours…' : 'Envoyer la demande'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-8 gap-4"
              >
                <div className={`flex items-center justify-center w-16 h-16 rounded-full border ${emailResult === 'failed' || !EMAILJS_CONFIGURED ? 'bg-amber-500/10 border-amber-500/30' : 'bg-gold/10 border-gold/30'}`}>
                  {emailResult === 'failed' || !EMAILJS_CONFIGURED ? (
                    <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <h3 className="font-serif text-xl text-white">
                  {emailResult === 'failed' || !EMAILJS_CONFIGURED ? 'Problème de transmission' : 'Message envoyé !'}
                </h3>
                <p className="text-text-muted font-sans text-sm leading-relaxed max-w-xs">
                  {emailResult === 'failed'
                    ? 'L\'envoi automatique a échoué. Vous pouvez nous contacter directement via les options ci-dessous.'
                    : !EMAILJS_CONFIGURED
                      ? 'Veuillez utiliser l\'un des moyens ci-dessous pour nous contacter.'
                      : 'Votre demande a bien été transmise. Notre équipe vous répondra sous 24h ouvrées.'}
                </p>

                {(emailResult === 'failed' || !EMAILJS_CONFIGURED) && (
                  <div className="flex flex-col sm:flex-row gap-3 mt-1 w-full max-w-xs">
                    <a
                      href="tel:+33780940002"
                      className="btn-outline flex-1 justify-center text-sm py-2.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                      Nous appeler
                    </a>
                    <a
                      href="mailto:contact@automobile-rennais.fr"
                      className="btn-outline flex-1 justify-center text-sm py-2.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      Nous contacter
                    </a>
                  </div>
                )}

                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', vehicle: '', message: '', _hp: '' }) }}
                  className="btn-ghost text-sm py-2 px-4"
                >
                  Nouveau message
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ContactInfo({ icon, label, value, href, external }) {
  const content = (
    <div className="flex items-start gap-3">
      <div className="flex items-center justify-center w-9 h-9 rounded-sm bg-surface-2 border border-border text-gold shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-text-muted font-sans text-xs mb-0.5">{label}</p>
        <p className={`font-sans text-sm font-medium ${href ? 'text-text-primary hover:text-gold transition-colors' : 'text-text-primary'}`}>
          {value}
        </p>
      </div>
    </div>
  )

  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="block"
      >
        {content}
      </a>
    )
  }
  return <div>{content}</div>
}
