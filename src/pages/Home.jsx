import Hero from '../components/sections/Hero'
import TrustBar from '../components/sections/TrustBar'
import { FeaturedNew, FeaturedUsed } from '../components/sections/FeaturedVehicles'
import FinancingCTA from '../components/sections/FinancingCTA'
import Testimonials from '../components/sections/Testimonials'
import InquiryForm from '../components/sections/InquiryForm'

export default function Home() {
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
