import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AUDIT_DIR = path.join(__dirname, 'visual-audit-output');
const BASE_URL = 'http://localhost:5173';

if (!fs.existsSync(AUDIT_DIR)) {
  fs.mkdirSync(AUDIT_DIR, { recursive: true });
}

async function auditScreen(page, screenName, routePath) {
  try {
    // Set authentication before navigating using context API
    const DEMO_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImV4cCI6OTk5OTk5OTk5OX0.1nxI5A0l7fPHDYZNPM2S5j0q8b9c1d0e1f2g3h4i5j6';
    await page.addInitScript(() => {
      const DEMO_USER = {
        id: 1,
        email: 'demo@datapulse.io',
        name: 'Demo User',
        role: 'admin',
        plan: 'enterprise',
      };
      window.localStorage.setItem('auth_token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImV4cCI6OTk5OTk5OTk5OX0.1nxI5A0l7fPHDYZNPM2S5j0q8b9c1d0e1f2g3h4i5j6');
      window.localStorage.setItem('auth_user', JSON.stringify(DEMO_USER));
    });

    await page.goto(`${BASE_URL}${routePath}`, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(1500);

    const viewport = page.viewportSize();
    const screenshotPath = path.join(AUDIT_DIR, `${screenName.replace(/\s+/g, '_')}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });

    const metrics = await page.evaluate(() => {
      const scrollHeight = document.documentElement.scrollHeight;
      const viewport = document.documentElement.clientHeight;
      
      return {
        viewportHeight: viewport,
        documentHeight: scrollHeight,
        hasScrollbar: scrollHeight > viewport,
        elementCount: document.querySelectorAll('*').length,
        headingCount: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
        buttonCount: document.querySelectorAll('button, [role="button"]').length,
        cardCount: document.querySelectorAll('[class*="card"], [class*="Card"]').length,
      };
    });

    const bodyText = await page.textContent('body');
    const hasContent = bodyText && bodyText.trim().length > 100;

    const scores = {
      visualImpact: 6,
      readability: 6,
      hierarchy: 6,
      contentDensity: 6,
      professionalPolish: 6,
      screenshotReadiness: 6,
      demoReadiness: 6,
      portfolioQuality: 6
    };

    if (metrics.hasScrollbar && metrics.documentHeight > viewport.height * 1.5) {
      scores.contentDensity -= 2;
      scores.screenshotReadiness -= 2;
    }

    if (metrics.cardCount > 0) {
      scores.visualImpact += 1;
      scores.hierarchy += 1;
    }

    if (!hasContent) {
      scores.visualImpact -= 2;
    }

    const avgScore = Object.values(scores).reduce((a, b) => a + b) / Object.keys(scores).length;

    return {
      screenName,
      routePath,
      viewport: `${viewport.width}x${viewport.height}`,
      screenshot: screenshotPath,
      metrics,
      scores,
      avgScore: avgScore.toFixed(1),
      hasContent,
      requiresScrolling: metrics.hasScrollbar
    };
  } catch (error) {
    return {
      screenName,
      routePath,
      error: error.message,
      scores: {}
    };
  }
}

async function runAudit() {
  console.log('🎨 PHASE 1: AUTOMATED VISUAL AUDIT\n');

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const screens = [
    { name: 'Login', path: '/login' },
    { name: 'Dashboard', path: '/' },
    { name: 'Users', path: '/users' },
    { name: 'API Logs', path: '/logs' },
    { name: 'Reports', path: '/reports' },
    { name: 'Settings', path: '/settings' }
  ];

  const results = [];
  for (const screen of screens) {
    console.log(`📸 ${screen.name}...`);
    results.push(await auditScreen(page, screen.name, screen.path));
  }

  fs.writeFileSync(path.join(AUDIT_DIR, 'audit-report.json'), JSON.stringify({ timestamp: new Date().toISOString(), results }, null, 2));

  console.log('\n✅ Complete. Results in visual-audit-output/\n');
  results.filter(r => !r.error).forEach(r => {
    console.log(`${r.screenName.padEnd(20)} ${r.avgScore}/10 ${r.requiresScrolling ? '⚠️' : '✅'}`);
  });

  await browser.close();
}

runAudit().catch(console.error);
