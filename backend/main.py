"""
Internal SaaS Dashboard API - Main Entry Point
"""
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routers import auth, users, api_logs, analytics, websocket
from app.database.init_db import init_db
from app.core.config import settings
from app.jobs.metrics_publisher import start_metrics_publisher
from app.jobs.logs_publisher import start_logs_publisher
import uuid
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Internal SaaS Dashboard API",
    description="Production-grade SaaS dashboard with analytics engine",
    version="1.0.0",
    debug=settings.DEBUG,
)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log incoming requests and response latency"""
    request_id = str(uuid.uuid4())
    start_time = time.time()

    response = await call_next(request)

    process_time = (time.time() - start_time) * 1000  # ms
    logger.info(
        f"[{request_id}] {request.method} {request.url.path} - "
        f"Status: {response.status_code} - Duration: {process_time:.2f}ms"
    )

    response.headers["X-Request-ID"] = request_id
    response.headers["X-Process-Time"] = str(process_time)
    return response


# Initialize database on startup
@app.on_event("startup")
def startup_event():
    """Initialize database and setup"""
    logger.info("Initializing application...")
    init_db()
    start_metrics_publisher()
    start_logs_publisher()
    logger.info("Application startup complete")


@app.on_event("shutdown")
def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Application shutdown")


# Exception handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle unhandled exceptions"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "request_id": request.headers.get("x-request-id")},
    )


# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(api_logs.router)
app.include_router(analytics.router)


# Health and status endpoints
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Internal SaaS Dashboard API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}


@app.get("/api/v1/status")
async def api_status():
    """API status endpoint"""
    return {
        "status": "running",
        "version": "1.0.0",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=settings.DEBUG)
