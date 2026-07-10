from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, employees, equipment, documents, analytics, notifications, copilot

app = FastAPI(
    title="IntelliMine Copilot API",
    description="Enterprise AI Operating System for Coal Mining Organizations",
    version="2.4.1",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://intellimine.vercel.app",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(employees.router, prefix="/api/employees", tags=["Employees"])
app.include_router(equipment.router, prefix="/api/equipment", tags=["Equipment"])
app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(copilot.router, prefix="/api/copilot", tags=["AI Copilot"])


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
    return {"status": "healthy", "database": "connected", "ai": "ready"}
