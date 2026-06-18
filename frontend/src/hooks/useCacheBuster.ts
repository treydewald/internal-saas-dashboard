import { useEffect } from 'react';

/**
 * Development hook to automatically clear cache and refresh on every page load
 * This ensures CSS changes from globals.css and other assets are always fresh
 */
export const useCacheBuster = () => {
  useEffect(() => {
    // Only run in development
    if (import.meta.env.DEV) {
      // Prevent caching via headers
      const preventCache = (url: string) => {
        const timeStamp = new Date().getTime();
        const urlWithParam = url.includes('?') ? `${url}&_=${timeStamp}` : `${url}?_=${timeStamp}`;
        return urlWithParam;
      };

      // Fetch CSS files without cache
      const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
      cssLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
          link.setAttribute('href', preventCache(href));
        }
      });

      // Clear localStorage dev cache if needed
      const lastLoadTime = localStorage.getItem('app_last_load_time');
      const currentTime = new Date().getTime();
      if (lastLoadTime) {
        const timeDiff = currentTime - parseInt(lastLoadTime);
        // Force reload every 5 seconds in dev mode for instant updates
        if (timeDiff > 5000) {
          localStorage.setItem('app_last_load_time', currentTime.toString());
          window.location.reload();
        }
      } else {
        localStorage.setItem('app_last_load_time', currentTime.toString());
      }
    }
  }, []);
};

/**
 * Function to manually clear all caches (for use in components)
 */
export const clearAllCaches = async () => {
  if (import.meta.env.DEV) {
    // Clear service worker cache
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }

    // Clear service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      registrations.forEach(registration => registration.unregister());
    }

    console.log('✅ All caches cleared');
  }
};

/**
 * Function to force reload with no-cache headers
 */
export const forceReload = () => {
  // Clear memory cache
  window.location.href = window.location.href;

  // Force hard refresh
  setTimeout(() => {
    window.location.reload();
  }, 100);
};
