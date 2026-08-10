import React from 'react';
import { Colour } from '../types';
import { Copy, Check, Eye } from 'lucide-react';

interface ColorCardProps {
  colour: Colour;
  onSelect?: (colour: Colour) => void;
}

export const ColorCard: React.FC<ColorCardProps> = ({ colour, onSelect }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyHex = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(colour.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine text contrast over the swatch background
  const isLight = colour.hsl_l > 60;

  return (
    <div
      onClick={() => onSelect && onSelect(colour)}
      className="group cursor-pointer bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all transform hover:-translate-y-0.5"
    >
      {/* Large visual swatch block */}
      <div
        className="h-32 w-full relative p-3 flex flex-col justify-between transition-opacity group-hover:opacity-95"
        style={{ backgroundColor: colour.hex }}
      >
        <div className="flex items-center justify-between">
          {colour.colour_role && (
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded shadow-sm flex items-center gap-1 ${
                isLight ? 'bg-slate-900/80 text-white' : 'bg-white/90 text-slate-900'
              }`}
            >
              {colour.colour_role}
              <span className={`text-[9px] px-1 py-0.2 rounded font-normal ${
                colour.role_confidence === 'Detected' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-slate-400 text-white'
              }`}>
                {colour.role_confidence || 'Inferred'}
              </span>
            </span>
          )}
        </div>

        <button
          onClick={handleCopyHex}
          className={`self-end p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md ${
            isLight ? 'bg-slate-900/80 text-white hover:bg-slate-900' : 'bg-white/80 text-slate-900 hover:bg-white'
          }`}
          title="Copy HEX"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Color information details */}
      <div className="p-4 space-y-2.5">
        <div className="flex items-baseline justify-between">
          <span className="font-mono font-bold text-base text-slate-900 tracking-tight">
            {colour.hex.toUpperCase()}
          </span>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            {colour.usage_percentage}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-500 pt-1 border-t border-slate-100">
          <div>
            <span className="text-[10px] text-slate-400 font-sans block uppercase font-medium">RGB</span>
            {colour.rgb_r}, {colour.rgb_g}, {colour.rgb_b}
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-sans block uppercase font-medium">HSL</span>
            {colour.hsl_h}°, {colour.hsl_s}%, {colour.hsl_l}%
          </div>
        </div>
      </div>
    </div>
  );
};
