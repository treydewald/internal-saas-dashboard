# System Architecture

## High-Level Overview

The Internal SaaS Dashboard is a three-tier full-stack application:

```
┌─────────────────────┐
│   React Frontend    │  (Vite, TypeScript, Components)
│  Port: 5173         │
└──────────┬──────────┘
           │
        HTTP/REST
           │
┌──────────▼──────────┐
│  FastAPI Backend    │  (Python, REST API)
│  Port: 8000         │
└──────────┬──────────┘
           │
        SQLAlchemy ORM
           │
┌──────────▼──────────┐
│   PostgreSQL DB     │  (Tables, Indexes, Constraints)
│  Port: 5432         │
└─────────────────────┘
```

## Component Breakdown

### Frontend (React + TypeScript + Vite)

**Structure:**
```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Dashboard.tsx  # Main dashboard layout
│   │   ├── Navbar.tsx     # Top navigation
│   │   ├── Sidebar.tsx    # Left sidebar navigation
│   │   ├── KPICard.tsx    # KPI metric cards
│   │   ├── DataTable.tsx  # Sortable data tables
│   │   ├── FilterBar.tsx  # Search and filter controls
│   │   └── ...
│   ├── pages/             # Full page containers
│   │   ├── DashboardPage.tsx
│   │   ├── UsersPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   ├── ReportsPage.tsx
│   │   └── SettingsPage.tsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.ts     # Authentication management
│   │   ├── useApi.ts      # API data fetching
│   │   ├── useFilters.ts  # Filter state management
│   │   └── ...
│   ├── services/          # API integration
│   │   ├── api.ts         # API client
│   │   ├── auth.ts        # Auth endpoints
│   │   ├── users.ts       # User endpoints
│   │   ├── analytics.ts   # Analytics endpoints
│   │   └── ...
│   ├── types/             # TypeScript definitions
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── analytics.ts
│   │   └── ...
│   ├── store/             # State management
│   │   ├── authContext.ts
│   │   ├── uiContext.ts
│   │   └── ...
│   ├── App.tsx            # Root component
│   └── main.tsx           # Entry point
└── package.json
```

**Key Responsibilities:**
- User interface rendering
- Form validation and submission
- API request handling
- Authentication token management
- State management (auth, UI state)
- Data presentation and visualization

### Backend (FastAPI + Python)

**Structure:**
```
backend/
├── app/
│   ├── main.py           # FastAPI application setup
│   ├── routers/          # API endpoint handlers
│   │   ├── auth.py       # /auth/* endpoints
│   │   ├── users.py      # /users/* endpoints
│   │   ├── analytics.py  # /analytics/* endpoints
│   │   ├── reports.py    # /reports/* endpoints
│   │   └── __init__.py
│   ├── services/         # Business logic layer
│   │   ├── auth_service.py        # Authentication logic
│   │   ├── user_service.py        # User management
│   │   ├── analytics_service.py   # Analytics processing
│   │   ├── report_service.py      # Report generation
│   │   └── __init__.py
│   ├── models/           # SQLAlchemy ORM models
│   │   ├── user.py       # User model
│   │   ├── role.py       # Role model
│   │   ├── metric.py     # Metric model
│   │   ├── analytics.py  # Analytics model
│   │   └── __init__.py
│   ├── schemas/          # Pydantic request/response schemas
│   │   ├── user.py       # User schemas
│   │   ├── auth.py       # Auth schemas
│   │   ├── analytics.py  # Analytics schemas
│   │   └── __init__.py
│   ├── core/             # Configuration and utilities
│   │   ├── config.py     # Settings management
│   │   ├── security.py   # JWT and password hashing
│   │   ├── database.py   # Database connection
│   │   └── __init__.py
│   └── __init__.py
├── tests/                # Unit and integration tests
│   ├── test_auth.py
│   ├── test_users.py
│   ├── test_analytics.py
│   └── __init__.py
├── .venv/               # Python virtual environment
├── requirements.txt     # Python dependencies
└── main.py             # Entry point
```

**Key Responsibilities:**
- REST API endpoint implementation
- Database operations (CRUD)
- Authentication and authorization
- Business logic execution
- Data validation
- Error handling
- Analytics computation

### Database (PostgreSQL)

**Core Tables:**

1. **users**
   - id (PK)
   - email (UNIQUE)
   - username (UNIQUE)
   - password_hash
   - full_name
   - is_active
   - created_at
   - updated_at

2. **roles**
   - id (PK)
   - name (UNIQUE)
   - description
   - permissions (JSON)
   - created_at

3. **user_roles** (Junction table)
   - id (PK)
   - user_id (FK)
   - role_id (FK)
   - assigned_at

4. **metrics**
   - id (PK)
   - user_id (FK)
   - metric_type
   - metric_value
   - timestamp
   - created_at

5. **analytics**
   - id (PK)
   - user_id (FK)
   - aggregation_type
   - data (JSONB)
   - calculated_at
   - created_at

6. **reports**
   - id (PK)
   - user_id (FK)
   - title
   - description
   - report_data (JSONB)
   - status
   - created_at
   - generated_at

7. **audit_logs**
   - id (PK)
   - user_id (FK)
   - action
   - resource_type
   - resource_id
   - changes (JSONB)
   - timestamp

## Data Flow

### Authentication Flow
```
1. User submits credentials (email, password)
2. Backend validates credentials against users table
3. Backend generates JWT token
4. Frontend stores token in localStorage/session
5. Frontend includes token in subsequent API requests
6. Backend validates token on protected endpoints
7. Request proceeds or returns 401 Unauthorized
```

### Analytics Data Flow
```
1. Metrics are collected from user actions
2. Data is stored in metrics table with timestamp
3. Analytics service aggregates metrics (hourly/daily)
4. Aggregated data stored in analytics table
5. Frontend queries analytics endpoint
6. Backend returns filtered/sorted results
7. Frontend renders visualizations (charts, tables)
```

### Report Generation Flow
```
1. User requests report generation
2. Backend fetches relevant data from analytics
3. Backend performs calculations and aggregations
4. Report data stored in reports table
5. Frontend polls for report completion
6. Frontend displays/downloads generated report
```

## API Layer Design

### REST Conventions
- GET: Retrieve resources
- POST: Create new resources
- PUT: Update existing resources
- DELETE: Remove resources
- PATCH: Partial updates

### API Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2026-06-15T10:30:00Z"
}
```

### Error Handling
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "User not found",
    "details": {}
  },
  "timestamp": "2026-06-15T10:30:00Z"
}
```

## Security Considerations

1. **Authentication**: JWT tokens with expiration
2. **Authorization**: Role-based access control (RBAC)
3. **Password Security**: bcrypt hashing
4. **CORS**: Restricted to frontend domain
5. **Data Validation**: Pydantic models enforce schema
6. **SQL Injection**: SQLAlchemy ORM prevents injection
7. **Audit Logging**: All user actions logged
8. **Error Messages**: Sensitive information not exposed

## Scalability

### Current State (MVP)
- Single database instance
- Synchronous API processing
- In-memory caching only
- No service separation

### Future Improvements
- Database replication and read replicas
- Async task queue (Celery + Redis)
- Redis caching layer
- Microservices architecture
- WebSocket support for real-time updates
- Message queue for event streaming
- Horizontal scaling with load balancer

## Development Workflow

1. **Branch Strategy**: Feature branches from main
2. **Testing**: Unit tests for services, integration tests for API
3. **Code Review**: PRs reviewed before merge
4. **Deployment**: CI/CD pipeline (GitHub Actions)
5. **Environment Parity**: Development, staging, production

## Performance Optimization

- Database indexing on frequently queried columns
- Query optimization with eager loading
- Frontend bundle optimization with Vite
- Caching strategies (HTTP caching headers)
- Pagination for large datasets
- Lazy loading for components and data
