import { chromium, Browser, Page } from "@playwright/test";
import * as fs from "fs";

async function detailedAudit() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Mock localStorage for auth
  await page.addInitScript(() => {
    localStorage.setItem(
      "auth_token",
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImV4cCI6OTk5OTk5OTk5OX0.1nxI5A0l7fPHDYZNPM2S5j0q8b9c1d0e1f2g3h4i5j6"
    );
  });

  // Navigate to dashboard
  await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // Check if we're on dashboard
  const url = page.url();
  console.log("Current URL:", url);

  // Wait for navigation to complete
  if (url.includes("/login")) {
    console.log("Logged out - attempting to navigate to dashboard");
    await page.goto("http://localhost:5173/dashboard", { waitUntil: "networkidle" });
  }

  // Analyze page structure
  const analysis = await page.evaluate(() => {
    const doc = document;

    return {
      title: doc.title,
      bodyChildren: doc.body.children.length,
      mainElement: !!doc.querySelector("main"),
      headerExists: !!doc.querySelector("header"),
      sidebarExists: !!doc.querySelector('[class*="sidebar"]') || !!doc.querySelector('[class*="Sidebar"]'),
      kpiCards: doc.querySelectorAll('[class*="kpi"]').length,
      cards: doc.querySelectorAll('[class*="card"]').length,
      sections: doc.querySelectorAll("section").length,
      divCount: doc.querySelectorAll("div").length,
      bodyHeight: doc.body.offsetHeight,
      mainHeight: doc.querySelector("main")?.offsetHeight || 0,
      contentHeight: doc.querySelector('[class*="content"]')?.offsetHeight || 0,
      htmlContent: doc.documentElement.outerHTML.substring(0, 500),
    };
  });

  console.log("\n=== PAGE STRUCTURE ANALYSIS ===");
  console.log(JSON.stringify(analysis, null, 2));

  // Try to check for error messages
  const errors = await page.evaluate(() => {
    const errorElements = document.querySelectorAll(
      '[class*="error"], [class*="Error"], .alert-danger'
    );
    return Array.from(errorElements).map((el) => el.textContent);
  });

  if (errors.length > 0) {
    console.log("\n=== ERRORS FOUND ===");
    console.log(errors);
  }

  // Check network requests
  const responses: string[] = [];
  page.on("response", (response) => {
    if (!response.url().includes(".js") && !response.url().includes(".css")) {
      responses.push(`${response.status()} ${response.url()}`);
    }
  });

  // Take screenshot
  await page.screenshot({ path: "./audit-detailed.png", fullPage: false });
  console.log("\nScreenshot saved to audit-detailed.png");

  // Try clicking on dashboard link if visible
  const dashboardLink = await page.$('a[href="/dashboard"], a[href="/"]');
  if (dashboardLink) {
    console.log("Found dashboard link, clicking...");
    await dashboardLink.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "./audit-after-click.png", fullPage: false });
  }

  await browser.close();
}

detailedAudit().catch(console.error);
