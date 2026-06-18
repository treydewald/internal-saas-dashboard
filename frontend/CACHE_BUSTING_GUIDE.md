# Automatic Cache Busting Guide

## Overview

The development environment now has **automatic cache busting** enabled. This ensures that CSS changes from `globals.css` and other assets are always fresh and visible without manual cache clearing.

---

## How It Works

### 1. HTML Meta Tags (index.html)
Cache-control meta tags prevent the browser from caching the main HTML file:
```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

### 2. Development-Mode Cache Buster (main.tsx)
When running in development mode (`import.meta.env.DEV`), the following automatic actions occur:

- **Service Worker Cleanup**: Unregisters all active service workers
- **Browser Cache Clearing**: Clears all cached storage
- **Fetch Interception**: All fetch requests use `cache: 'no-store'`
- **Cache-Busting Headers**: Adds `Cache-Control` header to all requests
- **XHR Interception**: Adds timestamp query parameters to all XMLHttpRequest calls
- **Console Notification**: Logs "Development mode: Automatic cache busting enabled"

### 3. Component-Level Cache Buster (useCacheBuster hook)
The `useCacheBuster` hook provides:
- Prevents CSS link caching with timestamps
- Clears localStorage development cache every 5 seconds
- Force reloads when cache becomes stale
- Provides utility functions for manual cache clearing

### 4. App-Level Cache Management (App.tsx)
The `AppShell` component uses `useCacheBuster()` to ensure cache is cleared globally across all page navigation.

---

## What You'll Notice

✅ **CSS Changes Applied Instantly**: Changes to `globals.css` appear without manual refresh  
✅ **No Stale Assets**: JavaScript and CSS files always load the latest version  
✅ **Console Message**: Dev mode logs cache busting status  
✅ **Automatic Cleanup**: Service workers and old caches are cleaned up silently  
✅ **Timestamp Headers**: All requests include cache-bust timestamps  

---

## For Developers

### Using Cache Buster Utilities

If you need to manually clear caches in a component:

```tsx
import { clearAllCaches, forceReload } from '@/hooks/useCacheBuster';

// Clear all caches programmatically
await clearAllCaches();

// Force a complete reload with no-cache headers
forceReload();
```

### Using the Hook

To add cache busting to any component:

```tsx
import { useCacheBuster } from '@/hooks/useCacheBuster';

export function MyComponent() {
  useCacheBuster(); // Cache is now busted for this component

  return <div>Content always stays fresh</div>;
}
```

---

## Production Notes

⚠️ **Important**: Cache busting is **ONLY ACTIVE IN DEVELOPMENT MODE**

The cache-busting code checks `import.meta.env.DEV` and only runs during development. In production:
- Normal browser caching applies
- Service workers work normally
- HTTP cache headers control caching behavior

This ensures optimal performance in production while maintaining instant refresh during development.

---

## Troubleshooting

### CSS Changes Still Not Showing

1. **Stop dev server**: Press `Ctrl+C` in the terminal
2. **Clear all browser data**: DevTools → Application → Clear all
3. **Restart dev server**: `npm run dev`
4. **Hard refresh**: `Ctrl+Shift+R`

### Still Seeing Old Styles

- Check browser DevTools Network tab
- Ensure responses show `Cache-Control: no-cache, no-store`
- Verify `_cache_bust` timestamp in query parameters
- Check Console for cache busting confirmation message

### Want to Manually Trigger Reload

Press `F5` or `Ctrl+R` for a normal reload - the cache buster will automatically apply fresh assets.

---

## Technical Details

### Files Modified
- `index.html` - Added cache-control meta tags
- `src/main.tsx` - Added development-mode cache buster
- `src/App.tsx` - Added useCacheBuster hook
- `src/hooks/useCacheBuster.ts` - Created cache management utilities

### Cache Buster Scope
The cache buster affects:
- CSS stylesheets
- JavaScript modules
- API requests
- Image assets
- Font files
- Any resource loaded via fetch or XMLHttpRequest

### Performance Impact
- **Development**: Minimal (adds timestamps to requests)
- **Production**: None (code is completely stripped)

---

## Summary

You now have **fully automatic cache management** in development. Simply:

1. **Make changes** to CSS, components, or assets
2. **Save the file** (auto-compile via Vite)
3. **Refresh browser** (manual refresh will get fresh assets automatically)

The cache buster ensures you always see the latest version of your code during development! 🎉

No more "clear cache and hard refresh" needed.
