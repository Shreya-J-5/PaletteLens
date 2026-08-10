import React from 'react';
import { BookOpen, Code2, Layers, Cpu, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DocumentationPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Documentation</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">PaletteLens Engine Guide</h1>
        <p className="text-sm text-slate-500">Technical architecture and color extraction documentation</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
        
        {/* Core Algorithm */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-sky-600" />
            1. Perceptual Color Extraction Engine
          </h2>
          <p>
            Unlike traditional RGB space clustering which distorts human perception of color brightness, PaletteLens converts image pixels into the <strong>CIE L*a*b*</strong> 3D color space before performing perceptual clustering and Delta E perceptual merging.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 space-y-1">
            <p className="text-slate-500">// 1. Convert sRGB → CIE XYZ → CIE L*a*b*</p>
            <p>L = (116.0 * fy) - 16.0</p>
            <p>a = 500.0 * (fx - fy)</p>
            <p>b = 200.0 * (fy - fz)</p>
            <p className="text-slate-500">// 2. Compute Euclidean Delta E distance for color merging</p>
            <p>Delta_E = sqrt( (L1 - L2)^2 + (a1 - a2)^2 + (b1 - b2)^2 )</p>
          </div>
        </section>

        {/* Website Crawling */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            2. Web Page Crawling & CSS Parsing
          </h2>
          <p>
            For target URLs, PaletteLens fetches reachable internal pages, extracts computed inline styles, stylesheet declarations, and rendered DOM element pixels to produce both page-level and aggregated global website palettes.
          </p>
        </section>

        {/* Code Export Formats */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-600" />
            3. Export Formats
          </h2>
          <p>Extracted color palettes can be copied or downloaded in multiple ready-to-use developer formats:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium pt-1">
            <li className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
              <Code2 className="w-4 h-4 text-sky-600" />
              <span>CSS Root Custom Variables (:root)</span>
            </li>
            <li className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-600" />
              <span>Tailwind CSS Color Config (theme.extend)</span>
            </li>
            <li className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-600" />
              <span>Structured JSON Metadata Array</span>
            </li>
            <li className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-600" />
              <span>HEX, RGB, HSL & CIE LAB Values</span>
            </li>
          </ul>
        </section>

      </div>
    </div>
  );
};
