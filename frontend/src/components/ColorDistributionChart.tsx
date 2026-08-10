import React, { useState, useMemo, useCallback } from 'react';
import { Colour } from '../types';
import { LayoutGrid } from 'lucide-react';

interface ColorDistributionChartProps {
  colours: Colour[];
}

/* ── Squarified Treemap Layout Algorithm ──────────────────────────── */

interface TreeRect {
  x: number;
  y: number;
  w: number;
  h: number;
  colour: Colour;
  area: number;
}

function squarify(
  items: { colour: Colour; value: number }[],
  x: number,
  y: number,
  w: number,
  h: number,
): TreeRect[] {
  if (items.length === 0) return [];
  if (items.length === 1) {
    return [{ x, y, w, h, colour: items[0].colour, area: items[0].value }];
  }

  const total = items.reduce((s, i) => s + i.value, 0);
  if (total <= 0) return [];

  const rects: TreeRect[] = [];

  // Recursive slice-and-dice with aspect-ratio optimisation
  let remaining = [...items];
  let cx = x, cy = y, cw = w, ch = h;

  while (remaining.length > 0) {
    const isHorizontal = cw >= ch;
    const sideLen = isHorizontal ? ch : cw;
    const totalRemaining = remaining.reduce((s, i) => s + i.value, 0);

    // Find the best row that minimises worst aspect ratio
    let row: typeof remaining = [];
    let rowSum = 0;
    let bestWorstRatio = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const candidate = [...row, remaining[i]];
      const candidateSum = rowSum + remaining[i].value;

      // Calculate worst aspect ratio for this row
      const rowFraction = candidateSum / totalRemaining;
      const rowLength = isHorizontal ? cw * rowFraction : ch * rowFraction;

      let worst = 0;
      for (const item of candidate) {
        const itemFraction = item.value / candidateSum;
        const itemLen = sideLen * itemFraction;
        const ratio = rowLength > 0 && itemLen > 0
          ? Math.max(rowLength / itemLen, itemLen / rowLength)
          : Infinity;
        worst = Math.max(worst, ratio);
      }

      if (worst <= bestWorstRatio) {
        bestWorstRatio = worst;
        row = candidate;
        rowSum = candidateSum;
      } else {
        break;
      }
    }

    if (row.length === 0) break;

    // Lay out the row
    const rowFraction = rowSum / totalRemaining;
    const rowThickness = isHorizontal
      ? cw * rowFraction
      : ch * rowFraction;

    let offset = 0;
    for (const item of row) {
      const itemFraction = item.value / rowSum;
      const itemLen = sideLen * itemFraction;

      if (isHorizontal) {
        rects.push({
          x: cx,
          y: cy + offset,
          w: rowThickness,
          h: itemLen,
          colour: item.colour,
          area: item.value,
        });
      } else {
        rects.push({
          x: cx + offset,
          y: cy,
          w: itemLen,
          h: rowThickness,
          colour: item.colour,
          area: item.value,
        });
      }
      offset += itemLen;
    }

    // Shrink remaining area
    if (isHorizontal) {
      cx += rowThickness;
      cw -= rowThickness;
    } else {
      cy += rowThickness;
      ch -= rowThickness;
    }

    remaining = remaining.slice(row.length);
  }

  return rects;
}

/* ── Contrast helpers ─────────────────────────────────────────────── */

function getLuminance(hex: string): number {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  const toLinear = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getTextColor(hex: string): string {
  return getLuminance(hex) > 0.35 ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.9)';
}

function getSubTextColor(hex: string): string {
  return getLuminance(hex) > 0.35 ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.55)';
}

/* ── Component ────────────────────────────────────────────────────── */

export const ColorDistributionChart: React.FC<ColorDistributionChartProps> = ({ colours }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [tooltipInfo, setTooltipInfo] = useState<{
    x: number; y: number; colour: Colour; pct: number;
  } | null>(null);

  const TREEMAP_WIDTH = 900;
  const TREEMAP_HEIGHT = 340;
  const GAP = 3;

  const treeRects = useMemo(() => {
    if (!colours || colours.length === 0) return [];

    const sorted = [...colours].sort((a, b) => (b.usage_percentage ?? 0) - (a.usage_percentage ?? 0));
    const items = sorted.map((c) => ({
      colour: c,
      value: Math.max(c.usage_percentage ?? 0, 0.5), // minimum area so tiny values still show
    }));

    return squarify(items, 0, 0, TREEMAP_WIDTH, TREEMAP_HEIGHT);
  }, [colours]);

  const handleMouseEnter = useCallback((idx: number, rect: TreeRect, e: React.MouseEvent) => {
    setHoveredIdx(idx);
    const svgEl = (e.target as SVGElement).closest('svg');
    if (!svgEl) return;
    const bounds = svgEl.getBoundingClientRect();
    const relX = e.clientX - bounds.left;
    const relY = e.clientY - bounds.top;
    setTooltipInfo({
      x: relX,
      y: relY,
      colour: rect.colour,
      pct: rect.colour.usage_percentage ?? 0,
    });
  }, []);

  const handleMouseMove = useCallback((idx: number, rect: TreeRect, e: React.MouseEvent) => {
    const svgEl = (e.target as SVGElement).closest('svg');
    if (!svgEl) return;
    const bounds = svgEl.getBoundingClientRect();
    setTooltipInfo({
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
      colour: rect.colour,
      pct: rect.colour.usage_percentage ?? 0,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIdx(null);
    setTooltipInfo(null);
  }, []);

  if (colours.length === 0) return null;

  return (
    <div className="bg-[#16171B] border border-[#262830] rounded-2xl p-6 shadow-xl space-y-4 relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#262830] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#1E2026] border border-[#262830] text-[#8B5CF6] flex items-center justify-center">
            <LayoutGrid className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm tracking-tight flex items-center gap-1">
              COLOUR USAGE <span className="font-cursive text-[#A78BFA] text-xl font-normal">Treemap</span>
            </h3>
            <p className="text-[11px] text-[#9CA3AF]">Area proportional to pixel weight across visual surface</p>
          </div>
        </div>

        <span className="text-xs font-mono font-medium text-[#9CA3AF] bg-[#1E2026] border border-[#262830] px-2.5 py-1 rounded-lg">
          {colours.length} significant colours
        </span>
      </div>

      {/* Treemap */}
      <div className="w-full relative" style={{ aspectRatio: `${TREEMAP_WIDTH} / ${TREEMAP_HEIGHT}` }}>
        <svg
          viewBox={`0 0 ${TREEMAP_WIDTH} ${TREEMAP_HEIGHT}`}
          className="w-full h-full"
          style={{ display: 'block' }}
        >
          {treeRects.map((rect, idx) => {
            const hex = (rect.colour.hex || '#888888').toUpperCase();
            const isHovered = hoveredIdx === idx;
            const pct = rect.colour.usage_percentage ?? 0;
            const role = rect.colour.colour_role || '';

            // Only show labels if the rect is big enough
            const showHex = rect.w > 55 && rect.h > 30;
            const showPct = rect.w > 45 && rect.h > 48;
            const showRole = rect.w > 70 && rect.h > 65;

            const textCol = getTextColor(hex);
            const subCol = getSubTextColor(hex);

            return (
              <g
                key={idx}
                onMouseEnter={(e) => handleMouseEnter(idx, rect, e)}
                onMouseMove={(e) => handleMouseMove(idx, rect, e)}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={rect.x + GAP / 2}
                  y={rect.y + GAP / 2}
                  width={Math.max(0, rect.w - GAP)}
                  height={Math.max(0, rect.h - GAP)}
                  rx={6}
                  ry={6}
                  fill={hex}
                  stroke={isHovered ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.15)'}
                  strokeWidth={isHovered ? 2.5 : 1}
                  style={{
                    filter: isHovered ? 'brightness(1.15)' : 'none',
                    transition: 'filter 0.15s ease, stroke 0.15s ease',
                  }}
                />

                {showHex && (
                  <text
                    x={rect.x + rect.w / 2}
                    y={rect.y + rect.h / 2 - (showPct ? 8 : 0)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={textCol}
                    fontSize={rect.w > 100 ? 14 : 11}
                    fontWeight="700"
                    fontFamily="'SF Mono', 'Fira Code', monospace"
                    style={{ pointerEvents: 'none' }}
                  >
                    {hex}
                  </text>
                )}

                {showPct && (
                  <text
                    x={rect.x + rect.w / 2}
                    y={rect.y + rect.h / 2 + (showRole ? 10 : 14)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={subCol}
                    fontSize={rect.w > 100 ? 12 : 10}
                    fontWeight="500"
                    fontFamily="system-ui, sans-serif"
                    style={{ pointerEvents: 'none' }}
                  >
                    {pct.toFixed(1)}%
                  </text>
                )}

                {showRole && role && (
                  <text
                    x={rect.x + rect.w / 2}
                    y={rect.y + rect.h / 2 + 27}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={subCol}
                    fontSize={9}
                    fontWeight="400"
                    fontFamily="system-ui, sans-serif"
                    style={{ pointerEvents: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  >
                    {role}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltipInfo && (
          <div
            className="absolute z-50 pointer-events-none"
            style={{
              left: Math.min(tooltipInfo.x + 14, TREEMAP_WIDTH - 160),
              top: tooltipInfo.y - 70,
            }}
          >
            <div className="bg-[#1E2026] text-white text-xs p-3 rounded-xl shadow-2xl border border-[#262830] font-mono space-y-1.5 min-w-[140px]">
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-md border border-white/20 shadow-sm flex-shrink-0"
                  style={{ backgroundColor: tooltipInfo.colour.hex }}
                />
                <span className="font-bold text-sm">{tooltipInfo.colour.hex.toUpperCase()}</span>
              </div>
              <div className="text-emerald-400 font-semibold">Usage: {tooltipInfo.pct.toFixed(1)}%</div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[#9CA3AF] font-sans">
                  RGB({tooltipInfo.colour.rgb_r}, {tooltipInfo.colour.rgb_g}, {tooltipInfo.colour.rgb_b})
                </span>
              </div>
              {tooltipInfo.colour.colour_role && (
                <div className="text-[10px] text-[#A78BFA] font-sans font-medium">
                  Role: {tooltipInfo.colour.colour_role}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
