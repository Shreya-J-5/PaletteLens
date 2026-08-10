import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Globe, Image as ImageIcon, FileText, Download, ArrowLeft, RefreshCw, 
  Layers, Palette, ChevronRight
} from 'lucide-react';
import { fetchAnalysisDetail } from '../api/client';
import { Analysis, Colour } from '../types';
import { ProgressStepper } from '../components/ProgressStepper';
import { ColorCard } from '../components/ColorCard';
import { ColorDetailModal } from '../components/ColorDetailModal';
import { ColorDistributionChart } from '../components/ColorDistributionChart';
import { ExportModal } from '../components/ExportModal';
import { ErrorAlert } from '../components/ErrorAlert';

export const AnalysisResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColour, setSelectedColour] = useState<Colour | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedPageFilter, setSelectedPageFilter] = useState<string | null>(null);

  const loadData = () => {
    if (!id) return;
    fetchAnalysisDetail(id)
      .then((data) => {
        setAnalysis(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();

    // Poll every 2 seconds if status is pending or processing
    const interval = setInterval(() => {
      if (analysis && (analysis.status === 'pending' || analysis.status === 'processing')) {
        loadData();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [id, analysis?.status]);

  if (loading && !analysis) {
    return (
      <div className="py-24 text-center space-y-3">
        <RefreshCw className="w-7 h-7 animate-spin text-[#8A8F98] mx-auto" />
        <p className="text-xs font-medium text-[#666A73]">Loading color extractions...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <ErrorAlert message="Analysis record not found." />
      </div>
    );
  }

  // If analysis is in progress, show real progress stepper
  if (analysis.status === 'pending' || analysis.status === 'processing') {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 space-y-8">
        <ProgressStepper
          currentStep={analysis.progress_step}
          status={analysis.status}
          sourceType={analysis.source_type}
        />
      </div>
    );
  }

  if (analysis.status === 'failed') {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 space-y-6">
        <ErrorAlert message={analysis.error_message} onRetry={loadData} />
      </div>
    );
  }

  // Filter global palette vs page specific palette
  const globalColours = analysis.colours.filter((c) => c.page_id === null);
  const displayColours = selectedPageFilter 
    ? analysis.colours.filter((c) => c.page_id === selectedPageFilter)
    : (globalColours.length > 0 ? globalColours : analysis.colours);

  const title = analysis.source_url || analysis.original_filename || 'Analysis Results';

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-7">
      
      {/* Back button & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCDDD9] pb-5">
        <div className="space-y-1">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#666A73] hover:text-[#111318] transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to History
          </Link>
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-white border border-[#DCDDD9] text-[#111318] shadow-2xs">
              {analysis.source_type === 'website' && <Globe className="w-5 h-5 text-[#1677FF]" />}
              {analysis.source_type === 'image' && <ImageIcon className="w-5 h-5 text-[#111318]" />}
              {analysis.source_type === 'pdf' && <FileText className="w-5 h-5 text-[#111318]" />}
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111318] tracking-tight">{title}</h1>
              <p className="text-xs text-[#666A73] flex items-center gap-2">
                <span>{analysis.page_count} {analysis.page_count === 1 ? 'page' : 'pages'} analyzed</span>
                <span>•</span>
                <span>{analysis.colour_count} significant colours detected</span>
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowExportModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#111318] hover:bg-[#252830] text-white rounded-xl text-xs font-semibold shadow-2xs transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#1677FF]" />
          Export Palette
        </button>
      </div>

      {/* Main Grid: Left Pages List (if website/pdf) + Right Palette Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-7">
        
        {/* Pages Sidebar */}
        {analysis.pages.length > 0 && (
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#111318] text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-[#666A73]" />
                Pages ({analysis.pages.length})
              </h3>
              {selectedPageFilter && (
                <button
                  onClick={() => setSelectedPageFilter(null)}
                  className="text-xs font-semibold text-[#1677FF] hover:underline"
                >
                  Show Global
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedPageFilter(null)}
                className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                  selectedPageFilter === null
                    ? 'bg-[#111318] text-white border-[#111318] shadow-2xs'
                    : 'bg-white text-[#111318] border-[#DCDDD9] hover:bg-[#F6F5F2]'
                }`}
              >
                <div className="font-semibold">Global Website Palette</div>
                <div className="text-[11px] opacity-75 mt-0.5">Aggregated brand colours</div>
              </button>

              {analysis.pages.map((p) => (
                <Link
                  key={p.id}
                  to={`/analysis/${analysis.id}/page/${p.id}`}
                  className={`block w-full text-left p-3 rounded-xl border text-xs transition-all group ${
                    selectedPageFilter === p.id
                      ? 'bg-[#111318] text-white border-[#111318] shadow-2xs'
                      : 'bg-white text-[#111318] border-[#DCDDD9] hover:border-[#111318]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold truncate max-w-[140px]">
                      {p.page_title || p.url}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#8A8F98] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  {p.screenshot_path && (
                    <div className="mt-2 h-16 w-full rounded-lg overflow-hidden border border-[#DCDDD9] bg-[#F6F5F2]">
                      <img
                        src={`/${p.screenshot_path}`}
                        alt={p.page_title || 'Page preview'}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Right Area: Frequency Chart & Swatches */}
        <div className={`${analysis.pages.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'} space-y-7`}>
          
          {/* Colour Frequency Distribution Chart */}
          <ColorDistributionChart colours={displayColours} />

          {/* Colour Swatches Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCDDD9] pb-3">
              <h2 className="font-bold text-[#111318] text-base flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#111318]" />
                {selectedPageFilter ? 'Page Palette' : 'Global Website Palette'}
              </h2>
              <span className="text-xs font-semibold text-[#666A73]">
                {displayColours.length} colours
              </span>
            </div>

            {/* Color Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayColours.map((c) => (
                <ColorCard
                  key={c.id}
                  colour={c}
                  onSelect={(colour) => setSelectedColour(colour)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Color Detail Modal */}
      <ColorDetailModal
        colour={selectedColour}
        onClose={() => setSelectedColour(null)}
      />

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          analysisId={analysis.id}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};
