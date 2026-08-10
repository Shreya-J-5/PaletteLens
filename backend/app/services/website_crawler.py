import os
import uuid
import asyncio
from urllib.parse import urlparse, urljoin
from typing import List, Dict, Set, Any
from PIL import Image
from playwright.async_api import async_playwright
from app.core.config import settings
from app.services.color_extractor import (
    extract_colors_from_pil_image, 
    hex_to_rgb, 
    rgb_to_hex, 
    rgb_to_hsl, 
    rgb_to_lab,
    delta_e_76
)

def normalize_url(url: str) -> str:
    parsed = urlparse(url)
    # Strip trailing slash and query params for canonical page matching
    path = parsed.path.rstrip("/")
    return f"{parsed.scheme}://{parsed.netloc}{path}"

async def analyze_website_task(analysis_id: str, start_url: str, update_progress_callback=None) -> Dict[str, Any]:
    """
    Crawls website pages using Playwright, captures screenshots, extracts CSS colors,
    and runs image color analysis on rendered page visuals.
    """
    parsed_start = urlparse(start_url)
    if not parsed_start.scheme or not parsed_start.netloc:
        raise ValueError("Invalid URL scheme or domain provided.")

    base_domain = parsed_start.netloc.lower()

    if update_progress_callback:
        update_progress_callback("Connecting to website")

    visited_urls: Set[str] = set()
    queue: List[str] = [start_url]
    pages_result: List[Dict[str, Any]] = []

    os.makedirs(os.path.join(settings.UPLOADS_DIR, "screenshots"), exist_ok=True)

    async with async_playwright() as p:
        # Launch browser with custom user-agent and stealth settings
        browser = await p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
        )
        context = await browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) PaletteLens-ColorAnalyzer/1.0"
        )
        page = await context.new_page()

        if update_progress_callback:
            update_progress_callback("Discovering pages")

        while queue and len(visited_urls) < settings.MAX_CRAWL_PAGES:
            current_url = queue.pop(0)
            norm_url = normalize_url(current_url)
            
            if norm_url in visited_urls:
                continue
            visited_urls.add(norm_url)

            if update_progress_callback:
                update_progress_callback(f"Capturing visuals ({len(visited_urls)}/{settings.MAX_CRAWL_PAGES}): {norm_url}")

            page_id = str(uuid.uuid4())
            screenshot_filename = f"screenshot_{page_id}.png"
            screenshot_rel_path = f"screenshots/{screenshot_filename}"
            screenshot_abs_path = os.path.join(settings.UPLOADS_DIR, screenshot_rel_path)

            page_title = "Untitled Page"
            page_status = "completed"
            css_colors: List[Dict[str, Any]] = []
            extracted_colors: List[Dict[str, Any]] = []

            try:
                # Navigate with timeout
                response = await page.goto(current_url, timeout=settings.CRAWL_TIMEOUT * 1000, wait_until="networkidle")
                
                # Check response status
                if response and response.status >= 400:
                    page_status = "failed"
                else:
                    page_title = await page.title() or norm_url

                    # Capture page screenshot
                    await page.screenshot(path=screenshot_abs_path, full_page=False)

                    # Extract DOM elements CSS colors with element role heuristics
                    css_colors = await page.evaluate("""
                        () => {
                            const sampleElements = Array.from(document.querySelectorAll('body, header, nav, main, footer, h1, h2, h3, p, a, button, input, .card, .btn'));
                            const colors = [];
                            
                            sampleElements.forEach(el => {
                                const style = window.getComputedStyle(el);
                                const tag = el.tagName.toLowerCase();
                                const roleAttr = el.getAttribute('role') || '';
                                
                                const bg = style.backgroundColor;
                                const fg = style.color;
                                const border = style.borderColor;
                                
                                if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                                    let role = 'Surface';
                                    if (tag === 'body' || tag === 'main') role = 'Background';
                                    else if (tag === 'button' || el.classList.contains('btn')) role = 'Primary';
                                    colors.push({ color: bg, role: role, confidence: 'Detected' });
                                }
                                if (fg && fg !== 'rgba(0, 0, 0, 0)' && fg !== 'transparent') {
                                    let role = 'Text';
                                    if (tag === 'h1' || tag === 'h2' || tag === 'h3') role = 'Highlight';
                                    colors.push({ color: fg, role: role, confidence: 'Detected' });
                                }
                                if (border && border !== 'rgba(0, 0, 0, 0)' && border !== 'transparent') {
                                    colors.push({ color: border, role: 'Border', confidence: 'Detected' });
                                }
                            });
                            return colors;
                        }
                    """)

                    # Perform pixel color extraction on screenshot
                    if os.path.exists(screenshot_abs_path):
                        with Image.open(screenshot_abs_path) as img:
                            visual_colors = extract_colors_from_pil_image(img, num_colors=10)
                            extracted_colors.extend(visual_colors)

                    # Discover links on page if under MAX_CRAWL_PAGES
                    if len(visited_urls) < settings.MAX_CRAWL_PAGES:
                        links = await page.evaluate("""
                            () => Array.from(document.querySelectorAll('a[href]')).map(a => a.href)
                        """)
                        for link in links:
                            try:
                                parsed_link = urlparse(link)
                                # Stay on same base domain, ignore mailto/javascript/anchors
                                if parsed_link.netloc.lower() == base_domain and parsed_link.scheme in ("http", "https"):
                                    norm_link = normalize_url(link)
                                    if norm_link not in visited_urls and norm_link not in queue:
                                        queue.append(norm_link)
                            except Exception:
                                pass

            except Exception as e:
                page_status = "failed"
                # Save fallback entry if navigation failed

            pages_result.append({
                "id": page_id,
                "url": norm_url,
                "page_title": page_title,
                "screenshot_path": screenshot_rel_path if page_status == "completed" else None,
                "status": page_status,
                "css_colors": css_colors,
                "visual_colors": extracted_colors
            })

        await browser.close()

    if update_progress_callback:
        update_progress_callback("Extracting colours")

    return {
        "pages": pages_result
    }
