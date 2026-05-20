import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'

const testimonials = [
  {
    name: 'Thomas M.',
    city: 'Rennes',
    rating: 5,
    date: 'Avril 2025',
    vehicle: 'Porsche 911 GT3',
    quote:
      "Expérience exceptionnelle du début à la fin. L'équipe m'a accompagné dans le choix de ma 911 GT3, sans pression. La transparence sur l'historique du véhicule m'a mis en confiance immédiatement. Je recommande vivement.",
    initials: 'TM',
    verified: true,
  },
  {
    name: 'Sophie L.',
    city: 'Saint-Malo',
    rating: 5,
    date: 'Février 2025',
    vehicle: 'Tesla Model S Plaid',
    quote:
      "J'avais des questions très précises sur la Tesla Model S d'occasion. L'équipe a répondu à tout, fourni tous les rapports de diagnostic, et le financement a été bouclé en 48h. Livraison impeccable, voiture comme neuve.",
    initials: 'SL',
    verified: true,
  },
  {
    name: 'Marc & Julie B.',
    city: 'Nantes',
    rating: 5,
    date: 'Mars 2025',
    vehicle: 'Range Rover Autobiography',
    quote:
      "Nous sommes venus de Nantes spécialement pour le Range Rover. L'accueil était vraiment premium — café, présentation détaillée, essai sans précipitation. Le prix était justifié et le SAV rapide. On revient pour le prochain !",
    initials: 'MB',
    verified: true,
  },
]

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5" aria-label={`Note : ${count}/5`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section aria-labelledby="heading-testimonials" className="section-padding bg-surface-1">
      <div className="container-max">
        <div className="text-center mb-12">
          <SectionHeading
            label="Avis clients"
            title="Ce Que Disent Nos Clients"
            subtitle="Des centaines de clients nous font confiance chaque année pour l'achat et la vente de leurs véhicules de prestige."
            center
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.article
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="card-base p-6 flex flex-col gap-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gold/15 border border-gold/25 shrink-0">
                    <span className="font-serif font-semibold text-gold text-sm">{t.initials}</span>
                  </div>
                  <div>
                    <p className="text-text-primary font-sans font-semibold text-sm">{t.name}</p>
                    <p className="text-text-muted font-sans text-xs">{t.city} · {t.date}</p>
                  </div>
                </div>

                {/* Verified badge */}
                {t.verified && (
                  <div title="Avis vérifié" className="shrink-0">
                    <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Stars */}
              <Stars count={t.rating} />

              {/* Quote */}
              <blockquote className="text-text-secondary font-sans text-sm leading-relaxed flex-1">
                <span className="text-gold text-2xl font-serif leading-none mr-1">"</span>
                {t.quote}
                <span className="text-gold text-2xl font-serif leading-none ml-1">"</span>
              </blockquote>

              {/* Vehicle tag */}
              <div className="flex items-center gap-1.5 pt-1 border-t border-border">
                <svg className="w-3.5 h-3.5 text-gold shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <span className="text-text-muted font-sans text-xs">{t.vehicle}</span>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Trust score summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 p-5 bg-surface-2 border border-border rounded-sm"
        >
          <div className="flex flex-col items-center">
            <span className="font-serif text-3xl font-bold text-gold">4.9</span>
            <span className="text-text-muted text-xs font-sans mt-0.5">Note globale</span>
          </div>
          <div className="hidden sm:block w-px h-10 bg-border" />
          <Stars count={5} />
          <div className="hidden sm:block w-px h-10 bg-border" />
          <div className="flex flex-col items-center">
            <span className="font-serif text-3xl font-bold text-white">200+</span>
            <span className="text-text-muted text-xs font-sans mt-0.5">Avis vérifiés</span>
          </div>
          <div className="hidden sm:block w-px h-10 bg-border" />
          <div className="flex flex-col items-center">
            <span className="font-serif text-3xl font-bold text-white">98%</span>
            <span className="text-text-muted text-xs font-sans mt-0.5">Clients satisfaits</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
