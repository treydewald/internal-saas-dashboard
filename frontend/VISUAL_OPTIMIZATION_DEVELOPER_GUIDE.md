# Visual Optimization — Developer Implementation Guide
**Quick Reference for Implementing T4-11 & T4-12 Visual Polish**

---

## 1. STATUSCHIP COMPONENT (T4-07 Foundational Requirement)

### Implementation (New File: `src/components/StatusChip.tsx`)

```tsx
import React from 'react';
import styles from './StatusChip.module.css';

export type StatusState = 'healthy' | 'running' | 'degraded' | 'warning' | 'error' | 'off' | 'inactive' | 'pending';

interface StatusChipProps {
  state: StatusState;
  label?: string;
  pulse?: boolean;
  updatedAt?: string;
}

const STATUS_CONFIG: Record<StatusState, { color: string; bgColor: string; label: string }> = {
  healthy: { color: 'var(--accent-success)', bgColor: 'var(--accent-success-dim)', label: 'Healthy' },
  running: { color: 'var(--accent-primary)', bgColor: 'var(--accent-primary-dim)', label: 'Running' },
  degraded: { color: 'var(--accent-warning)', bgColor: 'var(--accent-warning-dim)', label: 'Degraded' },
  warning: { color: 'var(--accent-warning)', bgColor: 'var(--accent-warning-dim)', label: 'Warning' },
  error: { color: 'var(--accent-error)', bgColor: 'var(--accent-error-dim)', label: 'Error' },
  off: { color: 'var(--text-muted)', bgColor: 'rgba(148,163,184,0.08)', label: 'Off' },
  inactive: { color: 'var(--text-muted)', bgColor: 'rgba(148,163,184,0.08)', label: 'Inactive' },
  pending: { color: 'var(--accent-warning)', bgColor: 'var(--accent-warning-dim)', label: 'Pending' },
};

export const StatusChip: React.FC<StatusChipProps> = ({ 
  state, 
  label, 
  pulse = false,
  updatedAt 
}) => {
  const config = STATUS_CONFIG[state];
  const displayLabel = label || config.label;
  const shouldAnimate = pulse && (state === 'running' || state === 'healthy');

  return (
    <div
      className={`${styles.chip} ${shouldAnimate ? styles.breathing : ''}`}
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
        borderColor: `${config.color}20`, // 20% opacity
      }}
      title={updatedAt ? `Updated: ${updatedAt}` : undefined}
    >
      {displayLabel}
    </div>
  );
};
```

### Styling (`src/components/StatusChip.module.css`)

```css
.chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: var(--fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border: 1px solid;
  border-radius: var(--radius-chip);
  white-space: nowrap;
  transition: all var(--duration-sm) var(--ease-out);
}

.breathing {
  animation: breathe 2.5s var(--ease-in-out) infinite;
}

@keyframes breathe {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}
```

### Usage Examples

```tsx
// User status
<StatusChip state="healthy" label="Active" />

// Running workflow
<StatusChip state="running" pulse={true} label="Running" />

// Error state
<StatusChip state="error" label="Failed" />

// HTTP status indicator
<StatusChip state={statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warning' : 'healthy'} />
```

---

## 2. TABLE BADGE WRAPPERS

### MethodBadge (`src/components/MethodBadge.tsx`)

```tsx
import React from 'react';
import { StatusChip } from './StatusChip';

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface MethodBadgeProps {
  method: HTTPMethod;
}

const METHOD_STATE_MAP: Record<HTTPMethod, 'healthy' | 'running' | 'warning' | 'error'> = {
  GET: 'healthy',      // sky
  POST: 'running',     // mint
  PATCH: 'warning',    // amber
  PUT: 'warning',      // amber
  DELETE: 'error',     // rose
};

export const MethodBadge: React.FC<MethodBadgeProps> = ({ method }) => {
  return <StatusChip state={METHOD_STATE_MAP[method]} label={method} />;
};
```

### StatusCodeBadge (`src/components/StatusCodeBadge.tsx`)

```tsx
import React from 'react';
import { StatusChip } from './StatusChip';

interface StatusCodeBadgeProps {
  code: number;
}

export const StatusCodeBadge: React.FC<StatusCodeBadgeProps> = ({ code }) => {
  let state: 'healthy' | 'running' | 'warning' | 'error' | 'degraded' = 'healthy';
  
  if (code >= 500) state = 'error';
  else if (code >= 400) state = 'warning';
  else if (code >= 300) state = 'running';
  else if (code >= 200) state = 'healthy';

  return <StatusChip state={state} label={String(code)} />;
};
```

---

## 3. TABLE ROW POLISH (T4-12)

### Add to `globals.css`

```css
/* Table Row Utilities */
.table-row {
  transition: background-color var(--duration-sm) var(--ease-out);
  cursor: pointer;
}

.table-row:nth-child(even) {
  background-color: rgba(255, 255, 255, 0.015);
}

.table-row:hover {
  background-color: rgba(56, 189, 248, 0.04);
}

.table-row--selected {
  background-color: rgba(56, 189, 248, 0.06);
  border-left: 3px solid var(--accent-primary);
}

/* Table separators - replace hard borders with soft separators */
.table tbody tr {
  border-bottom: 1px solid var(--border-subtle);
}

/* Strong header styling */
.table thead th {
  font-size: 11px;
  font-weight: var(--fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background-color: rgba(15, 23, 42, 0.02);
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-primary);
}

.table tbody td {
  padding: 10px 16px;
}
```

### Update Table Components

**Before:**
```tsx
<table>
  <tr>
    <td>{item.method}</td>
    <td>{item.status}</td>
    <td>{item.latency}ms</td>
  </tr>
</table>
```

**After:**
```tsx
<table className="table">
  <thead>
    <tr>
      <th>Method</th>
      <th>Status</th>
      <th>Latency</th>
    </tr>
  </thead>
  <tbody>
    {items.map((item) => (
      <tr 
        key={item.id}
        className={`table-row ${selectedId === item.id ? 'table-row--selected' : ''}`}
        onClick={() => setSelectedId(item.id)}
      >
        <td><MethodBadge method={item.method} /></td>
        <td><StatusCodeBadge code={item.status} /></td>
        <td style={item.latency >= 3000 ? { color: 'var(--accent-error)' } : {}}>
          {item.latency}ms
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

---

## 4. CARD GLASS-DEPTH TREATMENT (T4-11)

### Add to `globals.css`

```css
/* Glass-depth card system */
.glass-panel {
  background-color: var(--layer-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-card);
  backdrop-filter: blur(4px);
  box-shadow: inset 0 1px 0 var(--border-inner);
  transition: all var(--duration-md) var(--ease-out);
}

.glass-panel:hover {
  border-color: var(--border-highlight);
  box-shadow: 
    var(--shadow-card-hover),
    inset 0 1px 0 var(--border-inner);
  transform: scale(1.01);
}

/* Directional gradient lighting */
.card-gradient {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
}
```

### Update KPICard Component

```tsx
export const KPICard: React.FC<KPICardProps> = ({ ... }) => {
  const accent = ACCENT_COLORS[accentIndex];

  return (
    <article
      className="glass-panel"  // <- Add this class
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${accent.gradient})`, // <- Add gradient
      }}
    >
      <div className="card-gradient" />  {/* <- Add gradient overlay */}
      
      {/* Existing card content */}
      ...
    </article>
  );
};
```

---

## 5. BREATHING ANIMATION FOR STATUS INDICATORS

### Add to `globals.css`

```css
@keyframes breathe {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

.status-breathing {
  animation: breathe 2.5s var(--ease-in-out) infinite;
}

/* Apply to specific elements */
.connection-status--connected,
.status-chip--running,
.status-chip--healthy {
  animation: breathe 2.5s var(--ease-in-out) infinite;
}
```

---

## 6. SIDEBAR OPACITY TIERS

### Add to `globals.css`

```css
/* Sidebar Navigation Opacity Tiers */
.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  margin: 4px 8px;
  border-radius: 8px;
  font-size: 13px;
  color: var(--text-tertiary);
  background-color: transparent;
  cursor: pointer;
  transition: all var(--duration-sm) var(--ease-out);
}

.nav-item:hover {
  color: var(--text-secondary);
  background-color: rgba(56, 189, 248, 0.06);
}

.nav-item--active {
  color: var(--text-primary);
  background-color: rgba(56, 189, 248, 0.12);
  border-left: 4px solid var(--accent-primary);
  padding-left: 8px;
}

/* Section anchoring */
.nav-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-subtle);
}

.nav-section-label {
  font-size: 10px;
  font-weight: var(--fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  padding: 0 12px;
  margin-bottom: 8px;
}
```

---

## 7. FORM FIELD STYLING

### Add to `globals.css`

```css
/* Form Field Styling */
input,
textarea,
select {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-input);
  background-color: var(--layer-2);
  color: var(--text-primary);
  transition: all var(--duration-sm) var(--ease-out);
}

input::placeholder,
textarea::placeholder {
  color: var(--text-tertiary);
}

input:hover,
textarea:hover,
select:hover {
  border-color: var(--border-highlight);
}

input:focus,
textarea:focus,
select:focus {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
  border-color: var(--accent-primary);
}

/* Form label styling */
label {
  display: block;
  font-size: 12px;
  font-weight: var(--fw-medium);
  color: var(--text-primary);
  margin-bottom: 6px;
}

/* Form group spacing */
.form-group {
  margin-bottom: 16px;
}

.form-group:last-child {
  margin-bottom: 0;
}

/* Helper text */
.form-helper {
  font-size: 11px;
  color: var(--text-tertiary);
  margin-top: 4px;
}

/* Form validation feedback */
.form-error {
  color: var(--accent-error);
  font-size: 11px;
  margin-top: 4px;
}

.form-success {
  color: var(--accent-success);
  font-size: 11px;
  margin-top: 4px;
}
```

---

## 8. DASHBOARD LAYOUT OPTIMIZATION

### Update `src/layouts/DashboardLayout.module.css`

```css
.content {
  flex: 1;
  margin-left: 240px;
  overflow-y: auto;
  padding: 32px 36px;  /* Keep these values */
  background-color: var(--layer-0);
  scrollbar-gutter: stable;
  
  /* Constrain max-width to prevent excessive width on ultra-wide screens */
  display: flex;
  flex-direction: column;
}

/* Ensure children don't grow excessively */
.content > * {
  max-width: 100%;
}
```

### Update OverviewPage Layout

```tsx
export const OverviewPage: React.FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '32px',  /* Standard spacing */
      maxWidth: '100%'
    }}>
      {/* Hero header - 60px */}
      <div style={{ ... }}>...</div>

      {/* KPI Cards - ~100px (4 cards in 1 row) */}
      <section style={{ ... }}>
        <p className="eyebrow">Key Performance Indicators</p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
        }}>
          <KPICards ... />
        </div>
      </section>

      {/* Activity Chart - ~280px */}
      <section style={{ ... }}>
        <APIActivityChart ... />
      </section>

      {/* Performance Breakdown - ~120px */}
      <section style={{ ... }}>
        <MetricsCards ... />
      </section>

      {/* Total: 60 + 100 + 32 + 280 + 32 + 120 = 624px (fits 772px available) */}
    </div>
  );
};
```

---

## 9. CHART OPTIMIZATION (APIActivityChart)

### Key Improvements

```tsx
// Reduce gridline visual noise
<CartesianGrid 
  strokeDasharray="3 3" 
  stroke="var(--border-subtle)"
  horizontal={true}
  vertical={false}  // Remove vertical gridlines
  verticalPoints={[0, 25, 50, 75, 100]}  // Only 4 horizontal lines
/>

// Improve label readability
<XAxis 
  dataKey="date" 
  tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
  tickFormatter={(date) => format(new Date(date), 'MMM d')}  // Show every 2-3 days
/>

// Enhanced tooltip
<Tooltip
  contentStyle={{
    backgroundColor: 'var(--layer-2)',
    border: `1px solid var(--border-default)`,
    borderRadius: 'var(--radius-card)',
    boxShadow: 'var(--shadow-card)',
  }}
  labelStyle={{ color: 'var(--text-primary)' }}
/>

// Smooth line rendering
<Line
  type="monotone"
  dataKey="requests"
  stroke="var(--accent-primary)"
  strokeWidth={2}
  dot={false}
  isAnimationActive={true}
  animationDuration={300}
/>
```

---

## 10. TESTING CHECKLIST

After implementing each optimization:

- [ ] **Visual Inspection:** Does it look better?
- [ ] **Consistency:** Does it match design system tokens?
- [ ] **Responsiveness:** Does it work on mobile (768px) and tablet (1024px)?
- [ ] **Dark Theme:** Does it work in dark mode?
- [ ] **Performance:** No layout shift, smooth animations?
- [ ] **Accessibility:** Focus states visible, color contrast OK?
- [ ] **Screenshot:** Take before/after screenshots
- [ ] **Score:** Re-evaluate on 1–10 scale

---

## 11. COMMON PATTERNS

### Spacing Grid
```
8px unit grid: 8, 16, 24, 32, 48, 64
- Card padding: 16px
- Gap between cards: 16px
- Section margin: 32px (top)
- Page padding: 32px (top/bottom), 36px (left/right)
```

### Color Mappings
```
Primary: --accent-primary (#2563EB)
Success: --accent-success (#16A34A)
Warning: --accent-warning (#D97706)
Error: --accent-error (#DC2626)
Info: --accent-info (#0284C7)

Dim variants: --accent-*-dim (background tints)
```

### Typography Scale
```
Values: 28-32px, --fw-bold or --fw-extrabold
Labels: 13-14px, --fw-semibold
Metadata: 11px, --fw-normal, --text-muted
```

### Duration Scale
```
--duration-sm: 150ms (quick feedback)
--duration-md: 250ms (hover/elevation)
--duration-lg: 350ms (major transitions)
```

---

## 12. QUICK COMMIT MESSAGES

```bash
# StatusChip foundation
git commit -m "feat(T4-07): implement StatusChip component with 8-state system"

# Table polish
git commit -m "feat(T4-12): apply premium table polish (badges, row treatment)"

# Visual depth
git commit -m "feat(T4-11): add glass-depth treatment and card hover lift"

# Navigation polish
git commit -m "feat(T4-11): implement sidebar opacity tiers and section anchoring"

# Dashboard optimization
git commit -m "feat(T4-08): optimize dashboard content density for viewport fit"
```

---

## RESOURCES

- **Design Tokens:** `src/styles/globals.css`
- **Optimization Plan:** `VISUAL_OPTIMIZATION_PLAN.md`
- **Audit Summary:** `VISUAL_AUDIT_SUMMARY.md`
- **Component Reference:** See component files in `src/components/`

---

## FINAL REMINDERS

✅ **Do:**
- Use CSS variables from globals.css
- Follow 8px spacing grid
- Test on multiple breakpoints
- Take screenshots after each feature
- Keep animations subtle (not over-designed)

❌ **Don't:**
- Use hardcoded colors or spacing values
- Create arbitrary animation durations
- Override focus states without clear affordance
- Skip accessibility testing
- Commit without screenshot validation

---

Good luck! You've got this. 🎨

