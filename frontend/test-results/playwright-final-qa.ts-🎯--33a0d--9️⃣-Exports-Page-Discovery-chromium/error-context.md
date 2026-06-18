# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: playwright-final-qa.ts >> 🎯 COMPREHENSIVE SIDEBAR EXPLORATION >> 9️⃣ Exports Page Discovery
- Location: playwright-final-qa.ts:271:3

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Test source

```ts
  190 |     try {
  191 |       console.log('\n═══════════════════════════════════════');
  192 |       console.log('TAB 6: AUDIT LOG PAGE');
  193 |       console.log('═══════════════════════════════════════');
  194 | 
  195 |       await page.goto(`${BASE_URL}/audit-log`, { waitUntil: 'networkidle' });
  196 | 
  197 |       const table = await page.locator('table').count();
  198 |       const rows = await page.locator('tbody tr').count();
  199 |       const filters = await page.locator('select, input[type="date"]').count();
  200 | 
  201 |       console.log(`✓ Audit tables: ${table}`);
  202 |       console.log(`✓ Log entries: ${rows}`);
  203 |       console.log(`✓ Filter controls: ${filters}`);
  204 |       console.log(`✓ Page loads successfully: YES`);
  205 | 
  206 |       expect(table).toBeGreaterThan(0);
  207 |     } finally {
  208 |       await page.close();
  209 |     }
  210 |   });
  211 | 
  212 |   /**
  213 |    * TAB 7: Dashboards
  214 |    */
  215 |   test('7️⃣ Dashboard Builder Page Discovery', async ({ browser }) => {
  216 |     const page = await getAuthenticatedPage(browser);
  217 | 
  218 |     try {
  219 |       console.log('\n═══════════════════════════════════════');
  220 |       console.log('TAB 7: DASHBOARD BUILDER PAGE');
  221 |       console.log('═══════════════════════════════════════');
  222 | 
  223 |       await page.goto(`${BASE_URL}/dashboard-builder`, { waitUntil: 'networkidle' });
  224 | 
  225 |       const cards = await page.locator('[class*="dashboard"], [class*="card"]').count();
  226 |       const buttons = await page.locator('button').count();
  227 |       const canvases = await page.locator('canvas').count();
  228 | 
  229 |       console.log(`✓ Dashboard items: ${cards}`);
  230 |       console.log(`✓ Action buttons: ${buttons}`);
  231 |       console.log(`✓ Canvas elements: ${canvases}`);
  232 |       console.log(`✓ Page loads successfully: YES`);
  233 | 
  234 |       expect(buttons).toBeGreaterThan(0);
  235 |     } finally {
  236 |       await page.close();
  237 |     }
  238 |   });
  239 | 
  240 |   /**
  241 |    * TAB 8: Reports
  242 |    */
  243 |   test('8️⃣ Reports Page Discovery', async ({ browser }) => {
  244 |     const page = await getAuthenticatedPage(browser);
  245 | 
  246 |     try {
  247 |       console.log('\n═══════════════════════════════════════');
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
> 290 |       expect(tables).toBeGreaterThan(0);
      |                      ^ Error: expect(received).toBeGreaterThan(expected)
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
  348 |       expect(sections).toBeGreaterThan(0);
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
```