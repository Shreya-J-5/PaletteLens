from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import JSONResponse, PlainTextResponse
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models import Analysis, Colour
from app.services.export_service import (
    export_as_json,
    export_as_css,
    export_as_tailwind,
    generate_palette_png
)

router = APIRouter()

def get_target_colours(analysis_id: str, db: Session):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    # Target global colours (page_id is None) if available, else all colours
    colours = [c for c in analysis.colours if c.page_id is None]
    if not colours:
        colours = analysis.colours
    return colours

@router.get("/{analysis_id}/export/json")
def export_json_endpoint(analysis_id: str, db: Session = Depends(get_db)):
    colours = get_target_colours(analysis_id, db)
    json_data = export_as_json(colours)
    return JSONResponse(content=json_data)

@router.get("/{analysis_id}/export/css")
def export_css_endpoint(analysis_id: str, db: Session = Depends(get_db)):
    colours = get_target_colours(analysis_id, db)
    css_content = export_as_css(colours)
    return PlainTextResponse(content=css_content, media_type="text/css")

@router.get("/{analysis_id}/export/tailwind")
def export_tailwind_endpoint(analysis_id: str, db: Session = Depends(get_db)):
    colours = get_target_colours(analysis_id, db)
    tw_content = export_as_tailwind(colours)
    return PlainTextResponse(content=tw_content, media_type="application/javascript")

@router.get("/{analysis_id}/export/png")
def export_png_endpoint(analysis_id: str, db: Session = Depends(get_db)):
    colours = get_target_colours(analysis_id, db)
    png_bytes = generate_palette_png(colours)
    return Response(
        content=png_bytes,
        media_type="image/png",
        headers={"Content-Disposition": f"attachment; filename=palettelens_{analysis_id}.png"}
    )
