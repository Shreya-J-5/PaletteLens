import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Image as ImageIcon, FileText, ArrowRight, Copy, Check } from 'lucide-react';
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
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

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

  const samplePalette = [
    { hex: '#111318', rgb: 'rgb(17, 19, 24)', name: 'Obsidian' },
    { hex: '#F4F1EA', rgb: 'rgb(244, 241, 234)', name: 'Alabaster' },
    { hex: '#1677FF', rgb: 'rgb(22, 119, 255)', name: 'Electric Blue' },
    { hex: '#D9D2C5', rgb: 'rgb(217, 210, 197)', name: 'Warm Sand' },
    { hex: '#8A8F98', rgb: 'rgb(138, 143, 152)', name: 'Studio Slate' }
  ];

  const handleCopySample = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12 my-auto text-center">
      
      {/* Hero Headline & Description */}
      <div className="space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111318] tracking-tight leading-[1.12]">
          Extract the <span className="text-[#1677FF]">colours</span> behind<br className="hidden sm:inline" /> any design.
        </h1>

        <p className="text-xs sm:text-sm text-[#666A73] max-w-lg mx-auto font-normal leading-relaxed">
          Analyze websites, images, PDFs, and visual files to discover the exact colours genuinely used in production.
        </p>
      </div>

      {/* Main Studio Tool Panel */}
      <div className="mt-9 bg-white border border-[#DCDDD9] rounded-2xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] max-w-xl mx-auto w-full space-y-5 text-left">
        
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

      {/* Result Preview Teaser Component */}
      <div className="mt-12 w-full max-w-xl mx-auto space-y-3">
        <div className="flex items-center justify-between text-[11px] font-semibold text-[#666A73] uppercase tracking-wider px-1">
          <span>Extracted Palette Teaser</span>
          <span className="text-[#8A8F98] font-normal">Perceptual LAB Swatches</span>
        </div>

        <div className="grid grid-cols-5 gap-2 bg-white border border-[#DCDDD9] rounded-xl p-3 shadow-2xs">
          {samplePalette.map((color) => (
            <div
              key={color.hex}
              onClick={() => handleCopySample(color.hex)}
              className="group cursor-pointer flex flex-col items-center space-y-1.5 p-1.5 rounded-lg hover:bg-[#F6F5F2] transition-colors"
              title={`Click to copy ${color.hex}`}
            >
              <div
                className="w-full h-10 rounded-md border border-[#DCDDD9]/80 shadow-2xs group-hover:scale-105 transition-transform"
                style={{ backgroundColor: color.hex }}
              />
              <div className="text-[10px] font-mono text-[#111318] font-medium flex items-center gap-1">
                <span>{color.hex}</span>
                {copiedHex === color.hex ? (
                  <Check className="w-2.5 h-2.5 text-emerald-600" />
                ) : (
                  <Copy className="w-2.5 h-2.5 text-[#8A8F98] opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
