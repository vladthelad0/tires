import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { MapsProvider } from './contexts/MapsContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MapsProvider>
        <App />
      </MapsProvider>
    </BrowserRouter>
  </React.StrictMode>
)
