import React, { useState } from 'react';
import { Colour } from '../types';
import { X, Copy, Check, Info, Sparkles } from 'lucide-react';

interface ColorDetailModalProps {
  colour: Colour | null;
  onClose: () => void;
}

export const ColorDetailModal: React.FC<ColorDetailModalProps> = ({ colour, onClose }) => {
  if (!colour) return null;

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const rgbStr = `rgb(${colour.rgb_r}, ${colour.rgb_g}, ${colour.rgb_b})`;
  const hslStr = `hsl(${colour.hsl_h}, ${colour.hsl_s}%, ${colour.hsl_l}%)`;

  const isLight = colour.hsl_l > 60;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#16171B] border border-[#262830] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden relative text-white glow-purple">
        
        {/* Swatch Header */}
        <div
          className="h-44 w-full relative p-4 flex flex-col justify-between"
          style={{ backgroundColor: colour.hex }}
        >
          <button
            onClick={onClose}
            className={`self-end p-2 rounded-full backdrop-blur-md transition-colors ${
              isLight ? 'bg-black/60 text-white hover:bg-black/80' : 'bg-white/80 text-black hover:bg-white'
            }`}
          >
            <X className="w-4 h-4" />
          </button>

          <div className="bg-[#0C0D0E]/85 backdrop-blur-md rounded-xl p-3 self-start shadow-xl border border-white/10 flex items-center gap-3">
            <span className="font-mono font-extrabold text-lg text-white tracking-wider">
              {colour.hex.toUpperCase()}
            </span>
            <span className="font-cursive text-xl text-[#A78BFA] font-bold">
              {colour.usage_percentage}% usage
            </span>
          </div>
        </div>

        {/* Details Body */}
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
              <h3 className="font-extrabold text-white text-base tracking-tight">
                DETAILED <span className="font-cursive text-[#A78BFA] text-2xl font-normal">Color Specs</span>
              </h3>
            </div>
          </div>

          {colour.colour_role && (
            <div className="flex items-center justify-between bg-[#1E2026] p-3 rounded-xl border border-[#262830]">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#8B5CF6]" />
                <span className="text-xs font-medium text-[#9CA3AF]">Inferred Role:</span>
                <span className="text-xs font-bold text-white uppercase">{colour.colour_role}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                colour.role_confidence === 'Detected' 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              }`}>
                {colour.role_confidence || 'Inferred'}
              </span>
            </div>
          )}

          <div className="space-y-2.5 font-mono">
            {/* HEX */}
            <div className="flex items-center justify-between p-3 bg-[#1E2026] rounded-xl border border-[#262830]">
              <div>
                <span className="text-[9px] font-sans uppercase font-semibold text-[#9CA3AF] block">HEX FORMAT</span>
                <span className="text-xs font-bold text-white">{colour.hex.toUpperCase()}</span>
              </div>
              <button
                onClick={() => copyToClipboard(colour.hex, 'hex')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-semibold text-white bg-[#16171B] border border-[#262830] rounded-lg hover:border-[#8B5CF6] transition-colors"
              >
                {copiedField === 'hex' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#8B5CF6]" />}
                {copiedField === 'hex' ? 'Copied' : 'Copy HEX'}
              </button>
            </div>

            {/* RGB */}
            <div className="flex items-center justify-between p-3 bg-[#1E2026] rounded-xl border border-[#262830]">
              <div>
                <span className="text-[9px] font-sans uppercase font-semibold text-[#9CA3AF] block">RGB FORMAT</span>
                <span className="text-xs font-bold text-white">{rgbStr}</span>
              </div>
              <button
                onClick={() => copyToClipboard(rgbStr, 'rgb')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-semibold text-white bg-[#16171B] border border-[#262830] rounded-lg hover:border-[#8B5CF6] transition-colors"
              >
                {copiedField === 'rgb' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#8B5CF6]" />}
                {copiedField === 'rgb' ? 'Copied' : 'Copy RGB'}
              </button>
            </div>

            {/* HSL */}
            <div className="flex items-center justify-between p-3 bg-[#1E2026] rounded-xl border border-[#262830]">
              <div>
                <span className="text-[9px] font-sans uppercase font-semibold text-[#9CA3AF] block">HSL FORMAT</span>
                <span className="text-xs font-bold text-white">{hslStr}</span>
              </div>
              <button
                onClick={() => copyToClipboard(hslStr, 'hsl')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-semibold text-white bg-[#16171B] border border-[#262830] rounded-lg hover:border-[#8B5CF6] transition-colors"
              >
                {copiedField === 'hsl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#8B5CF6]" />}
                {copiedField === 'hsl' ? 'Copied' : 'Copy HSL'}
              </button>
            </div>

            {/* LAB */}
            <div className="p-3 bg-[#1E2026] rounded-xl border border-[#262830]">
              <span className="text-[9px] font-sans uppercase font-semibold text-[#9CA3AF] block">CIE L*a*b* COLOR SPACE</span>
              <span className="text-xs font-bold text-[#A78BFA]">
                L: {colour.lab_l}, a: {colour.lab_a}, b: {colour.lab_b}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
