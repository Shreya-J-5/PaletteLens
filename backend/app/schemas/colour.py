from pydantic import BaseModel, ConfigDict
from typing import Optional

class ColourBase(BaseModel):
    hex: str
    rgb_r: int
    rgb_g: int
    rgb_b: int
    hsl_h: float
    hsl_s: float
    hsl_l: float
    lab_l: float
    lab_a: float
    lab_b: float
    usage_percentage: float
    colour_role: Optional[str] = None
    role_confidence: Optional[str] = "Inferred"
    occurrence_count: int = 1

class ColourResponse(ColourBase):
    id: str
    analysis_id: str
    page_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
