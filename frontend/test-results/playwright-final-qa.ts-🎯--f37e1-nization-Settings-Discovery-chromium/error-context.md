# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: playwright-final-qa.ts >> 🎯 COMPREHENSIVE SIDEBAR EXPLORATION >> 1️⃣1️⃣ Organization Settings Discovery
- Location: playwright-final-qa.ts:327:3

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Test source

```ts
  248 |       console.log('TAB 8: REPORTS PAGE');
  249 |       console.log('═══════════════════════════════════════');
  250 | 
  251 |       await page.goto(`${BASE_URL}/reports`, { waitUntil: 'networkidle' });
  252 | 
  253 |       const tables = await page.locator('table').count();
  254 |       const buttons = await page.locator('button').count();
  255 |       const filters = await page.locator('select, input[type="date"]').count();
  256 | 
  257 |       console.log(`✓ Report tables: ${tables}`);
  258 |       console.log(`✓ Action buttons: ${buttons}`);
  259 |       console.log(`✓ Filter controls: ${filters}`);
  260 |       console.log(`✓ Page loads successfully: YES`);
  261 | 
  262 |       expect(buttons).toBeGreaterThan(0);
  263 |     } finally {
  264 |       await page.close();
  265 |     }
  266 |   });
  267 | 
  268 |   /**
  269 |    * TAB 9: Exports
  270 |    */
  271 |   test('9️⃣ Exports Page Discovery', async ({ browser }) => {
  272 |     const page = await getAuthenticatedPage(browser);
  273 | 
  274 |     try {
  275 |       console.log('\n═══════════════════════════════════════');
  276 |       console.log('TAB 9: EXPORTS PAGE');
  277 |       console.log('═══════════════════════════════════════');
  278 | 
  279 |       await page.goto(`${BASE_URL}/exports`, { waitUntil: 'networkidle' });
  280 | 
  281 |       const tables = await page.locator('table, [role="table"]').count();
  282 |       const buttons = await page.locator('button').count();
  283 |       const progress = await page.locator('[role="progressbar"], [class*="progress"]').count();
  284 | 
  285 |       console.log(`✓ Export lists: ${tables}`);
  286 |       console.log(`✓ Action buttons: ${buttons}`);
  287 |       console.log(`✓ Progress indicators: ${progress}`);
  288 |       console.log(`✓ Page loads successfully: YES`);
  289 | 
  290 |       expect(tables).toBeGreaterThan(0);
  291 |     } finally {
  292 |       await page.close();
  293 |     }
  294 |   });
  295 | 
  296 |   /**
  297 |    * TAB 10: API Keys
  298 |    */
  299 |   test('🔟 API Keys Page Discovery', async ({ browser }) => {
  300 |     const page = await getAuthenticatedPage(browser);
  301 | 
  302 |     try {
  303 |       console.log('\n═══════════════════════════════════════');
  304 |       console.log('TAB 10: API KEYS PAGE');
  305 |       console.log('═══════════════════════════════════════');
  306 | 
  307 |       await page.goto(`${BASE_URL}/api-keys`, { waitUntil: 'networkidle' });
  308 | 
  309 |       const tables = await page.locator('table').count();
  310 |       const buttons = await page.locator('button').count();
  311 |       const stats = await page.locator('[class*="usage"], [class*="stat"]').count();
  312 | 
  313 |       console.log(`✓ API key tables: ${tables}`);
  314 |       console.log(`✓ Action buttons: ${buttons}`);
  315 |       console.log(`✓ Usage statistics: ${stats}`);
  316 |       console.log(`✓ Page loads successfully: YES`);
  317 | 
  318 |       expect(tables).toBeGreaterThan(0);
  319 |     } finally {
  320 |       await page.close();
  321 |     }
  322 |   });
  323 | 
  324 |   /**
  325 |    * TAB 11: Organization Settings
  326 |    */
  327 |   test('1️⃣1️⃣ Organization Settings Discovery', async ({ browser }) => {
  328 |     const page = await getAuthenticatedPage(browser);
  329 | 
  330 |     try {
  331 |       console.log('\n═══════════════════════════════════════');
  332 |       console.log('TAB 11: ORGANIZATION SETTINGS PAGE');
  333 |       console.log('═══════════════════════════════════════');
  334 | 
  335 |       await page.goto(`${BASE_URL}/org-settings`, { waitUntil: 'networkidle' });
  336 | 
  337 |       const sections = await page.locator('[class*="section"], fieldset').count();
  338 |       const inputs = await page.locator('input, select, textarea').count();
  339 |       const buttons = await page.locator('button').count();
  340 |       const tables = await page.locator('table').count();
  341 | 
  342 |       console.log(`✓ Settings sections: ${sections}`);
  343 |       console.log(`✓ Input fields: ${inputs}`);
  344 |       console.log(`✓ Action buttons: ${buttons}`);
  345 |       console.log(`✓ Member tables: ${tables}`);
  346 |       console.log(`✓ Page loads successfully: YES`);
  347 | 
> 348 |       expect(sections).toBeGreaterThan(0);
      |                        ^ Error: expect(received).toBeGreaterThan(expected)
  349 |     } finally {
  350 |       await page.close();
  351 |     }
  352 |   });
  353 | 
  354 |   /**
  355 |    * TAB 12: User Settings
  356 |    */
  357 |   test('1️⃣2️⃣ User Settings Discovery', async ({ browser }) => {
  358 |     const page = await getAuthenticatedPage(browser);
  359 | 
  360 |     try {
  361 |       console.log('\n═══════════════════════════════════════');
  362 |       console.log('TAB 12: USER SETTINGS PAGE');
  363 |       console.log('═══════════════════════════════════════');
  364 | 
  365 |       await page.goto(`${BASE_URL}/settings`, { waitUntil: 'networkidle' });
  366 | 
  367 |       const sections = await page.locator('[class*="section"], [class*="card"]').count();
  368 |       const inputs = await page.locator('input, select').count();
  369 |       const toggles = await page.locator('[role="switch"]').count();
  370 |       const buttons = await page.locator('button').count();
  371 | 
  372 |       console.log(`✓ Settings sections: ${sections}`);
  373 |       console.log(`✓ Input fields: ${inputs}`);
  374 |       console.log(`✓ Toggle controls: ${toggles}`);
  375 |       console.log(`✓ Action buttons: ${buttons}`);
  376 |       console.log(`✓ Page loads successfully: YES`);
  377 | 
  378 |       expect(sections).toBeGreaterThan(0);
  379 |     } finally {
  380 |       await page.close();
  381 |     }
  382 |   });
  383 | 
  384 |   /**
  385 |    * VERIFICATION: All Sidebar Navigation
  386 |    */
  387 |   test('🔗 Navigation & Links Verification', async ({ browser }) => {
  388 |     const page = await getAuthenticatedPage(browser);
  389 | 
  390 |     try {
  391 |       console.log('\n═══════════════════════════════════════');
  392 |       console.log('SIDEBAR NAVIGATION VERIFICATION');
  393 |       console.log('═══════════════════════════════════════');
  394 | 
  395 |       // Collect all navigation links
  396 |       const sidebarLinks = await page.locator('[class*="sidebar"] a, nav a').all();
  397 |       const paths: string[] = [];
  398 | 
  399 |       for (let i = 0; i < Math.min(sidebarLinks.length, 12); i++) {
  400 |         try {
  401 |           const link = sidebarLinks[i];
  402 |           const href = await link.getAttribute('href');
  403 |           const text = await link.textContent();
  404 | 
  405 |           if (href && href.startsWith('/')) {
  406 |             paths.push(href);
  407 |             await page.goto(`${BASE_URL}${href}`, { waitUntil: 'load', timeout: 5000 });
  408 | 
  409 |             const mainContent = await page.locator('main, [role="main"]').count();
  410 |             console.log(`✓ ${text?.trim()} [${href}] - Content: ${mainContent > 0 ? 'YES' : 'NO'}`);
  411 |           }
  412 |         } catch (e) {
  413 |           // Skip link if it fails
  414 |         }
  415 |       }
  416 | 
  417 |       console.log(`\nTotal navigable paths: ${paths.length}`);
  418 |     } finally {
  419 |       await page.close();
  420 |     }
  421 |   });
  422 | 
  423 |   /**
  424 |    * EDGE CASES: Responsiveness & Interactions
  425 |    */
  426 |   test('⚡ Edge Cases & Responsiveness', async ({ browser }) => {
  427 |     const page = await getAuthenticatedPage(browser);
  428 | 
  429 |     try {
  430 |       console.log('\n═══════════════════════════════════════');
  431 |       console.log('EDGE CASE TESTING');
  432 |       console.log('═══════════════════════════════════════');
  433 | 
  434 |       // Test 1: Page refresh
  435 |       await page.goto(`${BASE_URL}/users`);
  436 |       await page.reload();
  437 |       const content1 = await page.locator('main, [role="main"]').count();
  438 |       console.log(`✓ Page refresh handled: ${content1 > 0 ? 'YES' : 'NO'}`);
  439 | 
  440 |       // Test 2: Navigation back/forward
  441 |       await page.goto(`${BASE_URL}/`);
  442 |       await page.goto(`${BASE_URL}/users`);
  443 |       await page.goBack();
  444 |       const content2 = await page.locator('main, [role="main"]').count();
  445 |       console.log(`✓ Browser back navigation: ${content2 > 0 ? 'YES' : 'NO'}`);
  446 | 
  447 |       // Test 3: Multiple tab visits
  448 |       const tabs = ['/', '/users', '/api-logs', '/alerts', '/exports'];
```