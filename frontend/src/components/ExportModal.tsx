import React, { useState, useMemo } from 'react';
import { X, Copy, Check, Download, Code, FileText, Palette, FileJson } from 'lucide-react';
import { Analysis, Colour } from '../types';
import {
  generateCssExport,
  generateJsonExport,
  generateTailwindExport,
  generatePngSwatchDataUrl,
  getExportTargetColours,
} from '../utils/exportGenerator';

interface ExportModalProps {
  analysisId: string;
  analysis: Analysis;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  analysisId,
  analysis,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'css' | 'json' | 'tailwind' | 'png'>('css');
  const [copied, setCopied] = useState(false);

  // Get the colours to export directly from the analysis prop - no async needed
  const exportColours = useMemo(() => {
    return getExportTargetColours(analysis);
  }, [analysis]);

  // Generate all export content client-side - no backend API dependency
  const content = useMemo(() => {
    if (activeTab === 'png') return '';
    if (activeTab === 'css') return generateCssExport(exportColours);
    if (activeTab === 'json') return generateJsonExport(exportColours);
    if (activeTab === 'tailwind') return generateTailwindExport(exportColours);
    return '';
  }, [activeTab, exportColours]);

  // Generate PNG data URL client-side
  const pngDataUrl = useMemo(() => {
    if (activeTab === 'png') {
      return generatePngSwatchDataUrl(exportColours);
    }
    return '';
  }, [activeTab, exportColours]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#16171B] border border-[#262830] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden text-white flex flex-col max-h-[85vh] glow-purple">
        {/* Header */}
        <div className="p-5 border-b border-[#262830] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1E2026] border border-[#262830] text-[#8B5CF6] flex items-center justify-center">
              <Download className="w-4 h-4 text-[#8B5CF6]" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base tracking-tight">
                EXPORT <span className="font-cursive text-[#A78BFA] text-2xl font-normal">Color System</span>
              </h3>
              <p className="text-xs text-[#9CA3AF]">1-click copy for production design systems & codebases</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#1E2026]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#262830] bg-[#1E2026] px-5 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('css')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
              activeTab === 'css'
                ? 'bg-[#16171B] text-white border-t border-x border-[#262830] font-bold'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-[#8B5CF6]" />
            CSS Variables
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
              activeTab === 'json'
                ? 'bg-[#16171B] text-white border-t border-x border-[#262830] font-bold'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <FileJson className="w-3.5 h-3.5 text-[#EC4899]" />
            JSON Format
          </button>

          <button
            onClick={() => setActiveTab('tailwind')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
              activeTab === 'tailwind'
                ? 'bg-[#16171B] text-white border-t border-x border-[#262830] font-bold'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#38BDF8]" />
            Tailwind CSS
          </button>

          <button
            onClick={() => setActiveTab('png')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
              activeTab === 'png'
                ? 'bg-[#16171B] text-white border-t border-x border-[#262830] font-bold'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-[#10B981]" />
            PNG Swatch Image
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {activeTab !== 'png' ? (
            <div className="relative bg-[#0C0D0E] border border-[#262830] rounded-xl p-4 overflow-x-auto text-[#F3F4F6] font-mono text-xs shadow-inner">
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 px-3 py-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg text-xs font-sans font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
                {copied ? 'Copied Code!' : 'Copy Code'}
              </button>
              <pre className="pr-24 whitespace-pre leading-relaxed">{content}</pre>
            </div>
          ) : (
            <div className="text-center space-y-5 py-6">
              <div className="inline-block p-6 bg-[#1E2026] border border-[#262830] rounded-2xl max-w-sm">
                <Palette className="w-12 h-12 text-[#8B5CF6] mx-auto mb-3" />
                <h4 className="text-sm font-bold text-white">High-Resolution Swatch PNG</h4>
                <p className="text-xs text-[#9CA3AF] mt-1">Export a clean image file containing hex codes and color swatches.</p>
              </div>

              {pngDataUrl && (
                <div className="max-w-md mx-auto rounded-xl overflow-hidden border border-[#262830]">
                  <img src={pngDataUrl} alt="Color palette swatch preview" className="w-full" />
                </div>
              )}

              <div>
                <a
                  href={pngDataUrl || '#'}
                  download={`palettelens_${analysisId}.png`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-xs font-semibold shadow-lg transition-all"
                >
                  <Download className="w-4 h-4 text-white" />
                  Download PNG Swatch Image
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
