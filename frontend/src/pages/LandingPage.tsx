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
    <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
      
      {/* Hero Header */}
      <div className="space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Extract the colours behind any design.
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto font-normal leading-relaxed">
          Analyze websites, images, PDFs, and visual files to discover the exact colours genuinely used in production.
        </p>
      </div>

      {/* Main Input Card */}
      <div className="mt-7 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm max-w-xl mx-auto w-full space-y-5 text-left">
        
        {/* Source Type Selector */}
        <div className="grid grid-cols-3 gap-2 bg-slate-100/90 p-1.5 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('website')}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
              activeTab === 'website'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-sky-600" />
            Website URL
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('image')}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
              activeTab === 'image'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
            Upload Image
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
              activeTab === 'file'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            Upload PDF / File
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'website' ? (
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-slate-700">Target Website Address</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-mono"
                required
              />
            </div>
          ) : (
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-slate-700">
                Select {activeTab === 'image' ? 'Image (PNG, JPG, WEBP, SVG)' : 'PDF or Visual File'}
              </label>
              <div className="border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl p-5 text-center cursor-pointer transition-colors relative">
                <input
                  type="file"
                  accept={activeTab === 'image' ? 'image/*' : '.pdf,image/*'}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
                    {activeTab === 'image' ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  </div>
                  {file ? (
                    <p className="text-xs font-semibold text-slate-900 font-mono">{file.name}</p>
                  ) : (
                    <div>
                      <p className="text-xs font-medium text-slate-700">Click to browse or drop file here</p>
                      <p className="text-[11px] text-slate-400">Supports PNG, JPG, WEBP, GIF, SVG, PDF (Up to 50MB)</p>
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
            className="w-full py-3 px-5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Creating analysis...</span>
            ) : (
              <>
                <span>Analyze Palette</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>

    </div>
  );
};
