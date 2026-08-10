import os
from typing import List, Dict, Any
from PIL import Image
from app.services.color_extractor import extract_colors_from_pil_image
from app.core.config import settings

def analyze_image_file(file_path: str, max_colors: int = 16) -> List[Dict[str, Any]]:
    """
    Analyzes an uploaded image file, downsamples appropriately, handles transparency,
    and extracts dominant colors with perceptually merged LAB clusters.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Image file not found: {file_path}")

    with Image.open(file_path) as img:
        colors = extract_colors_from_pil_image(img, num_colors=max_colors, merge_threshold=7.0)

    return colors
