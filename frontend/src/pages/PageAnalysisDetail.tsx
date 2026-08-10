import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, RefreshCw, Palette, Layers, Image as ImageIcon } from 'lucide-react';
import { fetchPageDetail } from '../api/client';
import { AnalysisPage, Colour } from '../types';
import { ColorCard } from '../components/ColorCard';
import { ColorDetailModal } from '../components/ColorDetailModal';

export const PageAnalysisDetail: React.FC = () => {
  const { id: analysisId, pageId } = useParams<{ id: string; pageId: string }>();
  const [page, setPage] = useState<AnalysisPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColour, setSelectedColour] = useState<Colour | null>(null);

  useEffect(() => {
    if (!analysisId || !pageId) return;
    setLoading(true);
    fetchPageDetail(analysisId, pageId)
      .then((data) => setPage(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [analysisId, pageId]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-slate-400 mx-auto" />
        <p className="text-xs text-slate-500">Loading page details...</p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center text-slate-500">
        Page analysis record not found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <Link
          to={`/analysis/${analysisId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Global Analysis
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tracking-tight">
              {page.page_title || page.url}
            </h1>
            <p className="text-xs text-slate-500 font-mono">{page.url}</p>
          </div>

          <a
            href={page.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 self-start sm:self-auto"
          >
            Visit Live Page
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Page Screenshot Preview */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-slate-500" />
            Page Preview
          </h3>
          {page.screenshot_path ? (
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 max-h-[500px]">
              <img
                src={`/${page.screenshot_path}`}
                alt={page.page_title || 'Page preview'}
                className="w-full h-full object-cover object-top"
              />
            </div>
          ) : (
            <div className="h-64 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-xs">
              No screenshot available
            </div>
          )}
        </div>

        {/* Page Palette Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Palette className="w-5 h-5 text-slate-700" />
              Page Palette
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {page.colours.length} page colours
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {page.colours.map((c) => (
              <ColorCard
                key={c.id}
                colour={c}
                onSelect={(col) => setSelectedColour(col)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <ColorDetailModal
        colour={selectedColour}
        onClose={() => setSelectedColour(null)}
      />
    </div>
  );
};
