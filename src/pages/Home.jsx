import { useEffect } from 'react'
import Hero from '../components/sections/Hero'
import TrustBar from '../components/sections/TrustBar'
import { FeaturedNew, FeaturedUsed } from '../components/sections/FeaturedVehicles'
import FinancingCTA from '../components/sections/FinancingCTA'
import Testimonials from '../components/sections/Testimonials'
import InquiryForm from '../components/sections/InquiryForm'

export default function Home() {
  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash)
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [])

  return (
    <main>
      <Hero />
      <TrustBar />
      <FeaturedNew />
      <FeaturedUsed />
      <FinancingCTA />
      <Testimonials />
      <InquiryForm />
    </main>
  )
}
