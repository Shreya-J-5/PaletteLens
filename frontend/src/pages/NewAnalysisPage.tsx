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
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#666A73] hover:text-[#111318] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </button>

      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-[#111318] tracking-tight">New Colour Analysis</h1>
        <p className="text-xs text-[#666A73]">Extract dominant colours and production design system palettes</p>
      </div>

      <div className="bg-white border border-[#DCDDD9] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="grid grid-cols-3 gap-1.5 bg-[#F6F5F2] border border-[#DCDDD9] p-1 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('website')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-all ${
              activeTab === 'website'
                ? 'bg-white text-[#111318] border border-[#DCDDD9] shadow-2xs font-semibold'
                : 'text-[#666A73] hover:text-[#111318]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#1677FF]" />
            Website
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('image')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-all ${
              activeTab === 'image'
                ? 'bg-white text-[#111318] border border-[#DCDDD9] shadow-2xs font-semibold'
                : 'text-[#666A73] hover:text-[#111318]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#111318]" />
            Image
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-all ${
              activeTab === 'file'
                ? 'bg-white text-[#111318] border border-[#DCDDD9] shadow-2xs font-semibold'
                : 'text-[#666A73] hover:text-[#111318]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#111318]" />
            PDF / File
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {activeTab === 'website' ? (
            <div className="space-y-1.5 text-left">
              <label className="block text-[11px] font-semibold text-[#111318] uppercase tracking-wider">Target Website Address</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F6F5F2] border border-[#DCDDD9] rounded-xl text-[#111318] placeholder:text-[#8A8F98] text-xs font-mono focus:outline-none focus:border-[#111318] focus:bg-white transition-all"
                required
              />
            </div>
          ) : (
            <div className="space-y-1.5 text-left">
              <label className="block text-[11px] font-semibold text-[#111318] uppercase tracking-wider">
                Upload {activeTab === 'image' ? 'Image (PNG, JPG, WEBP, SVG)' : 'PDF / File'}
              </label>
              <div className="border border-dashed border-[#DCDDD9] bg-[#F6F5F2] hover:bg-white hover:border-[#111318] rounded-xl p-8 text-center cursor-pointer transition-all relative">
                <input
                  type="file"
                  accept={activeTab === 'image' ? 'image/*' : '.pdf,image/*'}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
                {file ? (
                  <p className="text-xs font-semibold text-[#111318] font-mono">{file.name}</p>
                ) : (
                  <p className="text-xs text-[#666A73]">Click or drop file to start LAB color extraction</p>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-5 text-xs font-semibold text-white bg-[#111318] hover:bg-[#252830] rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Extracting colours...</span>
            ) : (
              <>
                <span>Extract Colours</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#1677FF] group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
