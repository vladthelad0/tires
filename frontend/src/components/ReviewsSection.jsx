// TODO: Replace with real reviews — also update the review JSON-LD in index.html when you do

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
    <section className="bg-[#f5f5f5] py-16 px-4" aria-label="Customer reviews">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-[#111111] text-center mb-2">
          What San Francisco Drivers Say
        </h2>
        <p className="text-center text-gray-500 text-sm mb-10">
          ★★★★★ Rated 5/5 by local customers
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <article
              key={r.name}
              className="bg-white rounded-2xl p-6 shadow-sm"
              itemScope
              itemType="https://schema.org/Review"
            >
              <div
                className="text-[#fed400] text-lg mb-3"
                aria-label={`${r.rating} out of 5 stars`}
              >
                <span
                  itemProp="reviewRating"
                  itemScope
                  itemType="https://schema.org/Rating"
                >
                  <meta itemProp="ratingValue" content={String(r.rating)} />
                  <meta itemProp="bestRating" content="5" />
                </span>
                {'★'.repeat(r.rating)}
              </div>
              <p
                className="text-gray-700 text-sm leading-relaxed mb-4"
                itemProp="reviewBody"
              >
                "{r.text}"
              </p>
              <p className="font-bold text-[#111111] text-sm">
                <span
                  itemProp="author"
                  itemScope
                  itemType="https://schema.org/Person"
                >
                  — <span itemProp="name">{r.name}</span>
                </span>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
