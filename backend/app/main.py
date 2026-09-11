from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db
from .routers import (
    dashboard,
    deliveries,
    hubs,
    vehicles,
    routes,
    reverse,
    simulation,
    planning,
    ai,
    driver,
    users
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables and seed realistic Pune dataset
    init_db()
    yield

app = FastAPI(
    title="Urban Flow API",
    description="Intelligent Urban Logistics Coordination Platform — Second Road Network for Goods (Pune Urban Pilot)",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Sub-Routers
app.include_router(dashboard.router)
app.include_router(deliveries.router)
app.include_router(hubs.router)
app.include_router(vehicles.router)
app.include_router(routes.router)
app.include_router(reverse.router)
app.include_router(simulation.router)
app.include_router(planning.router)
app.include_router(ai.router)
app.include_router(driver.router)
app.include_router(users.router)

@app.get("/")
def get_root():
    return {
        "platform": "Urban Flow",
        "vision": "A shared digital coordination layer for urban goods movement",
        "pilot_zone": "Pune Metropolitan Area, Maharashtra, India",
        "version": "1.0.0",
        "status": "operational",
        "docs_url": "/docs"
    }
