import React, { useState } from 'react';
import { Colour } from '../types';
import { X, Copy, Check, Info } from 'lucide-react';

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

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
        
        {/* Swatch Header */}
        <div
          className="h-44 w-full relative p-4 flex flex-col justify-between"
          style={{ backgroundColor: colour.hex }}
        >
          <button
            onClick={onClose}
            className="self-end p-2 rounded-full bg-slate-900/40 text-white hover:bg-slate-900/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="bg-white/90 backdrop-blur-md rounded-lg p-3 self-start shadow-md flex items-center gap-2">
            <span className="font-mono font-bold text-lg text-slate-900">{colour.hex.toUpperCase()}</span>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
              {colour.usage_percentage}% usage
            </span>
          </div>
        </div>

        {/* Details Body */}
        <div className="p-6 space-y-5">
          {colour.colour_role && (
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-600" />
                <span className="text-sm font-medium text-slate-700">Role:</span>
                <span className="text-sm font-bold text-slate-900">{colour.colour_role}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                colour.role_confidence === 'Detected' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {colour.role_confidence || 'Inferred'}
              </span>
            </div>
          )}

          <div className="space-y-3 font-mono">
            {/* HEX */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <div>
                <span className="text-[10px] font-sans uppercase font-bold text-slate-400 block">HEX</span>
                <span className="text-sm font-semibold text-slate-900">{colour.hex.toUpperCase()}</span>
              </div>
              <button
                onClick={() => copyToClipboard(colour.hex, 'hex')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-100"
              >
                {copiedField === 'hex' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedField === 'hex' ? 'Copied' : 'Copy HEX'}
              </button>
            </div>

            {/* RGB */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <div>
                <span className="text-[10px] font-sans uppercase font-bold text-slate-400 block">RGB</span>
                <span className="text-sm font-semibold text-slate-900">{rgbStr}</span>
              </div>
              <button
                onClick={() => copyToClipboard(rgbStr, 'rgb')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-100"
              >
                {copiedField === 'rgb' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedField === 'rgb' ? 'Copied' : 'Copy RGB'}
              </button>
            </div>

            {/* HSL */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <div>
                <span className="text-[10px] font-sans uppercase font-bold text-slate-400 block">HSL</span>
                <span className="text-sm font-semibold text-slate-900">{hslStr}</span>
              </div>
              <button
                onClick={() => copyToClipboard(hslStr, 'hsl')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-100"
              >
                {copiedField === 'hsl' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedField === 'hsl' ? 'Copied' : 'Copy HSL'}
              </button>
            </div>

            {/* LAB */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-[10px] font-sans uppercase font-bold text-slate-400 block">CIE L*a*b*</span>
              <span className="text-sm font-semibold text-slate-900">
                L: {colour.lab_l}, a: {colour.lab_a}, b: {colour.lab_b}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
