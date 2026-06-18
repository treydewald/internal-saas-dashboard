import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// Development mode: Clear HTTP caches to ensure fresh asset delivery
if (import.meta.env.DEV) {
  // Clear service workers and HTTP caches asynchronously (non-blocking)
  (async () => {
    try {
      // Unregister service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        registrations.forEach(reg => reg.unregister());
      }

      // Clear browser HTTP caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
    } catch (e) {
      // Silently fail - caching issues shouldn't break the app
    }
  })();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
