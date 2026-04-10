import { useState } from 'react'
import TopBar from '../components/TopBar'
import HeroBanner from '../components/HeroBanner'
import ServiceRequestForm from '../components/ServiceRequestForm'
import ServiceTracker from '../components/ServiceTracker'
import ServicesSection from '../components/ServicesSection'
import HowItWorks from '../components/HowItWorks'
import ServiceArea from '../components/ServiceArea'
import TrustSection from '../components/TrustSection'
import ReviewsSection from '../components/ReviewsSection'
import UrgencyBar from '../components/UrgencyBar'
import Footer from '../components/Footer'

export default function HomePage() {
  const [submittedTicket, setSubmittedTicket] = useState(null)
  const [submittedLocation, setSubmittedLocation] = useState(null)

  const handleFormSuccess = (ticketData, location) => {
    setSubmittedTicket(ticketData)
    setSubmittedLocation(location)
    document.getElementById('service-form-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <HeroBanner />
      <section id="service-form-section" className="py-12 px-4 bg-[#f5f5f5]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#111111] mb-8">
            Request Service Now
          </h2>
          {submittedTicket ? (
            <ServiceTracker
              ticket={submittedTicket}
              location={submittedLocation}
            />
          ) : (
            <ServiceRequestForm onSuccess={handleFormSuccess} />
          )}
        </div>
      </section>
      <ServicesSection />
      <HowItWorks />
      <ServiceArea />
      <TrustSection />
      <ReviewsSection />
      <UrgencyBar />
      <Footer />
    </div>
  )
}
