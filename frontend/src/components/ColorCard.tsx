import React, { useState } from 'react';
import { Colour } from '../types';
import { Copy, Check, Sparkles } from 'lucide-react';

interface ColorCardProps {
  colour: Colour;
  onSelect?: (colour: Colour) => void;
}

export const ColorCard: React.FC<ColorCardProps> = ({ colour, onSelect }) => {
  const [copied, setCopied] = useState(false);

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
      className="group cursor-pointer bg-[#16171B] border border-[#262830] hover:border-[#8B5CF6] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)] flex flex-col justify-between"
    >
      {/* Visual Color Swatch Block */}
      <div
        className="h-36 w-full relative p-3 flex flex-col justify-between transition-transform duration-300 group-hover:scale-[1.01]"
        style={{ backgroundColor: colour.hex }}
      >
        {/* Role & Confidence Badge */}
        <div className="flex items-center justify-between">
          {colour.colour_role ? (
            <span
              className={`text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-md backdrop-blur-md flex items-center gap-1.5 ${
                isLight ? 'bg-[#0C0D0E]/85 text-white border border-white/20' : 'bg-white/90 text-[#0C0D0E]'
              }`}
            >
              <span className="capitalize">{colour.colour_role}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                colour.role_confidence === 'Detected' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-purple-600 text-white'
              }`}>
                {colour.role_confidence || 'Inferred'}
              </span>
            </span>
          ) : <div />}

          {/* Quick Copy Hex Button */}
          <button
            onClick={handleCopyHex}
            className={`p-2 rounded-xl transition-all duration-200 backdrop-blur-md shadow-md ${
              isLight
                ? 'bg-[#0C0D0E]/80 text-white hover:bg-[#0C0D0E]'
                : 'bg-white/80 text-[#0C0D0E] hover:bg-white'
            }`}
            title="Copy HEX Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Hover Cue */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity self-start">
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md backdrop-blur-md ${
            isLight ? 'bg-black/70 text-white' : 'bg-white/80 text-black'
          }`}>
            Click for breakdown
          </span>
        </div>
      </div>

      {/* Color Information & Metadata */}
      <div className="p-4 space-y-3 bg-[#16171B]">
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono font-extrabold text-base text-white tracking-wider">
              {colour.hex.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-1 text-right">
            <span className="font-cursive text-lg text-[#A78BFA] font-bold">
              {colour.usage_percentage}%
            </span>
            <span className="text-[10px] text-[#9CA3AF] uppercase font-mono">usage</span>
          </div>
        </div>

        {/* Color Specs (RGB & HSL) */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-[#262830]">
          <div className="bg-[#1E2026] p-2 rounded-xl border border-[#262830]/80">
            <span className="text-[9px] text-[#9CA3AF] font-sans block uppercase font-semibold">RGB</span>
            <span className="text-white font-medium">{colour.rgb_r}, {colour.rgb_g}, {colour.rgb_b}</span>
          </div>
          <div className="bg-[#1E2026] p-2 rounded-xl border border-[#262830]/80">
            <span className="text-[9px] text-[#9CA3AF] font-sans block uppercase font-semibold">HSL</span>
            <span className="text-white font-medium">{colour.hsl_h}°, {colour.hsl_s}%, {colour.hsl_l}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
