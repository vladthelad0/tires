import { trackCall } from '../api'

const PHONE = import.meta.env.VITE_PHONE_NUMBER || '(415) 555-0100'

export default function Footer() {
  const handleCall = async (e) => {
    e.preventDefault()
    await trackCall()
    window.location.href = `tel:${PHONE}`
  }

  return (
    <footer
      className="bg-[#111111] text-white py-12 px-4"
      itemScope
      itemType="https://schema.org/AutoRepair"
    >
      <div className="max-w-4xl mx-auto text-center space-y-4">

        {/* Business name — NAP anchor for local SEO */}
        <p className="text-2xl font-black" itemProp="name">Rapid Tire Service</p>

        {/* Phone — machine-readable for schema */}
        <a
          href={`tel:${PHONE}`}
          onClick={handleCall}
          className="block text-[#fed400] font-black text-3xl hover:opacity-80 transition-opacity"
          itemProp="telephone"
          aria-label={`Call Rapid Tire Service at ${PHONE}`}
        >
          {PHONE}
        </a>

        <div
          className="text-gray-400 text-sm space-y-1"
          itemProp="openingHoursSpecification"
          itemScope
          itemType="https://schema.org/OpeningHoursSpecification"
        >
          <meta itemProp="dayOfWeek" content="Monday Tuesday Wednesday Thursday Friday Saturday Sunday" />
          <meta itemProp="opens" content="07:00" />
          <meta itemProp="closes" content="22:00" />
          <p>Hours: <time>Mon–Sun 7am–10pm</time></p>
          <p itemProp="areaServed">Service Area: San Francisco Bay Area</p>
        </div>

        <div className="border-t border-gray-700 pt-4 mt-6">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} Rapid Tire Service — Mobile Tire Repair San Francisco.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
