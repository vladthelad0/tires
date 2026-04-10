import { trackCall } from '../api'

const PHONE = import.meta.env.VITE_PHONE_NUMBER || '(415) 555-0100'

export default function HeroBanner() {
  const handleCallClick = async (e) => {
    e.preventDefault()
    await trackCall()
    window.location.href = `tel:${PHONE}`
  }

  const scrollToForm = () => {
    document.getElementById('service-form-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center items-center text-white text-center px-4"
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 40%, #111111 100%)',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="inline-block bg-[#fed400] text-[#111111] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-2">
          Mobile Tire Service — San Francisco
        </div>

        <h1 className="text-4xl md:text-6xl font-black leading-tight">
          Flat Tire?{' '}
          <span className="text-[#fed400]">We Come to You</span>
          {' '}— Fast
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto">
          Mobile tire repair and replacement in San Francisco. Same-day service available.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <a
            href={`tel:${PHONE}`}
            onClick={handleCallClick}
            className="bg-[#fed400] text-[#111111] font-black text-lg px-8 py-4 rounded-xl hover:bg-yellow-300 transition-all shadow-lg"
          >
            📞 Call Now
          </a>
          <button
            onClick={scrollToForm}
            className="border-2 border-white text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-white hover:text-[#111111] transition-all"
          >
            Request Service
          </button>
        </div>

        <div className="mt-8 bg-red-600/90 backdrop-blur-sm rounded-xl p-4 max-w-lg mx-auto">
          <p className="font-bold text-white">
            ⚡ Need help right now? Call immediately — we answer fast.
          </p>
          <a
            href={`tel:${PHONE}`}
            onClick={handleCallClick}
            className="text-[#fed400] font-black text-xl"
          >
            {PHONE}
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 animate-bounce">
        <svg className="w-6 h-6 text-white opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
