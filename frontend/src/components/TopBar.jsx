import { trackCall } from '../api'

const PHONE = import.meta.env.VITE_PHONE_NUMBER || '(415) 696-6969'

export default function TopBar() {
  const handleCallClick = async (e) => {
    e.preventDefault()
    await trackCall()
    window.location.href = `tel:${PHONE}`
  }

  return (
    <header className="bg-[#111111] sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <img
          src="/logo.png"
          alt="Rapid Tire Service"
          className="h-12 object-contain"
          style={{ borderRadius: '15px' }}
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'block'
          }}
        />
        <span
          className="hidden text-[#fed400] font-bold text-xl"
          style={{ display: 'none' }}
        >
          Rapid Tire
        </span>

        <a
          href={`tel:${PHONE}`}
          onClick={handleCallClick}
          className="text-[#fed400] font-bold text-lg tracking-wide hover:opacity-80 transition-opacity"
        >
          {PHONE}
        </a>

        <a
          href={`tel:${PHONE}`}
          onClick={handleCallClick}
          className="bg-[#fed400] text-[#111111] font-bold px-4 py-2 rounded-lg text-sm hover:bg-yellow-300 transition-colors"
        >
          Call Now
        </a>
      </div>
    </header>
  )
}
