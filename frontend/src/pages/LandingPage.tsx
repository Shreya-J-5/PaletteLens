import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Image as ImageIcon, FileText, ArrowRight, Sparkles, Paintbrush, Compass } from 'lucide-react';
import { createWebsiteAnalysis, createFileUploadAnalysis } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { incrementTrial, trackAnalysisForUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'website' | 'image' | 'file'>('website');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Enforce 3 free trial limit check
    const allowed = incrementTrial();
    if (!allowed) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (activeTab === 'website') {
        if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
          throw new Error('Please enter a valid URL starting with http:// or https://');
        }
        const res = await createWebsiteAnalysis(url);
        trackAnalysisForUser(res.id);
        navigate(`/analysis/${res.id}`);
      } else {
        if (!file) {
          throw new Error('Please select a visual image or PDF file to analyze.');
        }
        const sourceType = file.type === 'application/pdf' ? 'pdf' : (file.type.startsWith('image/') ? 'image' : 'file');
        const res = await createFileUploadAnalysis(file, sourceType);
        trackAnalysisForUser(res.id);
        navigate(`/analysis/${res.id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to start color analysis.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 my-auto text-center relative">
      
      {/* Studio Artboard Corner Crosshairs (+) */}
      <div className="absolute top-4 left-4 text-[#DCDDD9] font-mono text-xs select-none pointer-events-none">+</div>
      <div className="absolute top-4 right-4 text-[#DCDDD9] font-mono text-xs select-none pointer-events-none">+</div>
      <div className="absolute bottom-4 left-4 text-[#DCDDD9] font-mono text-xs select-none pointer-events-none">+</div>
      <div className="absolute bottom-4 right-4 text-[#DCDDD9] font-mono text-xs select-none pointer-events-none">+</div>

      {/* Designer Micro-Badge with Hand-drawn Sparkle */}
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#DCDDD9] rounded-full text-[11px] font-medium text-[#111318] shadow-2xs mb-6">
        <Sparkles className="w-3.5 h-3.5 text-[#1677FF]" />
        <span>Crafted for Art Directors, Designers & Visual Creators</span>
        <svg className="w-3.5 h-3.5 text-[#666A73]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 19l7-7-7-7M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Hero Headline & Description with Hand-Drawn Underline Doodle */}
      <div className="space-y-4 max-w-2xl mx-auto relative">
        
        {/* Floating Sketch Doodle Star (Left) */}
        <div className="absolute -top-6 -left-8 text-[#1677FF]/40 hidden sm:block">
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Floating Sketch Swatch Doodle (Right) */}
        <div className="absolute -bottom-2 -right-10 text-[#666A73]/30 hidden sm:block">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111318] tracking-tight leading-[1.15]">
          Extract the{' '}
          <span className="relative inline-block text-[#1677FF]">
            colours
            {/* Hand-Drawn Wavy Underline Doodle SVG */}
            <svg
              className="absolute -bottom-2 left-0 w-full h-3 text-[#1677FF]"
              viewBox="0 0 120 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 8C25 2 55 11 85 4C98 1 112 7 117 8"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>{' '}
          behind<br className="hidden sm:inline" /> any design.
        </h1>

        <p className="text-xs sm:text-sm text-[#666A73] max-w-lg mx-auto font-normal leading-relaxed">
          Analyze websites, images, PDFs, and visual files to discover the exact colours genuinely used in production.
        </p>
      </div>

      {/* Main Studio Tool Panel */}
      <div className="mt-8 bg-white border border-[#DCDDD9] rounded-2xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] max-w-xl mx-auto w-full space-y-5 text-left relative">
        
        {/* Playful Handwritten Doodle Note pointing to tool */}
        <div className="absolute -top-7 right-3 hidden sm:flex items-center gap-1.5 text-[11px] font-mono italic text-[#666A73]">
          <span>drop target URL or file below</span>
          <svg className="w-4 h-4 text-[#1677FF] rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Studio Segmented Tool Mode Control */}
        <div className="grid grid-cols-3 gap-1.5 bg-[#F6F5F2] border border-[#DCDDD9] p-1 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('website')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
              activeTab === 'website'
                ? 'bg-white text-[#111318] border border-[#DCDDD9] shadow-2xs font-semibold'
                : 'text-[#666A73] hover:text-[#111318]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#1677FF]" />
            Website URL
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('image')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
              activeTab === 'image'
                ? 'bg-white text-[#111318] border border-[#DCDDD9] shadow-2xs font-semibold'
                : 'text-[#666A73] hover:text-[#111318]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#111318]" />
            Upload Image
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
              activeTab === 'file'
                ? 'bg-white text-[#111318] border border-[#DCDDD9] shadow-2xs font-semibold'
                : 'text-[#666A73] hover:text-[#111318]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#111318]" />
            Upload PDF / File
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'website' ? (
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-[#111318] uppercase tracking-wider text-[11px]">
                Target Website Address
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F6F5F2] border border-[#DCDDD9] rounded-xl text-[#111318] placeholder:text-[#8A8F98] text-xs focus:outline-none focus:border-[#111318] focus:bg-white transition-all font-mono"
                required
              />
            </div>
          ) : (
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-[#111318] uppercase tracking-wider text-[11px]">
                Select {activeTab === 'image' ? 'Image (PNG, JPG, WEBP, SVG)' : 'PDF or Visual File'}
              </label>
              <div className="border border-dashed border-[#DCDDD9] bg-[#F6F5F2] hover:bg-white hover:border-[#111318] rounded-xl p-5 text-center cursor-pointer transition-all relative">
                <input
                  type="file"
                  accept={activeTab === 'image' ? 'image/*' : '.pdf,image/*'}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#DCDDD9] text-[#111318] flex items-center justify-center mx-auto shadow-2xs">
                    {activeTab === 'image' ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  </div>
                  {file ? (
                    <p className="text-xs font-semibold text-[#111318] font-mono">{file.name}</p>
                  ) : (
                    <div>
                      <p className="text-xs font-medium text-[#111318]">Click to browse or drop file here</p>
                      <p className="text-[11px] text-[#666A73]">Supports PNG, JPG, WEBP, SVG, PDF (Up to 50MB)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium text-left">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-5 text-xs font-semibold text-white bg-[#111318] hover:bg-[#252830] rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Extracting genuine colors...</span>
            ) : (
              <>
                <span>Analyze Palette</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#1677FF] group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Designer Studio Micro-Callout Footer Bar */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-[#666A73]">
        <div className="flex items-center gap-1.5">
          <Paintbrush className="w-3.5 h-3.5 text-[#1677FF]" />
          <span>CIELAB Perceptual Clustering</span>
        </div>
        <span className="text-[#DCDDD9]">•</span>
        <div className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-[#111318]" />
          <span>DOM Computed CSS & Pixel Analysis</span>
        </div>
        <span className="text-[#DCDDD9]">•</span>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#1677FF]" />
          <span>Export CSS, Tailwind & JSON</span>
        </div>
      </div>

    </div>
  );
};
