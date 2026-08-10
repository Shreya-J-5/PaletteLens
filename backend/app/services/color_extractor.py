import colorsys
import numpy as np
from PIL import Image
from typing import List, Dict, Tuple, Any

def rgb_to_hex(r: int, g: int, b: int) -> str:
    return f"#{r:02X}{g:02X}{b:02X}"

def hex_to_rgb(hex_str: str) -> Tuple[int, int, int]:
    hex_clean = hex_str.lstrip("#")
    if len(hex_clean) == 3:
        hex_clean = "".join([c*2 for c in hex_clean])
    return int(hex_clean[0:2], 16), int(hex_clean[2:4], 16), int(hex_clean[4:6], 16)

def rgb_to_hsl(r: int, g: int, b: int) -> Tuple[float, float, float]:
    r_norm, g_norm, b_norm = r / 255.0, g / 255.0, b / 255.0
    h, l, s = colorsys.rgb_to_hls(r_norm, g_norm, b_norm)
    return round(h * 360.0, 1), round(s * 100.0, 1), round(l * 100.0, 1)

def rgb_to_lab(r: int, g: int, b: int) -> Tuple[float, float, float]:
    """Convert sRGB (0-255) to CIE L*a*b* using standard D65 illuminant."""
    r_s, g_s, b_s = r / 255.0, g / 255.0, b / 255.0
    
    def pivot_rgb(c):
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    
    r_l, g_l, b_l = pivot_rgb(r_s), pivot_rgb(g_s), pivot_rgb(b_s)
    
    X = r_l * 0.4124564 + g_l * 0.3575761 + b_l * 0.1804375
    Y = r_l * 0.2126729 + g_l * 0.7151522 + b_l * 0.0721750
    Z = r_l * 0.0193339 + g_l * 0.1191920 + b_l * 0.9503041

    X_n, Y_n, Z_n = 0.95047, 1.00000, 1.08883
    x_r, y_r, z_r = X / X_n, Y / Y_n, Z / Z_n

    def pivot_xyz(c):
        return c ** (1/3) if c > 0.008856 else (7.787 * c) + (16 / 116)

    fx, fy, fz = pivot_xyz(x_r), pivot_xyz(y_r), pivot_xyz(z_r)

    L = (116.0 * fy) - 16.0
    a = 500.0 * (fx - fy)
    b_val = 200.0 * (fy - fz)

    return round(L, 2), round(a, 2), round(b_val, 2)

def delta_e_76(lab1: Tuple[float, float, float], lab2: Tuple[float, float, float]) -> float:
    """Euclidean distance in CIE L*a*b* space."""
    return float(np.sqrt((lab1[0] - lab2[0])**2 + (lab1[1] - lab2[1])**2 + (lab1[2] - lab2[2])**2))

def extract_colors_from_pil_image(image: Image.Image, num_colors: int = 12, merge_threshold: float = 8.0) -> List[Dict[str, Any]]:
    """
    Extract colors from a PIL image using PIL high-speed color quantization,
    then convert to LAB for perceptual merging.
    """
    img = image.convert("RGBA")
    
    bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
    composite = Image.alpha_composite(bg, img).convert("RGB")
    composite.thumbnail((400, 400), Image.Resampling.LANCZOS)
    
    # Quantize image colors using PIL Octree / Median Cut
    quantized = composite.quantize(colors=num_colors, method=Image.Quantize.MEDIANCUT)
    palette = quantized.getpalette()
    
    if not palette:
        return []

    # Get pixel color frequencies
    color_counts = quantized.getcolors()
    if not color_counts:
        return []

    total_pixels = sum(count for count, idx in color_counts)
    raw_clusters = []
    
    for count, idx in color_counts:
        r = palette[idx * 3]
        g = palette[idx * 3 + 1]
        b = palette[idx * 3 + 2]
        
        freq = (count / total_pixels) * 100.0
        lab = rgb_to_lab(r, g, b)
        
        raw_clusters.append({
            "rgb": (r, g, b),
            "lab": lab,
            "count": count,
            "frequency": freq
        })

    raw_clusters.sort(key=lambda x: x["frequency"], reverse=True)

    # Perceptually merge similar clusters in LAB space
    merged_clusters: List[Dict[str, Any]] = []
    for item in raw_clusters:
        merged = False
        for target in merged_clusters:
            dist = delta_e_76(item["lab"], target["lab"])
            if dist < merge_threshold:
                target["count"] += item["count"]
                target["frequency"] += item["frequency"]
                merged = True
                break
        if not merged:
            merged_clusters.append(item)

    total_count = sum(c["count"] for c in merged_clusters)
    results = []
    for item in merged_clusters:
        r, g, b = item["rgb"]
        hex_val = rgb_to_hex(r, g, b)
        h, s, l = rgb_to_hsl(r, g, b)
        lab_l, lab_a, lab_b = item["lab"]
        usage_pct = round((item["count"] / total_count) * 100.0, 2) if total_count > 0 else 0.0
        
        results.append({
            "hex": hex_val,
            "rgb_r": r,
            "rgb_g": g,
            "rgb_b": b,
            "hsl_h": h,
            "hsl_s": s,
            "hsl_l": l,
            "lab_l": lab_l,
            "lab_a": lab_a,
            "lab_b": lab_b,
            "usage_percentage": usage_pct,
            "occurrence_count": item["count"],
            "colour_role": None,
            "role_confidence": "Inferred"
        })

    results.sort(key=lambda x: x["usage_percentage"], reverse=True)
    results = infer_color_roles(results)
    return results

def infer_color_roles(colors: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Assign plausible roles based on color characteristics (Luminance, Saturation, Usage)."""
    if not colors:
        return colors

    bg_assigned = False
    primary_assigned = False
    text_assigned = False
    
    for c in colors:
        l = c["hsl_l"]
        s = c["hsl_s"]
        usage = c["usage_percentage"]
        
        if not bg_assigned and usage > 20 and (l > 75 or l < 20):
            c["colour_role"] = "Background"
            c["role_confidence"] = "Inferred"
            bg_assigned = True
            continue
            
        if not text_assigned and (l < 25 or l > 85) and usage > 5:
            c["colour_role"] = "Text"
            c["role_confidence"] = "Inferred"
            text_assigned = True
            continue
            
        if not primary_assigned and s > 35 and 20 <= l <= 75:
            c["colour_role"] = "Primary"
            c["role_confidence"] = "Inferred"
            primary_assigned = True
            continue

    for c in colors:
        if c.get("colour_role"):
            continue
        s = c["hsl_s"]
        l = c["hsl_l"]
        
        if s > 40:
            c["colour_role"] = "Accent"
        elif 30 <= l <= 70:
            c["colour_role"] = "Surface"
        elif l < 30 or l > 80:
            c["colour_role"] = "Border"
        else:
            c["colour_role"] = "Secondary"
        c["role_confidence"] = "Inferred"

    return colors
