import { useState, useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { GoogleMap, Marker } from '@react-google-maps/api'
import { createServiceRequest } from '../api'
import { useMaps } from '../contexts/MapsContext'

const SF_CENTER = { lat: 37.7749, lng: -122.4194 }

const ISSUE_OPTIONS = [
  { value: 'flat_repair', label: 'Flat Repair (screw, plug/patch)' },
  { value: 'locked_out', label: 'Roadside - Locked Out' },
  { value: 'no_fuel', label: 'Roadside - No Fuel' },
  { value: 'jumpstart', label: 'Roadside - Battery Jumpstart' },
  { value: 'tire_replacement', label: 'Tire Replacement / Installation' },
  { value: 'emergency', label: 'Emergency' },
]

export default function ServiceRequestForm({ onSuccess }) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: { issue_type: '' },
  })

  // Coordinates are stored in component state — completely independent from the address text field.
  // Editing the address field never clears markerPos.
  const [markerPos, setMarkerPos] = useState(null)
  const [mapCenter, setMapCenter] = useState(SF_CENTER)
  const [pinError, setPinError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)
  const [apiError, setApiError] = useState('')
  const mapRef = useRef(null)
  const isLoaded = useMaps()

  const onMapLoad = useCallback((map) => {
    mapRef.current = map
  }, [])

  const reverseGeocode = async (lat, lng) => {
    if (!window.google) return
    const geocoder = new window.google.maps.Geocoder()
    try {
      const result = await geocoder.geocode({ location: { lat, lng } })
      if (result.results[0]) {
        setValue('address', result.results[0].formatted_address)
      }
    } catch (e) {}
  }

  const pinLocation = (lat, lng) => {
    const position = { lat, lng }
    setMarkerPos(position)
    setMapCenter(position)
    reverseGeocode(lat, lng)
  }

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        pinLocation(pos.coords.latitude, pos.coords.longitude)
        setLocating(false)
      },
      () => {
        alert('Unable to retrieve your location. Please type your address or tap the map.')
        setLocating(false)
      }
    )
  }

  const handleMarkerDrag = (e) => {
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
    setMarkerPos({ lat, lng })
    reverseGeocode(lat, lng)
  }

  const handleMapClick = (e) => {
    pinLocation(e.latLng.lat(), e.latLng.lng())
  }

  const clearPin = () => {
    setMarkerPos(null)
    setMapCenter(SF_CENTER)
    setPinError(false)
  }

  const onSubmit = async (formData) => {
    // Pin is required — block submission if no coordinates
    if (!markerPos) {
      setPinError(true)
      document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setPinError(false)
    setLoading(true)
    setApiError('')
    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        // Address is auto-filled from reverse geocode but can be manually edited.
        // Coordinates are always the authoritative location.
        address: formData.address.trim(),
        issue_type: formData.issue_type,
        tire_size: formData.tire_size ? formData.tire_size.trim() : '',
        latitude: parseFloat(markerPos.lat.toFixed(7)),
        longitude: parseFloat(markerPos.lng.toFixed(7)),
      }
      const res = await createServiceRequest(payload)
      onSuccess(res.data, markerPos)
    } catch (err) {
      const data = err.response?.data
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        // Show DRF field-level validation errors
        const messages = Object.entries(data)
          .map(([field, msgs]) => {
            const label = field === 'non_field_errors' ? '' : `${field}: `
            return `${label}${Array.isArray(msgs) ? msgs.join(', ') : msgs}`
          })
          .join(' · ')
        setApiError(messages)
      } else {
        setApiError('Something went wrong. Please try again or call us directly.')
      }
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full border border-gray-200 rounded-lg px-4 py-3 text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#fed400] focus:border-transparent text-base'
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1'
  const errorClass = 'text-red-500 text-sm mt-1'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-xl p-6 space-y-5">

      {/* Name */}
      <div>
        <label className={labelClass}>Full Name *</label>
        <input
          {...register('name', { required: 'Name is required' })}
          type="text"
          placeholder="John Smith"
          className={inputClass}
        />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className={labelClass}>Phone Number *</label>
        <input
          {...register('phone', { required: 'Phone number is required' })}
          type="tel"
          placeholder="(415) 555-0100"
          className={inputClass}
        />
        {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
      </div>

      {/* Location — address text and map pin are independent */}
      <div>
        <label className={labelClass}>Your Location *</label>

        {/* Address text row */}
        <div className="flex gap-2">
          <input
            {...register('address', { required: 'Address is required' })}
            type="text"
            placeholder="Your current address or cross streets"
            className={`${inputClass} flex-1`}
            // NOTE: typing here intentionally does NOT move the map pin.
            // Coordinates are only set via Locate Me, map click, or marker drag.
          />
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={locating}
            className="bg-[#111111] text-[#fed400] font-semibold px-4 py-3 rounded-lg whitespace-nowrap hover:bg-[#222222] transition-colors disabled:opacity-50 text-sm"
          >
            {locating ? '...' : '📍 Locate Me'}
          </button>
        </div>
        {errors.address && <p className={errorClass}>{errors.address.message}</p>}

          {/* Pin status — always visible, required for submission */}
        <div id="map-section">
          {markerPos ? (
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-300 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                ✓ Location pinned · {markerPos.lat.toFixed(5)}, {markerPos.lng.toFixed(5)}
              </span>
              <button
                type="button"
                onClick={clearPin}
                className="text-xs text-gray-400 hover:text-red-500 underline transition-colors"
              >
                Clear pin
              </button>
            </div>
          ) : (
            <div className={`mt-2 rounded-lg px-3 py-2 text-sm font-semibold flex items-center gap-2 ${
              pinError
                ? 'bg-red-50 border border-red-400 text-red-700'
                : 'bg-amber-50 border border-amber-300 text-amber-700'
            }`}>
              {pinError ? '✗' : '⚠'} Pin your location on the map before submitting — this is how we find you.
            </div>
          )}
        </div>

        {/* Map */}
        <div
          className="mt-3 rounded-xl overflow-hidden border border-gray-200"
          style={{ height: '240px' }}
        >
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={mapCenter}
              zoom={markerPos ? 15 : 12}
              onLoad={onMapLoad}
              onClick={handleMapClick}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              {markerPos && (
                <Marker
                  position={markerPos}
                  draggable={true}
                  onDragEnd={handleMarkerDrag}
                />
              )}
            </GoogleMap>
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
              Loading map...
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1">
          📍 Tap the map or drag the pin to set your exact location. This is required — your address text alone is not enough.
        </p>
      </div>

      {/* Issue Type */}
      <div>
        <label className={labelClass}>Issue Type *</label>
        <select
          {...register('issue_type', {
            validate: (v) => (v && v !== '') || 'Please select an issue type',
          })}
          className={inputClass}
        >
          <option value="">Select your issue...</option>
          {ISSUE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.issue_type && <p className={errorClass}>{errors.issue_type.message}</p>}
      </div>

      {/* Tire Size */}
      <div>
        <label className={labelClass}>
          Tire Size{' '}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          {...register('tire_size')}
          type="text"
          placeholder="e.g. 225/65R17"
          className={inputClass}
        />
      </div>

      {/* API error display */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm whitespace-pre-wrap">
          {apiError}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#fed400] text-[#111111] font-black text-lg py-4 rounded-xl hover:bg-yellow-300 transition-colors disabled:opacity-60 shadow-lg"
      >
        {loading ? 'Sending Request...' : 'Request Service Now →'}
      </button>
    </form>
  )
}
