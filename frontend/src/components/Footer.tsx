import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Layers, Download } from 'lucide-react';

export const Footer: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <footer className="w-full bg-[#0C0D0E] border-t border-[#262830] mt-auto py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-5">
        
        {/* Render highlight cards ONLY on homepage */}
        {isHome && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-5 border-b border-[#262830]">
            <div className="flex items-start gap-3 bg-[#16171B] p-4 rounded-xl border border-[#262830] shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
              <div className="text-left space-y-0.5">
                <h4 className="text-xs font-semibold text-white">Genuine Pixel Extraction</h4>
                <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                  Calculates actual pixel colors and CSS declarations using LAB space perceptual clustering.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#16171B] p-4 rounded-xl border border-[#262830] shadow-sm">
              <Layers className="w-4 h-4 text-[#EC4899] flex-shrink-0 mt-0.5" />
              <div className="text-left space-y-0.5">
                <h4 className="text-xs font-semibold text-white">Page-by-Page Breakdown</h4>
                <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                  Crawls internal accessible links and aggregates total recurring brand colors across entire sites.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#16171B] p-4 rounded-xl border border-[#262830] shadow-sm">
              <Download className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
              <div className="text-left space-y-0.5">
                <h4 className="text-xs font-semibold text-white">Export Design Variables</h4>
                <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                  Export instant CSS root variables, Tailwind CSS config, structured JSON, and PNG swatches.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Brand & Legal Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9CA3AF]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Palette<span className="text-[#8B5CF6]">Lens</span></span>
            <span className="text-[#262830]">|</span>
            <span className="text-[12px] font-cursive text-[#A78BFA] font-medium">Crafted for Designers & Art Directors © {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-5 text-[11px] font-medium">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/docs" className="hover:text-white transition-colors">Documentation</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
