import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { EMAIL, PHONE_DISPLAY, buildWhatsAppUrl } from '../../inventory/inventoryService'

export default function InquiryForm() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', vehicle: '', message: '', _hp: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitMode, setSubmitMode] = useState(null) // 'email' | 'whatsapp'

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const buildMailto = () => {
    const subject = encodeURIComponent('Demande de renseignements — AUTOMOBILE RENNAIS')
    const body = encodeURIComponent(
      `Bonjour,\n\nNom : ${form.name}\nEmail : ${form.email}\nTéléphone : ${form.phone}\nVéhicule souhaité : ${form.vehicle}\n\nMessage :\n${form.message}\n\nCordialement,\n${form.name}`
    )
    return `mailto:${EMAIL}?subject=${subject}&body=${body}`
  }

  const buildWA = () =>
    buildWhatsAppUrl(
      `Bonjour, je m'appelle ${form.name}. Je suis intéressé(e) par ${form.vehicle || 'un de vos véhicules'}. ${form.message}`
    )

  const handleEmail = (e) => {
    e.preventDefault()
    if (form._hp) return // honeypot
    window.location.href = buildMailto()
    setSubmitMode('email')
    setSubmitted(true)
  }

  const handleWhatsApp = () => {
    if (form._hp) return
    window.open(buildWA(), '_blank', 'noopener,noreferrer')
    setSubmitMode('whatsapp')
    setSubmitted(true)
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
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                }
                label="WhatsApp"
                value="+33 7 80 94 00 02"
                href={buildWhatsAppUrl('Bonjour, je souhaite un renseignement.')}
                external
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
                  Répondons par email ou directement sur WhatsApp — à vous de choisir.
                </p>

                <form onSubmit={handleEmail} className="flex flex-col gap-4" noValidate>
                  {/* Honeypot */}
                  <input type="text" name="_hp" value={form._hp} onChange={handleChange} tabIndex={-1} className="hidden" aria-hidden="true" />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="inq-name" className="block text-xs font-sans font-medium text-text-secondary mb-1.5">Nom complet *</label>
                      <input id="inq-name" name="name" type="text" required placeholder="Jean Dupont" value={form.name} onChange={handleChange} className="input-base" />
                    </div>
                    <div>
                      <label htmlFor="inq-phone" className="block text-xs font-sans font-medium text-text-secondary mb-1.5">Téléphone</label>
                      <input id="inq-phone" name="phone" type="tel" placeholder="+33 6 XX XX XX XX" value={form.phone} onChange={handleChange} className="input-base" />
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

                  <div className="flex flex-col sm:flex-row gap-3 mt-1">
                    <button
                      type="submit"
                      disabled={!form.name || !form.email}
                      className="btn-primary flex-1 justify-center py-3.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Envoyer par email
                    </button>
                    <button
                      type="button"
                      onClick={handleWhatsApp}
                      disabled={!form.name}
                      className="flex flex-1 items-center justify-center gap-2 py-3.5 rounded-sm font-sans font-semibold text-sm bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366]/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Via WhatsApp
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
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 border border-gold/30">
                  <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl text-white">Message envoyé !</h3>
                <p className="text-text-muted font-sans text-sm leading-relaxed max-w-xs">
                  {submitMode === 'whatsapp'
                    ? 'Votre message a été ouvert dans WhatsApp. Notre équipe vous répondra très bientôt.'
                    : 'Votre email a été préparé. Notre équipe vous répondra sous 24h ouvrées.'}
                </p>
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
