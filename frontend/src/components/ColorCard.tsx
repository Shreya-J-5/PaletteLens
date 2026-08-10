import React from 'react';
import { Colour } from '../types';
import { Copy, Check } from 'lucide-react';

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

  const isLight = colour.hsl_l > 60;

  return (
    <div
      onClick={() => onSelect && onSelect(colour)}
      className="group cursor-pointer bg-white border border-[#DCDDD9] rounded-xl overflow-hidden shadow-2xs hover:border-[#111318] transition-all"
    >
      {/* Large visual swatch block */}
      <div
        className="h-32 w-full relative p-3 flex flex-col justify-between transition-transform duration-300 group-hover:scale-[1.02]"
        style={{ backgroundColor: colour.hex }}
      >
        <div className="flex items-center justify-between">
          {colour.colour_role && (
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded shadow-2xs flex items-center gap-1 ${
                isLight ? 'bg-[#111318]/85 text-white' : 'bg-white/90 text-[#111318]'
              }`}
            >
              {colour.colour_role}
              <span className={`text-[9px] px-1 py-0.2 rounded font-normal ${
                colour.role_confidence === 'Detected' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-[#666A73] text-white'
              }`}>
                {colour.role_confidence || 'Inferred'}
              </span>
            </span>
          )}
        </div>

        <button
          onClick={handleCopyHex}
          className={`self-end p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md ${
            isLight ? 'bg-[#111318]/85 text-white hover:bg-[#111318]' : 'bg-white/85 text-[#111318] hover:bg-white'
          }`}
          title="Copy HEX"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Color information details */}
      <div className="p-3.5 space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="font-mono font-bold text-sm text-[#111318] tracking-tight">
            {colour.hex.toUpperCase()}
          </span>
          <span className="text-[11px] font-medium text-[#666A73] bg-[#F6F5F2] border border-[#DCDDD9] px-1.5 py-0.5 rounded">
            {colour.usage_percentage}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#666A73] pt-1.5 border-t border-[#DCDDD9]">
          <div>
            <span className="text-[9px] text-[#8A8F98] font-sans block uppercase font-medium">RGB</span>
            {colour.rgb_r}, {colour.rgb_g}, {colour.rgb_b}
          </div>
          <div>
            <span className="text-[9px] text-[#8A8F98] font-sans block uppercase font-medium">HSL</span>
            {colour.hsl_h}°, {colour.hsl_s}%, {colour.hsl_l}%
          </div>
        </div>
      </div>
    </div>
  );
};
