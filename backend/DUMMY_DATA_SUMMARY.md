# Dummy Backend Data Summary
**DataPulse SaaS Dashboard**  
**Generated:** June 18, 2026

---

## Overview

The backend database is populated with realistic test data to support frontend development and QA testing. All data is seeded in SQLite database at `saas_dashboard.db`.

---

## Data Statistics

### Users
- **Total:** 69 users
- **Demo Admin:** admin@example.com / admin123
- **Roles:** admin, analyst, viewer
- **Plans:** free, pro, enterprise
- **Status:** active, inactive

### Organizations
- **Total:** 3 organizations
  - Acme Corp (enterprise tier)
  - TechStart Inc (pro tier)
  - Global Solutions Ltd (free tier)

### API Keys
- **Total:** ~30 API keys
- **Distribution:** 2-3 keys per user (50% of users)
- **Format:** sk_live_* format with SHA256 hash

### API Logs
- **Total:** 200+ log entries
- **Time Range:** Last 30 days
- **Endpoints:** 10 different API endpoints
- **Methods:** GET, POST, PUT, DELETE
- **Status Codes:** 200, 201, 400, 401, 403, 404, 500, 502, 503
- **Response Times:** 10-5000ms

### Export Jobs
- **Total:** 25 export jobs
- **Types:** users, api_logs, analytics, reports, audit_log
- **Statuses:** completed, processing, pending, failed
- **Progress:** 0-100% with row counts

### Alert Rules & Alerts
- **Rules:** 8 alert rules
- **Alerts:** 30+ alert instances
- **Metrics:** error_rate, response_time, active_users, cpu_usage, memory_usage, etc.
- **Statuses:** triggered, acknowledged, resolved
- **Notification Channels:** email, slack, dashboard

### Audit Logs
- **Total:** 100+ audit entries
- **Actions:** CREATE, UPDATE, DELETE, VIEW, EXPORT, LOGIN, LOGOUT
- **Resources:** User, APIKey, Dashboard, AlertRule, ExportJob, Report, Organization
- **Tracking:** IP addresses, old/new values, timestamps

### Dashboards
- **Total:** 12 dashboards
- **Names:**
  - Executive Overview
  - API Performance
  - User Analytics
  - System Health
  - Financial Metrics
  - Customer Insights
  - Operational Metrics
  - Real-time Monitoring
  - Trend Analysis
  - Compliance Dashboard
  - Security Overview
  - Cost Analysis

### ML Insights
- **Total:** 20+ insights
- **Types:** anomaly_detection, forecast, trend_analysis, correlation, outlier, pattern_recognition
- **Confidence Scores:** 50-99%

### Metrics
- **Total:** 50+ metric data points
- **Types:** active_users, total_requests, error_rate, response_time, cpu_usage, memory_usage, database_queries, cache_hit_rate

### Scheduled Reports
- **Total:** 10 scheduled reports
- **Schedules:** daily, weekly, monthly, quarterly
- **Recipients:** User email addresses
- **Status:** enabled/disabled

---

## Database Location

```
c:\Users\Trey\Projects\internal-saas-dashboard\backend\saas_dashboard.db
```

**Engine:** SQLite  
**Tables:** 13 (users, organizations, roles, api_logs, api_keys, export_jobs, alert_rules, alerts, audit_logs, dashboards, metrics, ml_insights, scheduled_reports)

---

## Backend API Configuration

### Server
- **Base URL:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs (Swagger UI)
- **CORS:** Enabled for localhost:5173 (frontend)

### Authentication
```bash
# Login Endpoint
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}

# Response
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin",
    "plan": "enterprise"
  }
}
```

### API Endpoints Available

#### Users
- `GET /api/users?skip=0&limit=10` - List users with pagination
- `GET /api/users/{user_id}` - Get user details
- `POST /api/users` - Create user (admin only)
- `PUT /api/users/{user_id}` - Update user (admin only)
- `DELETE /api/users/{user_id}` - Delete user (admin only)

#### API Logs
- `GET /api/api-logs?skip=0&limit=10` - List API logs
- `GET /api/api-logs?start_date=2026-06-01&end_date=2026-06-18` - Filter by date range
- `GET /api/api-logs?endpoint=/api/users` - Filter by endpoint

#### Exports
- `GET /api/exports?skip=0&limit=10` - List export jobs
- `POST /api/exports` - Create new export job
- `GET /api/exports/{job_id}` - Get job status
- `DELETE /api/exports/{job_id}` - Cancel export

#### Alerts
- `GET /api/alerts?skip=0&limit=10` - List alert rules
- `POST /api/alerts` - Create alert rule
- `PUT /api/alerts/{rule_id}` - Update alert rule
- `DELETE /api/alerts/{rule_id}` - Delete alert rule

#### Dashboard Builder
- `GET /api/dashboards` - List user's dashboards
- `POST /api/dashboards` - Create new dashboard
- `PUT /api/dashboards/{dashboard_id}` - Update dashboard
- `DELETE /api/dashboards/{dashboard_id}` - Delete dashboard

#### Analytics & Insights
- `GET /api/analytics/metrics` - Get KPI metrics
- `GET /api/analytics/insights` - Get ML insights
- `GET /api/analytics/trends` - Get trend analysis

#### Reports
- `GET /api/reports?skip=0&limit=10` - List reports
- `POST /api/reports` - Generate new report
- `GET /api/reports/{report_id}` - Get report details

#### Audit Log
- `GET /api/audit-log?skip=0&limit=10` - List audit entries
- `GET /api/audit-log?action=UPDATE` - Filter by action
- `GET /api/audit-log?user_id=1` - Filter by user

#### API Keys
- `GET /api/api-keys` - List user's API keys
- `POST /api/api-keys` - Generate new API key
- `PUT /api/api-keys/{key_id}` - Update key metadata
- `DELETE /api/api-keys/{key_id}` - Revoke API key

#### Organization
- `GET /api/organizations/me` - Get current organization
- `PUT /api/organizations/me` - Update organization settings
- `GET /api/organizations/me/members` - List organization members

---

## Using the Data in Frontend

### Setup

1. **Start Backend**
   ```bash
   cd c:\Users\Trey\Projects\internal-saas-dashboard\backend
   python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

2. **Start Frontend (in separate terminal)**
   ```bash
   cd c:\Users\Trey\Projects\internal-saas-dashboard\frontend
   npm run dev
   ```

3. **Access Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Login Credentials

#### Demo Admin
- **Email:** admin@example.com
- **Password:** admin123
- **Role:** admin
- **Plan:** enterprise
- **Access:** All features and data

#### Demo Analyst
- **Email:** analyst@example.com
- **Password:** password123
- **Role:** analyst
- **Plan:** pro
- **Access:** Analytics, reports, API logs

#### Demo Viewer
- **Email:** viewer@example.com
- **Password:** password123
- **Role:** viewer
- **Plan:** free
- **Access:** View-only for non-sensitive data

---

## Frontend Pages Now Showing Data

With backend running, these frontend pages now display populated data:

✅ **Users Page** - Shows list of 69 users with pagination
✅ **API Logs** - Shows 200+ API request logs with filtering
✅ **Audit Log** - Shows 100+ audit trail entries
✅ **Alerts** - Shows 8 alert rules and 30+ alert instances
✅ **Exports** - Shows 25 export jobs with progress tracking
✅ **API Keys** - Shows 30+ API keys with usage stats
✅ **Dashboard Builder** - Shows 12 pre-configured dashboards
✅ **Insights** - Shows 20+ ML-generated insights
✅ **Reports** - Shows scheduled reports
✅ **Organization Settings** - Shows organization data
✅ **User Settings** - Shows user profile data

---

## Generating Additional Data

To add more dummy data to the existing database:

```bash
cd c:\Users\Trey\Projects\internal-saas-dashboard\backend
python scripts/generate_dummy_data.py
```

The generator will:
- Detect existing data
- Prompt before adding more (to avoid duplicates)
- Generate realistic test data respecting relationships
- Populate all 13 tables

---

## Database Schema

### Tables & Relationships

```
users
├── api_keys (1:M)
├── api_logs (1:M)
├── dashboards (1:M)
├── audit_logs (1:M)
├── ml_insights (1:M)
└── scheduled_reports (1:M)

organizations
├── users (1:M)
└── export_jobs (1:M)

alert_rules (1:M)
└── alerts

export_jobs
└── (stores job progress & status)

metrics
└── (time-series data)

audit_logs
└── (immutable audit trail)
```

---

## Data Refresh / Reset

To completely reset the database:

```bash
# Backup current database
copy saas_dashboard.db saas_dashboard.db.backup

# Delete database
del saas_dashboard.db

# Restart backend (will recreate from schema)
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Generate fresh dummy data
python scripts/generate_dummy_data.py
```

---

## Common Test Scenarios

### Scenario 1: Review User Management
1. Login as admin@example.com
2. Navigate to Users tab
3. See 69 users with pagination (10 per page)
4. Filter by plan: free, pro, enterprise
5. Filter by status: active, inactive
6. Search by name/email

### Scenario 2: Monitor API Performance
1. Go to API Logs tab
2. See 200+ log entries
3. Filter by date range (last 7 days, last 30 days)
4. Filter by endpoint
5. View response times and status codes
6. See success/error rate

### Scenario 3: Set Up Alerts
1. Navigate to Alerts tab
2. See 8 existing alert rules
3. Create new alert rule with threshold
4. View 30+ triggered/acknowledged alerts
5. Configure notification channels

### Scenario 4: Manage Data Exports
1. Go to Exports tab
2. See 25 export jobs
3. View progress on ongoing exports
4. Track completion status
5. Download completed exports

### Scenario 5: View Analytics & Insights
1. Navigate to Insights tab
2. See 20+ AI-generated insights
3. View anomaly detections
4. See forecast confidence scores
5. Review trend analysis

---

## Troubleshooting

### Backend Not Responding
```bash
# Check if server is running
curl http://localhost:8000/docs

# If not, restart
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Authentication Failed
- Verify email: `admin@example.com`
- Verify password: `admin123`
- Check token expiration (tokens valid for ~24 hours)
- Refresh by logging in again

### No Data Showing in Frontend
- Verify backend is running
- Check CORS settings (should allow localhost:5173)
- Clear browser cache
- Check browser console for API errors
- Verify authentication token is being sent

### Database Locked
- Restart backend server
- Check for other Python processes: `tasklist | findstr python`
- Kill if needed: `taskkill /F /IM python.exe`

---

## Performance Notes

- **Dataset Size:** ~500 records across all tables
- **Load Time:** < 1 second for list pages
- **Pagination:** 10-50 items per page (configurable)
- **Search:** Full-text search on indexed fields
- **Date Range Filtering:** Optimized with database indexes

---

## Next Steps

1. **Verify all frontend pages display data correctly** ✅
2. **Test pagination and filtering** ✅
3. **Test form submissions (create/update/delete)** ✅
4. **Validate error handling with mock API errors** 📋
5. **Performance test with larger datasets** 📋
6. **Load testing with concurrent users** 📋

---

## Contact

For issues with dummy data:
- Check backend logs: `tail -f backend.log`
- Verify database: SQLite browser at `saas_dashboard.db`
- Review API documentation: http://localhost:8000/docs

---

**Last Updated:** 2026-06-18  
**Backend Status:** ✅ Running  
**Data Status:** ✅ Populated (69 users, 200+ logs)  
**Frontend Integration:** ✅ Ready for testing
