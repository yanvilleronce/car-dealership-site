import { useEffect } from 'react'
import { motion } from 'framer-motion'
import VehicleCard from '../components/ui/VehicleCard'
import { useInventory } from '../hooks/useInventory'

const pageConfig = {
  all: {
    title: 'Notre Inventaire',
    subtitle: 'Découvrez l\'ensemble de nos véhicules neufs et d\'occasion de prestige.',
    label: 'Tous nos véhicules',
  },
  new: {
    title: 'Véhicules Neufs',
    subtitle: 'Découvrez notre sélection de véhicules neufs disponibles immédiatement.',
    label: 'Véhicules neufs',
  },
  used: {
    title: 'Véhicules d\'Occasion',
    subtitle: 'Chaque véhicule est soigneusement inspecté, reconditionné et garanti.',
    label: 'Véhicules d\'occasion',
  },
}

export default function InventoryPage({ type = 'all' }) {
  const { allAvailable, newVehicles, usedVehicles } = useInventory()

  const config = pageConfig[type] || pageConfig.all
  const vehicles = type === 'new' ? newVehicles : type === 'used' ? usedVehicles : allAvailable

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [type])

  return (
    <main className="bg-black">
      <div className="pt-28 sm:pt-32 pb-8 sm:pb-12">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-gold font-sans text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              {config.label}
            </p>
            <h1 className="font-serif text-display-sm sm:text-display-md text-white mb-3">
              {config.title}
            </h1>
            <p className="text-text-muted font-sans text-sm sm:text-base max-w-xl">
              {config.subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 mb-6"
          >
            <p className="text-text-muted font-sans text-xs">
              {vehicles.length} véhicule{vehicles.length !== 1 ? 's' : ''}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-max px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        {vehicles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-muted font-sans text-sm">Aucun véhicule trouvé.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {vehicles.map((vehicle, i) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
