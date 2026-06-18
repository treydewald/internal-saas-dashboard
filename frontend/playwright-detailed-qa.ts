import { chromium, type Browser, type Page } from "playwright";
import * as fs from "fs";
import * as path from "path";

interface BugReport {
  id: string;
  severity: "critical" | "high" | "medium" | "low" | "cosmetic";
  title: string;
  location: string;
  reproduction: string[];
  expectedBehavior: string;
  actualBehavior: string;
  rootCauseAnalysis: string;
  screenshot: string;
  fixed: boolean;
}

class DetailedQAExplorer {
  private browser!: Browser;
  private page!: Page;
  private bugs: BugReport[] = [];
  private baseUrl = "http://localhost:5173";
  private outputDir = "./qa-detailed-results";
  private bugCount = 0;

  async init() {
    this.browser = await chromium.launch({ headless: false });
    this.page = await this.browser.newPage();

    // Capture all console messages
    this.page.on("console", (msg) => {
      console.log(`[${msg.type()}] ${msg.text()}`);
    });

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async takeScreenshot(name: string) {
    const fileName = `${this.outputDir}/screenshot-${name}.png`;
    await this.page.screenshot({ path: fileName, fullPage: true });
    return fileName;
  }

  async reportBug(
    title: string,
    severity: BugReport["severity"],
    location: string,
    reproduction: string[],
    expected: string,
    actual: string,
    rootCause: string
  ) {
    this.bugCount++;
    const bugId = `BUG-${String(this.bugCount).padStart(3, "0")}`;
    const screenshot = await this.takeScreenshot(bugId);

    const bug: BugReport = {
      id: bugId,
      severity,
      title,
      location,
      reproduction,
      expectedBehavior: expected,
      actualBehavior: actual,
      rootCauseAnalysis: rootCause,
      screenshot,
      fixed: false,
    };

    this.bugs.push(bug);
    console.error(`\n❌ ${bugId} [${severity.toUpperCase()}]: ${title}`);
    console.error(`   Location: ${location}`);
    console.error(`   Expected: ${expected}`);
    console.error(`   Actual: ${actual}`);
  }

  async testFormValidation() {
    console.log("\n🔍 Testing Form Validation\n");

    await this.page.goto(`${this.baseUrl}/login`);
    await this.page.waitForLoadState("networkidle");

    // Test: Empty form submission
    const signInBtn = await this.page.$('button:has-text("Sign In")');
    if (signInBtn) {
      await signInBtn.click();
      await this.page.waitForTimeout(500);

      // Check if form validates
      const isStillOnLogin = this.page.url().includes("/login");
      if (!isStillOnLogin) {
        await this.reportBug(
          "Form allows submission with empty fields",
          "high",
          "/login",
          ["Open login page", "Click Sign In without entering credentials"],
          "Form should prevent submission and show validation errors",
          "Form was submitted without validation",
          "Missing client-side form validation on email and password fields"
        );
      }
    }
  }

  async testResponsiveImages() {
    console.log("\n📱 Testing Responsive Images\n");

    // Test on mobile
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.page.goto(`${this.baseUrl}`);
    await this.page.waitForLoadState("networkidle");

    // Check if sidebar is properly hidden or toggled
    const sidebar = await this.page.$('[class*="sidebar"]');
    if (sidebar) {
      const isVisible = await sidebar.isVisible();
      if (isVisible) {
        const boundingBox = await sidebar.boundingBox();
        if (boundingBox && boundingBox.width > 300) {
          await this.reportBug(
            "Sidebar too wide on mobile viewport",
            "medium",
            "Mobile Layout",
            [
              "Set viewport to 375x667",
              "Navigate to dashboard",
              "Inspect sidebar width",
            ],
            "Sidebar should be hidden or occupy max 100px on mobile",
            `Sidebar width is ${boundingBox.width}px`,
            "Sidebar CSS media queries may not be properly configured for mobile"
          );
        }
      }
    }

    // Reset viewport
    await this.page.setViewportSize({ width: 1920, height: 1080 });
  }

  async testTableInteractions() {
    console.log("\n📊 Testing Table Interactions\n");

    await this.page.goto(`${this.baseUrl}/users`);
    await this.page.waitForLoadState("networkidle");

    // Test: Search functionality
    const searchInput = await this.page.$('input[placeholder*="Search"]');
    if (searchInput) {
      await searchInput.fill("Sarah");
      await this.page.waitForLoadState("networkidle");

      // Take screenshot to verify search results
      await this.takeScreenshot("users-search-results");

      // Check if results are filtered
      const rows = await this.page.locator("table tbody tr").all();
      console.log(`Found ${rows.length} rows after search`);

      // Verify at least one row contains "Sarah"
      let foundMatch = false;
      for (const row of rows) {
        const text = await row.textContent();
        if (text && text.includes("Sarah")) {
          foundMatch = true;
          break;
        }
      }

      if (!foundMatch && rows.length > 0) {
        await this.reportBug(
          "Search filter not working correctly",
          "high",
          "/users",
          [
            "Navigate to users page",
            'Search for "Sarah"',
            "Verify results are filtered",
          ],
          "Table should show only rows matching search term",
          "Table is showing unfiltered results",
          "Search input may not be connected to table filter logic"
        );
      }
    }
  }

  async testFilterDropdowns() {
    console.log("\n🎛️ Testing Filter Dropdowns\n");

    const page = this.page;

    // Test API Logs filters
    await page.goto(`${this.baseUrl}/api-logs`);
    await page.waitForLoadState("networkidle");

    // Look for filter elements more broadly
    const allSelects = await page.locator("select").all();
    console.log(`Found ${allSelects.length} select elements on API logs page`);

    const allInputs = await page.locator("input[type='text']").all();
    console.log(`Found ${allInputs.length} text inputs on API logs page`);

    // Check for filter buttons or elements
    const filterBtns = await page.locator('button:has-text("Filter")').all();
    console.log(`Found ${filterBtns.length} filter buttons`);
  }

  async testDateRangePicker() {
    console.log("\n📅 Testing Date Range Picker\n");

    const page = this.page;
    await page.goto(`${this.baseUrl}`);
    await page.waitForLoadState("networkidle");

    // Look for date range selector
    const lastSevenDays = await page.$('button:has-text("Last 7 days")');
    if (lastSevenDays) {
      console.log("✅ Found 'Last 7 days' preset button");
      await lastSevenDays.click();
      await page.waitForTimeout(500);
      await this.takeScreenshot("date-range-last7days");
    }

    const lastThirtyDays = await page.$('button:has-text("Last 30 days")');
    if (lastThirtyDays) {
      console.log("✅ Found 'Last 30 days' preset button");
      await lastThirtyDays.click();
      await page.waitForTimeout(500);
      await this.takeScreenshot("date-range-last30days");
    }

    const thisMonth = await page.$('button:has-text("This month")');
    if (thisMonth) {
      console.log("✅ Found 'This month' preset button");
      await thisMonth.click();
      await page.waitForTimeout(500);
      await this.takeScreenshot("date-range-thismonth");
    }
  }

  async testAlertCreation() {
    console.log("\n⚠️ Testing Alert Creation Flow\n");

    const page = this.page;
    await page.goto(`${this.baseUrl}/alerts`);
    await page.waitForLoadState("networkidle");

    // Look for create button
    const createBtn = await page.$('button:has-text("Create"), button:has-text("New")');
    if (createBtn) {
      console.log("Found create alert button");
      await createBtn.click();
      await page.waitForTimeout(500);
      await this.takeScreenshot("alert-create-form");

      // Try to fill in form
      const nameInput = await page.$('input[placeholder*="name"], input[placeholder*="Name"]');
      if (nameInput) {
        await nameInput.fill("Test Alert");
        console.log("Filled alert name");

        // Try to submit
        const submitBtn = await page.$('button:has-text("Create"), button:has-text("Save")');
        if (submitBtn) {
          await submitBtn.click();
          await page.waitForTimeout(1000);
          await this.takeScreenshot("alert-create-after-submit");
        }
      }
    }
  }

  async testLogout() {
    console.log("\n🚪 Testing Logout Flow\n");

    const page = this.page;
    await page.goto(`${this.baseUrl}`);
    await page.waitForLoadState("networkidle");

    // Find logout button
    const logoutBtn = await page.$('button:has-text("Logout")');
    if (logoutBtn) {
      console.log("Found logout button");
      await logoutBtn.click();
      await page.waitForTimeout(1000);
      await this.takeScreenshot("after-logout");

      // Check if redirected to login
      const isOnLogin = page.url().includes("/login");
      if (!isOnLogin) {
        await this.reportBug(
          "Logout does not redirect to login page",
          "high",
          "Header/Logout button",
          ["Click logout button", "Verify redirect to login"],
          "After logout, user should be redirected to /login",
          `User is on ${page.url()}`,
          "Logout logic may not include proper redirect"
        );
      }
    }
  }

  async testNavigationBreadcrumbs() {
    console.log("\n🗺️ Testing Navigation\n");

    const page = this.page;
    const routes = ["/", "/users", "/api-logs", "/audit-log", "/alerts", "/insights", "/settings"];

    for (const route of routes) {
      await page.goto(`${this.baseUrl}${route}`);
      await page.waitForLoadState("networkidle");

      const finalUrl = page.url();
      if (!finalUrl.includes(route)) {
        await this.reportBug(
          "Navigation route mismatch",
          "medium",
          route,
          [`Navigate to ${route}`],
          `Browser URL should contain ${route}`,
          `Actual URL: ${finalUrl}`,
          "Client-side routing may not be working correctly"
        );
      }
    }
  }

  async testConsoleErrors() {
    console.log("\n🔴 Checking for Console Errors\n");

    const page = this.page;
    const consoleErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to key pages and capture errors
    const pages = ["/", "/users", "/api-logs", "/settings"];
    for (const route of pages) {
      consoleErrors.length = 0; // Clear previous errors
      await page.goto(`${this.baseUrl}${route}`);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1000);

      if (consoleErrors.length > 0) {
        console.error(`Found ${consoleErrors.length} console errors on ${route}`);
        for (const error of consoleErrors) {
          console.error(`  - ${error}`);
        }
      }
    }
  }

  async testNetworkErrors() {
    console.log("\n🌐 Checking for Network Errors\n");

    const page = this.page;
    const networkErrors: string[] = [];

    page.on("requestfailed", (request) => {
      networkErrors.push(`${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
    });

    // Navigate to pages
    const routes = ["/", "/users", "/api-logs"];
    for (const route of routes) {
      networkErrors.length = 0;
      await page.goto(`${this.baseUrl}${route}`);
      await page.waitForLoadState("networkidle");

      if (networkErrors.length > 0) {
        console.warn(`Found ${networkErrors.length} network failures on ${route}`);
        for (const error of networkErrors) {
          console.warn(`  - ${error}`);
        }
      }
    }
  }

  async testButtonAccessibility() {
    console.log("\n♿ Testing Button Accessibility\n");

    const page = this.page;
    await page.goto(`${this.baseUrl}`);
    await page.waitForLoadState("networkidle");

    // Find all buttons
    const buttons = await page.locator("button").all();
    console.log(`Found ${buttons.length} buttons on dashboard`);

    for (const button of buttons.slice(0, 5)) {
      const ariaLabel = await button.getAttribute("aria-label");
      const text = await button.textContent();

      if (!ariaLabel && !text) {
        await this.reportBug(
          "Button missing accessible label",
          "medium",
          "Dashboard",
          ["Find button without text or aria-label"],
          "All buttons should have text content or aria-label",
          "Button found with neither text nor aria-label",
          "Button element missing accessibility attributes"
        );
        break;
      }
    }
  }

  async generateDetailedReport() {
    console.log("\n\n================== DETAILED QA REPORT ==================\n");

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalBugsFound: this.bugs.length,
        critical: this.bugs.filter((b) => b.severity === "critical").length,
        high: this.bugs.filter((b) => b.severity === "high").length,
        medium: this.bugs.filter((b) => b.severity === "medium").length,
        low: this.bugs.filter((b) => b.severity === "low").length,
      },
      bugs: this.bugs,
    };

    const reportPath = path.join(this.outputDir, "detailed-qa-report.json");
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`Total Bugs Found: ${report.summary.totalBugsFound}`);
    console.log(`  Critical: ${report.summary.critical}`);
    console.log(`  High: ${report.summary.high}`);
    console.log(`  Medium: ${report.summary.medium}`);
    console.log(`  Low: ${report.summary.low}`);

    console.log(`\nReport saved to: ${reportPath}`);

    if (this.bugs.length > 0) {
      console.log("\nBugs Found:");
      for (const bug of this.bugs) {
        console.log(`\n${bug.id} [${bug.severity}]: ${bug.title}`);
        console.log(`  Location: ${bug.location}`);
        console.log(`  Expected: ${bug.expectedBehavior}`);
        console.log(`  Actual: ${bug.actualBehavior}`);
        console.log(`  Root Cause: ${bug.rootCauseAnalysis}`);
      }
    }

    return report;
  }

  async close() {
    await this.browser.close();
  }
}

async function main() {
  const explorer = new DetailedQAExplorer();
  await explorer.init();

  try {
    console.log("🚀 Starting Detailed QA Exploration\n");

    await explorer.testFormValidation();
    await explorer.testResponsiveImages();
    await explorer.testTableInteractions();
    await explorer.testFilterDropdowns();
    await explorer.testDateRangePicker();
    await explorer.testAlertCreation();
    await explorer.testLogout();
    await explorer.testNavigationBreadcrumbs();
    await explorer.testConsoleErrors();
    await explorer.testNetworkErrors();
    await explorer.testButtonAccessibility();

    await explorer.generateDetailedReport();
  } finally {
    await explorer.close();
  }
}

main().catch(console.error);
