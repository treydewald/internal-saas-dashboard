import { useEffect } from 'react';

/**
 * Development hook to clear HTTP caches only (don't interfere with app state or HMR)
 *
 * WARNING: Clearing localStorage/sessionStorage/IndexedDB/cookies breaks HMR (hot reload)
 * and can interfere with development. Only clear browser HTTP caches.
 */
const performHttpCacheClear = async () => {
  if (!import.meta.env.DEV) return;

  try {
    // Only clear HTTP caches and service workers
    // Do NOT clear localStorage, sessionStorage, IndexedDB, or cookies as these break HMR

    // 1. Unregister service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      registrations.forEach(registration => registration.unregister());
    }

    // 2. Clear browser HTTP caches only
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }

    console.log('✅ HTTP cache cleared (HMR-safe)');
  } catch (error) {
    console.error('Error during cache clear:', error);
  }
};

/**
 * Development hook to clear HTTP caches on initial load only
 * Do NOT run on visibility changes as this breaks hot module replacement (HMR)
 */
export const useCacheBuster = () => {
  useEffect(() => {
    // Only clear caches once on initial load
    performHttpCacheClear();
  }, []); // Empty dependency array - runs only once
};

/**
 * Manually trigger HTTP cache clear (safe for HMR)
 */
export const clearHttpCaches = async () => {
  await performHttpCacheClear();
};
