import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import VehicleCard from '../ui/VehicleCard'
import { useInventory } from '../../hooks/useInventory'

function VehicleGrid({ vehicles }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {vehicles.map((vehicle, i) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
      ))}
    </div>
  )
}

// ─── Featured New Vehicles ──────────────────────────────────────────────────
export function FeaturedNew() {
  const { featuredNew, newVehicles } = useInventory()
  return (
    <section id="neufs" aria-labelledby="heading-new" className="section-padding bg-black">
      <div className="container-max">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <SectionHeading
            label="Arrivages récents"
            title="Véhicules Neufs"
            subtitle="Découvrez notre sélection de véhicules neufs disponibles immédiatement."
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="shrink-0"
          >
            <Link to="/vehicules/neufs" className="btn-outline text-sm py-2.5 px-5 whitespace-nowrap">
              Tout voir ({newVehicles.length})
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>

        <VehicleGrid vehicles={featuredNew} />
      </div>
    </section>
  )
}

// ─── Featured Used Vehicles ─────────────────────────────────────────────────
export function FeaturedUsed() {
  const { featuredUsed, usedVehicles } = useInventory()
  return (
    <section id="occasion" aria-labelledby="heading-used" className="section-padding bg-surface-1">
      <div className="container-max">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <SectionHeading
            label="Sélection rigoureuse"
            title="Véhicules d'Occasion"
            subtitle="Chaque véhicule est soigneusement inspecté, reconditionnné et garanti."
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="shrink-0"
          >
            <Link to="/vehicules/occasion" className="btn-outline text-sm py-2.5 px-5 whitespace-nowrap">
              Tout voir ({usedVehicles.length})
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>

        <VehicleGrid vehicles={featuredUsed} />

        {/* Certified badge explainer */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 p-4 sm:p-5 bg-surface-2 border border-border rounded-sm flex flex-col sm:flex-row items-start sm:items-center gap-3"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gold/10 border border-gold/20 shrink-0">
            <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-text-primary font-sans font-semibold text-sm">Véhicule certifié AUTOMOBILE RENNAIS</p>
            <p className="text-text-muted font-sans text-xs mt-0.5 leading-relaxed">
              Inspection 150 points · Historique Carfax / SIV complet · Garantie 12 mois incluse · Financement disponible dès le jour J
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
