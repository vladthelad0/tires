import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GoogleMap, Marker } from '@react-google-maps/api'
import { getServiceRequest, trackCall } from '../api'
import StatusTracker from './StatusTracker'
import { Phone } from 'lucide-react'
import { useMaps } from '../contexts/MapsContext'

const PHONE = import.meta.env.VITE_PHONE_NUMBER || '(415) 555-0100'

export default function ServiceTracker({ ticket, location }) {
  const [status, setStatus] = useState(ticket.status)
  const [statusNote, setStatusNote] = useState('')
  const isLoaded = useMaps()

  useEffect(() => {
    const fetchUpdate = async () => {
      try {
        const res = await getServiceRequest(ticket.ticket_code)
        setStatus(res.data.status)
        setStatusNote(res.data.status_note || '')
      } catch {}
    }

    const interval = setInterval(fetchUpdate, 30000)
    return () => clearInterval(interval)
  }, [ticket.ticket_code])

  const handleCall = async () => {
    await trackCall()
    window.location.href = `tel:${PHONE}`
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Confirmation banner */}
      <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-5 text-center">
        <div className="text-3xl mb-2">✅</div>
        <h3 className="font-black text-xl text-green-800">Your request was received!</h3>
        <p className="text-green-700 font-bold text-lg mt-1">Ticket #{ticket.ticket_code}</p>
        <p className="text-green-600 text-sm mt-2">
          Save this code or bookmark this page to check your status
        </p>
        <Link
          to={`/track/${ticket.ticket_code}`}
          className="inline-block mt-3 text-sm text-green-700 underline font-semibold"
        >
          View at /track/{ticket.ticket_code} →
        </Link>
      </div>

      {/* Status tracker */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-bold text-lg mb-5">Service Progress</h3>
        <StatusTracker status={status} />
        {statusNote && (
          <div className="mt-4 p-4 bg-[#f5f5f5] rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-1">Technician Note:</p>
            <p className="text-gray-800 text-sm">{statusNote}</p>
          </div>
        )}
        <p className="text-xs text-gray-400 mt-4 text-center">Updates automatically every 30 seconds</p>
      </div>

      {/* Map */}
      {location && isLoaded && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-lg mb-3">Your Location</h3>
          <div className="rounded-xl overflow-hidden" style={{ height: '200px' }}>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={location}
              zoom={15}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                zoomControl: false,
                draggable: false,
              }}
            >
              <Marker position={location} />
            </GoogleMap>
          </div>
        </div>
      )}

      {/* Call CTA */}
      <div className="bg-[#111111] rounded-2xl p-5 text-center">
        <p className="text-white font-semibold mb-3">Still need to call?</p>
        <button
          onClick={handleCall}
          className="bg-[#fed400] text-[#111111] font-black px-8 py-3 rounded-xl flex items-center gap-2 mx-auto"
        >
          <Phone size={18} />
          {PHONE}
        </button>
      </div>
    </div>
  )
}
