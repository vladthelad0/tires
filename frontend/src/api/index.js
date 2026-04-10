import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const createServiceRequest = (data) =>
  api.post('/api/service-request/', data)

export const getServiceRequest = (ticketCode) =>
  api.get(`/api/service-request/${ticketCode}/`)

export const trackCall = () =>
  api.post('/api/track/call/').catch(() => {})

export default api
