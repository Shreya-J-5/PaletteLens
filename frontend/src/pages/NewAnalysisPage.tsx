import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Image as ImageIcon, FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import { createWebsiteAnalysis, createFileUploadAnalysis } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const NewAnalysisPage: React.FC = () => {
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
          throw new Error('Please select a visual image or PDF file.');
        }
        const sourceType = file.type === 'application/pdf' ? 'pdf' : (file.type.startsWith('image/') ? 'image' : 'file');
        const res = await createFileUploadAnalysis(file, sourceType);
        trackAnalysisForUser(res.id);
        navigate(`/analysis/${res.id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to start analysis.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9CA3AF] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </button>

      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          New <span className="font-cursive text-[#A78BFA] text-3xl font-bold ml-1">Colour Extraction</span>
        </h1>
        <p className="text-xs text-[#9CA3AF]">Extract dominant colours and production design system palettes</p>
      </div>

      <div className="bg-[#16171B] border border-[#262830] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-3 gap-1.5 bg-[#1E2026] border border-[#262830] p-1 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('website')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-all ${
              activeTab === 'website'
                ? 'bg-[#16171B] text-white border border-[#262830] shadow-sm font-semibold'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#8B5CF6]" />
            Website
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('image')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-all ${
              activeTab === 'image'
                ? 'bg-[#16171B] text-white border border-[#262830] shadow-sm font-semibold'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-white" />
            Image
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-all ${
              activeTab === 'file'
                ? 'bg-[#16171B] text-white border border-[#262830] shadow-sm font-semibold'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-white" />
            PDF / File
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {activeTab === 'website' ? (
            <div className="space-y-1.5 text-left">
              <label className="block text-[11px] font-mono font-medium text-[#9CA3AF] uppercase tracking-wider">Target Website Address</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#1E2026] border border-[#262830] rounded-xl text-white placeholder:text-[#6B7280] text-xs font-mono focus:outline-none focus:border-[#8B5CF6] transition-all"
                required
              />
            </div>
          ) : (
            <div className="space-y-1.5 text-left">
              <label className="block text-[11px] font-mono font-medium text-[#9CA3AF] uppercase tracking-wider">
                Upload {activeTab === 'image' ? 'Image (PNG, JPG, WEBP, SVG)' : 'PDF / File'}
              </label>
              <div className="border border-dashed border-[#262830] bg-[#1E2026] hover:bg-[#23262F] hover:border-[#8B5CF6] rounded-xl p-8 text-center cursor-pointer transition-all relative">
                <input
                  type="file"
                  accept={activeTab === 'image' ? 'image/*' : '.pdf,image/*'}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
                {file ? (
                  <p className="text-xs font-semibold text-white font-mono">{file.name}</p>
                ) : (
                  <p className="text-xs text-[#9CA3AF]">Click or drop file to start LAB color extraction</p>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-lg text-xs font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-5 text-xs font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Extracting colours...</span>
            ) : (
              <>
                <span>Extract Colours</span>
                <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
