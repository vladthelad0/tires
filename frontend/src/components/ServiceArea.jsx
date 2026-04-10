import { GoogleMap, Circle } from '@react-google-maps/api'
import { useMaps } from '../contexts/MapsContext'

const SF_CENTER = { lat: 37.7749, lng: -122.4194 }

const NEIGHBORHOODS = [
  'SOMA', 'Mission District', 'Castro', 'Richmond', 'Sunset',
  'Marina', 'Financial District', 'Tenderloin', 'Bayview',
  'Daly City', 'South San Francisco',
]

export default function ServiceArea() {
  const isLoaded = useMaps()

  return (
    <section className="bg-[#f5f5f5] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-[#111111] text-center mb-4">
          We Serve San Francisco &amp; Surrounding Areas
        </h2>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {NEIGHBORHOODS.map((n) => (
            <span
              key={n}
              className="bg-white border border-gray-200 text-[#111111] text-sm font-medium px-3 py-1.5 rounded-full shadow-sm"
            >
              {n}
            </span>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden shadow-lg" style={{ height: '320px' }}>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={SF_CENTER}
              zoom={11}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                gestureHandling: 'none',
                zoomControl: false,
              }}
            >
              <Circle
                center={SF_CENTER}
                radius={20000}
                options={{
                  fillColor: '#fed400',
                  fillOpacity: 0.15,
                  strokeColor: '#fed400',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                }}
              />
            </GoogleMap>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              Loading map...
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
