import { chromium } from "@playwright/test";
import * as fs from "fs";

interface FinalValidation {
  timestamp: string;
  screens: ScreenValidation[];
  summary: ValidationSummary;
}

interface ScreenValidation {
  name: string;
  url: string;
  metrics: {
    contentHeight: number;
    viewportHeight: number;
    componentCount: number;
    statusBadges: number;
    tableRows: number;
    glassPanels: number;
    buttons: number;
  };
  visualElements: {
    hasHeader: boolean;
    hasSidebar: boolean;
    hasMainContent: boolean;
    hasGradients: boolean;
    hasAnimations: boolean;
  };
  scores: {
    contentDensity: number;
    tableQuality: number;
    statusIndicators: number;
    visualPolish: number;
    overallScore: number;
  };
}

interface ValidationSummary {
  totalScreens: number;
  averageScore: number;
  allScreensViewportFit: boolean;
  statusBadgesTotal: number;
  tableRowsTotal: number;
  readyForPortfolio: boolean;
  recommendations: string[];
}

async function validateFinal() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const screenValidations: ScreenValidation[] = [];

  const screens = [
    { name: "Dashboard Overview", url: "http://localhost:5173/dashboard" },
    { name: "Users Table", url: "http://localhost:5173/users" },
    { name: "API Logs", url: "http://localhost:5173/api-logs" },
    { name: "Audit Log", url: "http://localhost:5173/audit-log" },
  ];

  console.log("\n🎨 WEEK 3 FINAL VALIDATION — Portfolio Quality Assessment");
  console.log("=".repeat(70));

  for (const screen of screens) {
    console.log(`\n📊 ${screen.name}`);

    await page.goto(screen.url, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);

    const analysis = await page.evaluate(() => {
      const styles = window.getComputedStyle(document.body);
      const main = document.querySelector("main") || document.querySelector(".main-content");
      const sidebar = document.querySelectorAll(".sidebar");

      return {
        contentHeight: main?.offsetHeight || 0,
        viewportHeight: window.innerHeight,
        componentCount: document.querySelectorAll("[class*='card'], [class*='table'], section").length,
        statusBadges: document.querySelectorAll("[role='status'], [class*='Chip']").length,
        tableRows: document.querySelectorAll("table tbody tr").length,
        glassPanels: document.querySelectorAll(".glass-panel").length,
        buttons: document.querySelectorAll("button").length,
        hasPrimaryText: !!document.querySelector("h1"),
        hasGradient: styles.backgroundImage.includes('gradient'),
        hasAnimation: document.querySelector('[style*="animation"]') !== null,
        sidebarCount: sidebar.length,
      };
    });

    const metrics = {
      contentHeight: analysis.contentHeight,
      viewportHeight: analysis.viewportHeight,
      componentCount: analysis.componentCount,
      statusBadges: analysis.statusBadges,
      tableRows: analysis.tableRows,
      glassPanels: analysis.glassPanels,
      buttons: analysis.buttons,
    };

    // Score calculations
    const scores = {
      contentDensity: analysis.contentHeight > 400 && analysis.contentHeight < 850 ? 9 : analysis.contentHeight > 0 ? 7 : 4,
      tableQuality: analysis.tableRows > 0 ? 8 : 6,
      statusIndicators: analysis.statusBadges > 0 ? 9 : 5,
      visualPolish: analysis.glassPanels > 0 ? 8 : 6,
      overallScore: 0,
    };

    scores.overallScore = Math.round(
      (scores.contentDensity + scores.tableQuality + scores.statusIndicators + scores.visualPolish) / 4
    );

    const validation: ScreenValidation = {
      name: screen.name,
      url: screen.url,
      metrics,
      visualElements: {
        hasHeader: analysis.hasPrimaryText,
        hasSidebar: analysis.sidebarCount > 0,
        hasMainContent: analysis.contentHeight > 0,
        hasGradients: analysis.hasGradient,
        hasAnimations: analysis.hasAnimation,
      },
      scores,
    };

    screenValidations.push(validation);

    console.log(`   Content Height: ${metrics.contentHeight}px`);
    console.log(`   Components: ${metrics.componentCount}`);
    console.log(`   Status Badges: ${metrics.statusBadges}`);
    console.log(`   Table Rows: ${metrics.tableRows}`);
    console.log(`   Glass Panels: ${metrics.glassPanels}`);
    console.log(`   Overall Score: ${scores.overallScore}/10`);

    // Capture screenshot
    await page.screenshot({ path: `./week3-final/${screen.name.replace(/\s+/g, "-")}.png`, fullPage: false });
  }

  await context.close();
  await browser.close();

  // Generate summary
  const averageScore = Math.round(
    screenValidations.reduce((sum, s) => sum + s.scores.overallScore, 0) / screenValidations.length
  );

  const summary: ValidationSummary = {
    totalScreens: screenValidations.length,
    averageScore,
    allScreensViewportFit: screenValidations.every((s) => s.metrics.contentHeight < 850),
    statusBadgesTotal: screenValidations.reduce((sum, s) => sum + s.metrics.statusBadges, 0),
    tableRowsTotal: screenValidations.reduce((sum, s) => sum + s.metrics.tableRows, 0),
    readyForPortfolio: averageScore >= 8,
    recommendations: [
      averageScore >= 8 ? "✅ Portfolio ready - scores above 8/10 threshold" : "⚠️ Final polish needed",
      screenValidations.every((s) => s.metrics.glassPanels > 0) ? "✅ Glass-depth active on all screens" : "⚠️ Glass-depth incomplete",
      screenValidations.every((s) => s.metrics.contentHeight > 0) ? "✅ Content rendering on all screens" : "⚠️ Some screens have rendering issues",
      screenValidations.filter((s) => s.metrics.statusBadges > 0).length > 2 ? "✅ Status badges active" : "⚠️ Status badge coverage incomplete",
    ],
  };

  const report: FinalValidation = {
    timestamp: new Date().toISOString(),
    screens: screenValidations,
    summary,
  };

  // Create output directory
  if (!fs.existsSync("./week3-final")) {
    fs.mkdirSync("./week3-final", { recursive: true });
  }

  fs.writeFileSync("./week3-final-validation-report.json", JSON.stringify(report, null, 2));

  console.log("\n" + "=".repeat(70));
  console.log("\n📈 FINAL VALIDATION SUMMARY");
  console.log(`   Average Score: ${summary.averageScore}/10`);
  console.log(`   All Viewport Fit: ${summary.allScreensViewportFit ? "✅ YES" : "⚠️ NO"}`);
  console.log(`   Total Status Badges: ${summary.statusBadgesTotal}`);
  console.log(`   Total Table Rows: ${summary.tableRowsTotal}`);
  console.log(`   Portfolio Ready: ${summary.readyForPortfolio ? "✅ YES" : "⚠️ NEARLY"}`);
  console.log("\n📋 Recommendations:");
  summary.recommendations.forEach((rec) => console.log(`   ${rec}`));

  console.log("\n✅ Report saved to week3-final-validation-report.json");
  console.log("✅ Screenshots saved to week3-final/");
}

validateFinal().catch(console.error);
