import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Image as ImageIcon, FileText, ArrowLeft } from 'lucide-react';
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
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">New Colour Analysis</h1>
        <p className="text-sm text-slate-500">Extract dominant colours and design system palettes</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('website')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all ${
              activeTab === 'website' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'
            }`}
          >
            <Globe className="w-4 h-4 text-sky-600" />
            Website
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('image')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all ${
              activeTab === 'image' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-indigo-600" />
            Image
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all ${
              activeTab === 'file' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            PDF / File
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {activeTab === 'website' ? (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Website URL</label>
              <input
                type="url"
                placeholder="https://nike.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Upload File</label>
              <div className="border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100/60 rounded-xl p-8 text-center cursor-pointer relative">
                <input
                  type="file"
                  accept={activeTab === 'image' ? 'image/*' : '.pdf,image/*'}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
                {file ? (
                  <p className="text-sm font-semibold text-slate-900 font-mono">{file.name}</p>
                ) : (
                  <p className="text-sm text-slate-600">Click or drag file to start extraction</p>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Starting engine...' : 'Extract Colours'}
          </button>
        </form>
      </div>
    </div>
  );
};
