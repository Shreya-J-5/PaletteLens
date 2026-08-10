import io
import re
from typing import List, Dict, Any
from PIL import Image, ImageDraw, ImageFont
from app.models.colour import Colour

def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def export_as_json(colours: List[Colour]) -> Dict[str, Any]:
    palette = {}
    colour_list = []
    for c in colours:
        name = slugify(c.colour_role or f"color-{c.hex.lstrip('#')}")
        if name in palette:
            name = f"{name}-{c.hex.lstrip('#')}"
        palette[name] = c.hex
        
        colour_list.append({
            "hex": c.hex,
            "rgb": [c.rgb_r, c.rgb_g, c.rgb_b],
            "hsl": [c.hsl_h, c.hsl_s, c.hsl_l],
            "lab": [c.lab_l, c.lab_a, c.lab_b],
            "role": c.colour_role,
            "confidence": c.role_confidence,
            "usage_percentage": c.usage_percentage,
            "occurrence_count": c.occurrence_count
        })

    return {
        "roles": palette,
        "palette": colour_list
    }

def export_as_css(colours: List[Colour]) -> str:
    lines = [":root {"]
    seen_names = set()
    
    for c in colours:
        role_slug = slugify(c.colour_role or "color")
        var_name = f"--color-{role_slug}"
        if var_name in seen_names:
            var_name = f"{var_name}-{c.hex.lstrip('#').lower()}"
        seen_names.add(var_name)
        
        lines.append(f"  {var_name}: {c.hex}; /* RGB({c.rgb_r}, {c.rgb_g}, {c.rgb_b}) | {c.usage_percentage}% */")
        
    lines.append("}")
    return "\n".join(lines)

def export_as_tailwind(colours: List[Colour]) -> str:
    lines = [
        "/** PaletteLens Exported Tailwind CSS Config */",
        "module.exports = {",
        "  theme: {",
        "    extend: {",
        "      colors: {"
    ]
    
    seen_keys = set()
    for c in colours:
        role_key = slugify(c.colour_role or "color").replace("-", "_")
        if role_key in seen_keys:
            role_key = f"{role_key}_{c.hex.lstrip('#').lower()}"
        seen_keys.add(role_key)
        lines.append(f"        '{role_key}': '{c.hex}',")
        
    lines.extend([
        "      }",
        "    }",
        "  }",
        "}"
    ])
    return "\n".join(lines)

def generate_palette_png(colours: List[Colour]) -> bytes:
    """Draw a beautiful visual PNG image swatch of the color palette."""
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

    # Background canvas: sleek dark/off-white #0F172A
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

        # Card container background
        draw.rectangle([x0, y0, x1, y1], fill=(30, 41, 59), outline=(51, 65, 85), width=1)

        # Color Block
        color_block_h = 140
        draw.rectangle([x0 + 6, y0 + 6, x1 - 6, y0 + color_block_h], fill=(c.rgb_r, c.rgb_g, c.rgb_b))

        # Text Info
        txt_y = y0 + color_block_h + 10
        draw.text((x0 + 10, txt_y), c.hex.upper(), fill=(255, 255, 255))
        draw.text((x0 + 10, txt_y + 20), f"RGB: {c.rgb_r},{c.rgb_g},{c.rgb_b}", fill=(148, 163, 184))
        draw.text((x0 + 10, txt_y + 38), f"Usage: {c.usage_percentage}%", fill=(148, 163, 184))
        if c.colour_role:
            draw.text((x0 + 10, txt_y + 56), f"Role: {c.colour_role}", fill=(56, 189, 248))

    output = io.BytesIO()
    img.save(output, format="PNG")
    return output.getvalue()
