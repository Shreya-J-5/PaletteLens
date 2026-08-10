import os
import uuid
import shutil
import tempfile
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query, BackgroundTasks, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc

from app.db.database import get_db
from app.models import Analysis, AnalysisPage, Colour, AnalysisAsset
from app.schemas import AnalysisResponse, ColourResponse
from app.core.config import settings
from app.tasks import process_analysis_task, run_analysis_pipeline

router = APIRouter()

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_analysis(
    background_tasks: BackgroundTasks,
    source_type: str = Form(...), # website, image, pdf, file
    source_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    if source_type not in ("website", "image", "pdf", "file"):
        raise HTTPException(status_code=400, detail="Invalid source_type. Must be website, image, pdf, or file.")

    if source_type == "website":
        if not source_url or not (source_url.startswith("http://") or source_url.startswith("https://")):
            raise HTTPException(status_code=400, detail="A valid HTTP/HTTPS URL is required for website analysis.")
    else:
        if not file:
            raise HTTPException(status_code=400, detail="A file upload is required for image/pdf/file analysis.")

    analysis_id = str(uuid.uuid4())
    original_filename = file.filename if file else None

    try:
        db_analysis = Analysis(
            id=analysis_id,
            source_type=source_type,
            source_url=source_url if source_type == "website" else None,
            original_filename=original_filename,
            status="pending",
            progress_step="Source validated"
        )
        db.add(db_analysis)
        db.flush()

        if file:
            file_ext = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
            saved_filename = f"upload_{analysis_id}{file_ext}"

            # Attempt saving to primary UPLOADS_DIR, fallback to system temp directory
            target_dir = os.path.join(settings.UPLOADS_DIR, "files")
            try:
                os.makedirs(target_dir, exist_ok=True)
                file_path = os.path.join(target_dir, saved_filename)
                with open(file_path, "wb") as buffer:
                    shutil.copyfileobj(file.file, buffer)
            except Exception:
                tmp_dir = os.path.join(tempfile.gettempdir(), "palettelens_files")
                os.makedirs(tmp_dir, exist_ok=True)
                file_path = os.path.join(tmp_dir, saved_filename)
                file.file.seek(0)
                with open(file_path, "wb") as buffer:
                    shutil.copyfileobj(file.file, buffer)

            asset = AnalysisAsset(
                id=str(uuid.uuid4()),
                analysis_id=analysis_id,
                file_path=file_path,
                asset_type="original_upload"
            )
            db.add(asset)

        db.commit()
        db.refresh(db_analysis)

        # Execute analysis pipeline in background task or immediately
        try:
            process_analysis_task.delay(analysis_id)
        except Exception:
            background_tasks.add_task(run_analysis_pipeline, analysis_id)

        return {
            "id": analysis_id,
            "status": "pending",
            "progress_step": "Source validated"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to initialize analysis: {str(e)}")

@router.get("", response_model=List[AnalysisResponse])
def list_analyses(
    source_type: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
    sort_by: Optional[str] = Query("newest"), # newest, oldest, most_colours, most_pages
    db: Session = Depends(get_db)
):
    query = db.query(Analysis)

    if source_type and source_type != "all":
        query = query.filter(Analysis.source_type == source_type)

    if q:
        search_pattern = f"%{q}%"
        query = query.filter(
            (Analysis.source_url.ilike(search_pattern)) |
            (Analysis.original_filename.ilike(search_pattern))
        )

    if sort_by == "oldest":
        query = query.order_by(asc(Analysis.created_at))
    else:
        query = query.order_by(desc(Analysis.created_at))

    analyses = query.all()
    results = []

    for a in analyses:
        pages_count = len(a.pages)
        global_colours = [c for c in a.colours if c.page_id is None]
        colour_count = len(global_colours) if global_colours else len(a.colours)

        res_item = AnalysisResponse.model_validate(a)
        res_item.page_count = pages_count
        res_item.colour_count = colour_count
        results.append(res_item)

    if sort_by == "most_colours":
        results.sort(key=lambda x: x.colour_count, reverse=True)
    elif sort_by == "most_pages":
        results.sort(key=lambda x: x.page_count, reverse=True)

    return results

@router.get("/{analysis_id}", response_model=AnalysisResponse)
def get_analysis_by_id(analysis_id: str, db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    pages_count = len(analysis.pages)
    global_colours = [c for c in analysis.colours if c.page_id is None]
    colour_count = len(global_colours) if global_colours else len(analysis.colours)

    res = AnalysisResponse.model_validate(analysis)
    res.page_count = pages_count
    res.colour_count = colour_count
    return res

@router.delete("/{analysis_id}", status_code=status.HTTP_200_OK)
def delete_analysis(analysis_id: str, db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    for p in analysis.pages:
        if p.screenshot_path:
            abs_p = os.path.join(settings.UPLOADS_DIR, p.screenshot_path)
            if os.path.exists(abs_p):
                try:
                    os.remove(abs_p)
                except Exception:
                    pass

    for asset in analysis.assets:
        if asset.file_path and os.path.exists(asset.file_path):
            try:
                os.remove(asset.file_path)
            except Exception:
                pass

    db.delete(analysis)
    db.commit()

    return {"message": "Analysis deleted successfully", "id": analysis_id}
