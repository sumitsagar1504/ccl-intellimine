from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, employees, equipment, documents, analytics, notifications, copilot
import os

app = FastAPI(
    title="IntelliMine Copilot API",
    description="Enterprise AI Operating System for Coal Mining Organizations",
    version="2.4.1",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — allow all origins so Vercel/any frontend can connect
# In production you can restrict this to your specific Vercel URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,       # must be False when allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router,          prefix="/api/auth",          tags=["Authentication"])
app.include_router(employees.router,     prefix="/api/employees",     tags=["Employees"])
app.include_router(equipment.router,     prefix="/api/equipment",     tags=["Equipment"])
app.include_router(documents.router,     prefix="/api/documents",     tags=["Documents"])
app.include_router(analytics.router,     prefix="/api/analytics",     tags=["Analytics"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(copilot.router,       prefix="/api/copilot",       tags=["AI Copilot"])


@app.get("/")
def root():
    return {
        "name": "IntelliMine Copilot API",
        "version": "2.4.1",
        "status": "operational",
        "docs": "/docs",
        "organization": "Central Coalfields Limited",
    }


@app.get("/health")
def health():
    """Health check — called by Render to verify service is up."""
    gemini_configured = bool(os.getenv("GEMINI_API_KEY"))
    return {
        "status": "healthy",
        "ai": "configured" if gemini_configured else "not configured — set GEMINI_API_KEY",
        "mode": "demo",   # mock data mode
    }
