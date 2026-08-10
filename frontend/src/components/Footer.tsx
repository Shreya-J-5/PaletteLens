import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Layers, Download } from 'lucide-react';

export const Footer: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <footer className="w-full bg-[#F6F5F2] border-t border-[#DCDDD9] mt-auto py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-5">
        
        {/* Render highlight cards ONLY on homepage */}
        {isHome && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-5 border-b border-[#DCDDD9]">
            <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-[#DCDDD9] shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#1677FF] flex-shrink-0 mt-0.5" />
              <div className="text-left space-y-0.5">
                <h4 className="text-xs font-semibold text-[#111318]">Genuine Extraction</h4>
                <p className="text-[11px] text-[#666A73] leading-relaxed">
                  Calculates actual pixel colors and CSS declarations using LAB space perceptual clustering.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-[#DCDDD9] shadow-2xs">
              <Layers className="w-4 h-4 text-[#111318] flex-shrink-0 mt-0.5" />
              <div className="text-left space-y-0.5">
                <h4 className="text-xs font-semibold text-[#111318]">Page-by-Page & Global</h4>
                <p className="text-[11px] text-[#666A73] leading-relaxed">
                  Crawls internal accessible links and aggregates total recurring brand colors across entire sites.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-[#DCDDD9] shadow-2xs">
              <Download className="w-4 h-4 text-[#111318] flex-shrink-0 mt-0.5" />
              <div className="text-left space-y-0.5">
                <h4 className="text-xs font-semibold text-[#111318]">Export Anywhere</h4>
                <p className="text-[11px] text-[#666A73] leading-relaxed">
                  Export instant CSS root variables, Tailwind CSS config, structured JSON, and PNG swatches.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Brand & Legal Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#666A73]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#111318]">Palette<span className="text-[#1677FF]">Lens</span></span>
            <span className="text-[#DCDDD9]">|</span>
            <span className="text-[11px]">Crafted for Designers & Creative Directors © {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-5 text-[11px] font-medium">
            <Link to="/privacy" className="hover:text-[#111318] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#111318] transition-colors">Terms of Service</Link>
            <Link to="/docs" className="hover:text-[#111318] transition-colors">Documentation</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
