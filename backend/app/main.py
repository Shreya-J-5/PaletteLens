import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.api.router import api_router
from app.db.database import engine, Base
import app.models # Ensure all models are registered

# Automatically create tables if not present
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Base.metadata.create_all error: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="PaletteLens Production Color Extraction & Analysis Platform API",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists and mount static endpoint safely
try:
    os.makedirs(settings.UPLOADS_DIR, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=settings.UPLOADS_DIR), name="uploads")
except Exception as e:
    print(f"Warning: Could not mount static uploads directory: {e}")

# Register API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok", "app": settings.PROJECT_NAME}
