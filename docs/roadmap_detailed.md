# Tiered Feature Roadmap — Graphite Enterprise Analytics System

---

## Tier 1 (Core — Required for MVP)

### 1. User Authentication (Mock JWT)
- **Description:** Login page with email/password input; mock JWT token generation and storage in localStorage; logout functionality; protected routes redirect to login.
- **Key Components:** Login form, JWT token storage, session middleware, login page route, protected route wrapper

### 2. Database Schema & Core Tables
- **Description:** PostgreSQL schema definition for Users, API Logs, Metrics/KPIs, and Roles; migration scripts (Alembic); seed data generation (synthetic users and logs).
- **Key Components:** User table, API_Logs table, Metrics table, Roles table, migration files, seed script

### 3. FastAPI Backend Foundation
- **Description:** FastAPI app initialization, database connection setup (SQLAlchemy), middleware configuration (CORS, error handling), environment configuration (local dev + docker).
- **Key Components:** main.py, database.py, config.py, requirements.txt, Dockerfile

### 4. Dashboard Shell & Sidebar Navigation
- **Description:** React app skeleton with sidebar layout; navigation links to Overview, Users, API Logs, Reports, Settings; responsive layout; Graphite color theme (dark background, cyan primary, slate accents).
- **Key Components:** Layout wrapper, Sidebar component, Navigation links, routing structure (React Router), TailwindCSS theme config

### 5. KPI Cards Component (Static Data)
- **Description:** Four KPI cards displaying Active Users, API Requests, Error Rate, and Revenue; cards fetch from `/api/analytics/kpis` endpoint; display metric, value, and trend indicator (optional arrow).
- **Key Components:** KPI Card component, KPI API endpoint (FastAPI), KPI aggregation logic (backend), KPI display container

### 6. User Management CRUD API & Backend Logic
- **Description:** REST endpoints for CRUD operations on users: `GET /api/users` (list, filterable), `POST /api/users` (create), `GET /api/users/{id}`, `PUT /api/users/{id}` (edit), `DELETE /api/users/{id}`. Database queries via SQLAlchemy.
- **Key Components:** User model (SQLAlchemy), user routes (FastAPI), database queries, request/response schemas (Pydantic)

### 7. Users Table UI Component
- **Description:** Display paginated list of users in table format (columns: Name, Plan, Usage %, Status); fetch from `/api/users` endpoint; basic sorting and pagination controls.
- **Key Components:** Users table component, table headers, row rendering, pagination controls, data fetching (Axios)

### 8. API Logs Endpoint & Display
- **Description:** REST endpoint `GET /api/api-logs` returning paginated API request logs; display in table (columns: Timestamp, Endpoint, Status, Response Time); mock or seed realistic log data.
- **Key Components:** API_Logs model, API logs route, API logs table component, pagination

### 9. API Activity Chart (Line Chart)
- **Description:** Line chart showing API request volume over past 7 days; fetch aggregated data from `/api/analytics/api-activity` endpoint; display time-series data using Recharts.
- **Key Components:** Chart component (Recharts), API activity aggregation endpoint (backend), time-series data formatting

### 10. Role-Based Access Control (Backend)
- **Description:** Enforce role-based permissions on backend endpoints; extract user role from JWT token; middleware checks role before allowing endpoint access; return 403 Forbidden if insufficient permissions.
- **Key Components:** Role enum (Admin, Analyst, Viewer), permission decorator/middleware (FastAPI), role extraction from token, role-permission mapping

### 11. Role-Based UI Rendering (Frontend)
- **Description:** Frontend reads user role from auth state; conditionally render or hide features based on role (e.g., Users table only for Admin, API Logs only for Admin/Analyst).
- **Key Components:** Role context/state management, conditional rendering helpers, feature visibility flags

---

## Tier 2 (Enhancements — Improves Product Value)

### 1. Advanced Filtering & Search
- **Description:** Search bar and filter dropdowns on Users and API Logs tables; filter by date range, status, plan type, endpoint; persist filter state in URL query params; backend applies filters in SQL queries.
- **Key Components:** Filter UI components (input, select, date picker), filter state management, query param utilities, backend filter logic (SQL WHERE clauses)

### 2. Report Export (PDF/CSV)
- **Description:** Button on dashboard and reports page to export KPI snapshot or user list as CSV or PDF; include date range, filters applied, and timestamp.
- **Key Components:** Export button, CSV generation (backend or frontend), PDF generation (frontend library like jsPDF or backend via reportlab), export endpoint (FastAPI)

### 3. User Detail View & Inline Editing
- **Description:** Click user row in table to open modal/sidebar showing full user details; allow inline editing of name, plan, status; save via PUT endpoint.
- **Key Components:** User detail modal/sidebar, form fields, edit/save buttons, error handling, PUT request handler

### 4. Settings Panel
- **Description:** Settings page accessible from sidebar; displays user profile (name, email, role), options to change password (mock), API key management (display/regenerate), notification preferences (future).
- **Key Components:** Settings page layout, profile section, API key section, preferences section, update endpoints (FastAPI)

### 5. Dark/Light Theme Toggle
- **Description:** Theme toggle button in header/settings; apply light or dark theme via CSS classes or Tailwind dark mode; persist preference to localStorage.
- **Key Components:** Theme toggle button, theme context/provider, CSS variables or Tailwind dark mode config, localStorage persistence

### 6. Date Range Filtering
- **Description:** Calendar/date picker UI for filtering KPI cards and charts by custom date ranges; defaults to last 7 days; updates KPI cards and charts on selection.
- **Key Components:** Date range picker component, date range state management, query param updates, backend date filtering logic

### 7. Real-Time KPI Updates (Polling)
- **Description:** KPI cards refresh every 30 seconds via polling the `/api/analytics/kpis` endpoint; optional loading state or subtle animation during refresh.
- **Key Components:** useEffect polling hook, polling interval management, loading states, refresh animation

### 8. Advanced Data Aggregation & Metrics
- **Description:** Backend calculates derived metrics (growth %, churn rate, revenue per user, API success rate); expose via new endpoints; display on dashboard or reports page.
- **Key Components:** Aggregation logic (SQL or Python), new metrics endpoints (FastAPI), metrics display components

### 9. Responsive Mobile Layout
- **Description:** Sidebar collapses on mobile; KPI cards stack vertically; table becomes card-based or horizontal scroll on small screens; maintain full functionality.
- **Key Components:** Responsive grid layout, mobile menu toggle, responsive table/card rendering, mobile-first CSS

---

## Tier 3 (Advanced — Future / Complex)

### 1. Custom Dashboards
- **Description:** Allow users to create custom dashboards by selecting metrics, charts, and tables; save dashboard configuration (name, layout, widget selections); load saved dashboards.
- **Key Components:** Dashboard builder UI, dashboard configuration schema, dashboard CRUD endpoints, user dashboard preferences table, dashboard layout engine

### 2. Scheduled Reports
- **Description:** Users configure automated reports (daily, weekly, monthly); system generates and emails reports at scheduled intervals; report templates and distribution list.
- **Key Components:** Report scheduling UI, cron job scheduler (Celery or APScheduler), email service integration, report template engine, scheduled report table

### 3. Real-Time WebSocket Updates
- **Description:** Replace polling with WebSocket connections for live KPI and log updates; server pushes new data to connected clients; sub-second latency.
- **Key Components:** WebSocket server (FastAPI WebSockets), WebSocket client connection (frontend), message schema, error handling and reconnection logic

### 4. Alerting System
- **Description:** Configure alerts if KPIs exceed thresholds (error rate > 5%, revenue drop > 10%, etc.); send alerts via in-app notifications or email; alert history log.
- **Key Components:** Alert configuration schema, alert rules engine, threshold evaluation logic, notification service, alert history table, alert UI components

### 5. Audit Logging
- **Description:** Immutable log of all admin actions (user creation, data modifications, settings changes); includes timestamp, user, action, old/new values; queryable audit log page.
- **Key Components:** Audit log table, audit log entry creation on mutations, audit log query/display page, audit trail integrity checks

### 6. API Key Management & Rate Limiting
- **Description:** Allow users to generate, view, and revoke API keys for programmatic dashboard access; implement rate limiting per API key; track API key usage.
- **Key Components:** API key generation/storage logic, API key validation middleware, rate limiting decorator (FastAPI), API key table, key management UI

### 7. Multi-Organization Support
- **Description:** System supports multiple isolated organizations; each organization has its own users, data, dashboards, and API keys; user belongs to one or more organizations.
- **Key Components:** Organization table, organization foreign keys on all tables, organization middleware (enforce org isolation), org switching UI, org-aware queries

### 8. Data Export & Bulk Operations
- **Description:** Bulk export of users, API logs, or metrics in JSON, CSV, or Parquet; scheduled export jobs; S3 or cloud storage integration for large datasets.
- **Key Components:** Export job schema, background export job queue, cloud storage client (boto3 for S3), export job status tracking, download link generation

### 9. Machine Learning Insights (Advanced)
- **Description:** Anomaly detection on KPIs (unusual spikes/drops); trend forecasting (revenue forecast next month); churn prediction for users; display insights on dashboard.
- **Key Components:** ML model training pipeline, anomaly detection algorithm, time-series forecasting model, churn prediction model, inference service, insights display components

---

# Dependency Notes

### Build Order Constraints
1. **Auth must come before everything** — All protected endpoints require JWT validation; cannot test other features without login flow.
2. **Database schema must precede API endpoints** — ORM models and tables must exist before writing CRUD routes.
3. **FastAPI foundation must precede all endpoints** — Server setup, middleware, and error handling are prerequisites for all route implementations.
4. **Backend CRUD endpoints must precede UI tables** — Frontend cannot fetch/display user or log data without working endpoints.
5. **KPI aggregation logic must precede KPI cards** — Backend must calculate/return metrics before frontend can render cards.
6. **Role-based access control (backend) should precede role-based rendering (frontend)** — Backend enforcement is mandatory security; frontend rendering is UX polish.
7. **Core dashboard shell must precede all feature pages** — Navigation and layout are the container for all subsequent features.
8. **Filtering logic (backend) should precede filtering UI (frontend)** — Backend query logic enables frontend filters; order is flexible but coupling is tight.

### Cross-Tier Dependencies
- **Tier 2 Export** depends on Tier 1 API endpoints and table data
- **Tier 2 Advanced Filtering** depends on Tier 1 table components and backend CRUD
- **Tier 2 Real-Time Updates** depends on Tier 1 KPI cards and aggregation
- **Tier 3 Custom Dashboards** depends on Tier 1 and most of Tier 2 being stable
- **Tier 3 Alerting** depends on Tier 1 KPI aggregation and Tier 2 advanced filtering
- **Tier 3 ML Insights** depends on Tier 1 data collection and Tier 2 metrics aggregation

---

# Execution Order Recommendation

## Phase 1: Infrastructure & Authentication (Days 1–2)
1. Database schema & core tables (PostgreSQL)
2. FastAPI backend foundation
3. User authentication (mock JWT, login page)
4. Dashboard shell & sidebar navigation

**Deliverable:** Logged-in users can navigate to empty dashboard pages.

## Phase 2: Core Data & API Layer (Days 3–5)
5. User management CRUD API
6. API logs endpoint (with seed data)
7. KPI aggregation endpoint
8. Role-based access control (backend)
9. Seed database with synthetic data (users, logs, metrics)

**Deliverable:** Backend endpoints fully functional; Postman/curl can query all core endpoints.

## Phase 3: Dashboard UI Components (Days 6–9)
10. KPI cards component (fetch from API)
11. Users table UI (fetch, paginate, display)
12. API logs table UI (fetch, paginate, display)
13. API activity chart (Recharts, time-series)
14. Role-based UI rendering (hide/show features by role)

**Deliverable:** Full working dashboard with all Tier 1 features; can view KPIs, users, logs, and charts.

## Phase 4: Enhancement Polish (Days 10–12)
15. Advanced filtering & search (backend + frontend)
16. Date range filtering
17. User detail view & inline editing
18. Real-time KPI updates (polling)
19. Report export (CSV/PDF)

**Deliverable:** Dashboard is feature-rich and user-friendly; filtering and export work end-to-end.

## Phase 5: Final Polish & Testing (Days 13–14)
20. Settings panel
21. Dark/light theme toggle
22. Responsive mobile layout
23. Error handling, loading states, edge cases
24. Documentation, deployment setup

**Deliverable:** Production-ready MVP ready for deployment or portfolio showcase.

---

# Feature Extraction Quick Reference

| Feature ID | Feature Name | Tier | Est. Complexity | Est. Time |
|---|---|---|---|---|
| T1-01 | User Authentication | 1 | Low | 2h |
| T1-02 | Database Schema | 1 | Low | 1.5h |
| T1-03 | FastAPI Foundation | 1 | Low | 1h |
| T1-04 | Dashboard Shell | 1 | Medium | 2h |
| T1-05 | KPI Cards | 1 | Medium | 2.5h |
| T1-06 | User CRUD API | 1 | Medium | 2.5h |
| T1-07 | Users Table | 1 | Medium | 2h |
| T1-08 | API Logs | 1 | Medium | 2h |
| T1-09 | Activity Chart | 1 | Medium | 2h |
| T1-10 | RBAC Backend | 1 | Medium | 1.5h |
| T1-11 | RBAC Frontend | 1 | Low | 1.5h |
| T2-01 | Advanced Filtering | 2 | Medium | 3h |
| T2-02 | Export (CSV/PDF) | 2 | Medium | 2.5h |
| T2-03 | User Detail View | 2 | Low | 1.5h |
| T2-04 | Settings Panel | 2 | Low | 1.5h |
| T2-05 | Theme Toggle | 2 | Low | 1h |
| T2-06 | Date Range Filtering | 2 | Low | 1.5h |
| T2-07 | Real-Time Updates | 2 | Low | 1.5h |
| T2-08 | Advanced Metrics | 2 | Medium | 2h |
| T2-09 | Mobile Responsive | 2 | Low | 1.5h |
| T3-01 | Custom Dashboards | 3 | High | 6h |
| T3-02 | Scheduled Reports | 3 | High | 5h |
| T3-03 | WebSocket Updates | 3 | High | 4h |
| T3-04 | Alerting System | 3 | High | 4h |
| T3-05 | Audit Logging | 3 | Medium | 2h |
| T3-06 | API Key Management | 3 | Medium | 2h |
| T3-07 | Multi-Org Support | 3 | High | 6h |
| T3-08 | Bulk Export | 3 | High | 4h |
| T3-09 | ML Insights | 3 | High | 8h |

---

**Roadmap Status:** Ready for feature extraction and development loop initiation.
