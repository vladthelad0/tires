import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TrackPage from './pages/TrackPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/track/:ticketCode" element={<TrackPage />} />
    </Routes>
  )
}
