import { useEffect } from 'react';

/**
 * Comprehensive cache clearing - equivalent to:
 * 1. DevTools Application tab → Clear all site data
 * 2. DevTools Network tab → Check "Disable cache"
 * 3. Hard refresh (Ctrl+Shift+R)
 */
const performFullCacheClear = async () => {
  if (!import.meta.env.DEV) return;

  try {
    // 1. Clear all storage
    localStorage.clear();
    sessionStorage.clear();

    // 2. Clear IndexedDB
    if (window.indexedDB) {
      const dbs = await (window as any).indexedDB.databases?.() || [];
      dbs.forEach((db: any) => {
        try {
          window.indexedDB.deleteDatabase(db.name);
        } catch (e) {}
      });
    }

    // 3. Clear all service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      registrations.forEach(registration => registration.unregister());
    }

    // 4. Clear browser caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }

    // 5. Clear cookies
    document.cookie.split(";").forEach(c => {
      const name = c.split("=")[0];
      document.cookie = `${name}=;expires=${new Date(0).toUTCString()};path=/`;
    });

    // 6. Add cache-bust params to all assets
    const timestamp = Date.now();
    document.querySelectorAll('link[rel="stylesheet"]').forEach(el => {
      const href = el.getAttribute('href');
      if (href && !href.includes('_bust=')) {
        const sep = href.includes('?') ? '&' : '?';
        el.setAttribute('href', `${href}${sep}_bust=${timestamp}`);
      }
    });

    console.log('✅ Full cache clear completed');
  } catch (error) {
    console.error('Error during cache clear:', error);
  }
};

/**
 * Development hook to clear all caches on every page load
 * Equivalent to: DevTools → Application → Clear all + Network → Disable cache + Hard refresh
 */
export const useCacheBuster = () => {
  useEffect(() => {
    performFullCacheClear();
  }, []);

  // Also clear cache when page becomes visible (tab switch)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        performFullCacheClear();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);
};

/**
 * Manually trigger full cache clear
 */
export const clearAllCaches = async () => {
  await performFullCacheClear();
};

/**
 * Force reload with all caches cleared
 */
export const forceReload = async () => {
  await performFullCacheClear();
  // Hard refresh equivalent (Ctrl+Shift+R)
  setTimeout(() => {
    window.location.href = window.location.href + '?_force_refresh=' + Date.now();
  }, 100);
};
