import { trackCall } from '../api'

const PHONE = import.meta.env.VITE_PHONE_NUMBER || '(415) 555-0100'

export default function UrgencyBar() {
  const handleCall = async (e) => {
    e.preventDefault()
    await trackCall()
    window.location.href = `tel:${PHONE}`
  }

  return (
    <div className="bg-[#fed400] py-4 px-4 text-center">
      <p className="font-bold text-[#111111] text-base">
        Available Today · Limited Same-Day Slots ·{' '}
        <a
          href={`tel:${PHONE}`}
          onClick={handleCall}
          className="underline font-black"
        >
          Call Now for Fastest Response: {PHONE}
        </a>
      </p>
    </div>
  )
}
