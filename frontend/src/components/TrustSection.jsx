import { Zap, Calendar, MapPin, Wrench } from 'lucide-react'

const badges = [
  { icon: <Zap size={28} />, title: 'Fast Response', desc: 'We dispatch immediately upon request' },
  { icon: <Calendar size={28} />, title: 'Same-Day Service', desc: 'Available 7 days a week, 7am–10pm' },
  { icon: <MapPin size={28} />, title: 'Mobile Convenience', desc: 'We come to your exact location' },
  { icon: <Wrench size={28} />, title: 'Professional Equipment', desc: 'Industry-grade tools and tires' },
]

export default function TrustSection() {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-[#111111] text-center mb-10">Why Choose Us</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((b) => (
            <div key={b.title} className="text-center">
              <div className="text-[#fed400] flex justify-center mb-3">{b.icon}</div>
              <h3 className="font-bold text-[#111111] mb-1">{b.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
