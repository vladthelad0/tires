import { trackCall } from '../api'

const PHONE = import.meta.env.VITE_PHONE_NUMBER || '(415) 555-0100'

export default function Footer() {
  const handleCall = async (e) => {
    e.preventDefault()
    await trackCall()
    window.location.href = `tel:${PHONE}`
  }

  return (
    <footer className="bg-[#111111] text-white py-12 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h2 className="text-2xl font-black">Rapid Tire Service</h2>
        <a
          href={`tel:${PHONE}`}
          onClick={handleCall}
          className="block text-[#fed400] font-black text-3xl hover:opacity-80 transition-opacity"
        >
          {PHONE}
        </a>
        <div className="text-gray-400 text-sm space-y-1">
          <p>Hours: Mon–Sun 7am–10pm</p>
          <p>Service Area: San Francisco Bay Area</p>
        </div>
        <div className="border-t border-gray-700 pt-4 mt-6">
          <p className="text-gray-600 text-xs">© {new Date().getFullYear()} Rapid Tire Service. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
