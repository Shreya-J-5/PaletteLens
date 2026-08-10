import os
import asyncio
from datetime import datetime
from typing import List, Dict, Any
from sqlalchemy.orm import Session

from app.core.celery_app import celery_app
from app.db.database import SessionLocal
from app.models import Analysis, AnalysisPage, Colour, AnalysisAsset
from app.services.website_crawler import analyze_website_task
from app.services.image_analyzer import analyze_image_file
from app.services.pdf_analyzer import analyze_pdf_file
from app.services.color_extractor import infer_color_roles, hex_to_rgb, rgb_to_hsl, rgb_to_lab, delta_e_76

def update_analysis_progress(db: Session, analysis_id: str, status: str, step_msg: str, error_msg: str = None):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if analysis:
        analysis.status = status
        analysis.progress_step = step_msg
        if error_msg:
            analysis.error_message = error_msg
        if status in ("completed", "failed"):
            analysis.completed_at = datetime.utcnow()
        db.commit()

def run_analysis_pipeline(analysis_id: str):
    """Core analysis execution engine for website, image, pdf, and file inputs."""
    db: Session = SessionLocal()
    try:
        analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
        if not analysis:
            return

        update_analysis_progress(db, analysis_id, "processing", "Source validated")

        source_type = analysis.source_type
        all_colours_raw: List[Dict[str, Any]] = []

        if source_type == "website":
            update_analysis_progress(db, analysis_id, "processing", "Content loaded")
            
            # Execute Playwright crawling asynchronously
            def progress_cb(msg):
                update_analysis_progress(db, analysis_id, "processing", msg)

            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                crawl_res = loop.run_until_complete(
                    analyze_website_task(analysis.id, analysis.source_url, update_progress_callback=progress_cb)
                )
            finally:
                loop.close()

            update_analysis_progress(db, analysis_id, "processing", "Visual content processed")

            pages_data = crawl_res.get("pages", [])
            for p_data in pages_data:
                # Save AnalysisPage record
                page_obj = AnalysisPage(
                    id=p_data["id"],
                    analysis_id=analysis.id,
                    url=p_data["url"],
                    page_title=p_data.get("page_title"),
                    screenshot_path=p_data.get("screenshot_path"),
                    status=p_data.get("status", "completed")
                )
                db.add(page_obj)
                db.flush()

                # Process CSS and visual colors for this page
                page_colors = []
                # 1. Visual colors from screenshot
                for vc in p_data.get("visual_colors", []):
                    page_colors.append(vc)
                    all_colours_raw.append(vc)

                # 2. CSS colors parsed from DOM
                for css in p_data.get("css_colors", []):
                    c_str = css.get("color", "")
                    if c_str.startswith("rgb"):
                        try:
                            vals = [int(x) for x in c_str.replace("rgba", "").replace("rgb", "").replace("(", "").replace(")", "").split(",")[:3]]
                            r, g, b = vals[0], vals[1], vals[2]
                            hx = f"#{r:02X}{g:02X}{b:02X}"
                            h, s, l = rgb_to_hsl(r, g, b)
                            lab_l, lab_a, lab_b = rgb_to_lab(r, g, b)
                            color_dict = {
                                "hex": hx,
                                "rgb_r": r, "rgb_g": g, "rgb_b": b,
                                "hsl_h": h, "hsl_s": s, "hsl_l": l,
                                "lab_l": lab_l, "lab_a": lab_a, "lab_b": lab_b,
                                "usage_percentage": 5.0,
                                "colour_role": css.get("role", "Surface"),
                                "role_confidence": "Detected",
                                "occurrence_count": 1
                            }
                            page_colors.append(color_dict)
                            all_colours_raw.append(color_dict)
                        except Exception:
                            pass

                # Save page-specific Colour records
                for col in page_colors[:15]:
                    c_model = Colour(
                        analysis_id=analysis.id,
                        page_id=page_obj.id,
                        hex=col["hex"],
                        rgb_r=col["rgb_r"], rgb_g=col["rgb_g"], rgb_b=col["rgb_b"],
                        hsl_h=col["hsl_h"], hsl_s=col["hsl_s"], hsl_l=col["hsl_l"],
                        lab_l=col["lab_l"], lab_a=col["lab_a"], lab_b=col["lab_b"],
                        usage_percentage=col.get("usage_percentage", 0.0),
                        colour_role=col.get("colour_role"),
                        role_confidence=col.get("role_confidence", "Inferred"),
                        occurrence_count=col.get("occurrence_count", 1)
                    )
                    db.add(c_model)

        elif source_type in ("image", "file"):
            update_analysis_progress(db, analysis_id, "processing", "Content loaded")
            asset = db.query(AnalysisAsset).filter(AnalysisAsset.analysis_id == analysis_id, AnalysisAsset.asset_type == "original_upload").first()
            if not asset or not os.path.exists(asset.file_path):
                raise FileNotFoundError("Uploaded file asset not found.")

            update_analysis_progress(db, analysis_id, "processing", "Visual content processed")
            img_colors = analyze_image_file(asset.file_path, max_colors=20)
            all_colours_raw.extend(img_colors)

        elif source_type == "pdf":
            update_analysis_progress(db, analysis_id, "processing", "Content loaded")
            asset = db.query(AnalysisAsset).filter(AnalysisAsset.analysis_id == analysis_id, AnalysisAsset.asset_type == "original_upload").first()
            if not asset or not os.path.exists(asset.file_path):
                raise FileNotFoundError("Uploaded PDF asset not found.")

            update_analysis_progress(db, analysis_id, "processing", "Visual content processed")
            pdf_res = analyze_pdf_file(asset.file_path, analysis_id=analysis_id)

            for p_data in pdf_res.get("pages", []):
                page_obj = AnalysisPage(
                    id=p_data["id"],
                    analysis_id=analysis.id,
                    url=p_data["url"],
                    page_title=p_data.get("page_title"),
                    screenshot_path=p_data.get("screenshot_path"),
                    status=p_data.get("status", "completed")
                )
                db.add(page_obj)
                db.flush()

                for col in p_data.get("visual_colors", []):
                    c_model = Colour(
                        analysis_id=analysis.id,
                        page_id=page_obj.id,
                        hex=col["hex"],
                        rgb_r=col["rgb_r"], rgb_g=col["rgb_g"], rgb_b=col["rgb_b"],
                        hsl_h=col["hsl_h"], hsl_s=col["hsl_s"], hsl_l=col["hsl_l"],
                        lab_l=col["lab_l"], lab_a=col["lab_a"], lab_b=col["lab_b"],
                        usage_percentage=col.get("usage_percentage", 0.0),
                        colour_role=col.get("colour_role"),
                        role_confidence=col.get("role_confidence", "Inferred"),
                        occurrence_count=col.get("occurrence_count", 1)
                    )
                    db.add(c_model)
                    all_colours_raw.append(col)

        update_analysis_progress(db, analysis_id, "processing", "Colours detected")

        # Aggregate Global Website / Document Colour Palette across all pages/sources
        update_analysis_progress(db, analysis_id, "processing", "Palette generated")

        merged_global: List[Dict[str, Any]] = []
        for raw in all_colours_raw:
            matched = False
            r_lab = (raw["lab_l"], raw["lab_a"], raw["lab_b"])
            for g in merged_global:
                g_lab = (g["lab_l"], g["lab_a"], g["lab_b"])
                if delta_e_76(r_lab, g_lab) < 7.5:
                    g["occurrence_count"] += raw.get("occurrence_count", 1)
                    g["usage_percentage"] += raw.get("usage_percentage", 1.0)
                    if raw.get("role_confidence") == "Detected" and g.get("role_confidence") != "Detected":
                        g["colour_role"] = raw.get("colour_role")
                        g["role_confidence"] = "Detected"
                    matched = True
                    break
            if not matched:
                merged_global.append(dict(raw))

        # Normalize usage percentages
        tot_usage = sum(m["usage_percentage"] for m in merged_global) or 1.0
        for m in merged_global:
            m["usage_percentage"] = round((m["usage_percentage"] / tot_usage) * 100.0, 2)

        merged_global.sort(key=lambda x: x["usage_percentage"], reverse=True)
        merged_global = infer_color_roles(merged_global)

        # Save Global Palette Colour entries (page_id = NULL)
        for g_col in merged_global[:24]:
            c_model = Colour(
                analysis_id=analysis.id,
                page_id=None, # Global website palette entry
                hex=g_col["hex"],
                rgb_r=g_col["rgb_r"], rgb_g=g_col["rgb_g"], rgb_b=g_col["rgb_b"],
                hsl_h=g_col["hsl_h"], hsl_s=g_col["hsl_s"], hsl_l=g_col["hsl_l"],
                lab_l=g_col["lab_l"], lab_a=g_col["lab_a"], lab_b=g_col["lab_b"],
                usage_percentage=g_col.get("usage_percentage", 0.0),
                colour_role=g_col.get("colour_role"),
                role_confidence=g_col.get("role_confidence", "Inferred"),
                occurrence_count=g_col.get("occurrence_count", 1)
            )
            db.add(c_model)

        update_analysis_progress(db, analysis_id, "processing", "Results saved")
        update_analysis_progress(db, analysis_id, "completed", "Results saved")

    except Exception as e:
        err_msg = str(e)
        update_analysis_progress(db, analysis_id, "failed", "Analysis failed", error_msg=err_msg)
    finally:
        db.close()

@celery_app.task(name="app.tasks.analysis_tasks.process_analysis_task")
def process_analysis_task(analysis_id: str):
    run_analysis_pipeline(analysis_id)
