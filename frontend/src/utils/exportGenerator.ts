import { Colour, Analysis } from '../types';

export const slugify = (text: string): string => {
  if (!text) return 'color';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'color';
};

export const getExportTargetColours = (analysis?: Analysis | null): Colour[] => {
  if (!analysis || !analysis.colours || analysis.colours.length === 0) return [];
  const globalColours = analysis.colours.filter((c) => c.page_id === null || c.page_id === undefined);
  return globalColours.length > 0 ? globalColours : analysis.colours;
};

export const generateCssExport = (colours: Colour[]): string => {
  if (!colours || colours.length === 0) return '/* No color palette data available */';
  const lines: string[] = [':root {'];
  const seenNames = new Set<string>();

  colours.forEach((c) => {
    const hexUpper = (c.hex || '#000000').toUpperCase();
    const cleanHex = hexUpper.replace('#', '').toLowerCase();
    const roleSlug = slugify(c.colour_role || 'color');
    let varName = `--color-${roleSlug}`;
    if (seenNames.has(varName)) {
      varName = `${varName}-${cleanHex}`;
    }
    seenNames.add(varName);

    const r = c.rgb_r ?? 0;
    const g = c.rgb_g ?? 0;
    const b = c.rgb_b ?? 0;
    const usage = c.usage_percentage ?? 0;

    lines.push(`  ${varName}: ${hexUpper}; /* RGB(${r}, ${g}, ${b}) | ${usage}% */`);
  });

  lines.push('}');
  return lines.join('\n');
};

export const generateJsonExport = (colours: Colour[]): string => {
  if (!colours || colours.length === 0) return JSON.stringify({ roles: {}, palette: [] }, null, 2);
  const roles: Record<string, string> = {};
  const paletteList: any[] = [];

  colours.forEach((c) => {
    const hexUpper = (c.hex || '#000000').toUpperCase();
    const cleanHex = hexUpper.replace('#', '').toLowerCase();
    const roleName = c.colour_role || `color-${cleanHex}`;
    let name = slugify(roleName);
    if (roles[name]) {
      name = `${name}-${cleanHex}`;
    }
    roles[name] = hexUpper;

    paletteList.push({
      hex: hexUpper,
      rgb: [c.rgb_r ?? 0, c.rgb_g ?? 0, c.rgb_b ?? 0],
      hsl: [c.hsl_h ?? 0, c.hsl_s ?? 0, c.hsl_l ?? 0],
      lab: [c.lab_l ?? 0, c.lab_a ?? 0, c.lab_b ?? 0],
      role: c.colour_role || null,
      confidence: c.role_confidence || null,
      usage_percentage: c.usage_percentage ?? 0,
      occurrence_count: c.occurrence_count ?? 0,
    });
  });

  return JSON.stringify({ roles, palette: paletteList }, null, 2);
};

export const generateTailwindExport = (colours: Colour[]): string => {
  if (!colours || colours.length === 0) return '/* No color palette data available */';
  const lines: string[] = [
    '/** PaletteLens Exported Tailwind CSS Config */',
    'module.exports = {',
    '  theme: {',
    '    extend: {',
    '      colors: {',
  ];

  const seenKeys = new Set<string>();
  colours.forEach((c) => {
    const hexUpper = (c.hex || '#000000').toUpperCase();
    const cleanHex = hexUpper.replace('#', '').toLowerCase();
    let roleKey = slugify(c.colour_role || 'color').replace(/-/g, '_');
    if (seenKeys.has(roleKey)) {
      roleKey = `${roleKey}_${cleanHex}`;
    }
    seenKeys.add(roleKey);
    lines.push(`        '${roleKey}': '${hexUpper}',`);
  });

  lines.push('      }'),
  lines.push('    }'),
  lines.push('  }'),
  lines.push('}');

  return lines.join('\n');
};

export const generatePngSwatchDataUrl = (colours: Colour[]): string => {
  const canvas = document.createElement('canvas');
  const swatchWidth = 160;
  const swatchHeight = 240;
  const padding = 20;
  const headerHeight = 80;

  const count = colours.length || 1;
  const cols = Math.min(6, Math.max(1, count));
  const rows = Math.ceil(count / cols);

  const imgWidth = cols * swatchWidth + (cols + 1) * padding;
  const imgHeight = headerHeight + rows * swatchHeight + (rows + 1) * padding;

  canvas.width = imgWidth;
  canvas.height = imgHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(0, 0, imgWidth, imgHeight);

  // Header Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('PaletteLens - Color Palette Analysis', padding, 40);

  // Line divider
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, headerHeight - 10);
  ctx.lineTo(imgWidth - padding, headerHeight - 10);
  ctx.stroke();

  colours.forEach((c, idx) => {
    const colIdx = idx % cols;
    const rowIdx = Math.floor(idx / cols);

    const x0 = padding + colIdx * (swatchWidth + padding);
    const y0 = headerHeight + padding + rowIdx * (swatchHeight + padding);

    // Card background
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(x0, y0, swatchWidth, swatchHeight);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(x0, y0, swatchWidth, swatchHeight);

    // Color block
    const hexUpper = (c.hex || '#000000').toUpperCase();
    ctx.fillStyle = hexUpper;
    ctx.fillRect(x0 + 6, y0 + 6, swatchWidth - 12, 140);

    // Text
    const r = c.rgb_r ?? 0;
    const g = c.rgb_g ?? 0;
    const b = c.rgb_b ?? 0;
    const usage = c.usage_percentage ?? 0;

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(hexUpper, x0 + 10, y0 + 165);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px sans-serif';
    ctx.fillText(`RGB: ${r},${g},${b}`, x0 + 10, y0 + 185);
    ctx.fillText(`Usage: ${usage}%`, x0 + 10, y0 + 202);

    if (c.colour_role) {
      ctx.fillStyle = '#38BDF8';
      ctx.fillText(`Role: ${c.colour_role}`, x0 + 10, y0 + 220);
    }
  });

  return canvas.toDataURL('image/png');
};
