import { chromium, Browser, Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

interface ScreenAudit {
  name: string;
  url: string;
  viewport: string;
  scores: {
    visualImpact: number;
    readability: number;
    hierarchy: number;
    contentDensity: number;
    professionalPolish: number;
    screenshotReadiness: number;
    demoReadiness: number;
    portfolioQuality: number;
  };
  observations: string[];
  issues: string[];
  recommendations: string[];
}

const audits: ScreenAudit[] = [];

async function auditScreen(
  page: Page,
  name: string,
  url: string
): Promise<void> {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const screenshotPath = `./audit-screenshots/${name.replace(/\s+/g, "-")}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: false });

  const audit: ScreenAudit = {
    name,
    url,
    viewport: "1440x900",
    scores: {
      visualImpact: 0,
      readability: 0,
      hierarchy: 0,
      contentDensity: 0,
      professionalPolish: 0,
      screenshotReadiness: 0,
      demoReadiness: 0,
      portfolioQuality: 0,
    },
    observations: [],
    issues: [],
    recommendations: [],
  };

  // Collect visual metrics
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  const documentHeight = await page.evaluate(() => {
    const main = document.querySelector("main");
    return main ? main.offsetHeight : document.body.offsetHeight;
  });

  audit.observations.push(`Viewport Height: ${viewportHeight}px`);
  audit.observations.push(`Document Height: ${documentHeight}px`);
  audit.observations.push(
    `Requires Scrolling: ${scrollHeight > viewportHeight ? "YES" : "NO"}`
  );

  // Analyze color contrast and hierarchy
  const colorInfo = await page.evaluate(() => {
    const styles = window.getComputedStyle(document.body);
    return {
      bgColor: styles.backgroundColor,
      textColor: styles.color,
      fontSize: styles.fontSize,
    };
  });

  audit.observations.push(`Background Color: ${colorInfo.bgColor}`);
  audit.observations.push(`Text Color: ${colorInfo.textColor}`);

  // Count interactive elements
  const interactiveElements = await page.evaluate(() => ({
    buttons: document.querySelectorAll("button").length,
    links: document.querySelectorAll("a").length,
    forms: document.querySelectorAll("form").length,
    inputs: document.querySelectorAll("input").length,
  }));

  audit.observations.push(`Interactive Elements: ${JSON.stringify(interactiveElements)}`);

  // Identify visual issues
  if (scrollHeight > viewportHeight * 1.5) {
    audit.issues.push("Excessive vertical scrolling required");
    audit.recommendations.push(
      "Consider reorganizing content into tabs or collapsible sections"
    );
  }

  audits.push(audit);
  console.log(`✓ Audited: ${name}`);
}

async function runAudit() {
  const screenshotDir = "./audit-screenshots";
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  // Set auth token for protected pages
  await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
  const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImV4cCI6OTk5OTk5OTk5OX0.1nxI5A0l7fPHDYZNPM2S5j0q8b9c1d0e1f2g3h4i5j6";
  await page.context().addCookies([
    {
      name: "auth_token",
      value: token,
      domain: "localhost",
      path: "/",
    },
  ]);

  // Audit all major screens
  const screens = [
    { name: "Login Page", url: "http://localhost:5173" },
    { name: "Dashboard Overview", url: "http://localhost:5173/dashboard" },
    { name: "Users Management", url: "http://localhost:5173/users" },
    { name: "API Logs", url: "http://localhost:5173/logs" },
    { name: "Settings", url: "http://localhost:5173/settings" },
  ];

  for (const screen of screens) {
    try {
      await auditScreen(page, screen.name, screen.url);
    } catch (error) {
      console.error(`Failed to audit ${screen.name}:`, error);
    }
  }

  await context.close();
  await browser.close();

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    totalScreens: audits.length,
    averageScores: {
      visualImpact:
        audits.reduce((sum, a) => sum + a.scores.visualImpact, 0) /
        audits.length,
      readability:
        audits.reduce((sum, a) => sum + a.scores.readability, 0) / audits.length,
      hierarchy:
        audits.reduce((sum, a) => sum + a.scores.hierarchy, 0) / audits.length,
      contentDensity:
        audits.reduce((sum, a) => sum + a.scores.contentDensity, 0) /
        audits.length,
      professionalPolish:
        audits.reduce((sum, a) => sum + a.scores.professionalPolish, 0) /
        audits.length,
      screenshotReadiness:
        audits.reduce((sum, a) => sum + a.scores.screenshotReadiness, 0) /
        audits.length,
      demoReadiness:
        audits.reduce((sum, a) => sum + a.scores.demoReadiness, 0) /
        audits.length,
      portfolioQuality:
        audits.reduce((sum, a) => sum + a.scores.portfolioQuality, 0) /
        audits.length,
    },
    screens: audits,
  };

  fs.writeFileSync(
    "./visual-audit-report.json",
    JSON.stringify(report, null, 2)
  );
  console.log("\n✓ Audit complete. Report saved to visual-audit-report.json");
}

runAudit().catch(console.error);
