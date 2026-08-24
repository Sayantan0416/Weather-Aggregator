from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes.locations import router as location_router
from .routes.weather import router as weather_router


app = FastAPI(
    title="Weather Aggregator API",
    description="Next-level weather intelligence platform",
    version="1.0.0",
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API routes
app.include_router(
    location_router,
    prefix="/api",
)

app.include_router(
    weather_router,
    prefix="/api",
)


@app.get("/")
def root():
    return {
        "message": "Weather Aggregator API is running!",
        "status": "success",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Weather Aggregator API",
    }