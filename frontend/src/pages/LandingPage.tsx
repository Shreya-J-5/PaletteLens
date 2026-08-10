import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Image as ImageIcon, FileText, ArrowRight } from 'lucide-react';
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
    <div className="flex-1 flex flex-col justify-center items-center w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 my-auto text-center relative select-none">
      
      {/* Studio Artboard Canvas Grid Marks (+) */}
      <div className="absolute top-4 left-4 text-[#262830] font-mono text-xs select-none pointer-events-none">+</div>
      <div className="absolute top-4 right-4 text-[#262830] font-mono text-xs select-none pointer-events-none">+</div>
      <div className="absolute bottom-4 left-4 text-[#262830] font-mono text-xs select-none pointer-events-none">+</div>
      <div className="absolute bottom-4 right-4 text-[#262830] font-mono text-xs select-none pointer-events-none">+</div>

      {/* Figma-Style Multi-User Cursor Vector Doodle (Top Left) */}
      <div className="absolute top-8 left-8 hidden lg:flex items-center gap-1.5 animate-bounce-subtle pointer-events-none z-10">
        <svg className="w-4 h-4 text-[#8B5CF6] fill-[#8B5CF6]" viewBox="0 0 24 24">
          <path d="M5.5 3.21l12.6 12.6-5.4.3 3.6 7.2-2.7 1.4-3.6-7.2-4.5 4.5V3.21z"/>
        </svg>
        <span className="bg-[#8B5CF6] text-white text-[10px] font-medium font-mono px-2 py-0.5 rounded-full shadow-md">
          Alex • UI Architect
        </span>
      </div>

      {/* Figma-Style Multi-User Cursor Vector Doodle (Bottom Right) */}
      <div className="absolute bottom-16 right-10 hidden lg:flex items-center gap-1.5 pointer-events-none z-10">
        <svg className="w-4 h-4 text-[#EC4899] fill-[#EC4899]" viewBox="0 0 24 24">
          <path d="M5.5 3.21l12.6 12.6-5.4.3 3.6 7.2-2.7 1.4-3.6-7.2-4.5 4.5V3.21z"/>
        </svg>
        <span className="bg-[#EC4899] text-white text-[10px] font-medium font-mono px-2 py-0.5 rounded-full shadow-md">
          Sarah • Brand Lead
        </span>
      </div>

      {/* Designer Pantone / Artboard Tag */}
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#16171B] border border-[#262830] rounded-lg text-[11px] font-mono text-[#9CA3AF] mb-6">
        <span className="w-2 h-2 rounded-full bg-[#10B981]" />
        <span>ARTBOARD 1440 × 900 • CIELAB 3D COLOR SPACE</span>
      </div>

      {/* Hero Title & Description */}
      <div className="space-y-4 max-w-2xl mx-auto relative">
        
        {/* Pen Tool Vector Path Handle Doodle (SVG Behind Text) */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[#262830] hidden sm:block pointer-events-none">
          <svg className="w-72 h-16 opacity-40" viewBox="0 0 300 60" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 50 Q 150 -20 290 50" strokeDasharray="4 4" />
            <rect x="6" y="46" width="8" height="8" fill="#8B5CF6" />
            <rect x="286" y="46" width="8" height="8" fill="#8B5CF6" />
            <circle cx="150" cy="15" r="4" fill="#EC4899" />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
          Deconstruct the{' '}
          <span className="font-cursive text-[#A78BFA] text-5xl sm:text-6xl lg:text-7xl font-bold relative inline-block">
            colours
            {/* Vector Pen Curve Underline Doodle */}
            <svg
              className="absolute -bottom-2 left-0 w-full h-3 text-[#8B5CF6]"
              viewBox="0 0 120 12"
              fill="none"
            >
              <path
                d="M2 9C28 2 62 10 118 3"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </span>{' '}
          behind<br className="hidden sm:inline" /> any design.
        </h1>

        <p className="text-xs sm:text-sm text-[#9CA3AF] max-w-lg mx-auto font-normal leading-relaxed">
          Extract production CSS variables, LAB perceptual color clusters, and dominant brand palettes from websites, UI screenshots, and PDF artboards.
        </p>
      </div>

      {/* Main Studio Tool Panel */}
      <div className="mt-8 bg-[#16171B] border border-[#262830] rounded-2xl p-6 sm:p-7 shadow-2xl max-w-xl mx-auto w-full space-y-5 text-left relative">
        
        {/* Studio Segmented Control */}
        <div className="grid grid-cols-3 gap-1.5 bg-[#1E2026] border border-[#262830] p-1 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('website')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
              activeTab === 'website'
                ? 'bg-[#16171B] text-white border border-[#262830] shadow-sm font-semibold'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#8B5CF6]" />
            Website URL
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('image')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
              activeTab === 'image'
                ? 'bg-[#16171B] text-white border border-[#262830] shadow-sm font-semibold'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-white" />
            Upload Image
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
              activeTab === 'file'
                ? 'bg-[#16171B] text-white border border-[#262830] shadow-sm font-semibold'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-white" />
            Upload PDF / File
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'website' ? (
            <div className="space-y-1.5 text-left">
              <label className="block text-[11px] font-mono font-medium text-[#9CA3AF] uppercase tracking-wider">
                Target Website Address
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#1E2026] border border-[#262830] rounded-xl text-white placeholder:text-[#6B7280] text-xs focus:outline-none focus:border-[#8B5CF6] transition-all font-mono"
                required
              />
            </div>
          ) : (
            <div className="space-y-1.5 text-left">
              <label className="block text-[11px] font-mono font-medium text-[#9CA3AF] uppercase tracking-wider">
                Select {activeTab === 'image' ? 'Image (PNG, JPG, WEBP, SVG)' : 'PDF or Visual File'}
              </label>
              <div className="border border-dashed border-[#262830] bg-[#1E2026] hover:bg-[#23262F] hover:border-[#8B5CF6] rounded-xl p-5 text-center cursor-pointer transition-all relative">
                <input
                  type="file"
                  accept={activeTab === 'image' ? 'image/*' : '.pdf,image/*'}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-[#16171B] border border-[#262830] text-white flex items-center justify-center mx-auto shadow-2xs">
                    {activeTab === 'image' ? <ImageIcon className="w-4 h-4 text-[#8B5CF6]" /> : <FileText className="w-4 h-4 text-[#8B5CF6]" />}
                  </div>
                  {file ? (
                    <p className="text-xs font-semibold text-white font-mono">{file.name}</p>
                  ) : (
                    <div>
                      <p className="text-xs font-medium text-white">Click to browse or drop visual file here</p>
                      <p className="text-[11px] text-[#9CA3AF]">Supports PNG, JPG, WEBP, SVG, PDF (Up to 50MB)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-lg text-xs font-medium text-left">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-5 text-xs font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Extracting genuine colors...</span>
            ) : (
              <>
                <span>Deconstruct Palette</span>
                <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Designer Technical Specs Footer */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-[#9CA3AF]">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
          <span>CIELAB Delta E Clustering</span>
        </div>
        <span className="text-[#262830]">•</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#EC4899]" />
          <span>DOM CSS & Pixel Inspection</span>
        </div>
        <span className="text-[#262830]">•</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          <span>Export CSS Root, Tailwind & JSON</span>
        </div>
      </div>

    </div>
  );
};
