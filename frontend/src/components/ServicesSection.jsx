import { Wrench, RefreshCw, Settings, AlertTriangle } from 'lucide-react'

const services = [
  {
    icon: <Wrench size={32} />,
    title: 'Flat Tire Repair',
    desc: 'Plug, patch, or emergency repair on-site — no tow truck needed.',
  },
  {
    icon: <RefreshCw size={32} />,
    title: 'Tire Replacement',
    desc: 'New tires sourced and installed at your location, same day.',
  },
  {
    icon: <Settings size={32} />,
    title: 'Tire Installation',
    desc: 'Mounting and balancing for tires you already have.',
  },
  {
    icon: <AlertTriangle size={32} />,
    title: 'Emergency Roadside',
    desc: 'Stuck on the highway or a parking lot? We come fast.',
  },
]

export default function ServicesSection() {
  return (
    <section className="bg-[#111111] py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-black text-white text-center mb-10">Our Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {services.map((s) => (
            <div
              key={s.title}
              className="bg-[#222222] rounded-2xl p-6 flex flex-col items-center text-center gap-3 hover:bg-[#2a2a2a] transition-colors"
            >
              <div className="text-[#fed400]">{s.icon}</div>
              <h3 className="text-white font-bold text-base">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
