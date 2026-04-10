import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getServiceRequest } from '../api'
import { trackCall } from '../api'
import StatusTracker from '../components/StatusTracker'
import { Phone } from 'lucide-react'

const PHONE = import.meta.env.VITE_PHONE_NUMBER || '(415) 555-0100'

export default function TrackPage() {
  const { ticketCode } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const fetchTicket = async () => {
    try {
      const res = await getServiceRequest(ticketCode)
      setData(res.data)
      setNotFound(false)
    } catch (err) {
      if (err.response?.status === 404) setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTicket()
    const interval = setInterval(fetchTicket, 30000)
    return () => clearInterval(interval)
  }, [ticketCode])

  const handleCall = async () => {
    await trackCall()
    window.location.href = `tel:${PHONE}`
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="bg-[#111111] px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <Link to="/">
          <img src="/logo.png" alt="Rapid Tire Service" className="h-10 object-contain" style={{ borderRadius: '15px' }} />
        </Link>
        <button
          onClick={handleCall}
          className="bg-[#fed400] text-[#111111] font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          <Phone size={16} />
          Call Now
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-[#fed400] border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-500">Loading your ticket...</p>
          </div>
        )}

        {!loading && notFound && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-[#111111] mb-2">Ticket Not Found</h1>
            <p className="text-gray-600 mb-6">
              We couldn't find ticket <strong>{ticketCode}</strong>. Please check the code and try again.
            </p>
            <Link
              to="/"
              className="inline-block bg-[#fed400] text-[#111111] font-bold px-6 py-3 rounded-lg"
            >
              Go Back Home
            </Link>
          </div>
        )}

        {!loading && data && (
          <div className="space-y-6">
            <div className="bg-[#111111] text-white rounded-xl p-6">
              <p className="text-[#fed400] font-semibold text-sm uppercase tracking-wide mb-1">Ticket Status</p>
              <h1 className="text-2xl font-bold">#{data.ticket_code}</h1>
              <p className="text-gray-400 mt-1 text-sm">
                Submitted {new Date(data.created_at).toLocaleString()}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-lg mb-4">Service Progress</h2>
              <StatusTracker status={data.status} />
              {data.status_note && (
                <div className="mt-4 p-4 bg-[#f5f5f5] rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Technician Note:</p>
                  <p className="text-gray-800">{data.status_note}</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-lg mb-3">Request Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium">{data.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Service Type</span>
                  <span className="font-medium capitalize">{data.issue_type?.replace(/_/g, ' ')}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#fed400] rounded-xl p-6 text-center">
              <p className="font-bold text-[#111111] mb-3">Questions? Call us now</p>
              <button
                onClick={handleCall}
                className="bg-[#111111] text-white font-bold px-8 py-3 rounded-lg flex items-center gap-2 mx-auto"
              >
                <Phone size={18} />
                {PHONE}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
