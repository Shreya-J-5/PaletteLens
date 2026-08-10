from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models import Analysis, AnalysisPage, Colour
from app.schemas import AnalysisPageResponse, ColourResponse

router = APIRouter()

@router.get("/{analysis_id}/pages", response_model=List[AnalysisPageResponse])
def get_analysis_pages(analysis_id: str, db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return [AnalysisPageResponse.model_validate(p) for p in analysis.pages]

@router.get("/{analysis_id}/pages/{page_id}", response_model=AnalysisPageResponse)
def get_analysis_page_detail(analysis_id: str, page_id: str, db: Session = Depends(get_db)):
    page = db.query(AnalysisPage).filter(AnalysisPage.id == page_id, AnalysisPage.analysis_id == analysis_id).first()
    if not page:
        raise HTTPException(status_code=404, detail="Page not found for this analysis")
    
    return AnalysisPageResponse.model_validate(page)

@router.get("/{analysis_id}/colours", response_model=List[ColourResponse])
def get_analysis_colours(analysis_id: str, db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    # If website/pdf with pages, return global aggregated palette (page_id is NULL) by default, or all if none
    globals_c = [c for c in analysis.colours if c.page_id is None]
    if globals_c:
        return [ColourResponse.model_validate(c) for c in globals_c]
    return [ColourResponse.model_validate(c) for c in analysis.colours]
