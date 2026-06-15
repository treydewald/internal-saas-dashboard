# Internal SaaS Dashboard + API System

A production-style SaaS dashboard with comprehensive user authentication, role-based access control, and real-time analytics engine.

## Project Overview

This is a full-stack application demonstrating modern SaaS product development. The system includes a React-based admin dashboard, a FastAPI backend with REST APIs, PostgreSQL database, and a real-time analytics engine for business metrics aggregation and insights generation.

**Key Features:**
- User authentication and authorization with role-based access control (RBAC)
- Real-time analytics engine for business metrics aggregation
- Multi-user support with secure data isolation
- CRUD operations across multiple business entities
- Advanced filtering, search, and reporting capabilities
- Enterprise-grade UI/UX design

## Architecture

```
internal-saas-dashboard/
├── frontend/              # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page-level containers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API integration
│   │   ├── types/         # TypeScript definitions
│   │   ├── store/         # State management
│   │   └── App.tsx
│   └── package.json
├── backend/               # FastAPI + Python
│   ├── app/
│   │   ├── routers/       # API route handlers
│   │   ├── services/      # Business logic
│   │   ├── models/        # Pydantic models
│   │   ├── schemas/       # Database schemas
│   │   ├── core/          # Core configuration
│   │   └── main.py
│   ├── tests/
│   ├── .venv/
│   ├── requirements.txt
│   └── main.py
├── docs/
│   ├── ARCHITECTURE.md
│   ├── FEATURES.md
│   ├── ROADMAP.md
│   └── NEXT_STEPS.md
└── README.md
```

## Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Axios/Fetch** - HTTP client
- **TailwindCSS** - Styling (optional)

### Backend
- **FastAPI** - Modern Python API framework
- **SQLAlchemy** - ORM
- **Pydantic** - Data validation
- **PostgreSQL** - Database

### DevOps
- **Git** - Version control
- **GitHub** - Repository hosting

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- PostgreSQL 12+
- Git

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
.\.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --reload
```

The backend API will be available at `http://localhost:8000`

API documentation: `http://localhost:8000/docs`

## Development Commands

### Frontend
```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Backend
```bash
cd backend

# Activate virtual environment
.\.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux

# Run development server
uvicorn main:app --reload

# Run tests
pytest

# Format code
black .

# Lint code
flake8 .
```

## Project Structure

### Key Directories

**frontend/src/**
- `components/` - Reusable React components (buttons, cards, modals, etc.)
- `pages/` - Full page components (Dashboard, Users, Analytics, Reports)
- `services/` - API client and data fetching logic
- `hooks/` - Custom hooks for auth, data fetching, etc.
- `types/` - TypeScript interfaces and types
- `store/` - State management (Context API or similar)

**backend/app/**
- `routers/` - API endpoints organized by feature (users, analytics, reports)
- `services/` - Business logic and data processing
- `models/` - SQLAlchemy ORM models
- `schemas/` - Pydantic request/response schemas
- `core/` - Configuration, database connection, security

## Database Schema

The system uses PostgreSQL with the following core entities:

- **users** - User accounts with authentication credentials
- **roles** - Authorization roles (Admin, Manager, Viewer)
- **user_roles** - User-to-role assignments
- **metrics** - Business metrics and KPIs
- **analytics** - Aggregated analytics data
- **reports** - Generated business reports
- **audit_logs** - System audit trail

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Current user info

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `GET /api/users/{id}` - Get user details
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Analytics
- `GET /api/analytics/metrics` - Get business metrics
- `GET /api/analytics/summary` - Get analytics summary
- `POST /api/analytics/filter` - Filter datasets
- `GET /api/analytics/trends` - Get trend analysis

### Reports
- `GET /api/reports` - List reports
- `POST /api/reports` - Generate new report
- `GET /api/reports/{id}` - Get report details
- `DELETE /api/reports/{id}` - Delete report

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Commit: `git commit -m "Add feature description"`
4. Push: `git push origin feature/your-feature-name`
5. Open a Pull Request

## License

Open source - suitable for portfolio and demonstration purposes.

## Next Steps

See [docs/NEXT_STEPS.md](docs/NEXT_STEPS.md) for development roadmap and implementation priorities.
