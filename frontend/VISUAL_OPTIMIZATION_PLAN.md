# Visual Optimization Plan — SaaS Dashboard
**Generated:** June 16, 2026  
**Status:** Phase 1 - Audit Complete | Phase 2 - Planning | Phases 3-4 - Implementation Ready

---

## EXECUTIVE SUMMARY

The Internal SaaS Dashboard (DataPulse) has completed core functionality implementation (T1-T3 features) and a light theme design system. The application is now ready for **visual polish optimization** to achieve portfolio-grade presentation quality. This plan identifies specific visual improvements organized by screen and feature area.

**Current State:**
- ✅ Full light theme design system implemented (tokens, colors, typography)
- ✅ Core dashboard shell with sidebar navigation  
- ✅ Mock data infrastructure ready
- ⚠️ Component rendering needs content density optimization
- ⚠️ Hero dashboard composition needs viewport-first restructuring
- ⚠️ Status indicators need consistency improvements
- ⚠️ Table polish incomplete across all data tables

**Goal:** Every screen should achieve 9/10+ score on Visual Impact, Readability, Hierarchy, Professional Polish, and Portfolio Quality dimensions.

---

## PHASE 2 SCREEN SCORING & OPTIMIZATION ROADMAP

### Screen 1: Dashboard Overview
**Current Scores (Baseline):**
- Visual Impact: 6/10
- Readability: 7/10
- Hierarchy: 6/10
- Content Density: 4/10 (empty space)
- Professional Polish: 5/10
- Screenshot Readiness: 4/10
- Demo Readiness: 4/10
- Portfolio Quality: 5/10
- **Average: 5.6/10** ❌

**Critical Issues:**
1. **Content Void** — Main content area renders empty despite shell being present
   - Sidebar visible and styled correctly ✅
   - Header visible with connection status ✅
   - Main content area: 57px height instead of ~800px
   - No KPI cards, charts, or sections visible

2. **Layout Not Utilizing Viewport**
   - Content area should show: KPI cards, Activity chart, Performance metrics
   - Currently 85% of viewport is whitespace
   - Fails "screenshot-ready composition" requirement

3. **Missing Visual Hierarchy**
   - No primary focal point
   - No secondary content anchors
   - Viewer cannot understand screen purpose from single screenshot

**Optimization Actions:**

**Priority 1: Component Rendering Fix**
- [ ] Debug OverviewPage component rendering (check for React errors in console)
- [ ] Verify KPICards component mounts correctly
- [ ] Confirm mock data fallback works when API unavailable
- [ ] Ensure APIActivityChart renders with mock data
- [ ] Validate MetricsCards component mounting

**Priority 2: Content Density Improvement**
- [ ] Restructure KPI section to display 4 cards in single row (2-column on mobile)
- [ ] Position APIActivityChart below KPI cards with no gap collapse
- [ ] Add MetricsCards section with 3-column grid layout
- [ ] Ensure all primary content visible without scroll on 1440×900 viewport

**Priority 3: Visual Hierarchy Establishment**
- [ ] Apply strong color to KPI primary card (Active Users)
- [ ] Establish clear visual weight between metric value, delta, and metadata
- [ ] Add subtle background gradient to chart section (6° angle, 2% opacity)
- [ ] Use spacing scale rigorously: 32px major gaps, 16px minor gaps

**Priority 4: Polish & Depth**
- [ ] Apply glass-depth treatment to all cards: `backdrop-filter: blur(4px)` + inner highlight
- [ ] Add card hover elevation: `scale(1.01)` + shadow transition
- [ ] Implement breathing animation on active status indicators (2.5s, ease-in-out)
- [ ] Add subtle section dividers: `border-bottom: 1px solid var(--border-subtle)`

**Expected Result after Optimization:**
- Visual Impact: 9/10 (strong focal point on KPI cards)
- Readability: 9/10 (clear label hierarchy)
- Hierarchy: 9/10 (distinct sections with visual anchors)
- Content Density: 9/10 (maximum viewport utilization)
- Professional Polish: 9/10 (depth, motion, consistency)
- Screenshot Readiness: 9/10 (all primary content visible)
- Demo Readiness: 9/10 (impressive default state)
- Portfolio Quality: 9/10 (Stripe/Vercel quality bar)
- **Target Average: 9/10** ✅

---

### Screen 2: Users Management Table
**Current Scores (Baseline):**
- Visual Impact: 5/10
- Readability: 6/10
- Hierarchy: 5/10
- Content Density: 5/10
- Professional Polish: 4/10
- Screenshot Readiness: 5/10
- Demo Readiness: 5/10
- Portfolio Quality: 5/10
- **Average: 5.1/10** ❌

**Critical Issues:**
1. **Table Scannability Low**
   - No alternating row opacity for visual scanning aid
   - No row hover highlight
   - Hard borders between rows (solid lines, visually heavy)

2. **Status Indicators Inconsistent**
   - No semantic color coding for user status (active/inactive/pending)
   - Missing StatusChip component implementation (required by T4-07)
   - No visual distinction between action types

3. **Column Headers Unclear**
   - Weak hierarchy between header and body rows
   - No visual weight difference
   - Missing accent underline or background

4. **Actions Not Obvious**
   - No visual affordance for row click (cursor pointer missing)
   - No selected-row highlighting
   - No side-drawer expansion hint

**Optimization Actions:**

**Priority 1: Implement StatusChip Component (T4-07 Dependency)**
- [ ] Create `StatusChip` primitive component
- [ ] Implement 8-state system: healthy, running, degraded, warning, error, off, inactive, pending
- [ ] Map semantic colors from globals.css accent variables
- [ ] Apply breathing animation (2.5s, ease-in-out, infinite) to active/live states only
- [ ] Apply `border: 1px solid <accent-color-at-20%-opacity>` treatment
- [ ] Use `border-radius: var(--radius-chip)`, `padding: 3px 10px`, `font-size: 11px`

**Priority 2: Row Treatment (T4-12 Table Polish)**
- [ ] Odd rows: base background
- [ ] Even rows: `rgba(255,255,255,0.015)` additive tint (subtle zebra stripe aid)
- [ ] Row hover: `background: rgba(56,189,248,0.04)`, `transition: var(--duration-sm)`
- [ ] Replace hard borders with `border-bottom: 1px solid var(--border-subtle)` (softer separation)
- [ ] Add left accent bar on selected row: `border-left: 3px solid var(--accent-primary)`

**Priority 3: Status Badge Coloring (T4-12 Table Polish)**
- [ ] Render user status column with StatusChip
- [ ] Map: `active` = mint, `inactive` = muted, `pending` = amber
- [ ] Use StatusChip component for visual consistency

**Priority 4: Header & Interaction Affordance**
- [ ] Add strong visual weight to headers: `--fw-semibold`, uppercase, 11px
- [ ] Highlight header background: `background: rgba(15,23,42,0.02)`
- [ ] Add cursor pointer to rows (affordance for click action)
- [ ] Add visual feedback on hover: row selection styling

**Expected Result after Optimization:**
- Visual Impact: 8/10 (status badges add color, scannable)
- Readability: 9/10 (row alternation helps scanning)
- Hierarchy: 8/10 (strong headers)
- Content Density: 8/10 (compact rows with clear scanning)
- Professional Polish: 8/10 (glass depth, hover states)
- Screenshot Readiness: 8/10 (status colors tell story)
- Demo Readiness: 8/10 (interactive affordance clear)
- Portfolio Quality: 8/10 (enterprise-grade table)
- **Target Average: 8.1/10** ✅

---

### Screen 3: API Logs Table
**Current Scores (Baseline):**
- Visual Impact: 5/10
- Readability: 6/10
- Hierarchy: 5/10
- Content Density: 5/10
- Professional Polish: 4/10
- Screenshot Readiness: 5/10
- Demo Readiness: 5/10
- Portfolio Quality: 5/10
- **Average: 5.1/10** ❌

**Critical Issues:**
1. **Method/Status Badges Missing**
   - No HTTP method color coding (GET=sky, POST=mint, DELETE=rose, PATCH=amber)
   - No HTTP status code badges (2xx=mint, 3xx=sky, 4xx=amber, 5xx=rose)
   - Raw text makes table harder to scan

2. **Latency Information Not Highlighted**
   - Slow requests (≥3000ms) not visually flagged
   - No threshold-based color coding
   - Operators can't identify performance issues at a glance

3. **Row Treatment Same Issues as Users Table**
   - No alternating row opacity
   - No hover highlight
   - Hard borders

**Optimization Actions:**

**Priority 1: Method & Status Badge System (T4-12)**
- [ ] Create MethodBadge wrapper around StatusChip
- [ ] Map: GET → sky (`--accent-info`), POST → mint (`--accent-success`), DELETE → rose (`--accent-error`), PATCH/PUT → amber (`--accent-warning`)
- [ ] Create StatusCodeBadge wrapper
- [ ] Map: 2xx → mint, 3xx → sky, 4xx → amber, 5xx → rose

**Priority 2: Latency Threshold Encoding (T4-12)**
- [ ] Latency < 1000ms: default `--text-secondary`
- [ ] Latency 1000–2999ms: `--accent-warning` text
- [ ] Latency ≥ 3000ms: `--accent-error` text + optional background tint

**Priority 3: Apply Table Polish from T4-12**
- [ ] Alternating row opacity treatment
- [ ] Row hover highlight with transition
- [ ] Soft border separators
- [ ] Selected-row left accent bar

**Priority 4: Column Header Hierarchy**
- [ ] Strengthen header styling with uppercase, semibold weight
- [ ] Add subtle background tint to header row

**Expected Result after Optimization:**
- Visual Impact: 8/10 (badge colors make data story clear)
- Readability: 9/10 (method/status colors support fast scanning)
- Hierarchy: 8/10 (strong header treatment)
- Content Density: 8/10 (compact rows, efficient data presentation)
- Professional Polish: 8/10 (consistent badge system, depth)
- Screenshot Readiness: 8/10 (color coding immediately communicates table purpose)
- Demo Readiness: 8/10 (clear interaction model)
- Portfolio Quality: 8/10 (enterprise-grade observability interface)
- **Target Average: 8.1/10** ✅

---

### Screen 4: Sidebar Navigation
**Current Scores (Baseline):**
- Visual Impact: 7/10
- Readability: 7/10
- Hierarchy: 6/10
- Content Density: 6/10
- Professional Polish: 5/10
- Screenshot Readiness: 7/10
- Demo Readiness: 6/10
- Portfolio Quality: 6/10
- **Average: 6.4/10** ⚠️

**Critical Issues:**
1. **Opacity Tiers Not Visually Distinct**
   - Active item, hover, and idle states not clearly differentiated
   - Users cannot tell which nav item is active without close inspection
   - Opacity differences too subtle

2. **Section Anchoring Weak**
   - No clear visual separation between navigation sections
   - Missing `border-bottom: 1px solid var(--border-subtle)` between sections
   - Grouped items not anchored visually

3. **Active State Accent Bar Placement**
   - Left inset accent bar present but may need emphasis
   - Color contrast against background could be stronger

**Optimization Actions:**

**Priority 1: Opacity Tier Enforcement (T4-11)**
- [ ] **Active nav item:** bright background fill + `--text-primary` label + left inset `3px solid var(--accent-primary)` bar
  - Background: `rgba(56,189,248,0.12)` (10-12% opacity mint tint)
  - Full text contrast
- [ ] **Hover nav item:** `rgba(56,189,248,0.06)` fill + `--text-secondary` label
  - Light tint, reduced contrast hint
- [ ] **Idle nav item:** transparent + `--text-tertiary` label
  - Clearly lower contrast than hover state
- [ ] Verify three tiers are visually distinguishable at normal viewing distance (not on close inspection)

**Priority 2: Section Anchoring**
- [ ] Add `border-bottom: 1px solid var(--border-subtle)` section dividers between major navigation groups
- [ ] Section headers: strong weight (`var(--fw-semibold)`) with top spacing (`margin-top: 16px` min)
- [ ] Example sections: "PLATFORM", "MANAGEMENT", "SETTINGS", "ADVANCED"

**Priority 3: Active State Visual Emphasis**
- [ ] Increase left accent bar width to `4px` for better visibility
- [ ] Ensure accent color has sufficient contrast: `var(--accent-primary)` (#2563EB)
- [ ] Add subtle background glow to active item: `box-shadow: inset 0 0 12px var(--accent-primary-dim)` (very subtle)

**Priority 4: Label Hierarchy & Spacing**
- [ ] Apply spacing scale: 12px gap between items, 8px padding inside items
- [ ] Section label typography: 10px, `--fw-semibold`, uppercase, `--text-muted`
- [ ] Nav item label: 13px, `--fw-medium`, mixed case
- [ ] Icon + label alignment: centered, 8px gap

**Expected Result after Optimization:**
- Visual Impact: 8/10 (active state prominent, clear navigation intent)
- Readability: 8/10 (opacity tiers support fast scanning)
- Hierarchy: 8/10 (sections anchored visually)
- Content Density: 7/10 (efficient space usage)
- Professional Polish: 8/10 (subtle hover states, animations)
- Screenshot Readiness: 8/10 (active nav state immediately clear)
- Demo Readiness: 8/10 (user immediately understands navigation structure)
- Portfolio Quality: 8/10 (professional navigation treatment)
- **Target Average: 7.9/10** ✅

---

### Screen 5: Settings Panel
**Current Scores (Baseline):**
- Visual Impact: 5/10
- Readability: 6/10
- Hierarchy: 5/10
- Content Density: 4/10
- Professional Polish: 4/10
- Screenshot Readiness: 4/10
- Demo Readiness: 5/10
- Portfolio Quality: 4/10
- **Average: 4.9/10** ❌

**Critical Issues:**
1. **Content Underutilization**
   - Settings form elements not visible in primary viewport
   - Large empty space between form fields
   - Scrolling required for basic workflow

2. **Form Group Clarity**
   - Profile settings, API key management, theme toggle not visually grouped
   - No section dividers
   - Unclear information architecture

3. **Button & Form States**
   - Save/Cancel buttons may lack clear visual weight
   - Form validation feedback unclear
   - Success/error states not prominent

**Optimization Actions:**

**Priority 1: Content Density & Viewport Optimization**
- [ ] Reduce vertical spacing between form field groups from 24px to 16px
- [ ] Use two-column form layout for desktop: Profile left, API Keys right
- [ ] Keep theme toggle and account settings in single viewport
- [ ] Compress field-label spacing (currently may be excessive)

**Priority 2: Section Anchoring & Grouping**
- [ ] Add section dividers: `border-bottom: 1px solid var(--border-subtle)`
- [ ] Section headers: 14px, `--fw-semibold`, 32px top margin
- [ ] Example sections: "Account", "API Keys", "Preferences", "Danger Zone"

**Priority 3: Form Field Styling**
- [ ] All inputs: `border: 1px solid var(--border-default)`
- [ ] Focus state: `outline: 2px solid var(--accent-primary)`, outline-offset: 2px
- [ ] Label: 12px, `--fw-medium`, `--text-primary`
- [ ] Helper text: 11px, `--text-tertiary`

**Priority 4: Button Treatment**
- [ ] Primary button (Save): `var(--accent-primary)` background, white text, 8px radius
- [ ] Secondary button (Cancel): transparent, border, `var(--accent-primary)` text
- [ ] Hover: `scale(1.01)` elevation, shadow transition
- [ ] Active: `scale(0.97)` depress feedback

**Priority 5: Success/Error Feedback**
- [ ] Success toast: mint background tint, `--accent-success` border, green text, icon
- [ ] Error toast: rose background tint, `--accent-error` border, red text, icon
- [ ] Inline validation: show icon next to field on focus-out

**Expected Result after Optimization:**
- Visual Impact: 7/10 (form styling makes settings feel organized)
- Readability: 8/10 (clear field labels and groups)
- Hierarchy: 8/10 (section anchoring establishes structure)
- Content Density: 8/10 (viewport optimization, two-column layout)
- Professional Polish: 8/10 (button interactions, field focus states)
- Screenshot Readiness: 7/10 (settings form communicates functionality)
- Demo Readiness: 7/10 (clear workflow)
- Portfolio Quality: 7/10 (professional form treatment)
- **Target Average: 7.6/10** ✅

---

## PHASE 3: APPLICATION-WIDE OPTIMIZATION FRAMEWORK

### 1. Content-First Layout Architecture
**Requirement:** Primary content 60–75% of visible space. Eliminate unnecessary empty regions.

**Implementation:**
- [ ] Audit every page: measure primary content width vs. sidebar width
- [ ] Maintain 240px sidebar (fixed)
- [ ] Ensure content area on desktop 1440px: 240px sidebar leaves 1200px for content
- [ ] Apply padding-right 36px, padding-left 32px (68px total gutter)
- [ ] Content width: ~1132px
- [ ] Never have centered content narrower than 800px on desktop

**Files to Update:**
- `src/layouts/DashboardLayout.module.css` — content area sizing
- `src/App.css` — main layout constraints

---

### 2. Viewport-First Composition & Non-Scrolling Architecture
**Requirement:** Primary screens fit in single viewport. Scrolling is fallback only.

**Implementation:**
- [ ] **Dashboard Overview** — KPI cards, activity chart, metrics visible without scroll
- [ ] **Users Table** — full table with ~10 rows visible, pagination below
- [ ] **API Logs** — ~12 log rows visible, pagination below
- [ ] **Settings** — profile form visible, scroll for advanced sections
- [ ] **Sidebar** — navigation items fit within viewport height
- [ ] **Modal Dialogs** — form content fits within modal height (no scroll inside modal)

**Constraint Heights:**
- Viewport: 900px
- Header: 64px
- Content starts: 64px
- Available: 836px
- Padding: 32px top + 32px bottom = 64px
- Content space: 772px

---

### 3. Hero-Focused Composition
**Requirement:** Establish single primary focal point on every screen.

**Dashboard Overview:**
- Primary: Active Users KPI card (top-left, largest accent color)
- Secondary: Activity Chart (center, highlights trends)
- Tertiary: Other KPI cards (right side, equal visual weight)

**Users Table:**
- Primary: User list (bulk data)
- Secondary: Search/filter controls (top-right)
- Tertiary: Pagination (bottom)

**API Logs:**
- Primary: Request table (bulk activity)
- Secondary: Status badge colors (method + status code + latency)
- Tertiary: Pagination + export (bottom)

---

### 4. Hierarchy Simplification
**Requirements:**
- Collapse low-value controls
- Move advanced options into progressive disclosure
- Reduce visual noise
- Surface important actions first

**Implementation:**
- [ ] Hide advanced filters behind "More Options" drawer
- [ ] Keep primary filter (date range) always visible
- [ ] Move API key generation behind modal (not inline)
- [ ] Hide API key value by default, show on click
- [ ] Compress metadata rows in tables (smaller font)

---

### 5. Presentation-Ready Default States
**Requirement:** Every screen designed as though in product demo.

**Implementation:**
- [ ] Dashboard Overview: Seed with 7 days of mock data, showing clear trends
- [ ] Users Table: Populate with 12 representative users (active, inactive, pending)
- [ ] API Logs: Show mixed success/error logs over past 24 hours
- [ ] Charts: Show recognizable patterns (spikes, trends)
- [ ] Status Indicators: Mix of healthy, running, warning states

---

### 6. Universal Readability
**Requirements:**
- Increase readability of critical information
- Improve contrast
- Improve label visibility
- Reduce cognitive load

**Implementation:**
- [ ] Data values: `var(--fw-bold)` or `var(--fw-extrabold)`, 28–32px
- [ ] Card labels: `var(--fw-semibold)`, uppercase, 11px, 0.08em letter-spacing
- [ ] Metadata: `var(--fw-normal)`, 11px, `--text-muted`
- [ ] All text: minimum 11px (no smaller)
- [ ] Line-height: 1.5 minimum for body text
- [ ] Color contrast: WCAG AA minimum for all text on background

---

### 7. Information Density Optimization
**Requirement:** Increase signal-to-noise ratio within viewport.

**Implementation:**
- [ ] Remove unnecessary padding (reduce from 24px to 16px where appropriate)
- [ ] Consolidate related information (group similar fields)
- [ ] Reduce row height in tables from 48px to 40px
- [ ] Use compact spacing in forms (12px gap instead of 16px)
- [ ] Use 8px grid rigorously: 8, 16, 24, 32, 48, 64px only

---

### 8. Visual Consistency System
**Requirement:** Standardize across entire application.

**Enforcement:**
- [ ] All spacing: 8px grid
- [ ] All typography: defined weights and sizes
- [ ] All border-radius: 6px, 8px, 16px, 24px, 999px only
- [ ] All shadows: token values only (`--shadow-sm`, `--shadow-card`, etc.)
- [ ] All colors: CSS variables from globals.css
- [ ] All transitions: 150ms (sm), 250ms (md), 350ms (lg)
- [ ] All easing: `--ease-out`, `--ease-in-out` only

---

### 9. Dashboard Optimization
**Requirements:**
- Establish primary KPI region
- Group related metrics
- Reduce fragmentation
- Create stronger visual anchors

**Implementation:**
- [ ] KPI cards in single row (4 columns on desktop, 2 on tablet, 1 on mobile)
- [ ] Activity chart below KPIs with 32px gap
- [ ] Performance metrics in 3-column grid below chart
- [ ] All three regions visible in single viewport

---

### 10. Data Visualization Optimization
**Requirements:**
- Highlight important trends
- Improve label readability
- Reduce clutter
- Increase screenshot clarity

**Implementation for APIActivityChart:**
- [ ] Y-axis: show only 3–4 gridlines (reduce visual clutter)
- [ ] X-axis: show date labels every 2 days (not every day)
- [ ] Line: 2px width, smooth bezier curves
- [ ] Area fill: 12% opacity gradient
- [ ] Tooltip on hover: dark background, white text, rounded corners

---

### 11. Navigation Optimization
**Requirements:**
- Reduce navigation dominance
- Increase content prominence
- Simplify hierarchy
- Surface relevant actions

**Implementation:**
- [ ] Sidebar width: 240px (fixed, no expand/collapse animation)
- [ ] Main content margin-left: 240px
- [ ] On mobile: bottom navigation instead of sidebar
- [ ] Active state: clear visual emphasis (see Sidebar section above)

---

### 12. Screenshot Optimization
**Requirement:** Every screen evaluable as a single screenshot.

**Evaluation Checklist:**
- [ ] Strong composition (clear focal point)
- [ ] Safe margins (no content at edges)
- [ ] Balanced layouts (visual weight distribution)
- [ ] Visible value (content immediately communicates purpose)
- [ ] Clear hierarchy (primary, secondary, tertiary content distinct)
- [ ] Portfolio-quality presentation (no janky spacing, no misaligned elements)

---

## PHASE 4: ITERATIVE IMPROVEMENT SYSTEM

### Testing Protocol
1. Launch app with `npm run dev`
2. Navigate to each major screen
3. Take full-page screenshot at 1440×900
4. Compare against optimization targets
5. Re-score using 8-point scale
6. Iterate on lowest-scoring screens

### Validation Checklist
- [ ] Dashboard Overview: ≥9/10 average
- [ ] Users Table: ≥8/10 average
- [ ] API Logs: ≥8/10 average
- [ ] Sidebar Nav: ≥8/10 average
- [ ] Settings: ≥7.5/10 average
- [ ] All screens: ≥8/10 on Portfolio Quality dimension
- [ ] No screen requires scrolling for primary workflow
- [ ] Single viewport shows complete value proposition

### Continuous Improvement Cadence
1. **Initial Pass:** Implement Phase 3 framework
2. **Screenshot Pass:** Capture all screens, compare
3. **Refinement Pass:** Address lowest-scoring elements
4. **Polish Pass:** Fine-tune spacing, shadows, animations
5. **Final Validation:** Verify no new issues, regressions clear

---

## IMPLEMENTATION ORDER (Recommended)

### Week 1: Foundation
1. [ ] Create StatusChip component (T4-07 blocker)
2. [ ] Implement table row polish system (T4-12 foundation)
3. [ ] Update globals.css with glass-depth utilities
4. [ ] Verify component rendering (debug Dashboard Overview empty state)

### Week 2: Dashboard
1. [ ] Fix Dashboard Overview rendering
2. [ ] Implement content density optimization
3. [ ] Add KPI card hover lift effects
4. [ ] Implement breathing animation for status indicators
5. [ ] Add chart polish (grid lines, tooltips)

### Week 3: Tables & Forms
1. [ ] Apply UsersTable polish (rows, hover, badges)
2. [ ] Apply APILogsTable polish (method badges, latency colors)
3. [ ] Apply AuditLogTable polish (action type badges)
4. [ ] Implement form field styling in Settings
5. [ ] Add success/error feedback patterns

### Week 4: Navigation & Polish
1. [ ] Implement sidebar opacity tiers
2. [ ] Add section anchoring to navigation
3. [ ] Polish active state visual emphasis
4. [ ] Implement header styling refinements
5. [ ] Add ambient background glow effect

### Week 5: Validation & Iteration
1. [ ] Capture full-page screenshots of all screens
2. [ ] Score against optimization targets
3. [ ] Address remaining issues
4. [ ] Fine-tune spacing and alignment
5. [ ] Perform final visual audit

---

## SUCCESS CRITERIA (End State)

**Technical Requirements:**
- [ ] All CSS uses token variables only (no hardcoded colors/spacing)
- [ ] All transitions use `--duration-*` tokens
- [ ] All font-weights come from defined scale
- [ ] All spacing comes from 8px grid
- [ ] No component uses arbitrary `box-shadow` (only `--shadow-*` tokens)

**Visual Requirements:**
- [ ] 4-layer visual hierarchy perceivable (background → sections → cards → interactive)
- [ ] Every card has `scale(1.01)` hover lift with shadow transition
- [ ] Every major screen fits primary content in single viewport
- [ ] Status indicators use consistent color mapping
- [ ] Typography hierarchy enforced: values > labels > metadata
- [ ] Navigation active state visually unambiguous
- [ ] All tables scannable: alternating rows, hover highlights, semantic badges
- [ ] Section dividers consistent across all pages

**Portfolio Metrics:**
- [ ] Dashboard Overview: 9/10 average score
- [ ] Users Table: 8/10 average score
- [ ] API Logs: 8/10 average score
- [ ] All screens: ≥8/10 on "Portfolio Quality" dimension
- [ ] Single screenshot of Dashboard communicates: modern SaaS, professional UI, data-rich
- [ ] Screenshots worthy of landing page hero image
- [ ] Product demo ready with no manual preparation

**Functional Verification:**
- [ ] Zero new bugs introduced
- [ ] Zero performance regressions
- [ ] All interactions work as before
- [ ] Mobile responsive behavior preserved
- [ ] Dark theme toggle still works correctly
- [ ] Auth/permissions unchanged

---

## DELIVERABLES

### Code Changes
- Updated component CSS modules with polish layer
- New StatusChip component (reusable primitive)
- Table row utility styles
- Sidebar opacity tier styles
- Form field component updates
- globals.css additions (utilities, animations)

### Documentation
- Component style guide updates
- Design token usage reference
- Animation/transition documentation
- Accessibility verification report

### Validation Artifacts
- Before/after screenshots (all major screens)
- Visual regression test baseline
- Screen scoring spreadsheet
- Portfolio screenshot selection guide

---

## NOTES

**Known Dependencies:**
- StatusChip must be completed before T4-12 table polish can proceed
- globals.css utilities (glass-depth, animations) needed by multiple features
- Component rendering issue on Dashboard Overview must be resolved first

**Risk Mitigation:**
- All changes non-functional — no business logic changes
- Changes are CSS/styling only — low risk of regressions
- Incremental validation at each phase catches issues early
- Before/after screenshots provide clear evidence of improvement

**Long-term Maintenance:**
- All design decisions documented in this plan
- CSS tokens prevent style drift over time
- Typography and spacing scale prevents accidental inconsistencies
- Component library approach enables easy reuse

