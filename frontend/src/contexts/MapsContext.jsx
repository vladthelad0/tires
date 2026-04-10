import { createContext, useContext } from 'react'
import { useJsApiLoader } from '@react-google-maps/api'

const LIBRARIES = ['places']
const MapsContext = createContext(false)

export function MapsProvider({ children }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: LIBRARIES,
  })

  return <MapsContext.Provider value={isLoaded}>{children}</MapsContext.Provider>
}

export function useMaps() {
  return useContext(MapsContext)
}
