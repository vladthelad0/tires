export default function HowItWorks() {
  const steps = [
    { num: '1', title: 'Call or Submit Request', desc: 'Call us directly or fill out the quick form with your location and issue.' },
    { num: '2', title: 'We Come to You', desc: 'A technician is dispatched to your exact location — no towing required.' },
    { num: '3', title: 'Back on the Road', desc: 'We fix the problem on-site and get you moving again, fast.' },
  ]

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-[#111111] text-center mb-10">How It Works</h2>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {steps.map((step, i) => (
            <div key={i} className="flex-1 text-center">
              <div className="w-16 h-16 bg-[#fed400] text-[#111111] font-black text-2xl rounded-full flex items-center justify-center mx-auto mb-4">
                {step.num}
              </div>
              <h3 className="font-bold text-lg text-[#111111] mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
