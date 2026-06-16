# UI System Specification

**Internal SaaS Dashboard — Normalized Build Spec**
_Version 1.0 | June 2026_

---

## 1. Product Summary

### What This UI Represents

A multi-tenant internal operations dashboard for B2B SaaS teams. It surfaces real-time API activity, user analytics, alerting, audit logs, and organization-level settings inside a unified, role-gated interface.

### Who It Is For

- **Admins** — full system visibility, user management, org configuration, audit trails
- **Analysts / Managers** — API log inspection, insight cards, custom alert rules, report generation
- **Viewers** — read-only metric consumption across the overview and dashboards

### Primary Interaction Goal

An operator opens the dashboard to answer one of three questions within seconds:

1. _Is the system healthy right now?_ (Overview + Connection Status + KPI cards)
2. _Who did what, and when?_ (Audit Log + API Logs + Alerts)
3. _What is trending?_ (Insights + Forecast + Analytics charts)

Every layout and hierarchy decision flows from these three questions.

---

## 2. Visual Design System

### Theme

Dark-first with a fully spec'd light theme. Class-toggled via `html.dark`. Default: dark.

The dark theme projects a **deep navy intelligence** aesthetic — suggesting a mission-critical, enterprise-grade tool. The light theme uses elevated whites and soft blues, maintaining the same spatial hierarchy without emitting the same drama.

---

### Color Palette

#### Layer System (Visual Depth)

| Token       | Dark Value | Light Value | Role                      |
| ----------- | ---------- | ----------- | ------------------------- |
| `--layer-0` | `#060c1f`  | `#F0F4FA`   | App background            |
| `--layer-1` | `#0c1528`  | `#F8FAFC`   | Section backgrounds       |
| `--layer-2` | `#111d38`  | `#FFFFFF`   | Card surfaces             |
| `--layer-3` | `#192644`  | `#FFFFFF`   | Interactive element fills |

#### Accent Colors

| Role           | Token              | Dark Value | Semantic Use                         |
| -------------- | ------------------ | ---------- | ------------------------------------ |
| Primary / Info | `--accent-primary` | `#38BDF8`  | Active states, focus rings, key data |
| Success        | `--accent-success` | `#34D399`  | Positive trends, healthy status      |
| Warning        | `--accent-warning` | `#FBBF24`  | Degraded status, alert thresholds    |
| Error          | `--accent-error`   | `#FB7185`  | Failures, critical alerts            |
| Purple         | `--accent-purple`  | `#A78BFA`  | Forecast / ML-generated data         |

Each accent has a paired `*-dim` variant at 12–15% opacity for chip backgrounds and hover fills.

#### Text Scale

| Token              | Dark Value | Role                  |
| ------------------ | ---------- | --------------------- |
| `--text-primary`   | `#EFF6FF`  | Headings, data values |
| `--text-secondary` | `#CBD5E1`  | Labels, descriptions  |
| `--text-tertiary`  | `#64748B`  | Metadata, timestamps  |
| `--text-muted`     | `#3D5270`  | Disabled, placeholder |

---

### Typography

| Use Case       | Weight Token                                 | Approx Size    | Example                         |
| -------------- | -------------------------------------------- | -------------- | ------------------------------- |
| Section titles | `--fw-semibold` (600–700)                    | 13–14px        | "API Activity", "Recent Alerts" |
| Card labels    | `--fw-medium` (500)                          | 11px uppercase | "ACTIVE USERS"                  |
| Data values    | `--fw-bold` / `--fw-extrabold` (700–800)     | 28–32px        | "1,284"                         |
| Delta / trend  | `--fw-semibold` (600)                        | 12px           | "+6.1%"                         |
| Metadata       | `--fw-normal` (400)                          | 11px           | "Updated 12 sec ago"            |
| Nav labels     | `--fw-medium` (500), active: `--fw-semibold` | 13px           | "Overview"                      |

Font stack: `system-ui, -apple-system, sans-serif` — no external font dependency.
Letter spacing: uppercase labels use `0.08em`.

---

### Component Style Rules

#### Glass Depth System

All panels and cards must layer three properties together:

1. `backdrop-filter: blur(…)` — establishes glass plane
2. `border: 1px solid var(--border-default)` — outer definition
3. `box-shadow: inset 0 1px 0 var(--border-inner)` — inner top highlight

This trio creates the enterprise glass depth that separates this UI from a flat dashboard.

#### Directional Card Lighting

Cards receive directional light from the top-left:

```
background: linear-gradient(135deg, <top-left-tint> 0%, <base-color> 100%)
```

Example (KPI card dark): `linear-gradient(135deg, #1e2d4a 0%, #1a2342 100%)`

Bottom-right is always the base layer color — never brighter than top-left.

#### Border Treatment

```
border: 1px solid var(--border-default)           /* outer definition */
box-shadow: inset 0 1px 0 var(--border-inner)     /* inner top highlight */
```

On active/hover, border transitions to `var(--border-highlight)` (`rgba(56,189,248,0.35)`).

#### Border Radius Scale (Strict)

| Element            | Token             | Value |
| ------------------ | ----------------- | ----- |
| Full-screen panels | `--radius-panel`  | 24px  |
| Cards, modals      | `--radius-card`   | 18px  |
| Buttons            | `--radius-button` | 14px  |
| Chips, badges      | `--radius-chip`   | 999px |
| Inputs             | `--radius-input`  | 10px  |
| Small elements     | `--radius-sm`     | 8px   |

#### Shadow System (Layered)

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.25), 0 2px 8px rgba(0, 0, 0, 0.2);
--shadow-card:
  0 1px 2px rgba(0, 0, 0, 0.3), 0 8px 24px rgba(0, 0, 0, 0.3),
  0 20px 60px rgba(0, 0, 0, 0.18);
--shadow-card-hover:
  0 1px 3px rgba(0, 0, 0, 0.35), 0 12px 32px rgba(0, 0, 0, 0.38),
  0 24px 72px rgba(0, 0, 0, 0.24), 0 0 0 1px rgba(56, 189, 248, 0.2);
```

#### Motion Scale (Strict)

| Duration Token  | Value | Use                                |
| --------------- | ----- | ---------------------------------- |
| `--duration-sm` | 150ms | Hover states, color transitions    |
| `--duration-md` | 250ms | Card lifts, panel transitions      |
| `--duration-lg` | 350ms | Modal open/close, page transitions |

Easing: `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` for entrances. `--ease-in-out` for toggles.

---

## 3. Layout Architecture

### Global Layout

```
┌─────────────────────────────────────────────────────┐
│  HEADER (58px fixed top)                            │
│  [☰ Menu]  [Brand Title]  [Status] [Theme] [User]  │
├────────────┬────────────────────────────────────────┤
│            │                                        │
│  SIDEBAR   │   MAIN CONTENT AREA                    │
│  240px     │   flex-1, scrollable                   │
│  fixed     │                                        │
│            │                                        │
└────────────┴────────────────────────────────────────┘
```

- Header: `height: 58px`, `position: fixed`, `z-index: 300`
- Sidebar: `width: 240px`, `position: fixed`, `top: 58px`, `z-index: 200`
- Main: `margin-left: 240px`, `padding-top: 58px`, page-specific inner layout

On mobile: sidebar collapses to off-canvas drawer with overlay backdrop.

---

### Screen Regions by Page

#### Overview Page (Primary focal page)

```
┌───────────────────────────────────────────────┐
│  Page Header + Date Range Picker              │
├───────┬───────┬───────┬───────────────────────┤
│  KPI  │  KPI  │  KPI  │  KPI  (4-col grid)    │
├───────┴───────┴───────┴───────────────────────┤
│  API Activity Chart (large, full-width)        │
├──────────────────────┬────────────────────────┤
│  Active Alerts       │  Recent API Logs        │
│  (left ~40%)         │  (right ~60%)           │
└──────────────────────┴────────────────────────┘
```

#### Insights Page

```
┌───────────────────────────────────────────────┐
│  Insights Cards (ML-generated, 3-col)          │
├───────────────────────────────────────────────┤
│  Forecast Chart (full-width, purple accent)    │
├───────────────────────────────────────────────┤
│  Anomaly Alert List                            │
└───────────────────────────────────────────────┘
```

#### API Logs Page

```
┌───────────────────────────────────────────────┐
│  Filter Bar (search + method + status filters) │
├───────────────────────────────────────────────┤
│  API Logs Table (paginated, sortable)          │
│  → row hover highlight                         │
│  → alternating row opacity                     │
└───────────────────────────────────────────────┘
```

#### Alerts Page

```
┌──────────────────────┬────────────────────────┐
│  Alert Rule Builder  │  Alert History          │
│  (left panel)        │  (right panel)          │
└──────────────────────┴────────────────────────┘
```

#### Audit Log, Users, Reports, Exports, Settings

Standard single-column layout: filter bar → table/form → pagination/actions.

---

## 4. Component System

### 4.1 Header

**Purpose:** Global navigation anchor, live system status, user identity, theme toggle.

**State behavior:**

- Renders `ConnectionStatus` as live pulsing dot when WebSocket is connected
- Theme button toggles `html.dark` class, persisted to localStorage
- Hamburger triggers sidebar drawer on mobile

**Props:**

```ts
onMenuToggle?: () => void
```

**Visual rules:**

- Background: `var(--layer-1)` with `border-bottom: 1px solid var(--border-default)`
- Brand title: `--fw-semibold`, `--accent-primary` tint or white — visually anchored left
- User section: right-aligned flex row, `gap: 12px`

---

### 4.2 Sidebar

**Purpose:** Primary navigation. Role-filtered nav items. Communicates current page context.

**State behavior:**

- `active` item: bright background, left inset accent bar (`inset 3px 0 0 var(--accent-primary)`)
- `hover` item: `rgba(56,189,248,0.06)` background fill, `--text-secondary` text
- `idle` item: transparent, `--text-tertiary` (lower opacity, pushes visual weight down)
- Items filtered by `user.role` at render time — no client-side permission bypass

**Props:**

```ts
isOpen?: boolean
onClose?: () => void
```

**Nav items (role-gated):**
| Label | Path | Min Role |
|---|---|---|
| Overview | `/` | any |
| Users | `/users` | any |
| API Logs | `/api-logs` | analyst |
| Insights | `/insights` | analyst |
| Alerts | `/alerts` | analyst |
| Audit Log | `/audit-log` | admin |
| Dashboards | `/dashboard-builder` | any |
| Reports | `/reports` | admin |
| Exports | `/exports` | any |
| API Keys | `/api-keys` | any |
| Org Settings | `/org-settings` | admin |
| Settings | `/settings` | admin |

**Visual rules:**

- Width: 240px, background: `linear-gradient(180deg, #0d1829 0%, #0F172A 100%)`
- Nav items: `border-radius: var(--radius-sm)`, `transition: all var(--duration-sm)`
- Icons: emoji currently; future target = SVG icon set for visual consistency

---

### 4.3 KPICard

**Purpose:** Surface a single business metric with trend context and metadata.

**State behavior:**

- Hover: `transform: scale(1.01)`, shadow transitions from `--shadow-card` to `--shadow-card-hover`
- Trend direction drives color: green (`--accent-success`) for up, rose (`--accent-error`) for down
- Neutral/no trend: no delta chip rendered

**Props:**

```ts
{
  name: string                        // e.g. "ACTIVE USERS"
  value: number
  unit?: string                       // e.g. "$", "ms"
  trend?: { direction: 'up'|'down'; percent: number }
  context?: string                    // e.g. "vs last 24h"
  updatedAt?: string                  // e.g. "Updated 12 sec ago"
  sparkline?: number[]                // micro trend array (7 points)
}
```

**Composition (A+ layout):**

```
[ icon ]  [ LABEL (uppercase 11px) ]
[ Value (700–800 weight, 28–32px)  ]
[ Sparkline (micro, 40x20px)       ]
[ Delta chip ]  [ Context text     ]
[ Updated metadata (tertiary)      ]
```

**Visual rules:**

- Background: `linear-gradient(135deg, #1e2d4a 0%, #1a2342 100%)`
- Top accent border: `border-top: 2px solid var(--accent-primary)`
- Border radius: `var(--radius-card)`
- Hover: `box-shadow: var(--shadow-card-hover)`, border-color to `var(--border-highlight)`

---

### 4.4 APIActivityChart

**Purpose:** Primary data visualization. Shows request volume over time, center-stage on Overview.

**State behavior:**

- Renders real-time via WebSocket updates or polling
- Supports date range filtering from `DateRangePicker`
- Tooltip on data point hover

**Props:**

```ts
{
  data: { timestamp: string; count: number; errors: number }[]
  dateRange: { start: Date; end: Date }
  isLive?: boolean
}
```

**Visual rules:**

- Full-width card, `min-height: 280px`
- Dual series: requests (sky blue) + errors (rose)
- Chart area background: `var(--layer-1)` inside `var(--layer-2)` card
- "● LIVE" indicator when `isLive=true`: softly pulsing dot at `2.5s` cycle

---

### 4.5 ConnectionStatus

**Purpose:** Indicate WebSocket connection state inline in the header.

**State behavior:**

- `connected`: mint dot, slow glow breathing animation `2.5s ease-in-out infinite`
- `connecting`: amber dot, faster pulse
- `disconnected`: rose dot, static

**Visual rules:**

- Dot: `8px × 8px`, `border-radius: 50%`
- Text: `--text-tertiary`, `--fw-medium`, `11px`
- No text on mobile — dot only

---

### 4.6 StatusChip

**Purpose:** Render semantic status as a pill badge (used in logs, alerts, users table).

**State behavior:**

- Glow breathing at `2.5s` cycle for `running` / `healthy` states — not a ping animation, a soft opacity oscillation
- Static for terminal states (`error`, `off`, `inactive`)

**Props:**

```ts
{
  status: 'running' | 'healthy' | 'degraded' | 'error' | 'off' | 'inactive' | 'pending'
  label?: string   // override display label
  pulse?: boolean  // enable breathing animation
}
```

**Color map:**
| Status | Background | Text |
|---|---|---|
| running / healthy | `--accent-success-dim` | `--accent-success` |
| degraded / pending | `--accent-warning-dim` | `--accent-warning` |
| error | `--accent-error-dim` | `--accent-error` |
| off / inactive | `rgba(100,116,139,0.12)` | `#64748B` |

**Visual rules:**

- `border-radius: var(--radius-chip)`, `padding: 3px 10px`
- `font-size: 11px`, `font-weight: --fw-semibold`, uppercase
- `border: 1px solid <text-color-at-20%-opacity>`

---

### 4.7 APILogsTable

**Purpose:** Paginated, sortable table of API request logs.

**State behavior:**

- Row hover: `background: rgba(56,189,248,0.04)` — full-width highlight
- Alternating rows: odd rows at base opacity, even rows at `rgba(255,255,255,0.015)` tint
- Clickable rows expand detail inline or open a side drawer
- Sort column header shows arrow icon

**Props:**

```ts
{
  logs: APILog[]
  isLoading: boolean
  filters: LogFilters
  onPageChange: (page: number) => void
  totalCount: number
}
```

**Column set:** Timestamp · Method · Path · Status · Latency (ms) · User/Key · IP

**Visual rules:**

- Soft separators between rows: `border-bottom: 1px solid var(--border-subtle)`
- Method badges use `StatusChip` pattern: GET=sky, POST=mint, DELETE=rose, PATCH=amber
- Latency > 1000ms highlighted in amber; latency > 3000ms in rose

---

### 4.8 AlertNotification / AlertHistory

**Purpose:** Surface active and historical alert events with severity context.

**State behavior:**

- New/active alerts: left accent bar `var(--accent-error)` or `var(--accent-warning)`
- Dismissed alerts: muted, reduced opacity
- Alert rule builder: form-based, validates threshold + metric + window

**Props:**

```ts
{
  alerts: Alert[]
  onDismiss: (id: string) => void
  onViewRule: (ruleId: string) => void
}
```

---

### 4.9 ForecastChart

**Purpose:** Display ML-generated forecast trend with confidence interval.

**Props:**

```ts
{
  actuals: {
    date: string;
    value: number;
  }
  [];
  forecast: {
    date: string;
    value: number;
    lower: number;
    upper: number;
  }
  [];
  metric: string;
}
```

**Visual rules:**

- Forecast region uses `--accent-purple` with `0.15` fill opacity
- Confidence band: very soft fill, `stroke-dasharray` on boundary lines
- "ML Forecast" label in `--accent-purple` in chart legend

---

### 4.10 AuditLogTable

**Purpose:** Read-only chronological record of admin/system actions.

**Visual rules:** Same table treatment as `APILogsTable`. Event type uses `StatusChip`-style badges. Row click opens `AuditEntryDetail` modal.

---

### 4.11 FilterBar

**Purpose:** Search + multi-filter controls above any table.

**Props:**

```ts
{
  onSearch: (q: string) => void
  filters: FilterConfig[]
  activeFilters: Record<string, string>
  onFilterChange: (key: string, value: string) => void
}
```

**Visual rules:**

- Background: `var(--layer-1)`, `border-radius: var(--radius-card)`, `padding: 12px 16px`
- Search input: `border-radius: var(--radius-input)`, focus ring `var(--border-highlight)`
- Filter chips: `StatusChip`-style, removable with `×`

---

### 4.12 DashboardEditor / WidgetLibrary

**Purpose:** Drag-and-drop custom dashboard builder. Users compose layouts from a widget palette.

**State behavior:**

- Drag ghost: semi-transparent clone of widget at `0.7` opacity
- Drop zone highlight: dashed border `var(--accent-primary)` when drag-over
- Selected widget: `box-shadow: var(--shadow-card-hover)`

---

### 4.13 ExportButton / ExportJobForm

**Purpose:** Trigger async data exports (CSV, PDF). Show job status inline.

**State behavior:**

- Pending: amber `StatusChip` + spinner
- Complete: mint `StatusChip` + download link
- Failed: rose `StatusChip` + retry option

---

## 5. Data Model (Frontend Mock Layer)

### User

```ts
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "analyst" | "viewer";
  status: "active" | "inactive" | "pending";
  createdAt: string;
  lastLogin: string | null;
  orgId: string;
}
```

### KPI Metric

```ts
interface KPIMetric {
  id: string;
  name: string;
  value: number;
  unit?: string;
  trend?: { direction: "up" | "down"; percent: number };
  context?: string; // "vs last 24h"
  updatedAt: string;
  sparkline?: number[]; // 7-point array for micro trend
}
```

**Mock seed values:**

```json
[
  {
    "id": "active_users",
    "name": "Active Users",
    "value": 1284,
    "trend": { "direction": "up", "percent": 6.1 },
    "context": "vs last 24h",
    "sparkline": [980, 1020, 1100, 1150, 1200, 1260, 1284]
  },
  {
    "id": "api_requests",
    "name": "API Requests",
    "value": 48720,
    "unit": "",
    "trend": { "direction": "up", "percent": 12.4 },
    "sparkline": [38000, 41000, 43500, 45200, 46800, 47900, 48720]
  },
  {
    "id": "error_rate",
    "name": "Error Rate",
    "value": 0.82,
    "unit": "%",
    "trend": { "direction": "down", "percent": 0.3 }
  },
  {
    "id": "revenue",
    "name": "Revenue",
    "value": 24850,
    "unit": "$",
    "trend": { "direction": "up", "percent": 3.7 },
    "sparkline": [21000, 21800, 22400, 23100, 23900, 24400, 24850]
  }
]
```

### API Log Entry

```ts
interface APILog {
  id: string;
  timestamp: string; // ISO 8601
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  statusCode: number;
  latencyMs: number;
  userId: string | null;
  apiKeyId: string | null;
  ip: string;
  orgId: string;
}
```

### Alert

```ts
interface Alert {
  id: string;
  ruleId: string;
  ruleName: string;
  severity: "critical" | "warning" | "info";
  message: string;
  status: "active" | "acknowledged" | "resolved";
  triggeredAt: string;
  resolvedAt: string | null;
  metric: string;
  threshold: number;
  currentValue: number;
}
```

### Alert Rule

```ts
interface AlertRule {
  id: string;
  name: string;
  metric: "error_rate" | "latency_p99" | "request_count" | "active_users";
  condition: "gt" | "lt" | "gte" | "lte";
  threshold: number;
  windowMinutes: number;
  severity: "critical" | "warning" | "info";
  enabled: boolean;
  notifyChannels: ("email" | "webhook" | "in_app")[];
}
```

### Audit Entry

```ts
interface AuditEntry {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string; // e.g. "user.update", "api_key.create"
  targetType: string;
  targetId: string;
  targetLabel: string;
  metadata: Record<string, unknown>;
  timestamp: string;
  ip: string;
  orgId: string;
}
```

### Connection State

```ts
type ConnectionState = "connected" | "connecting" | "disconnected";
```

### Status States

```ts
type SystemStatus =
  | "running"
  | "healthy"
  | "degraded"
  | "error"
  | "off"
  | "inactive"
  | "pending";
```

---

## 6. Interaction Flows

### 6.1 Login

1. User lands on `/login`
2. Enters email + password → POST `/api/auth/login`
3. On success: JWT stored, `user` context populated, redirect to `/`
4. On failure: inline error message below form (rose, no page reload)
5. Role fetched from JWT payload — gates sidebar rendering immediately

---

### 6.2 Overview Dashboard Load

1. Page mounts → parallel fetch: KPI metrics + API activity chart data + active alerts
2. KPI cards render with loading skeleton (shimmer pulse at `--duration-md`)
3. Data arrives → values animate in (count-up over `350ms`)
4. WebSocket connects → `ConnectionStatus` transitions to `connected` (mint)
5. Live data updates stream in → chart updates without full re-render

---

### 6.3 API Log Inspection

1. User navigates to `/api-logs`
2. Default view: last 100 entries, sorted by timestamp descending
3. User types in FilterBar search → 150ms debounce → filtered results
4. User clicks method badge chip → filter applied, URL query param updated
5. User clicks a log row → row expands or side panel opens with full request detail
6. User clicks "Export" → `ExportJobForm` modal opens, selects format, submits
7. Export job status shown via `StatusChip` — auto-updates on completion

---

### 6.4 Alert Rule Creation

1. User navigates to `/alerts`
2. Clicks "New Rule" → `AlertRuleBuilder` form slides in or expands
3. Selects metric, condition, threshold, window, severity, notification channels
4. Real-time preview: "This rule would have fired X times in the last 7 days"
5. Submits → rule appears in list as enabled with mint `StatusChip`
6. If threshold is immediately breached: alert fires, appears in `AlertHistory` with rose severity

---

### 6.5 Alert Acknowledgement

1. Active alert displayed in overview panel and `/alerts` page
2. Operator clicks "Acknowledge" → status transitions `active → acknowledged`
3. `StatusChip` transitions from rose → amber, glow fades
4. Entry logged to audit trail automatically

---

### 6.6 Dashboard Builder

1. User navigates to `/dashboard-builder`
2. `DashboardSwitcher` shows list of saved dashboards + "Create New"
3. User enters edit mode → `WidgetLibrary` panel opens on right
4. User drags widget to canvas grid → drop zone highlights during drag
5. Widget placed, immediately renders with mock/live data
6. User clicks "Save" → layout persisted to backend (or localStorage fallback)
7. Switching dashboards: animated crossfade `var(--duration-md)`

---

### 6.7 Theme Toggle

1. User clicks theme button in header
2. `html.dark` class removed/added → all `var(--*)` CSS tokens swap instantly
3. `localStorage.setItem('theme', value)` persisted
4. Transition: `transition: background-color var(--duration-md), color var(--duration-sm)` on `body`

---

### 6.8 Error Handling Behavior

- **Network failure:** Toast notification (rose, top-right, 4s auto-dismiss) + stale data retained on screen
- **401 Unauthorized:** Silent redirect to `/login`, session cleared
- **403 Forbidden:** Inline message in the affected component area — no redirect
- **422 Validation errors:** Field-level inline error messages beneath inputs
- **WebSocket disconnect:** `ConnectionStatus` transitions to amber then rose, auto-reconnect with backoff, no data loss on reconnect

---

## 7. Screenshot Composition Strategy

### Primary Focal Element

**KPI Cards row (4-up)** — highest contrast, most visually immediate, communicates product value at a glance. Must show at least 2 cards with active trend chips (one up/green, one down/rose).

### Secondary Supporting Elements

- **API Activity Chart** directly below — large, blue/rose dual-series, reinforces the "live data" narrative
- **ConnectionStatus** in header showing "● LIVE" (mint dot, connected state) — signals real-time capability

### Tertiary Elements

- Active alerts panel (left lower zone) — at least 1 critical (rose) and 1 warning (amber) alert visible
- API Logs table (right lower zone) — at minimum 5–6 rows, mix of 200/400/500 status codes
- Sidebar: active item highlighted (Overview), 4–5 nav items visible below it

### Single-Frame Composition Rules

- **Viewport:** 1440×900px minimum for screenshot capture
- **Dark theme only** for portfolio/showcase shots — higher contrast drama
- Sidebar open, fully visible
- Header: show user name + connected status + theme toggle
- At least one `StatusChip` in each severity color visible in the frame (mint, amber, rose)
- No loading spinners or skeleton states — fully resolved data only
- Date range picker showing a meaningful range (e.g., "Last 7 days")

### Page-Specific Screenshot Targets

| Page              | Hero element                         | Secondary                |
| ----------------- | ------------------------------------ | ------------------------ |
| Overview          | KPI cards + chart                    | Alerts panel             |
| Insights          | Forecast chart (purple)              | Anomaly alerts           |
| API Logs          | Full table with method badges        | FilterBar active         |
| Audit Log         | Table with action type chips         | Entry detail drawer open |
| Alerts            | Alert rule form + history            | Severity mix             |
| Dashboard Builder | Custom layout + widget library panel | —                        |

---

## 8. Polish Upgrade Priorities

Ranked by portfolio impact and implementation cost ratio:

| Priority | Change                                                       | Impact                            |
| -------- | ------------------------------------------------------------ | --------------------------------- |
| 1        | Visual hierarchy via 4-layer depth system                    | Immediate perceived quality lift  |
| 2        | Hover + motion system (`scale(1.01)`, `--duration-*`)        | UI feels alive while interacting  |
| 3        | KPI card micro context (sparkline, "Updated X ago")          | Signals product maturity          |
| 4        | Status chip glow breathing animation (`2.5s`, not ping)      | Enterprise-grade feel             |
| 5        | Ambient background (radial gradient + noise at 2–5% opacity) | Depth without distraction         |
| 6        | Typography hierarchy enforcement (400/500/600/700/800 scale) | Visual organization, scannability |
| 7        | Better sidebar opacity tiers (active/hover/idle contrast)    | Navigation clarity                |
| 8        | Log table row hover + alternating opacity                    | Readability                       |
| 9        | "● LIVE" animated dot in chart + header                      | Real-time credibility             |
| 10       | Button microinteractions (depress on click + release)        | Tactile premium feel              |

---

_This specification is the single source of truth for UI implementation decisions. All component builds, CSS tokens, and interaction patterns downstream should reference and remain consistent with this document._
