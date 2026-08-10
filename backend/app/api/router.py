from fastapi import APIRouter
from app.api.endpoints import analyses, pages, export

api_router = APIRouter()

api_router.include_router(analyses.router, prefix="/analyses", tags=["Analyses"])
api_router.include_router(pages.router, prefix="/analyses", tags=["Pages & Colours"])
api_router.include_router(export.router, prefix="/analyses", tags=["Export"])
