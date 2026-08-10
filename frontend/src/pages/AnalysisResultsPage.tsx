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
        <RefreshCw className="w-7 h-7 animate-spin text-[#8B5CF6] mx-auto" />
        <p className="text-xs font-medium text-[#9CA3AF]">Loading color extractions...</p>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262830] pb-5">
        <div className="space-y-1">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9CA3AF] hover:text-white transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to History
          </Link>
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#16171B] border border-[#262830] text-white shadow-sm">
              {analysis.source_type === 'website' && <Globe className="w-5 h-5 text-[#8B5CF6]" />}
              {analysis.source_type === 'image' && <ImageIcon className="w-5 h-5 text-[#EC4899]" />}
              {analysis.source_type === 'pdf' && <FileText className="w-5 h-5 text-[#10B981]" />}
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {title} <span className="font-cursive text-[#A78BFA] text-3xl font-normal ml-1">Color Palette</span>
              </h1>
              <p className="text-xs text-[#9CA3AF] flex items-center gap-2">
                <span>{analysis.page_count} {analysis.page_count === 1 ? 'page' : 'pages'} analyzed</span>
                <span>•</span>
                <span>{analysis.colour_count} significant colours detected</span>
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowExportModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-xs font-semibold shadow-lg transition-all self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4 text-white" />
          Export Palette
        </button>
      </div>

      {/* Main Grid: Left Pages List (if website/pdf) + Right Palette Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-7">
        
        {/* Pages Sidebar */}
        {analysis.pages.length > 0 && (
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#9CA3AF] text-xs flex items-center gap-1.5 uppercase tracking-wider font-mono">
                <Layers className="w-3.5 h-3.5 text-[#8B5CF6]" />
                Pages ({analysis.pages.length})
              </h3>
              {selectedPageFilter && (
                <button
                  onClick={() => setSelectedPageFilter(null)}
                  className="text-xs font-semibold text-[#8B5CF6] hover:underline"
                >
                  Show Global
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedPageFilter(null)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all ${
                  selectedPageFilter === null
                    ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-md font-semibold'
                    : 'bg-[#16171B] text-[#9CA3AF] border-[#262830] hover:text-white hover:border-[#8B5CF6]'
                }`}
              >
                <div className="font-semibold text-white">Global Website Palette</div>
                <div className="text-[11px] opacity-80 mt-0.5">Aggregated brand colours</div>
              </button>

              {analysis.pages.map((p) => (
                <Link
                  key={p.id}
                  to={`/analysis/${analysis.id}/page/${p.id}`}
                  className={`block w-full text-left p-3.5 rounded-xl border text-xs transition-all group ${
                    selectedPageFilter === p.id
                      ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-md'
                      : 'bg-[#16171B] text-[#9CA3AF] border-[#262830] hover:border-[#8B5CF6] hover:text-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold truncate max-w-[140px]">
                      {p.page_title || p.url}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  {p.screenshot_path && (
                    <div className="mt-2 h-16 w-full rounded-lg overflow-hidden border border-[#262830] bg-[#1E2026]">
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
            <div className="flex items-center justify-between border-b border-[#262830] pb-3">
              <h2 className="font-extrabold text-white text-base flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#8B5CF6]" />
                {selectedPageFilter ? 'Page Palette' : (
                  <>
                    Global Website <span className="font-cursive text-[#A78BFA] text-xl font-normal">Swatches</span>
                  </>
                )}
              </h2>
              <span className="text-xs font-mono font-medium text-[#9CA3AF] bg-[#16171B] border border-[#262830] px-2.5 py-1 rounded-lg">
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
