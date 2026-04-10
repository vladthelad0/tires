// TODO: Replace with real reviews

const reviews = [
  {
    name: 'Michael T.',
    text: 'Got a flat on the Bay Bridge approach and they were there in under 30 minutes. Absolutely lifesaving. Highly recommend.',
    rating: 5,
  },
  {
    name: 'Sarah K.',
    text: 'Called at 8pm on a Sunday — they still came out. Fixed my flat in the parking garage quickly and professionally.',
    rating: 5,
  },
  {
    name: 'David R.',
    text: 'Super convenient, fair price, and they texted updates the whole time. This is how service should work.',
    rating: 5,
  },
]

export default function ReviewsSection() {
  return (
    <section className="bg-[#f5f5f5] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-[#111111] text-center mb-10">What Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r.name} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-[#fed400] text-lg mb-3">{'★'.repeat(r.rating)}</div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">"{r.text}"</p>
              <p className="font-bold text-[#111111] text-sm">— {r.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
