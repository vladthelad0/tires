const STEPS = [
  { key: 'received', label: 'Received' },
  { key: 'assigned', label: 'Technician Assigned' },
  { key: 'en_route', label: 'En Route' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
]

const STATUS_ORDER = {
  received: 0,
  assigned: 1,
  en_route: 2,
  in_progress: 3,
  completed: 4,
  cancelled: -1,
}

export default function StatusTracker({ status }) {
  if (status === 'cancelled') {
    return (
      <div className="text-center py-4">
        <div className="inline-block bg-red-100 text-red-700 font-bold px-6 py-3 rounded-full">
          ✗ Request Cancelled
        </div>
      </div>
    )
  }

  const currentIndex = STATUS_ORDER[status] ?? 0

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => {
          const isCompleted = i < currentIndex
          const isCurrent = i === currentIndex
          const isPending = i > currentIndex

          return (
            <div key={step.key} className="flex flex-col items-center flex-1 relative">
              {i < STEPS.length - 1 && (
                <div
                  className="absolute top-4 left-1/2 w-full h-0.5 z-0"
                  style={{
                    backgroundColor: isCompleted || isCurrent ? '#fed400' : '#e5e7eb',
                  }}
                />
              )}
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                  isCompleted
                    ? 'bg-[#fed400] border-[#fed400] text-[#111111]'
                    : isCurrent
                    ? 'bg-[#111111] border-[#fed400] text-[#fed400]'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {isCompleted ? '✓' : i + 1}
              </div>
              <p
                className={`mt-2 text-xs text-center leading-tight max-w-[60px] ${
                  isCurrent ? 'font-bold text-[#111111]' : isPending ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {step.label}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
