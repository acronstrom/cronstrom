import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'

const umamiWebsiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID
if (umamiWebsiteId) {
  const script = document.createElement('script')
  script.defer = true
  script.src = 'https://cloud.umami.is/script.js'
  script.dataset.websiteId = umamiWebsiteId
  document.head.appendChild(script)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
