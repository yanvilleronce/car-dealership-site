import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { EMAIL } from '../../constants'

const benefits = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    title: 'Taux à partir de 2,9%',
    desc: 'Financement compétitif avec nos partenaires bancaires.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Réponse en 24h',
    desc: "Accord de principe rapide, sans engagement initial.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    title: 'Reprise de votre véhicule',
    desc: 'Estimez et reprenez votre véhicule actuel directement chez nous.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Garantie incluse',
    desc: '12 mois minimum sur chaque véhicule, extensible jusqu\'à 36 mois.',
  },
]

const budgetOptions = [
  { value: '', label: 'Budget mensuel estimé' },
  { value: '< 500€/mois', label: 'Moins de 500 €/mois' },
  { value: '500–800€/mois', label: '500 – 800 €/mois' },
  { value: '800–1200€/mois', label: '800 – 1 200 €/mois' },
  { value: '1200–2000€/mois', label: '1 200 – 2 000 €/mois' },
  { value: '> 2000€/mois', label: 'Plus de 2 000 €/mois' },
]

export default function FinancingCTA() {
  const [form, setForm] = useState({ name: '', phone: '', vehicle: '', budget: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const buildMailto = () => {
    const subject = encodeURIComponent('Demande de financement — AUTOMOBILE RENNAIS')
    const body = encodeURIComponent(
      `Bonjour,\n\nJe souhaite une simulation de financement.\n\nNom : ${form.name}\nTéléphone : ${form.phone}\nVéhicule souhaité : ${form.vehicle}\nBudget mensuel : ${form.budget}\n\nMerci de me recontacter.\n\nCordialement,\n${form.name}`
    )
    return `mailto:${EMAIL}?subject=${subject}&body=${body}`
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    window.location.href = buildMailto()
    setSubmitted(true)
  }

  return (
    <section id="financement" aria-labelledby="heading-financing" className="section-padding bg-black">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left — Copy */}
          <div>
            <SectionHeading
              label="Financement flexible"
              title="Votre Véhicule de Rêve à Votre Portée"
              subtitle="Nous travaillons avec les meilleures institutions financières pour vous proposer les conditions les plus avantageuses, que vous soyez salarié, indépendant ou chef d'entreprise."
            />

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex gap-3 p-4 bg-surface-1 border border-border rounded-sm"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-sm bg-gold/10 text-gold border border-gold/20 shrink-0">
                    {b.icon}
                  </div>
                  <div>
                    <p className="text-text-primary font-sans font-semibold text-sm">{b.title}</p>
                    <p className="text-text-muted font-sans text-xs mt-0.5 leading-relaxed">{b.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-surface-1 border border-border rounded-sm p-6 sm:p-8"
          >
            {!submitted ? (
              <>
                <div className="mb-6">
                  <h3 className="font-serif text-xl text-white mb-1">Simuler mon financement</h3>
                  <p className="text-text-muted font-sans text-sm">
                    Remplissez ce formulaire — nous vous répondons sous 24h.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Honeypot */}
                  <input type="text" name="_hp" tabIndex={-1} className="hidden" aria-hidden="true" />

                  <div>
                    <label htmlFor="fin-name" className="block text-xs font-sans font-medium text-text-secondary mb-1.5">
                      Nom complet *
                    </label>
                    <input
                      id="fin-name"
                      name="name"
                      type="text"
                      required
                      placeholder="Jean Dupont"
                      value={form.name}
                      onChange={handleChange}
                      className="input-base"
                    />
                  </div>

                  <div>
                    <label htmlFor="fin-phone" className="block text-xs font-sans font-medium text-text-secondary mb-1.5">
                      Téléphone *
                    </label>
                    <input
                      id="fin-phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+33 6 XX XX XX XX"
                      value={form.phone}
                      onChange={handleChange}
                      className="input-base"
                    />
                  </div>

                  <div>
                    <label htmlFor="fin-vehicle" className="block text-xs font-sans font-medium text-text-secondary mb-1.5">
                      Véhicule souhaité
                    </label>
                    <input
                      id="fin-vehicle"
                      name="vehicle"
                      type="text"
                      placeholder="ex: Porsche 911, Lamborghini Urus…"
                      value={form.vehicle}
                      onChange={handleChange}
                      className="input-base"
                    />
                  </div>

                  <div>
                    <label htmlFor="fin-budget" className="block text-xs font-sans font-medium text-text-secondary mb-1.5">
                      Budget mensuel
                    </label>
                    <select
                      id="fin-budget"
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      className="input-base appearance-none cursor-pointer"
                    >
                      {budgetOptions.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={!form.name || !form.phone}
                    className="btn-primary w-full justify-center py-3.5 mt-1 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Demander ma simulation
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>

                  <p className="text-text-muted font-sans text-xs text-center">
                    Sans engagement · Réponse sous 24h ouvrées
                  </p>
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
                <h3 className="font-serif text-xl text-white">Demande envoyée</h3>
                <p className="text-text-muted font-sans text-sm leading-relaxed">
                  Merci {form.name}. Notre équipe vous contactera dans les 24 heures.
                </p>
                <a
                  href="mailto:contact@automobile-rennais.fr"
                  className="btn-outline text-sm py-2.5 px-5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  Nous contacter par email
                </a>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
