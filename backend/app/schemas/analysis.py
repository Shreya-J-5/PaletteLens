from pydantic import BaseModel, ConfigDict, HttpUrl
from typing import Optional, List
from datetime import datetime
from app.schemas.colour import ColourResponse

class AnalysisCreate(BaseModel):
    source_type: str # website, image, pdf, file
    source_url: Optional[str] = None

class AnalysisPageResponse(BaseModel):
    id: str
    analysis_id: str
    url: str
    page_title: Optional[str] = None
    screenshot_path: Optional[str] = None
    status: str
    created_at: datetime
    colours: List[ColourResponse] = []

    model_config = ConfigDict(from_attributes=True)

class AnalysisAssetResponse(BaseModel):
    id: str
    analysis_id: str
    file_path: str
    asset_type: str
    metadata_json: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class AnalysisResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    source_type: str
    source_url: Optional[str] = None
    original_filename: Optional[str] = None
    status: str
    progress_step: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    pages: List[AnalysisPageResponse] = []
    colours: List[ColourResponse] = []
    assets: List[AnalysisAssetResponse] = []
    page_count: int = 0
    colour_count: int = 0

    model_config = ConfigDict(from_attributes=True)
