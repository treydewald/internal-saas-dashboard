import { test, expect, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5173';
const REPORT_DIR = './qa-results';
const SCREENSHOTS_DIR = './qa-results/screenshots';

interface PageExploration {
  path: string;
  title: string;
  elements: Record<string, number>;
  interactiveTests: string[];
  errors: string[];
}

function ensureReportDirs() {
  [REPORT_DIR, SCREENSHOTS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
}

async function captureScreenshot(page: Page, name: string): Promise<string> {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${name}-${ts}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  await page.screenshot({ path: filepath, fullPage: true }).catch(() => {});
  return filename;
}

async function explorePage(page: Page, pathname: string, title: string): Promise<PageExploration> {
  const exploration: PageExploration = {
    path: pathname,
    title,
    elements: {},
    interactiveTests: [],
    errors: [],
  };

  try {
    console.log(`\n🔍 Testing: ${title} (${pathname})`);
    await page.goto(`${BASE_URL}${pathname}`, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    
    await captureScreenshot(page, title);

    // Count elements
    const counts = {
      'Forms': await page.locator('form').count(),
      'Tables': await page.locator('table').count(),
      'Buttons': await page.locator('button, [role="button"]').count(),
      'Inputs': await page.locator('input, textarea, select').count(),
      'Links': await page.locator('a').count(),
    };

    exploration.elements = counts;
    Object.entries(counts).forEach(([type, count]) => {
      if (count > 0) console.log(`  ${type}: ${count}`);
    });

    // Test interactive elements
    const buttons = await page.locator('button, [role="button"]').all();
    for (let i = 0; i < Math.min(buttons.length, 2); i++) {
      try {
        const btn = buttons[i];
        if (await btn.isVisible() && await btn.isEnabled()) {
          const text = await btn.textContent();
          await btn.click({ timeout: 3000 }).catch(() => {});
          exploration.interactiveTests.push(`Clicked: ${text?.trim() || `Button ${i}`}`);
          await page.waitForTimeout(200);
        }
      } catch (e) {}
    }

    return exploration;
  } catch (error) {
    exploration.errors.push(String(error));
    return exploration;
  }
}

test.describe('📱 Complete Dashboard QA Exploration', () => {
  let explorations: PageExploration[] = [];
  let startTime: number;

  test.beforeAll(() => {
    ensureReportDirs();
    startTime = Date.now();
  });

  const pages = [
    { path: '/', name: 'Overview' },
    { path: '/users', name: 'Users' },
    { path: '/api-logs', name: 'API Logs' },
    { path: '/insights', name: 'Insights' },
    { path: '/alerts', name: 'Alerts' },
    { path: '/audit-log', name: 'Audit Log' },
    { path: '/dashboard-builder', name: 'Dashboard Builder' },
    { path: '/reports', name: 'Reports' },
    { path: '/exports', name: 'Exports' },
    { path: '/api-keys', name: 'API Keys' },
    { path: '/org-settings', name: 'Org Settings' },
    { path: '/settings', name: 'Settings' },
  ];

  pages.forEach(({ path: pathname, name }) => {
    test(`Test ${name}`, async ({ page }) => {
      const result = await explorePage(page, pathname, name);
      explorations.push(result);
    });
  });

  test.afterAll(async () => {
    const duration = (Date.now() - startTime) / 1000;
    
    const report = {
      timestamp: new Date().toISOString(),
      duration: `${duration}s`,
      pages: explorations.length,
      explorations,
    };

    fs.writeFileSync(path.join(REPORT_DIR, 'qa-report.json'), JSON.stringify(report, null, 2));
    console.log(`\n✅ QA Complete: ${explorations.length} pages tested in ${duration}s`);
  });
});
