/**
 * AUTONOMOUS VISUAL OPTIMIZATION AUDIT
 * Comprehensive Playwright-driven visual assessment of the internal SaaS dashboard
 * PHASE 1: Automated Application Audit
 */

import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:5181';
const SCREENSHOTS_DIR = path.join(__dirname, '.visual-audit-screenshots');
const REPORT_PATH = path.join(__dirname, 'visual-audit-report.json');

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

/**
 * Screen evaluation rubric (1-10 scale)
 */
const screenEvaluationRubric = {
  visualImpact: 'Does the screen have strong composition and visual hierarchy?',
  readability: 'Is text legible? Are labels clear? Is hierarchy apparent?',
  hierarchy: 'Is there a clear primary focal point? Do elements have weight ordering?',
  contentDensity: 'Is information presented efficiently without clutter? Above the fold?',
  professionalPolish: 'Does it feel like enterprise-grade SaaS?',
  screenshotReadiness: 'Can a single viewport screenshot communicate the screen\'s purpose?',
  demoReadiness: 'Would this screen work well in a product demo?',
  portfolioQuality: 'Could this be a hero image on a marketing page?'
};

/**
 * Audit framework
 */
class VisualAudit {
  constructor() {
    this.screens = [];
    this.findings = [];
    this.optimizations = [];
  }

  /**
   * Wait for server to be ready with retry logic
   */
  async waitForServer(maxRetries = 60) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(`${BASE_URL}/`);
        if (response.ok) return true;
      } catch (e) {
        // Server not ready yet
      }
      if (i % 10 === 0) console.log(`Waiting for server... (${i}s)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    throw new Error('Dev server did not respond after 60 seconds');
  }

  /**
   * Capture visual assessment of a screen
   */
  async captureScreen(page, routeName, routePath, description) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const screenshotPath = path.join(SCREENSHOTS_DIR, `${routeName}-${timestamp}.png`);

    try {
      // Navigate to route
      await page.goto(`${BASE_URL}${routePath}`, { waitUntil: 'networkidle' });

      // Wait for any loading states to complete
      await page.waitForTimeout(1000);

      // Take screenshot of full viewport
      await page.screenshot({ path: screenshotPath, fullPage: false });

      // Capture viewport metrics
      const viewport = page.viewportSize();
      const bodyBox = await page.evaluate(() => {
        const body = document.body;
        const html = document.documentElement;
        return {
          width: Math.max(body.scrollWidth, html.scrollWidth),
          height: Math.max(body.scrollHeight, html.scrollHeight),
          viewportHeight: window.innerHeight
        };
      });

      // Assess readability of critical elements
      const readabilityAssessment = await this.assessReadability(page);

      // Assess visual hierarchy
      const hierarchyAssessment = await this.assessHierarchy(page);

      // Assess above-fold visibility
      const aboveFoldContent = await page.evaluate(() => {
        const vh = window.innerHeight;
        const elements = document.querySelectorAll('h1, h2, .kpi-card, button, [role="main"]');
        let visibleCount = 0;
        let totalCount = elements.length;

        elements.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top < vh && rect.bottom > 0) visibleCount++;
        });

        return { visibleCount, totalCount };
      });

      return {
        routeName,
        routePath,
        description,
        screenshotPath,
        viewport: {
          width: viewport.width,
          height: viewport.height,
          documentHeight: bodyBox.height,
          requires_scroll: bodyBox.height > viewport.height
        },
        readability: readabilityAssessment,
        hierarchy: hierarchyAssessment,
        aboveFoldContent,
        timestamp
      };
    } catch (error) {
      console.error(`Failed to capture screen for ${routeName}:`, error.message);
      return null;
    }
  }

  /**
   * Assess text readability and contrast
   */
  async assessReadability(page) {
    return await page.evaluate(() => {
      const textElements = document.querySelectorAll('h1, h2, h3, p, label, button, [role="button"]');
      const assessments = [];

      textElements.forEach(el => {
        if (el.offsetParent === null) return; // Hidden element

        const computed = window.getComputedStyle(el);
        const fontSize = parseInt(computed.fontSize);
        const fontWeight = computed.fontWeight;
        const color = computed.color;

        // Basic heuristic: size should be >= 12px for body text
        const isLegible = fontSize >= 12;

        assessments.push({
          text: el.textContent?.slice(0, 50),
          fontSize,
          fontWeight,
          isLegible
        });
      });

      const legibleCount = assessments.filter(a => a.isLegible).length;
      return {
        totalElements: textElements.length,
        legibleElements: legibleCount,
        score: legibleCount / Math.max(textElements.length, 1)
      };
    });
  }

  /**
   * Assess visual hierarchy (color contrast, sizing, positioning)
   */
  async assessHierarchy(page) {
    return await page.evaluate(() => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const bodyText = document.querySelectorAll('p, span, li');

      const headingSize = headings.length > 0
        ? parseInt(window.getComputedStyle(headings[0]).fontSize)
        : 0;

      const bodySize = bodyText.length > 0
        ? parseInt(window.getComputedStyle(bodyText[0]).fontSize)
        : 0;

      // Check if there's clear visual distinction
      const hasDistinction = headingSize > bodySize * 1.2;

      // Count visually distinct regions
      const regions = document.querySelectorAll('[role="main"], [role="region"], .card, .panel, section');

      return {
        headingCount: headings.length,
        headingSize,
        bodySize,
        hasDistinction,
        regionCount: regions.length
      };
    });
  }

  /**
   * Score a screen across all dimensions
   */
  scoreScreen(screenData) {
    const scores = {};

    // Scoring logic based on captured metrics
    const requires_scroll = screenData.viewport.requires_scroll;
    const readabilityScore = screenData.readability.score;
    const hasDistinction = screenData.hierarchy.hasDistinction;
    const aboveFoldRatio = screenData.aboveFoldContent.visibleCount /
                          Math.max(screenData.aboveFoldContent.totalCount, 1);

    // Visual Impact (composition, balance, focal point)
    scores.visualImpact = hasDistinction && aboveFoldRatio > 0.6 ? 7 : 5;

    // Readability (text legibility, label clarity)
    scores.readability = readabilityScore > 0.8 ? 8 : 6;

    // Hierarchy (clear primary focal point, weight ordering)
    scores.hierarchy = hasDistinction ? 7 : 5;

    // Content Density (information efficiency, above-fold presence)
    scores.contentDensity = !requires_scroll && aboveFoldRatio > 0.7 ? 8 : 6;

    // Professional Polish (enterprise feel, consistency)
    scores.professionalPolish = 6; // Will be updated with visual inspection

    // Screenshot Readiness (communicates purpose in one viewport)
    scores.screenshotReadiness = !requires_scroll ? 8 : 5;

    // Demo Readiness (functional, clear workflows)
    scores.demoReadiness = 7;

    // Portfolio Quality (hero image worthiness)
    scores.portfolioQuality = aboveFoldRatio > 0.8 && !requires_scroll ? 7 : 4;

    // Calculate overall score
    const overall = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;

    return { ...scores, overall: Math.round(overall) };
  }

  /**
   * Run complete audit
   */
  async runAudit() {
    let browser;

    try {
      console.log('Waiting for dev server...');
      await this.waitForServer();
      console.log('Dev server ready! Starting visual audit...\n');

      browser = await chromium.launch();
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1
      });
      const page = await context.newPage();

      // Define all major screens to audit
      const screensToAudit = [
        {
          name: 'Login',
          path: '/',
          description: 'Authentication entry point - login form'
        },
        {
          name: 'Dashboard-Overview',
          path: '/dashboard',
          description: 'Main dashboard with KPI cards and analytics'
        },
        {
          name: 'Users-Table',
          path: '/dashboard/users',
          description: 'User management table with CRUD operations'
        },
        {
          name: 'API-Logs',
          path: '/dashboard/logs',
          description: 'API activity logs and performance metrics'
        },
        {
          name: 'Reports',
          path: '/dashboard/reports',
          description: 'Report generation and viewing'
        },
        {
          name: 'Settings',
          path: '/dashboard/settings',
          description: 'User account and application settings'
        }
      ];

      // Capture each screen
      console.log('PHASE 1: AUTOMATED APPLICATION AUDIT\n');
      console.log('Capturing screens...\n');

      for (const screen of screensToAudit) {
        const screenData = await this.captureScreen(page, screen.name, screen.path, screen.description);
        if (screenData) {
          const scores = this.scoreScreen(screenData);
          screenData.scores = scores;
          this.screens.push(screenData);
          console.log(`✓ ${screen.name}: Overall Score ${scores.overall}/10`);
        }
      }

      // Generate report
      this.generateReport();

      await context.close();
      await browser.close();

    } catch (error) {
      console.error('Audit failed:', error);
      process.exit(1);
    }
  }

  /**
   * Generate audit report
   */
  generateReport() {
    console.log('\n\n=== VISUAL AUDIT REPORT ===\n');

    // Screen-by-screen summary
    console.log('PHASE 2: SCREEN SCORING SYSTEM\n');
    console.log('Screen Performance Overview:\n');

    this.screens.forEach(screen => {
      const scores = screen.scores;
      console.log(`\n${screen.routeName}`);
      console.log(`  Route: ${screen.routePath}`);
      console.log(`  Description: ${screen.description}`);
      console.log(`  Overall Score: ${scores.overall}/10`);
      console.log(`  Visual Impact: ${scores.visualImpact}/10`);
      console.log(`  Readability: ${scores.readability}/10`);
      console.log(`  Hierarchy: ${scores.hierarchy}/10`);
      console.log(`  Content Density: ${scores.contentDensity}/10`);
      console.log(`  Professional Polish: ${scores.professionalPolish}/10`);
      console.log(`  Screenshot Readiness: ${scores.screenshotReadiness}/10`);
      console.log(`  Demo Readiness: ${scores.demoReadiness}/10`);
      console.log(`  Portfolio Quality: ${scores.portfolioQuality}/10`);
      console.log(`  Requires Scrolling: ${screen.viewport.requires_scroll}`);
      console.log(`  Viewport: ${screen.viewport.width}x${screen.viewport.height}`);
      console.log(`  Document Height: ${screen.viewport.documentHeight}px`);

      // Identify issues
      const issues = [];
      if (screen.viewport.requires_scroll) {
        issues.push('- Requires scrolling (violates viewport-first principle)');
      }
      if (scores.contentDensity < 7) {
        issues.push('- Low content density (optimize whitespace usage)');
      }
      if (scores.hierarchy < 7) {
        issues.push('- Weak visual hierarchy (improve focal point clarity)');
      }
      if (scores.screenshotReadiness < 8) {
        issues.push('- Screenshot-readiness concerns (layout optimization needed)');
      }

      if (issues.length > 0) {
        console.log('  Issues:');
        issues.forEach(issue => console.log('    ' + issue));
      }
    });

    // Write JSON report for further processing
    const report = {
      timestamp: new Date().toISOString(),
      screenshotDirectory: SCREENSHOTS_DIR,
      screens: this.screens,
      summary: {
        totalScreensAudited: this.screens.length,
        averageScore: Math.round(this.screens.reduce((sum, s) => sum + s.scores.overall, 0) / this.screens.length),
        screenshotsPath: SCREENSHOTS_DIR
      }
    };

    fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
    console.log(`\n\n✓ Audit report saved to: ${REPORT_PATH}`);
    console.log(`✓ Screenshots saved to: ${SCREENSHOTS_DIR}`);
  }
}

// Run the audit
const audit = new VisualAudit();
await audit.runAudit();
