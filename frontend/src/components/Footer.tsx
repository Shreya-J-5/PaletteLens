import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Layers, Download } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Core Website Information Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-slate-100">
          <div className="flex items-start gap-3 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
            <ShieldCheck className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
            <div className="text-left space-y-1">
              <h4 className="text-xs font-bold text-slate-900">Genuine Extraction</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Calculates actual pixel colors and CSS declarations using LAB space perceptual clustering algorithms.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
            <Layers className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="text-left space-y-1">
              <h4 className="text-xs font-bold text-slate-900">Page-by-Page & Global</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Crawls internal accessible links and aggregates total recurring brand colors across entire sites.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
            <Download className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-left space-y-1">
              <h4 className="text-xs font-bold text-slate-900">Export Anywhere</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Export instant CSS root variables, Tailwind CSS config, structured JSON, and PNG swatches.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Brand & Legal Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Palette<span className="text-sky-600">Lens</span></span>
            <span className="text-slate-400">|</span>
            <span>Visual Color Analysis Engine © {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link to="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
            <Link to="/docs" className="hover:text-slate-900 transition-colors">Documentation</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
