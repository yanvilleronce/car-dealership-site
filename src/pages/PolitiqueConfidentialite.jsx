import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function PolitiqueConfidentialite() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <main className="bg-black">
      <div className="pt-28 sm:pt-32 pb-16 sm:pb-24">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-gold font-sans text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              Protection des données
            </p>
            <h1 className="font-serif text-display-sm sm:text-display-md text-white mb-8">
              Politique de Confidentialité
            </h1>

            <div className="space-y-8 text-text-muted font-sans text-sm leading-relaxed">
              <section>
                <h2 className="font-serif text-lg text-white mb-3">1. Responsable du traitement</h2>
                <p>
                  Le responsable du traitement des données à caractère personnel collectées sur le site <strong className="text-text-secondary">automobile-rennais.fr</strong> est :
                </p>
                <p className="mt-2">
                  <strong className="text-text-secondary">AUTOMOBILE RENNAIS</strong><br />
                  7 Rue des Sillons, 35850 Parthenay-de-Bretagne<br />
                  <a href="mailto:contact@automobile-rennais.fr" className="text-gold hover:underline">contact@automobile-rennais.fr</a><br />
                  +33 7 80 94 00 02
                </p>
              </section>

              <section>
                <h2 className="font-serif text-lg text-white mb-3">2. Données collectées</h2>
                <p className="mb-2">Dans le cadre de l'utilisation du site, nous sommes susceptibles de collecter les données suivantes :</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone</li>
                  <li>Message et préférences concernant les véhicules</li>
                  <li>Date de rendez-vous souhaitée</li>
                  <li>Informations relatives au financement</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-lg text-white mb-3">3. Finalités du traitement</h2>
                <p className="mb-2">Vos données sont collectées uniquement pour les finalités suivantes :</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Gestion des demandes de réservation de véhicules</li>
                  <li>Traitement des formulaires de contact</li>
                  <li>Communication avec le client (email, téléphone)</li>
                  <li>Organisation des rendez-vous et essais</li>
                  <li>Suivi commercial et relation client</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-lg text-white mb-3">4. Transmission des données</h2>
                <p>
                  Vos données sont destinées à AUTOMOBILE RENNAIS. Elles ne sont ni vendues, ni cédées à des tiers. Nous utilisons le service <strong className="text-text-secondary">EmailJS</strong> (EmailJS Ltd) pour l'envoi des emails de notification et de confirmation. EmailJS traite vos données uniquement pour l'acheminement des messages et s'engage à ne pas les utiliser à d'autres fins. En utilisant nos formulaires, vous consentez à cette transmission.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-lg text-white mb-3">5. Stockage et sécurité</h2>
                <p>
                  Aucune donnée bancaire ou de paiement n'est collectée ou stockée sur ce site. Les données sont conservées localement (navigation) et via le service EmailJS pour la durée nécessaire au traitement de votre demande. Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-lg text-white mb-3">6. Durée de conservation</h2>
                <p>
                  Vos données personnelles sont conservées pour une durée maximale de trois ans à compter de votre dernier contact avec notre équipe. Passé ce délai, elles sont supprimées ou anonymisées.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-lg text-white mb-3">7. Vos droits</h2>
                <p className="mb-2">Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Droit d'accès à vos données</li>
                  <li>Droit de rectification des données inexactes</li>
                  <li>Droit à l'effacement (droit à l'oubli)</li>
                  <li>Droit à la limitation du traitement</li>
                  <li>Droit à la portabilité de vos données</li>
                  <li>Droit d'opposition au traitement</li>
                </ul>
                <p className="mt-3">
                  Pour exercer ces droits, contactez-nous par email à <a href="mailto:contact@automobile-rennais.fr" className="text-gold hover:underline">contact@automobile-rennais.fr</a> ou par courrier à l'adresse postale indiquée ci-dessus.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-lg text-white mb-3">8. Cookies</h2>
                <p>
                  Ce site n'utilise pas de cookies de suivi ou de traçage publicitaire. Des cookies techniques strictement nécessaires au fonctionnement du site peuvent être déposés par l'hébergeur (Vercel) pour assurer la sécurité et la performance du service.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-lg text-white mb-3">9. Contact</h2>
                <p>
                  Pour toute question relative à la présente politique de confidentialité, vous pouvez nous contacter :
                </p>
                <p className="mt-2">
                  Email : <a href="mailto:contact@automobile-rennais.fr" className="text-gold hover:underline">contact@automobile-rennais.fr</a><br />
                  Téléphone : <a href="tel:+33780940002" className="text-gold hover:underline">+33 7 80 94 00 02</a>
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
