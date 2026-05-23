import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function MentionsLegales() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <main className="bg-black">
      <div className="pt-28 sm:pt-32 pb-16 sm:pb-24">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-gold font-sans text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              Informations légales
            </p>
            <h1 className="font-serif text-display-sm sm:text-display-md text-white mb-8">
              Mentions Légales
            </h1>

            <div className="space-y-8 text-text-muted font-sans text-sm leading-relaxed">
              <section>
                <h2 className="font-serif text-lg text-white mb-3">Éditeur du site</h2>
                <p className="mb-2">
                  <strong className="text-text-secondary">AUTOMOBILE RENNAIS</strong>
                </p>
                <p className="mb-1">7 Rue des Sillons</p>
                <p className="mb-1">35850 Parthenay-de-Bretagne</p>
                <p className="mb-1">France</p>
                <p className="mt-3">
                  Téléphone : <a href="tel:+33780940002" className="text-gold hover:underline">+33 7 80 94 00 02</a>
                </p>
                <p>
                  Email : <a href="mailto:contact@automobile-rennais.fr" className="text-gold hover:underline">contact@automobile-rennais.fr</a>
                </p>
              </section>

              <section>
                <h2 className="font-serif text-lg text-white mb-3">Directeur de la publication</h2>
                <p>Le directeur de la publication est le représentant légal d'AUTOMOBILE RENNAIS.</p>
              </section>

              <section>
                <h2 className="font-serif text-lg text-white mb-3">Hébergement</h2>
                <p className="mb-2">Ce site est hébergé par :</p>
                <p>
                  <strong className="text-text-secondary">Vercel Inc.</strong><br />
                  340 S Lemon Ave #4133<br />
                  Walnut, CA 91789<br />
                  États-Unis<br />
                  <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">vercel.com</a>
                </p>
              </section>

              <section>
                <h2 className="font-serif text-lg text-white mb-3">Propriété intellectuelle</h2>
                <p>
                  L'ensemble des contenus figurant sur le site <strong className="text-text-secondary">automobile-rennais.fr</strong> (textes, images, photographies, vidéos, logos, icônes, base de données) est la propriété exclusive d'AUTOMOBILE RENNAIS, sauf mention contraire. Toute reproduction, représentation, modification ou exploitation, totale ou partielle, sans autorisation préalable écrite est interdite et constituerait une contrefaçon.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-lg text-white mb-3">Responsabilité</h2>
                <p>
                  Les informations présentées sur ce site sont fournies à titre indicatif. AUTOMOBILE RENNAIS s'efforce d'assurer l'exactitude et la mise à jour des données, mais ne saurait garantir l'exhaustivité ou l'absence d'erreur. Les prix et disponibilités des véhicules sont susceptibles d'évoluer sans préavis. AUTOMOBILE RENNAIS décline toute responsabilité en cas de dommage direct ou indirect résultant de l'utilisation du site.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-lg text-white mb-3">Liens hypertextes</h2>
                <p>
                  Le site peut contenir des liens vers des sites tiers. AUTOMOBILE RENNAIS n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou leurs pratiques.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-lg text-white mb-3">Droit applicable</h2>
                <p>
                  Les présentes mentions légales sont régies par le droit français. Tout litige relatif à l'utilisation du site relève de la compétence des tribunaux français.
                </p>
              </section>
            </div>

            <div className="mt-10 pt-8 border-t border-border">
              <Link to="/" className="text-gold font-sans text-sm hover:underline">&larr; Retour à l'accueil</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
