import React from 'react';
import { ArrowLeft, Cpu, Layers, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DocumentationPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 flex-1 flex flex-col justify-center">
      
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors self-start"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Home
      </Link>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          PaletteLens Engine Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          How our perceptual color engine extracts authentic production colors.
        </p>
      </div>

      {/* Designer & Developer Engine Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Perceptual LAB Engine */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2 text-sky-600">
            <Cpu className="w-4 h-4" />
            <h3 className="text-sm font-bold text-slate-900">Perceptual LAB Engine</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Standard RGB space distorts human perception of color brightness. PaletteLens converts pixels into the <strong className="text-slate-900">CIE L*a*b*</strong> 3D color space to cluster colors matching human vision.
          </p>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono text-slate-700 space-y-0.5">
            <p className="text-slate-400">// Perceptual Delta E Distance</p>
            <p className="text-sky-700">ΔE = √( (L1-L2)² + (a1-a2)² + (b1-b2)² )</p>
          </div>
        </div>

        {/* Card 2: Website & Asset Crawling */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2 text-indigo-600">
            <Layers className="w-4 h-4" />
            <h3 className="text-sm font-bold text-slate-900">Deep Site Crawling</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            For website URLs, PaletteLens fetches reachable internal pages, extracts computed DOM styles, and calculates both individual page palettes and recurring site-wide brand colors.
          </p>
          <div className="p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-lg text-[11px] font-medium text-indigo-900 space-y-1">
            <p>✓ DOM CSS Computed Colors</p>
            <p>✓ Page-by-Page Breakdown</p>
            <p>✓ Global Frequency Aggregation</p>
          </div>
        </div>

        {/* Card 3: Ready-to-Use Exports */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-600">
            <Code2 className="w-4 h-4" />
            <h3 className="text-sm font-bold text-slate-900">Instant Exports</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Export extracted palettes directly into your design system or codebase with 1-click copying across multiple production formats.
          </p>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-medium text-slate-700 pt-1">
            <span className="p-1.5 bg-slate-50 border border-slate-200 rounded text-center">CSS Variables</span>
            <span className="p-1.5 bg-slate-50 border border-slate-200 rounded text-center">Tailwind Config</span>
            <span className="p-1.5 bg-slate-50 border border-slate-200 rounded text-center">Structured JSON</span>
            <span className="p-1.5 bg-slate-50 border border-slate-200 rounded text-center">HEX / RGB / HSL</span>
          </div>
        </div>

      </div>

    </div>
  );
};
