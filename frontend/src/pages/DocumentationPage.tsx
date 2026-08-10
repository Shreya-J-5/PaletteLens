import React from 'react';
import { ArrowLeft, Cpu, Layers, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DocumentationPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-6 flex-1 flex flex-col justify-center">
      
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9CA3AF] hover:text-white transition-colors self-start"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Home
      </Link>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          PaletteLens Engine Guide
        </h1>
        <p className="text-xs sm:text-sm text-[#9CA3AF] font-normal">
          How our perceptual color engine extracts authentic production colors.
        </p>
      </div>

      {/* Studio Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Perceptual LAB Engine */}
        <div className="bg-[#16171B] border border-[#262830] rounded-xl p-5 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2 text-[#8B5CF6]">
            <Cpu className="w-4 h-4" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Perceptual LAB Engine</h3>
          </div>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Standard RGB space distorts human perception of color brightness. PaletteLens converts pixels into the <strong className="text-white">CIE L*a*b*</strong> 3D color space to cluster colors matching human vision.
          </p>
          <div className="p-2.5 bg-[#1E2026] border border-[#262830] rounded-lg text-[11px] font-mono text-white space-y-0.5">
            <p className="text-[#6B7280]">// Perceptual Delta E Distance</p>
            <p className="text-[#8B5CF6]">ΔE = √( (L1-L2)² + (a1-a2)² + (b1-b2)² )</p>
          </div>
        </div>

        {/* Card 2: Website & Asset Crawling */}
        <div className="bg-[#16171B] border border-[#262830] rounded-xl p-5 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2 text-[#EC4899]">
            <Layers className="w-4 h-4" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Deep Site Crawling</h3>
          </div>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            For website URLs, PaletteLens fetches reachable internal pages, extracts computed DOM styles, and calculates both individual page palettes and recurring site-wide brand colors.
          </p>
          <div className="p-2.5 bg-[#1E2026] border border-[#262830] rounded-lg text-[11px] font-medium text-white space-y-1">
            <p>✓ DOM CSS Computed Colors</p>
            <p>✓ Page-by-Page Breakdown</p>
            <p>✓ Global Frequency Aggregation</p>
          </div>
        </div>

        {/* Card 3: Ready-to-Use Exports */}
        <div className="bg-[#16171B] border border-[#262830] rounded-xl p-5 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2 text-[#10B981]">
            <Code2 className="w-4 h-4" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Instant Exports</h3>
          </div>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Export extracted palettes directly into your design system or codebase with 1-click copying across multiple production formats.
          </p>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-white pt-1">
            <span className="p-1.5 bg-[#1E2026] border border-[#262830] rounded text-center">CSS Variables</span>
            <span className="p-1.5 bg-[#1E2026] border border-[#262830] rounded text-center">Tailwind Config</span>
            <span className="p-1.5 bg-[#1E2026] border border-[#262830] rounded text-center">Structured JSON</span>
            <span className="p-1.5 bg-[#1E2026] border border-[#262830] rounded text-center">HEX / RGB / HSL</span>
          </div>
        </div>

      </div>

    </div>
  );
};
