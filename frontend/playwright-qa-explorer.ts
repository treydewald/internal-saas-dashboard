import { chromium, type Browser, type Page } from "playwright";
import * as fs from "fs";
import * as path from "path";

interface BugReport {
  id: string;
  severity: "critical" | "high" | "medium" | "low" | "cosmetic";
  location: string;
  title: string;
  reproduction: string[];
  expected: string;
  actual: string;
  rootCause?: string;
  fixed: boolean;
  screenshot?: string;
}

interface FeatureDiscovery {
  name: string;
  location: string;
  type: string;
  purpose: string;
  scenarios: string[];
}

class BlindQAExplorer {
  private browser!: Browser;
  private page!: Page;
  private bugs: BugReport[] = [];
  private features: FeatureDiscovery[] = [];
  private screenshots: string[] = [];
  private baseUrl = "http://localhost:5173";
  private outputDir = "./qa-results";

  async init() {
    this.browser = await chromium.launch({ headless: false });
    this.page = await this.browser.newPage({
      recordVideo: { dir: "./qa-results/videos" },
    });

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
    if (!fs.existsSync(path.join(this.outputDir, "videos"))) {
      fs.mkdirSync(path.join(this.outputDir, "videos"), { recursive: true });
    }
  }

  async takeScreenshot(name: string) {
    const fileName = `screenshot-${Date.now()}-${name}.png`;
    const filePath = path.join(this.outputDir, fileName);
    await this.page.screenshot({ path: filePath });
    this.screenshots.push(filePath);
    console.log(`📸 Screenshot: ${fileName}`);
    return filePath;
  }

  async logError(title: string, details: any) {
    console.error(`❌ ERROR: ${title}`, details);
  }

  async captureConsoleAndNetworkErrors() {
    const errors: any[] = [];

    this.page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push({
          type: "console",
          message: msg.text(),
          location: msg.location(),
        });
        this.logError("Console Error", msg.text());
      }
    });

    this.page.on("requestfailed", (request) => {
      errors.push({
        type: "network",
        url: request.url(),
        failure: request.failure(),
      });
      this.logError("Network Failure", request.url());
    });

    return errors;
  }

  async testAuthentication() {
    console.log("\n🔐 TESTING AUTHENTICATION\n");

    // Step 1: Discover login page
    await this.page.goto(`${this.baseUrl}/login`);
    await this.page.waitForLoadState("networkidle");
    await this.takeScreenshot("01-login-page");

    // Discover form elements
    const usernameInput = await this.page.$('input[type="email"], input[placeholder*="email"], input[placeholder*="username"]');
    const passwordInput = await this.page.$('input[type="password"]');
    const loginButton = await this.page.$('button:has-text("Log In"), button:has-text("Login"), button:has-text("Sign In")');

    if (!usernameInput || !passwordInput || !loginButton) {
      this.bugs.push({
        id: "AUTH-001",
        severity: "critical",
        location: "Login Page (/login)",
        title: "Login form elements not found",
        reproduction: ["Navigate to /login"],
        expected: "Login form with email/username, password, and login button",
        actual: "One or more form elements missing",
        fixed: false,
      });
      return;
    }

    // Try invalid credentials
    await usernameInput.fill("invalid@test.com");
    await passwordInput.fill("wrongpassword");
    await loginButton.click();
    await this.page.waitForTimeout(2000);
    await this.takeScreenshot("02-login-invalid-attempt");

    // Check for error message
    const errorMessage = await this.page.$('text=invalid, text=error, text=failed');
    if (!errorMessage) {
      console.log("⚠️  No error message visible after invalid login");
    }

    // Try valid credentials (if demo user exists)
    await usernameInput.fill("demo@example.com");
    await passwordInput.fill("demo123");
    await loginButton.click();

    try {
      await this.page.waitForURL((url) => url.pathname !== "/login", {
        timeout: 5000,
      });
      console.log("✅ Login successful");
      await this.takeScreenshot("03-login-success");
    } catch {
      console.log("⚠️  Login with demo credentials failed or no demo account");
    }
  }

  async testNavigation() {
    console.log("\n📍 TESTING MAIN NAVIGATION\n");

    // Check if we're on a protected page
    const currentUrl = this.page.url();
    if (currentUrl.includes("/login")) {
      console.log("⚠️  Not authenticated, skipping navigation tests");
      return;
    }

    // Discover navigation menu
    const navItems = await this.page.locator('[role="navigation"] a, nav a, .sidebar a, [class*="menu"] a').all();
    console.log(`Found ${navItems.length} navigation items`);

    const navPaths: string[] = [];
    for (const item of navItems) {
      const href = await item.getAttribute("href");
      const text = await item.textContent();
      if (href && text) {
        navPaths.push({ href, text });
        console.log(`  📄 ${text.trim()} → ${href}`);
      }
    }

    this.features.push({
      name: "Navigation Menu",
      location: "Sidebar/Header",
      type: "Navigation",
      purpose: "Navigate between application pages",
      scenarios: navPaths.map((p) => `Click on "${p.text}" to navigate to ${p.href}`),
    });

    // Test navigation to each page
    for (const navItem of navItems.slice(0, 5)) {
      const href = await navItem.getAttribute("href");
      const text = await navItem.textContent();
      if (href && !href.startsWith("http")) {
        console.log(`\n  Navigating to ${text}...`);
        await navItem.click();
        await this.page.waitForLoadState("networkidle");
        await this.takeScreenshot(`nav-${text?.replace(/\s+/g, "-").toLowerCase()}`);
      }
    }
  }

  async testDashboard() {
    console.log("\n📊 TESTING DASHBOARD PAGE\n");

    await this.page.goto(`${this.baseUrl}`);
    await this.page.waitForLoadState("networkidle");
    await this.takeScreenshot("dashboard-overview");

    // Discover KPI cards
    const kpiCards = await this.page.locator('[class*="kpi"], [class*="card"], [class*="metric"]').all();
    console.log(`Found ${kpiCards.length} KPI/metric cards`);

    // Discover charts
    const charts = await this.page.locator('[class*="chart"], svg').all();
    console.log(`Found ${charts.length} chart elements`);

    // Discover tables
    const tables = await this.page.locator("table, [role='table']").all();
    console.log(`Found ${tables.length} tables`);

    this.features.push({
      name: "Dashboard",
      location: "/",
      type: "Page",
      purpose: "Display KPIs, charts, and recent activity",
      scenarios: [
        "Load dashboard and verify all KPI cards display",
        "Verify charts render without errors",
        "Verify tables display data",
        "Test sorting on table columns if available",
      ],
    });
  }

  async testUsers() {
    console.log("\n👥 TESTING USERS PAGE\n");

    try {
      await this.page.goto(`${this.baseUrl}/users`);
      await this.page.waitForLoadState("networkidle");
      await this.takeScreenshot("users-page");

      // Discover table
      const table = await this.page.locator("table, [role='table']");
      const exists = await table.isVisible();

      if (!exists) {
        this.bugs.push({
          id: "USERS-001",
          severity: "high",
          location: "/users",
          title: "Users table not visible",
          reproduction: ["Navigate to /users"],
          expected: "Users table should be visible with user data",
          actual: "No table found on page",
          fixed: false,
        });
        return;
      }

      // Discover actions
      const createButton = await this.page.$('button:has-text("Create"), button:has-text("Add"), button:has-text("New")');
      const editButtons = await this.page.locator('button:has-text("Edit")').all();
      const deleteButtons = await this.page.locator('button:has-text("Delete")').all();

      console.log(`✅ Found users table with ${editButtons.length} edit buttons and ${deleteButtons.length} delete buttons`);

      // Test search if available
      const searchInput = await this.page.$('input[placeholder*="search"], input[placeholder*="Search"]');
      if (searchInput) {
        console.log("Testing search...");
        await searchInput.fill("test");
        await this.page.waitForLoadState("networkidle");
        await this.takeScreenshot("users-search");
      }

      this.features.push({
        name: "Users Management",
        location: "/users",
        type: "CRUD",
        purpose: "Manage user accounts",
        scenarios: [
          "View list of users in table",
          "Search for users",
          "Edit user details",
          "Delete users",
          "Create new users if button available",
        ],
      });
    } catch (e) {
      this.logError("Users page error", e);
    }
  }

  async testApiLogs() {
    console.log("\n📋 TESTING API LOGS PAGE\n");

    try {
      await this.page.goto(`${this.baseUrl}/api-logs`);
      await this.page.waitForLoadState("networkidle");
      await this.takeScreenshot("api-logs-page");

      // Discover filtering
      const filterInputs = await this.page.locator("input[placeholder*='filter'], input[placeholder*='Filter']").all();
      console.log(`Found ${filterInputs.length} filter inputs`);

      // Discover date range picker
      const dateInputs = await this.page.locator('input[type="date"]').all();
      console.log(`Found ${dateInputs.length} date inputs`);

      // Test filtering
      if (filterInputs.length > 0) {
        await filterInputs[0].fill("GET");
        await this.page.waitForLoadState("networkidle");
        await this.takeScreenshot("api-logs-filtered");
      }

      this.features.push({
        name: "API Logs",
        location: "/api-logs",
        type: "Page",
        purpose: "View and filter API requests",
        scenarios: [
          "View list of API logs",
          "Filter logs by method",
          "Filter logs by status code",
          "Filter logs by date range",
          "Sort by columns",
        ],
      });
    } catch (e) {
      this.logError("API logs page error", e);
    }
  }

  async testAuditLog() {
    console.log("\n🔍 TESTING AUDIT LOG PAGE\n");

    try {
      await this.page.goto(`${this.baseUrl}/audit-log`);
      await this.page.waitForLoadState("networkidle");
      await this.takeScreenshot("audit-log-page");

      this.features.push({
        name: "Audit Log",
        location: "/audit-log",
        type: "Page",
        purpose: "Track system activities and changes",
        scenarios: ["View audit log entries", "Filter by action type", "Filter by date", "View entry details"],
      });
    } catch (e) {
      this.logError("Audit log page error", e);
    }
  }

  async testAlerts() {
    console.log("\n🚨 TESTING ALERTS PAGE\n");

    try {
      await this.page.goto(`${this.baseUrl}/alerts`);
      await this.page.waitForLoadState("networkidle");
      await this.takeScreenshot("alerts-page");

      // Discover alert creation button
      const createAlert = await this.page.$('button:has-text("Create"), button:has-text("New")');
      if (createAlert) {
        console.log("Testing alert creation...");
        await createAlert.click();
        await this.page.waitForTimeout(500);
        await this.takeScreenshot("alerts-create-modal");

        // Test form fields
        const formInputs = await this.page.locator("input, textarea, select").all();
        console.log(`Found ${formInputs.length} form fields in alert builder`);
      }

      this.features.push({
        name: "Alerts",
        location: "/alerts",
        type: "Page",
        purpose: "Create and manage alert rules",
        scenarios: [
          "View existing alerts",
          "Create new alert rule",
          "Edit alert rule",
          "Delete alert rule",
          "Test alert conditions",
        ],
      });
    } catch (e) {
      this.logError("Alerts page error", e);
    }
  }

  async testInsights() {
    console.log("\n💡 TESTING INSIGHTS PAGE\n");

    try {
      await this.page.goto(`${this.baseUrl}/insights`);
      await this.page.waitForLoadState("networkidle");
      await this.takeScreenshot("insights-page");

      this.features.push({
        name: "Insights",
        location: "/insights",
        type: "Page",
        purpose: "Display analytics and insights",
        scenarios: ["View insight cards", "View trend charts", "View anomaly detection"],
      });
    } catch (e) {
      this.logError("Insights page error", e);
    }
  }

  async testWorkflow() {
    console.log("\n⚙️ TESTING WORKFLOW PAGE\n");

    try {
      await this.page.goto(`${this.baseUrl}/workflow`);
      await this.page.waitForLoadState("networkidle");
      await this.takeScreenshot("workflow-page");

      this.features.push({
        name: "Workflow",
        location: "/workflow",
        type: "Page",
        purpose: "Create and manage automation workflows",
        scenarios: ["View workflows", "Create new workflow", "Edit workflow", "Delete workflow"],
      });
    } catch (e) {
      this.logError("Workflow page error", e);
    }
  }

  async testReports() {
    console.log("\n📈 TESTING REPORTS PAGE\n");

    try {
      await this.page.goto(`${this.baseUrl}/reports`);
      await this.page.waitForLoadState("networkidle");
      await this.takeScreenshot("reports-page");

      this.features.push({
        name: "Reports",
        location: "/reports",
        type: "Page",
        purpose: "Generate and view reports",
        scenarios: ["View report templates", "Generate report", "Download report", "Schedule report"],
      });
    } catch (e) {
      this.logError("Reports page error", e);
    }
  }

  async testExports() {
    console.log("\n💾 TESTING EXPORTS PAGE\n");

    try {
      await this.page.goto(`${this.baseUrl}/exports`);
      await this.page.waitForLoadState("networkidle");
      await this.takeScreenshot("exports-page");

      this.features.push({
        name: "Exports",
        location: "/exports",
        type: "Page",
        purpose: "Export data in various formats",
        scenarios: ["View export jobs", "Create export job", "Download exported file", "Cancel export"],
      });
    } catch (e) {
      this.logError("Exports page error", e);
    }
  }

  async testSettings() {
    console.log("\n⚙️ TESTING SETTINGS PAGE\n");

    try {
      await this.page.goto(`${this.baseUrl}/settings`);
      await this.page.waitForLoadState("networkidle");
      await this.takeScreenshot("settings-page");

      // Discover settings sections
      const sections = await this.page.locator('[class*="section"], [class*="tab"]').all();
      console.log(`Found ${sections.length} settings sections`);

      this.features.push({
        name: "Settings",
        location: "/settings",
        type: "Page",
        purpose: "Manage user preferences and account settings",
        scenarios: ["View profile settings", "Change password", "Manage API keys", "Set preferences"],
      });
    } catch (e) {
      this.logError("Settings page error", e);
    }
  }

  async testResponsiveness() {
    console.log("\n📱 TESTING RESPONSIVENESS\n");

    const viewports = [
      { width: 1920, height: 1080, name: "Desktop" },
      { width: 1024, height: 768, name: "Tablet" },
      { width: 375, height: 667, name: "Mobile" },
    ];

    for (const viewport of viewports) {
      console.log(`\nTesting at ${viewport.name} resolution (${viewport.width}x${viewport.height})`);
      await this.page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await this.page.reload();
      await this.page.waitForLoadState("networkidle");
      await this.takeScreenshot(`responsive-${viewport.name.toLowerCase()}`);
    }

    // Reset to desktop
    await this.page.setViewportSize({ width: 1920, height: 1080 });
  }

  async testErrorStates() {
    console.log("\n⚠️ TESTING ERROR STATES\n");

    // Test 404
    await this.page.goto(`${this.baseUrl}/nonexistent-page`);
    await this.page.waitForLoadState("networkidle");
    await this.takeScreenshot("error-404");

    // Check if error page is displayed
    const notFound = await this.page.$("text=404, text=not found, text=Not Found");
    if (!notFound) {
      console.log("⚠️  No 404 error page visible");
    }
  }

  async generateReport() {
    console.log("\n\n📋 GENERATING FINAL REPORT\n");

    const report = {
      executionTime: new Date().toISOString(),
      summary: {
        pagesExplored: this.features.length,
        featuresDiscovered: this.features.length,
        totalBugsFound: this.bugs.length,
        bugsFixed: this.bugs.filter((b) => b.fixed).length,
        screenshotsTaken: this.screenshots.length,
      },
      features: this.features,
      bugs: this.bugs,
      screenshots: this.screenshots,
    };

    const reportPath = path.join(this.outputDir, "qa-report.json");
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log("\n========== QA REPORT ==========\n");
    console.log(`Pages Explored: ${report.summary.pagesExplored}`);
    console.log(`Features Discovered: ${report.summary.featuresDiscovered}`);
    console.log(`Total Bugs Found: ${report.summary.totalBugsFound}`);
    console.log(`Bugs Fixed: ${report.summary.bugsFixed}`);
    console.log(`Screenshots: ${report.summary.screenshotsTaken}`);
    console.log(`\nFull report: ${reportPath}`);
    console.log("\n==============================\n");

    return report;
  }

  async close() {
    await this.browser.close();
  }
}

async function main() {
  const explorer = new BlindQAExplorer();
  await explorer.init();

  try {
    console.log("🚀 Starting Blind QA Exploration\n");

    await explorer.testAuthentication();
    await explorer.testNavigation();
    await explorer.testDashboard();
    await explorer.testUsers();
    await explorer.testApiLogs();
    await explorer.testAuditLog();
    await explorer.testAlerts();
    await explorer.testInsights();
    await explorer.testWorkflow();
    await explorer.testReports();
    await explorer.testExports();
    await explorer.testSettings();
    await explorer.testResponsiveness();
    await explorer.testErrorStates();

    const report = await explorer.generateReport();
  } finally {
    await explorer.close();
  }
}

main().catch(console.error);
