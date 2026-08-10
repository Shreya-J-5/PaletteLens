import os
import uuid
import tempfile
import fitz # PyMuPDF
from typing import List, Dict, Any
from PIL import Image
from app.core.config import settings
from app.services.color_extractor import extract_colors_from_pil_image

def analyze_pdf_file(pdf_path: str, analysis_id: str, max_pages: int = 20) -> Dict[str, Any]:
    """
    Renders PDF pages using PyMuPDF (fitz) in memory to PIL images
    and extracts page-by-page and document-wide palettes.
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")

    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    pages_to_process = min(total_pages, max_pages)

    pages_result: List[Dict[str, Any]] = []

    for page_num in range(pages_to_process):
        page = doc.load_page(page_num)
        pix = page.get_pixmap(dpi=150)
        
        page_id = str(uuid.uuid4())
        screenshot_filename = f"pdf_{analysis_id}_page_{page_num + 1}.png"
        screenshot_rel_path = f"screenshots/{screenshot_filename}"
        
        # Convert pixmap directly in memory to PIL Image
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        extracted_colors = extract_colors_from_pil_image(img, num_colors=10)

        # Attempt optional screenshot save to disk if writable
        try:
            screenshot_abs_path = os.path.join(settings.UPLOADS_DIR, screenshot_rel_path)
            os.makedirs(os.path.dirname(screenshot_abs_path), exist_ok=True)
            pix.save(screenshot_abs_path)
        except Exception:
            screenshot_rel_path = None

        pages_result.append({
            "id": page_id,
            "url": f"Page {page_num + 1}",
            "page_title": f"PDF Page {page_num + 1} of {total_pages}",
            "screenshot_path": screenshot_rel_path,
            "status": "completed",
            "visual_colors": extracted_colors
        })

    doc.close()

    return {
        "total_pages": total_pages,
        "processed_pages": len(pages_result),
        "pages": pages_result
    }
