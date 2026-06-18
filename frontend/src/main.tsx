import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// Automatic cache buster - clears cache on every load in development
if (import.meta.env.DEV) {
  // Disable all caching
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name));
    }).catch(() => {});
  }

  // Clear service workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => registration.unregister());
    }).catch(() => {});
  }

  // Override fetch to always use no-cache
  const originalFetch = window.fetch;
  window.fetch = function(...args: any[]) {
    const init = args[1] || {};
    init.cache = 'no-store';
    init.headers = { ...init.headers, 'Cache-Control': 'no-cache, no-store, must-revalidate' };
    return originalFetch(args[0], init);
  };

  // Add cache buster query param to all asset imports
  const originalXHR = window.XMLHttpRequest.prototype.open;
  window.XMLHttpRequest.prototype.open = function(method: string, url: string | URL) {
    if (typeof url === 'string' && !url.includes('?')) {
      arguments[1] = url + '?_cache_bust=' + Date.now();
    } else if (typeof url === 'string') {
      arguments[1] = url + '&_cache_bust=' + Date.now();
    }
    return originalXHR.apply(this, arguments as any);
  };

  console.log('🔄 Development mode: Automatic cache busting enabled');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
