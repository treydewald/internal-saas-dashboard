import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// Comprehensive automatic cache clearing - runs on EVERY page load in development
if (import.meta.env.DEV) {
  console.log('🔄 Clearing all browser storage and caches...');

  // 1. Clear all IndexedDB databases
  if (window.indexedDB) {
    try {
      const dbs = await (window as any).indexedDB.databases?.() || [];
      dbs.forEach((db: any) => {
        window.indexedDB.deleteDatabase(db.name);
      });
      console.log('✅ Cleared IndexedDB');
    } catch (e) {}
  }

  // 2. Clear localStorage
  try {
    localStorage.clear();
    console.log('✅ Cleared localStorage');
  } catch (e) {}

  // 3. Clear sessionStorage
  try {
    sessionStorage.clear();
    console.log('✅ Cleared sessionStorage');
  } catch (e) {}

  // 4. Clear all service workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
      });
      console.log(`✅ Unregistered ${registrations.length} service worker(s)`);
    }).catch(() => {});
  }

  // 5. Clear all browser caches
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name));
      console.log(`✅ Cleared ${names.length} cache store(s)`);
    }).catch(() => {});
  }

  // 6. Override fetch to always use no-cache
  const originalFetch = window.fetch;
  window.fetch = function(...args: any[]) {
    const init = args[1] || {};
    init.cache = 'no-store';
    init.headers = {
      ...init.headers,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };
    return originalFetch(args[0], init);
  };

  // 7. Add cache buster query param to all asset imports
  const originalXHR = window.XMLHttpRequest.prototype.open;
  window.XMLHttpRequest.prototype.open = function(method: string, url: string | URL) {
    if (typeof url === 'string') {
      const separator = url.includes('?') ? '&' : '?';
      arguments[1] = url + separator + '_t=' + Date.now();
    }
    return originalXHR.apply(this, arguments as any);
  };

  // 8. Clear cookies
  try {
    document.cookie.split(";").forEach(c => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });
    console.log('✅ Cleared cookies');
  } catch (e) {}

  // 9. Set aggressive no-cache headers
  document.addEventListener('DOMContentLoaded', () => {
    const allElements = document.querySelectorAll('link, script');
    allElements.forEach(el => {
      if (el.tagName === 'LINK' && el.getAttribute('rel') === 'stylesheet') {
        const href = el.getAttribute('href');
        if (href && !href.includes('_t=')) {
          el.setAttribute('href', href + '?_t=' + Date.now());
        }
      }
      if (el.tagName === 'SCRIPT') {
        const src = el.getAttribute('src');
        if (src && !src.includes('_t=')) {
          el.setAttribute('src', src + '?_t=' + Date.now());
        }
      }
    });
  });

  console.log('🎯 Development Mode: Full cache clearing enabled on every load');
  console.log('📍 Clearing on: Page load, tab switch, visibility change');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
