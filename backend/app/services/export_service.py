import io
import re
from typing import List, Dict, Any
from PIL import Image, ImageDraw

def slugify(text: str) -> str:
    if not text:
        return "color"
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-') or "color"

def export_as_json(colours: List[Any]) -> Dict[str, Any]:
    palette = {}
    colour_list = []
    for c in colours:
        hex_val = (getattr(c, 'hex', '#000000') or '#000000').upper()
        clean_hex = hex_val.lstrip('#').lower()
        role = getattr(c, 'colour_role', None) or f"color-{clean_hex}"
        name = slugify(role)
        if name in palette:
            name = f"{name}-{clean_hex}"
        palette[name] = hex_val
        
        colour_list.append({
            "hex": hex_val,
            "rgb": [
                int(getattr(c, 'rgb_r', 0) or 0),
                int(getattr(c, 'rgb_g', 0) or 0),
                int(getattr(c, 'rgb_b', 0) or 0)
            ],
            "hsl": [
                int(getattr(c, 'hsl_h', 0) or 0),
                int(getattr(c, 'hsl_s', 0) or 0),
                int(getattr(c, 'hsl_l', 0) or 0)
            ],
            "lab": [
                float(getattr(c, 'lab_l', 0.0) or 0.0),
                float(getattr(c, 'lab_a', 0.0) or 0.0),
                float(getattr(c, 'lab_b', 0.0) or 0.0)
            ],
            "role": getattr(c, 'colour_role', None),
            "confidence": getattr(c, 'role_confidence', None),
            "usage_percentage": float(getattr(c, 'usage_percentage', 0.0) or 0.0),
            "occurrence_count": int(getattr(c, 'occurrence_count', 0) or 0)
        })

    return {
        "roles": palette,
        "palette": colour_list
    }

def export_as_css(colours: List[Any]) -> str:
    lines = [":root {"]
    seen_names = set()
    
    for c in colours:
        hex_val = (getattr(c, 'hex', '#000000') or '#000000').upper()
        clean_hex = hex_val.lstrip('#').lower()
        role_slug = slugify(getattr(c, 'colour_role', None) or "color")
        var_name = f"--color-{role_slug}"
        if var_name in seen_names:
            var_name = f"{var_name}-{clean_hex}"
        seen_names.add(var_name)
        
        rgb_r = int(getattr(c, 'rgb_r', 0) or 0)
        rgb_g = int(getattr(c, 'rgb_g', 0) or 0)
        rgb_b = int(getattr(c, 'rgb_b', 0) or 0)
        usage = float(getattr(c, 'usage_percentage', 0.0) or 0.0)
        
        lines.append(f"  {var_name}: {hex_val}; /* RGB({rgb_r}, {rgb_g}, {rgb_b}) | {usage}% */")
        
    lines.append("}")
    return "\n".join(lines)

def export_as_tailwind(colours: List[Any]) -> str:
    lines = [
        "/** PaletteLens Exported Tailwind CSS Config */",
        "module.exports = {",
        "  theme: {",
        "    extend: {",
        "      colors: {"
    ]
    
    seen_keys = set()
    for c in colours:
        hex_val = (getattr(c, 'hex', '#000000') or '#000000').upper()
        clean_hex = hex_val.lstrip('#').lower()
        role_key = slugify(getattr(c, 'colour_role', None) or "color").replace("-", "_")
        if role_key in seen_keys:
            role_key = f"{role_key}_{clean_hex}"
        seen_keys.add(role_key)
        lines.append(f"        '{role_key}': '{hex_val}',")
        
    lines.extend([
        "      }",
        "    }",
        "  }",
        "}"
    ])
    return "\n".join(lines)

def generate_palette_png(colours: List[Any]) -> bytes:
    """Draw a visual PNG image swatch of the color palette."""
    if not colours:
        colours = []

    swatch_width = 160
    swatch_height = 240
    padding = 20
    header_height = 80
    cols = min(6, max(1, len(colours)))
    rows = ((len(colours) - 1) // cols) + 1 if len(colours) > 0 else 1

    img_width = cols * swatch_width + (cols + 1) * padding
    img_height = header_height + rows * swatch_height + (rows + 1) * padding

    # Background canvas: sleek dark #0F172A
    img = Image.new("RGB", (img_width, img_height), (15, 23, 42))
    draw = ImageDraw.Draw(img)

    # Header Title
    draw.text((padding, 25), "PaletteLens - Color Palette Analysis", fill=(255, 255, 255))
    draw.line([(padding, header_height - 10), (img_width - padding, header_height - 10)], fill=(51, 65, 85), width=2)

    for idx, c in enumerate(colours):
        col_idx = idx % cols
        row_idx = idx // cols
        
        x0 = padding + col_idx * (swatch_width + padding)
        y0 = header_height + padding + row_idx * (swatch_height + padding)
        x1 = x0 + swatch_width
        y1 = y0 + swatch_height

        hex_val = (getattr(c, 'hex', '#000000') or '#000000').upper()
        rgb_r = int(getattr(c, 'rgb_r', 0) or 0)
        rgb_g = int(getattr(c, 'rgb_g', 0) or 0)
        rgb_b = int(getattr(c, 'rgb_b', 0) or 0)
        usage = float(getattr(c, 'usage_percentage', 0.0) or 0.0)
        role = getattr(c, 'colour_role', None)

        # Card container background
        draw.rectangle([x0, y0, x1, y1], fill=(30, 41, 59), outline=(51, 65, 85), width=1)

        # Color Block
        color_block_h = 140
        draw.rectangle([x0 + 6, y0 + 6, x1 - 6, y0 + color_block_h], fill=(rgb_r, rgb_g, rgb_b))

        # Text Info
        txt_y = y0 + color_block_h + 10
        draw.text((x0 + 10, txt_y), hex_val, fill=(255, 255, 255))
        draw.text((x0 + 10, txt_y + 20), f"RGB: {rgb_r},{rgb_g},{rgb_b}", fill=(148, 163, 184))
        draw.text((x0 + 10, txt_y + 38), f"Usage: {usage}%", fill=(148, 163, 184))
        if role:
            draw.text((x0 + 10, txt_y + 56), f"Role: {role}", fill=(56, 189, 248))

    output = io.BytesIO()
    img.save(output, format="PNG")
    return output.getvalue()

