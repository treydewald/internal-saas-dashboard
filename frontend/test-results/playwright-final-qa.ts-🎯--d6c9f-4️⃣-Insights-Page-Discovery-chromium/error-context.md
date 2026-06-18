# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: playwright-final-qa.ts >> 🎯 COMPREHENSIVE SIDEBAR EXPLORATION >> 4️⃣ Insights Page Discovery
- Location: playwright-final-qa.ts:131:3

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Test source

```ts
  50  |       console.log('═══════════════════════════════════════');
  51  | 
  52  |       await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  53  | 
  54  |       // Discover elements
  55  |       const kpiCards = await page.locator('[class*="kpi"], [class*="metric"], [class*="card"]').count();
  56  |       const charts = await page.locator('canvas, svg[role="img"]').count();
  57  |       const header = await page.locator('[class*="header"]').count();
  58  | 
  59  |       console.log(`✓ KPI Cards found: ${kpiCards}`);
  60  |       console.log(`✓ Charts found: ${charts}`);
  61  |       console.log(`✓ Header elements: ${header}`);
  62  |       console.log(`✓ Page loads successfully: YES`);
  63  | 
  64  |       expect(header).toBeGreaterThan(0);
  65  |     } finally {
  66  |       await page.close();
  67  |     }
  68  |   });
  69  | 
  70  |   /**
  71  |    * TAB 2: Users
  72  |    */
  73  |   test('2️⃣ Users Page Discovery', async ({ browser }) => {
  74  |     const page = await getAuthenticatedPage(browser);
  75  | 
  76  |     try {
  77  |       console.log('\n═══════════════════════════════════════');
  78  |       console.log('TAB 2: USERS PAGE');
  79  |       console.log('═══════════════════════════════════════');
  80  | 
  81  |       await page.goto(`${BASE_URL}/users`, { waitUntil: 'networkidle' });
  82  | 
  83  |       const table = await page.locator('table, [role="table"]').count();
  84  |       const inputs = await page.locator('input[type="text"], input[placeholder]').count();
  85  |       const selects = await page.locator('select').count();
  86  |       const buttons = await page.locator('button').count();
  87  | 
  88  |       console.log(`✓ Tables found: ${table}`);
  89  |       console.log(`✓ Search inputs: ${inputs}`);
  90  |       console.log(`✓ Filter dropdowns: ${selects}`);
  91  |       console.log(`✓ Action buttons: ${buttons}`);
  92  |       console.log(`✓ Page loads successfully: YES`);
  93  | 
  94  |       expect(table).toBeGreaterThan(0);
  95  |     } finally {
  96  |       await page.close();
  97  |     }
  98  |   });
  99  | 
  100 |   /**
  101 |    * TAB 3: API Logs
  102 |    */
  103 |   test('3️⃣ API Logs Page Discovery', async ({ browser }) => {
  104 |     const page = await getAuthenticatedPage(browser);
  105 | 
  106 |     try {
  107 |       console.log('\n═══════════════════════════════════════');
  108 |       console.log('TAB 3: API LOGS PAGE');
  109 |       console.log('═══════════════════════════════════════');
  110 | 
  111 |       await page.goto(`${BASE_URL}/api-logs`, { waitUntil: 'networkidle' });
  112 | 
  113 |       const table = await page.locator('table').count();
  114 |       const dateInputs = await page.locator('input[type="date"]').count();
  115 |       const filters = await page.locator('select, [class*="filter"]').count();
  116 | 
  117 |       console.log(`✓ Log tables: ${table}`);
  118 |       console.log(`✓ Date range pickers: ${dateInputs}`);
  119 |       console.log(`✓ Filter controls: ${filters}`);
  120 |       console.log(`✓ Page loads successfully: YES`);
  121 | 
  122 |       expect(table).toBeGreaterThan(0);
  123 |     } finally {
  124 |       await page.close();
  125 |     }
  126 |   });
  127 | 
  128 |   /**
  129 |    * TAB 4: Insights
  130 |    */
  131 |   test('4️⃣ Insights Page Discovery', async ({ browser }) => {
  132 |     const page = await getAuthenticatedPage(browser);
  133 | 
  134 |     try {
  135 |       console.log('\n═══════════════════════════════════════');
  136 |       console.log('TAB 4: INSIGHTS PAGE');
  137 |       console.log('═══════════════════════════════════════');
  138 | 
  139 |       await page.goto(`${BASE_URL}/insights`, { waitUntil: 'networkidle' });
  140 | 
  141 |       const cards = await page.locator('[class*="card"], [class*="insight"]').count();
  142 |       const charts = await page.locator('canvas, svg').count();
  143 |       const buttons = await page.locator('button').count();
  144 | 
  145 |       console.log(`✓ Insight cards: ${cards}`);
  146 |       console.log(`✓ Charts/visualizations: ${charts}`);
  147 |       console.log(`✓ Interactive buttons: ${buttons}`);
  148 |       console.log(`✓ Page loads successfully: YES`);
  149 | 
> 150 |       expect(cards).toBeGreaterThan(0);
      |                     ^ Error: expect(received).toBeGreaterThan(expected)
  151 |     } finally {
  152 |       await page.close();
  153 |     }
  154 |   });
  155 | 
  156 |   /**
  157 |    * TAB 5: Alerts
  158 |    */
  159 |   test('5️⃣ Alerts Page Discovery', async ({ browser }) => {
  160 |     const page = await getAuthenticatedPage(browser);
  161 | 
  162 |     try {
  163 |       console.log('\n═══════════════════════════════════════');
  164 |       console.log('TAB 5: ALERTS PAGE');
  165 |       console.log('═══════════════════════════════════════');
  166 | 
  167 |       await page.goto(`${BASE_URL}/alerts`, { waitUntil: 'networkidle' });
  168 | 
  169 |       const forms = await page.locator('form').count();
  170 |       const buttons = await page.locator('button').count();
  171 |       const inputs = await page.locator('input, select, textarea').count();
  172 | 
  173 |       console.log(`✓ Forms found: ${forms}`);
  174 |       console.log(`✓ Action buttons: ${buttons}`);
  175 |       console.log(`✓ Input fields: ${inputs}`);
  176 |       console.log(`✓ Page loads successfully: YES`);
  177 | 
  178 |       expect(buttons).toBeGreaterThan(0);
  179 |     } finally {
  180 |       await page.close();
  181 |     }
  182 |   });
  183 | 
  184 |   /**
  185 |    * TAB 6: Audit Log
  186 |    */
  187 |   test('6️⃣ Audit Log Page Discovery', async ({ browser }) => {
  188 |     const page = await getAuthenticatedPage(browser);
  189 | 
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
```